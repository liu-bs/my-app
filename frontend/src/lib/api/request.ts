/**
 * @file request.ts
 * @description 同构请求层，基于 fetch 的统一封装。为客户端和服务端提供一致的 API 调用能力，
 *              统一处理 BaseURL、HttpOnly Cookie 鉴权、超时控制、错误处理及 401 自动重定向。
 *              约定（对齐后端 API.md）：
 *              - 成功响应 { code: 0, data, message } → 返回 data
 *              - 错误响应 { code, message, details? } → 抛出 ApiRequestError
 *              - HTTP 状态码：400 校验失败 / 401 未授权 / 403 禁止 / 404 不存在 / 409 冲突 / 422 实体无法处理 / 500 服务器错误 / 503 服务不可用
 */
import { ApiRequestError } from '@my-app/shared';
export { ApiRequestError };
import type { ApiResponse, RequestOptions, ValidationErrorDetail } from '@my-app/shared';

/** 鉴权 Cookie 名称，后端登录时以 HttpOnly 方式下发 */
export const AUTH_COOKIE = 'auth_token';
/** 请求默认超时时间，单位ms */
const DEFAULT_TIMEOUT = 15_000;

/** 接口基础地址：API Routes 集成在同域，客户端和服务端统一用 /api */
const BASE_URL = '/api';

/**
 * 服务端请求时读取 httpOnly Cookie 并转发给后端
 * @description 动态导入 next/headers 避免将服务端模块打包到客户端
 * @returns Cookie 字符串（如 "auth_token=xxx"），客户端运行或无 token 时返回 undefined
 */
async function getServerCookieHeader(): Promise<string | undefined> {
  if (typeof window !== 'undefined') return undefined;
  try {
    const { cookies: nextCookies } = await import('next/headers');
    const cookieStore = await nextCookies();
    const authToken = cookieStore.get(AUTH_COOKIE)?.value;
    if (!authToken) return undefined;
    return `${AUTH_COOKIE}=${authToken}`;
  } catch {
    return undefined;
  }
}

/**
 * 构建完整请求 URL，拼装 BASE_URL + path + querystring
 * @param path 接口路径，以 / 开头
 * @param query 查询参数对象，自动过滤 null/undefined/空字符串
 * @returns 完整请求 URL 字符串
 */
function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = `${BASE_URL}${path}`;
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== null && value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

/**
 * 构建服务端请求 URL（绝对路径）
 * @description Netlify serverless 环境中，Server Component 内部 fetch 相对路径会失败，
 *              需要拼接完整 URL。优先从请求头获取 host，fallback 到 NEXT_PUBLIC_BASE_URL
 */
async function buildServerUrl(path: string, query?: RequestOptions['query']): Promise<string> {
  const relativeUrl = buildUrl(path, query);

  // 从请求头获取 host（Netlify 会设置 x-forwarded-host / x-forwarded-proto）
  try {
    const { headers } = await import('next/headers');
    const h = await headers();
    const host = h.get('x-forwarded-host') || h.get('host');
    const proto =
      h.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http');
    if (host) return `${proto}://${host}${relativeUrl}`;
  } catch {
    // headers() 不可用（非 Next.js 上下文），fallback
  }

  // Fallback 到环境变量配置的 base URL
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${base.replace(/\/$/, '')}${relativeUrl}`;
}

/** 客户端 401 防抖锁，避免多个并行请求同时触发重定向 */
let authRedirecting = false;
/** authRedirecting 安全重置定时器，防止锁泄漏 */
let authRedirectTimer: ReturnType<typeof setTimeout> | null = null;

/** 刷新 Token 锁，避免多个 401 并行请求同时触发刷新 */
let refreshPromise: Promise<boolean> | null = null;

/**
 * 尝试刷新 Token：调用 /api/auth/refresh 接口
 * @returns 刷新成功返回 true，失败返回 false
 */
async function tryRefreshToken(): Promise<boolean> {
  // 已有刷新请求在进行中，复用同一个 Promise
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) return false;
      const payload = await res.json();
      return payload?.code === 0;
    } catch {
      return false;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

/**
 * 发起请求并返回 data 部分
 * @param path 接口路径，以 / 开头
 * @param options 请求配置（method/body/query/headers/超时/鉴权重定向控制等）
 * @returns 后端响应中的 data 字段
 * @throws ApiRequestError 任何非 2xx / 业务 code 非 0 的情况
 */
export async function request<T>(
  path: string,
  options: RequestOptions = {},
  _retryDepth = 0,
): Promise<T> {
  const { body, query, headers, skipAuthRedirect, signal, ...rest } = options;

  // 服务端使用绝对 URL（Netlify serverless 不支持相对路径 fetch），客户端使用相对路径
  const isServer = typeof window === 'undefined';
  const url = isServer ? await buildServerUrl(path, query) : buildUrl(path, query);

  // 服务端：转发 httpOnly Cookie
  const serverCookie = await getServerCookieHeader();

  // 请求超时控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
  const combinedSignal = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal;

  let res: Response;
  try {
    res = await fetch(url, {
      ...rest,
      signal: combinedSignal,
      credentials: typeof window !== 'undefined' ? 'include' : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...(serverCookie ? { Cookie: serverCookie } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiRequestError(0, 0, '请求超时，请稍后重试');
    }
    // 网络错误 / 后端未启动
    throw new ApiRequestError(0, 0, '网络请求失败，请检查服务是否可用');
  } finally {
    clearTimeout(timeoutId);
  }

  // 解析 JSON（容错：后端可能返回非 JSON）
  let payload: (ApiResponse<T> & { details?: ValidationErrorDetail[] }) | null = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      // 非 JSON，按状态码抛出
      throw new ApiRequestError(res.status, res.status, `请求失败（${res.status}）`);
    }
  }

  // 成功：2xx 且业务 code 为 0
  if (res.ok && payload && payload.code === 0) {
    return payload.data;
  }

  // 401 客户端：尝试刷新 Token 后重试（最多一次），失败则重定向登录
  if (res.status === 401 && !skipAuthRedirect && typeof window !== 'undefined' && _retryDepth < 1) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      // 刷新成功，重试原始请求
      return request<T>(path, options, _retryDepth + 1);
    }
    // 刷新失败，重定向到登录页
    if (!authRedirecting) {
      authRedirecting = true;
      // 安全重置：5 秒后清除锁，防止因重定向未执行导致锁永久泄漏
      if (authRedirectTimer) clearTimeout(authRedirectTimer);
      authRedirectTimer = setTimeout(() => {
        authRedirecting = false;
        authRedirectTimer = null;
      }, 5000);
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }
  }

  const message = payload?.message || `请求失败（${res.status}）`;
  throw new ApiRequestError(res.status, payload?.code ?? res.status, message, payload?.details);
}

/**
 * 便捷请求方法集合，封装 GET/POST/PUT/PATCH/DELETE 快捷调用
 */
export const api = {
  /** GET 请求 @param path 接口路径 @param query 查询参数 @param opts 额外选项（含 revalidate 缓存秒数） */
  get: <T>(
    path: string,
    query?: RequestOptions['query'],
    opts?: { skipAuthRedirect?: boolean; revalidate?: number },
  ) => {
    const { revalidate, ...rest } = opts ?? {};
    return request<T>(path, {
      method: 'GET',
      query,
      ...rest,
      ...(revalidate !== undefined ? { next: { revalidate } } : {}),
    });
  },
  /** POST 请求 @param path 接口路径 @param body 请求体 @param opts 额外选项 */
  post: <T>(path: string, body?: unknown, opts?: { skipAuthRedirect?: boolean }) =>
    request<T>(path, { method: 'POST', body, ...opts }),
  /** PUT 请求 @param path 接口路径 @param body 请求体 @param opts 额外选项 */
  put: <T>(path: string, body?: unknown, opts?: { skipAuthRedirect?: boolean }) =>
    request<T>(path, { method: 'PUT', body, ...opts }),
  /** DELETE 请求 @param path 接口路径 @param opts 额外选项 */
  delete: <T>(path: string, opts?: { skipAuthRedirect?: boolean }) =>
    request<T>(path, { method: 'DELETE', ...opts }),
};
