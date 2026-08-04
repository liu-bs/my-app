/**
 * @file server.ts
 * @description 服务端鉴权辅助函数，供 Server Components 获取当前登录用户
 */
import 'server-only';
import { cache } from 'react';
import { authApi } from './api';
import { AUTH_COOKIE } from '@/lib/api/request';
import type { User } from '@my-app/shared';

/**
 * 获取当前登录用户信息（服务端）
 * @description 使用 React cache() 确保同一请求内多次调用只执行一次，
 *              避免布局和页面重复请求 /api/auth/me
 *              先检查 httpOnly auth_token cookie 是否存在，不存在则直接返回 null，
 *              避免访客模式下无谓的 401 请求
 * @returns 用户信息，未登录或接口异常时返回 null
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  try {
    // 服务端：检查 auth_token cookie 是否存在，不存在则跳过请求
    const { cookies: nextCookies } = await import('next/headers');
    const cookieStore = await nextCookies();
    const authToken = cookieStore.get(AUTH_COOKIE)?.value;
    if (!authToken) return null;

    const res = await authApi.me();
    return res.user;
  } catch {
    return null;
  }
});
