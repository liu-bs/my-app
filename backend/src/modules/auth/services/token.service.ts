/**
 * @file token.service.ts
 * @description JWT Token 服务工厂，提供 Token 签发与验证能力，基于 jsonwebtoken 实现
 */

import jwt from 'jsonwebtoken';
import { env } from '@/config';
import type { AuthPayload, TokenVerifyResult, TokenService } from '@my-app/shared';

export type { AuthPayload, TokenVerifyResult, TokenService };
/**
 * 创建 Token 服务
 * @returns TokenService 实例，提供 generate 和 verify 方法
 */
export function createTokenService(): TokenService {
  return {
    /**
     * 签发 JWT Token
     * @param payload 载荷数据，包含用户 ID、邮箱和 tokenVersion
     * @returns 签发的 JWT 字符串
     */
    generate: (payload: AuthPayload) => {
      const expiresIn = env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'];
      return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
    },
    /**
     * 验证 JWT Token
     * @param token 待验证的 JWT 字符串
     * @returns 验证结果，成功时返回 payload，失败时返回错误类型（expired 或 invalid）
     */
    verify: (token: string): TokenVerifyResult => {
      try {
        const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
        return { success: true, payload };
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return { success: false, errorType: 'expired' };
        }
        return { success: false, errorType: 'invalid' };
      }
    },
    /**
     * 解码过期 Token（不验签），用于 refresh 场景提取 payload
     * @param token 过期的 JWT 字符串
     * @returns payload 或 null（解码失败时）
     */
    decode: (token: string): AuthPayload | null => {
      try {
        return jwt.decode(token) as AuthPayload;
      } catch {
        return null;
      }
    },
  };
}
