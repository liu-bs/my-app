/**
 * @file proxy.ts
 * @description Next.js 16 Proxy 中间件，负责路由守卫。
 *              受保护路由检查 auth_token cookie，缺失则重定向 /login?redirect=<原路径>
 *              注意：proxy 运行在 Edge Runtime，可读取 httpOnly Cookie；
 *              仅拦截浏览器入站请求，服务端组件内的 fetch 不经过此处。
 *              API Routes 已集成到同域 Next.js App Router，不再需要 API 代理。
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE } from '@/lib/api/request';
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
 * Proxy 入口函数，处理路由守卫
 * @param request Next.js 请求对象
 * @returns NextResponse — 路由守卫 redirect / 放行 next
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

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

/** proxy 匹配规则：拦截非静态资源的页面路由（不再拦截 /api） */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
