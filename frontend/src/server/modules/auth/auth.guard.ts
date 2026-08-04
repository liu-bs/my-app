import 'server-only';
import type { NextRequest } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@server/errors';
import type { UserRepository } from './kv-user.repository';
import type { TokenService, AuthPayload, TokenVerifyResult } from './services/token.service';

export interface AuthDeps {
  tokenService: TokenService;
  userRepo: UserRepository;
}

/**
 * 必选认证：从 NextRequest 的 cookie 中读取 auth_token，验证后返回 AuthPayload。
 * 失败时抛出 UnauthorizedError / ForbiddenError。
 */
export async function requireAuth(request: NextRequest, deps: AuthDeps): Promise<AuthPayload> {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    throw new UnauthorizedError('未授权，请先登录');
  }

  const result: TokenVerifyResult = deps.tokenService.verify(token);
  if (!result.success) {
    const msg =
      result.errorType === 'expired' ? '登录已过期，请重新登录' : 'Token 无效，请重新登录';
    throw new UnauthorizedError(msg);
  }

  const decoded = result.payload;

  const user = await deps.userRepo.findById(decoded.id).catch(() => undefined);
  if (!user) {
    throw new UnauthorizedError('用户不存在，请重新登录');
  }

  if ((user.tokenVersion ?? 0) !== decoded.tokenVersion) {
    throw new UnauthorizedError('Token 已失效，请重新登录');
  }

  if (user.disabled) {
    throw new ForbiddenError('账号已被禁用');
  }

  return decoded;
}

/**
 * 可选认证：失败时返回 null 而非抛异常。
 */
export async function tryAuth(request: NextRequest, deps: AuthDeps): Promise<AuthPayload | null> {
  try {
    return await requireAuth(request, deps);
  } catch {
    return null;
  }
}
