/**
 * @file proxy.ts
 * @description Next.js 路由代理，在请求进入页面之前拦截未登录访问私有路径。
 *
 * 环节闭环：
 * - 用户访问私有页面 → Proxy 检测 Cookie → 无 Cookie 则重定向登录页
 * - 登录成功 → Cookie 种入 → 后续请求自动放行
 * - 登出 → Cookie 清除 → 再次访问私有页面被拦截
 *
 * 注意：httpOnly Cookie 无法通过 JS 读取是否存在，
 * 但 Proxy 运行在 Edge Runtime，可通过 request.cookies.get() 读取。
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** 需要登录才能访问的路径前缀 */
const PRIVATE_PATHNAMES = ["/dashboard", "/profile", "/settings", "/write", "/my-articles", "/favorites", "/notifications", "/reading-list"];

/** Cookie 名称 — 与后端 res.cookie() 的第一个参数保持一致 */
const AUTH_COOKIE_NAME = "auth_token";

/**
 * 判断当前路径是否属于私有区域
 *
 * 严格匹配路径前缀：完全等于或以下一级 / 开头的子路径都视为私有。
 *
 * @param pathname 当前请求路径
 * @returns 类型谓词，true=私有路径需要鉴权
 */
function isPrivatePath(pathname: string) {
  return PRIVATE_PATHNAMES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

/**
 * Next.js Proxy 入口
 *
 * 检查请求 Cookie：未登录用户访问私有路径时附带 redirect 参数跳转到登录页。
 * 公开路径直接放行。
 *
 * @param request Next.js 请求对象
 * @returns 放行响应或重定向到登录页的响应
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token && isPrivatePath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    // 携带原始路径，登录成功后可跳转回去
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/** Proxy 配置 */
export const config = {
  /** 匹配所有路径，由 proxy 内部判断是否需要拦截（排除 API、静态资源与图标） */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
