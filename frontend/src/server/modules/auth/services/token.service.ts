import 'server-only';
import jwt from 'jsonwebtoken';
import { env } from '@server/config/env';
import type { AuthPayload, TokenVerifyResult, TokenService } from '@my-app/shared';

export type { AuthPayload };
export type { TokenVerifyResult, TokenService };

export function createTokenService(): TokenService {
  return {
    generate: (payload: AuthPayload) => {
      const expiresIn = env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'];
      return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
    },
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
    decode: (token: string): AuthPayload | null => {
      try {
        return jwt.decode(token) as AuthPayload;
      } catch {
        return null;
      }
    },
  };
}
