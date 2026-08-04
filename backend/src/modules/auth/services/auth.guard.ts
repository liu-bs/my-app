/**
 * @file auth.guard.ts
 * @description auth 模块鉴权守卫，包含必选守卫（未登录拒绝）和可选守卫（未登录放行），以及获取当前登录用户的辅助函数
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { UnauthorizedError, ForbiddenError } from '@/errors';
import type { UserRepository } from '../repository/auth.repository.ts';
import type { TokenService } from './token.service.ts';
import type { AuthPayload, TokenVerifyResult } from './token.service.ts';

/**
 * 创建必选鉴权守卫中间件
 * @description 校验 Cookie 中的 auth_token，验证 Token 有效性、用户存在性、tokenVersion 匹配及账号未禁用
 * @param deps 依赖对象，包含 tokenService 和 userRepo
 * @returns Express RequestHandler 中间件
 */
export function createAuthGuard(deps: {
  tokenService: TokenService;
  userRepo: UserRepository;
}): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      // 仅从 Cookie 读取 auth_token，统一鉴权通道
      const token = req.cookies?.auth_token;

      if (!token) {
        next(new UnauthorizedError('未授权，请先登录'));
        return;
      }

      const result: TokenVerifyResult = deps.tokenService.verify(token);
      if (!result.success) {
        const msg =
          result.errorType === 'expired' ? '登录已过期，请重新登录' : 'Token 无效，请重新登录';
        next(new UnauthorizedError(msg));
        return;
      }

      const decoded = result.payload;

      const user = await deps.userRepo.findById(decoded.id).catch(() => undefined);
      if (!user) {
        next(new UnauthorizedError('用户不存在，请重新登录'));
        return;
      }

      if ((user.tokenVersion ?? 0) !== decoded.tokenVersion) {
        next(new UnauthorizedError('Token 已失效，请重新登录'));
        return;
      }

      if (user.disabled) {
        next(new ForbiddenError('账号已被禁用'));
        return;
      }

      // 鉴权通过，将解码后的 payload 挂载到 req.user
      req.user = decoded;
      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * 可选认证守卫：存在有效 Cookie 时设置 req.user，否则以游客身份继续。
 * 用于需要区分登录/游客状态的公开接口（如文章列表、文章详情）。
 */
export function createOptionalAuthGuard(deps: {
  tokenService: TokenService;
  userRepo: UserRepository;
}): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies?.auth_token;
      if (!token) {
        next();
        return;
      }

      const result: TokenVerifyResult = deps.tokenService.verify(token);
      if (!result.success) {
        // 无效或过期的 Cookie 在可选守卫中静默忽略，以游客身份继续
        next();
        return;
      }

      const decoded = result.payload;

      const user = await deps.userRepo.findById(decoded.id).catch(() => undefined);
      if (!user || (user.tokenVersion ?? 0) !== decoded.tokenVersion || user.disabled) {
        next();
        return;
      }

      req.user = decoded;
      next();
    } catch {
      next();
    }
  };
}

/**
 * 从请求中获取已认证用户信息
 * @param req Express 请求对象
 * @returns 解码后的 AuthPayload
 * @throws 未登录时抛出 UnauthorizedError
 */
export function getAuthUser(req: Request): AuthPayload {
  if (!req.user) {
    throw new UnauthorizedError('未授权，请先登录');
  }
  return req.user;
}
