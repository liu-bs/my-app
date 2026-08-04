/**
 * @file auth.routes.ts
 * @description auth 模块路由定义，包含注册、登录、获取当前用户、登出、修改密码、更新资料等接口
 */

import { Router, type Request, type Response, type NextFunction } from 'express';
import type { CreateAuthRouterDeps } from '@my-app/shared';
import { createAuthRateLimiter } from '@/middleware/rateLimiter.ts';
import { asyncHandler } from '@/utils/asyncHandler.ts';
import { createSuccessResponse } from '@/utils/common.ts';
import { UnauthorizedError } from '@/errors';
import { toSafeUser } from '../services/auth.service.ts';
import { getAuthUser } from '../services/auth.guard.ts';
import {
  parseRegisterBody,
  parseLoginBody,
  parseChangePasswordBody,
  parseUpdateProfileBody,
} from './auth.validators.ts';

/**
 * 创建 auth 路由（工厂函数）
 * @param deps 认证相关依赖，必须由调用方注入
 */
export function createAuthRouter(deps: CreateAuthRouterDeps): Router {
  const router: Router = Router();
  // 认证接口限流器，防止暴力登录/注册
  const authRateLimiter = createAuthRateLimiter();

  // POST /register — 注册新用户
  router.post(
    '/register',
    authRateLimiter,
    asyncHandler(async (req: Request, res: Response) => {
      const dto = parseRegisterBody(req);
      const user = await deps.authService.register(dto);
      // 注册仅创建用户记录，不下发登录态——登录态必须由显式调用 /login 建立
      res.status(201).json(createSuccessResponse({ user: toSafeUser(user) }, '注册成功，请登录'));
    }),
  );

  // POST /login — 用户登录，下发认证 Cookie
  router.post(
    '/login',
    authRateLimiter,
    asyncHandler(async (req: Request, res: Response) => {
      const dto = parseLoginBody(req);
      const user = await deps.authService.login(dto);
      deps.authCookieHelper.setAuthCookies(res, user);
      res.json(createSuccessResponse(null, '登录成功'));
    }),
  );

  // GET /me — 获取当前登录用户信息
  router.get(
    '/me',
    deps.authGuard,
    asyncHandler(async (req: Request, res: Response) => {
      const user = await deps.authService.getMe(getAuthUser(req).id);
      res.json(createSuccessResponse({ user: toSafeUser(user) }, '获取成功'));
    }),
  );

  // POST /logout — 登出，递增 tokenVersion 使旧 Token 失效并清除 Cookie
  router.post(
    '/logout',
    deps.authGuard,
    asyncHandler(async (req: Request, res: Response) => {
      await deps.authService.logout(getAuthUser(req).id);
      deps.authCookieHelper.clearAuthCookies(res);
      res.json(createSuccessResponse(null, '登出成功'));
    }),
  );

  // POST /change-password — 修改密码，成功后清除 Cookie 要求重新登录
  router.post(
    '/change-password',
    deps.authGuard,
    authRateLimiter,
    asyncHandler(async (req: Request, res: Response) => {
      const dto = parseChangePasswordBody(req);
      await deps.authService.changePassword(getAuthUser(req).id, dto);
      deps.authCookieHelper.clearAuthCookies(res);
      res.json(createSuccessResponse(null, '密码修改成功，请重新登录'));
    }),
  );

  // PUT /profile — 更新用户资料（姓名、头像、简介、位置、网站），zod 校验长度上限
  router.put(
    '/profile',
    deps.authGuard,
    asyncHandler(async (req: Request, res: Response) => {
      const profileData = parseUpdateProfileBody(req);
      const user = await deps.authService.updateProfile(getAuthUser(req).id, profileData);
      res.json(createSuccessResponse({ user: toSafeUser(user) }, '资料更新成功'));
    }),
  );

  // POST /refresh — 刷新 Token，验证签名（接受过期但签名有效的 Token）后下发新 Cookie
  router.post(
    '/refresh',
    authRateLimiter,
    asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
      const token = req.cookies?.['auth_token'] as string | undefined;
      if (!token) {
        throw new UnauthorizedError('无 Token，请重新登录');
      }
      // 必须验签：接受过期但签名有效的 Token，拒绝签名错误的伪造 Token
      const result = deps.tokenService.verify(token);
      if (!result.success && result.errorType !== 'expired') {
        throw new UnauthorizedError('Token 无效，请重新登录');
      }
      // verify 成功或过期时，从 payload 提取用户信息刷新
      const payload = result.success ? result.payload : deps.tokenService.decode(token);
      if (!payload) {
        throw new UnauthorizedError('Token 无法解析，请重新登录');
      }
      const user = await deps.authService.refresh(payload);
      deps.authCookieHelper.setAuthCookies(res, user);
      res.json(createSuccessResponse({ user: toSafeUser(user) }, 'Token 已刷新'));
    }),
  );

  return router;
}
