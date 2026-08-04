/**
 * @file proxy.ts
 * @description Next.js 16 Proxy 中间件，负责 API 代理和路由守卫。
 *              1. 将 /api/* 请求 rewrite 到后端服务（开发期避免跨域，Cookie 同源携带）
 *              2. 受保护路由检查 auth_token cookie，缺失则重定向 /login?redirect=<原路径>
 *              注意：proxy 运行在 Edge Runtime，可读取 httpOnly Cookie；
 *              仅拦截浏览器入站请求，服务端组件内的 fetch 不经过此处。
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE, BACKEND_URL } from '@/lib/api/request';
import { PROTECTED_ROUTES } from '@/config/site';

/**
 * 判断路径是否属于受保护路由
 * @param pathname 当前请求路径
 * @returns 是否受保护
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Proxy 入口函数，处理 API 代理和路由守卫
 * @param request Next.js 请求对象
 * @returns NextResponse — API 代理 rewrite / 路由守卫 redirect / 放行 next
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // ── API 代理 ──
  if (pathname.startsWith('/api/')) {
    const target = new URL(`${pathname}${search}`, BACKEND_URL);
    return NextResponse.rewrite(target);
  }

  // ── 路由守卫 ──
  if (isProtectedRoute(pathname)) {
    const authToken = request.cookies.get(AUTH_COOKIE)?.value;
    if (!authToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

/** proxy 匹配规则：拦截所有 /api 路径及非静态资源的页面路由 */
export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
