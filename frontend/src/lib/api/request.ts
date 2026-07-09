/**
 * 同构 API 请求 — 基于 fetch 封装，客户端与服务端通用
 *
 * 鉴权：客户端 credentials:'include' 自动带 Cookie；服务端通过 config.token 显式传入
 * 401 拦截：客户端自动跳 /login，并发去重（__AUTH_REDIRECTING__），跳前调 __AUTH_CONTEXT__.logout()
 * skipAuthRedirect 可跳过（如 /auth/me 探测）
 */

/** 401 跳转去重标志 + Auth 上下文桥接（由 AuthProvider 注册） */
declare global {
  interface Window {
    __AUTH_REDIRECTING__?: boolean;
    __AUTH_CONTEXT__?: { logout: () => void };
  }
}

import type { ApiResponse } from "@my-app/shared";

/** API 基础地址，优先读取环境变量，回退到本地开发地址 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/** 默认请求超时（毫秒） */
const DEFAULT_TIMEOUT = 15_000;

/** API 请求错误，HTTP 状态码非 2xx 时抛出 */
export class ApiRequestError extends Error {
  statusCode: number;
  error: string;

  constructor(message: string, statusCode: number, error: string) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
    this.error = error;
    Object.setPrototypeOf(this, ApiRequestError.prototype);
  }
}

/** 请求配置，扩展原生 RequestInit */
export interface RequestConfig extends Omit<RequestInit, "body"> {
  /** URL 查询参数，值为 undefined/null/空字符串 时自动过滤 */
  params?: Record<string, string | number | boolean | undefined>;
  /** 鉴权 token，服务端组件需显式传入，客户端无需 */
  token?: string;
  /** 请求体 — FormData/Blob/ArrayBuffer 直接透传，其余 JSON 序列化 */
  body?: unknown;
  /** Next.js fetch 扩展 — 缓存策略 */
  cache?: RequestCache;
  /** Next.js fetch 扩展 — 服务端缓存控制 */
  next?: { revalidate?: number | false; tags?: string[] };
  /** 请求超时（毫秒），默认 15000 */
  timeout?: number;
  /** 跳过 401 全局跳转（如 /auth/me 探测，未登录不应跳走） */
  skipAuthRedirect?: boolean;
}

/**
 * 同构 API 请求
 *
 * 客户端 credentials:'include' 自动带 Cookie；服务端需 config.token 传 Authorization
 * 支持 Next.js fetch 扩展（cache/next）、内置超时、外部 AbortSignal
 *
 * @template T 业务数据类型
 * @returns API 响应，204 时 data 为 null
 * @throws ApiRequestError HTTP 状态码非 2xx 时抛出
 */
export async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T | null>> {
  const { params, token, next, cache, body, headers: customHeaders, timeout = DEFAULT_TIMEOUT, skipAuthRedirect, ...fetchConfig } = config;

  // 拼接 URL + 查询参数（undefined/null/空字符串自动过滤）
  const base = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  let url = base;
  if (params) {
    const u = new URL(base);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") u.searchParams.append(key, String(value));
    });
    url = u.toString();
  }

  // 序列化请求体：FormData/Blob/ArrayBuffer 直接透传，其余 JSON.stringify
  const isRaw = body instanceof FormData || body instanceof Blob || body instanceof ArrayBuffer || ArrayBuffer.isView(body);
  const serializedBody = body === undefined || body === null ? undefined : isRaw ? (body as BodyInit) : JSON.stringify(body);

  // 构建请求头：非 raw 请求默认 Content-Type: application/json，自定义头覆盖
  const headers = new Headers(!isRaw ? { "Content-Type": "application/json" } : undefined);
  if (customHeaders) {
    const custom = customHeaders instanceof Headers ? customHeaders : new Headers(customHeaders as HeadersInit);
    custom.forEach((value, key) => headers.set(key, value));
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  // 超时控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const signal = fetchConfig.signal ? AbortSignal.any([fetchConfig.signal, controller.signal]) : controller.signal;

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      signal,
      headers,
      body: serializedBody,
      ...(typeof window !== "undefined" ? { credentials: "include" } : {}),
      ...(cache ? { cache } : {}),
      ...(next ? { next } : {}),
    });

    // 204 无响应体
    if (response.status === 204) return { data: null, message: "No Content", statusCode: 204 };

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // 客户端 401：跳转登录页（Cookie 过期），skipAuthRedirect 除外
      if (response.status === 401 && typeof window !== "undefined" && !skipAuthRedirect) {
        if (!window.__AUTH_REDIRECTING__) {
          window.__AUTH_REDIRECTING__ = true;
          try {
            window.__AUTH_CONTEXT__?.logout();
          } catch {
            /* AuthProvider 未注册时忽略 */
          }
          window.location.href = "/login";
        }
        // 跳转已触发，抛出错误中断调用链
        throw new ApiRequestError(data?.message || response.statusText, response.status, data?.error || "Unauthorized");
      }
      throw new ApiRequestError(data?.message || response.statusText, response.status, data?.error || "Error");
    }

    return data as ApiResponse<T>;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * HTTP 快捷方法 — 直接返回业务数据（无需 .data）
 *
 * 客户端/服务端通用，服务端需在 config 传入 token
 * 登录/登出等需要 Set-Cookie 的场景必须从浏览器直接发请求
 */
export const http = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "GET" }).then((r) => r.data),

  post: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "POST", body }).then((r) => r.data),

  put: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "PUT", body }).then((r) => r.data),

  patch: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "PATCH", body }).then((r) => r.data),

  del: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "DELETE" }).then((r) => r.data),
};
