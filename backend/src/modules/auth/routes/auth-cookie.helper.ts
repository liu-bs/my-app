/**
 * @file auth-cookie.helper.ts
 * @description auth 模块 Cookie 辅助工具，负责登录态 Cookie 的设置与清除
 */

import type { Response } from 'express';
import type { User, AuthCookieHelper } from '@my-app/shared';
import {
  buildCookieOptions,
  buildStatusCookieOptions,
  buildClearCookieOptions,
  buildClearStatusCookieOptions,
} from '@/utils/cookie.ts';
import type { TokenService } from '../services/token.service.ts';

/**
 * 创建 auth Cookie 辅助工具
 * @param deps 依赖对象，包含 tokenService 用于生成 JWT
 * @returns AuthCookieHelper 实例
 */
export function createAuthCookieHelper(deps: { tokenService: TokenService }): AuthCookieHelper {
  return {
    /**
     * 设置认证 Cookie，同时下发 auth_token（JWT）和 auth_status（前端可读的登录标志）
     * @param res Express 响应对象
     * @param user 已认证的用户对象
     */
    setAuthCookies: (res: Response, user: User): void => {
      const token = deps.tokenService.generate({
        id: user.id,
        email: user.email,
        tokenVersion: user.tokenVersion ?? 0,
      });
      res.cookie('auth_token', token, buildCookieOptions());
      res.cookie('auth_status', '1', buildStatusCookieOptions());
    },
    /**
     * 清除认证 Cookie，注销登录态
     * @param res Express 响应对象
     */
    clearAuthCookies: (res: Response): void => {
      res.clearCookie('auth_token', buildClearCookieOptions());
      res.clearCookie('auth_status', buildClearStatusCookieOptions());
    },
  };
}
