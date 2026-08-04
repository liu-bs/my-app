import 'server-only';
import { env } from '@server/config/env';

export interface NextCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
  maxAge?: number;
}

export function buildCookieOptions(
  overrides: Pick<NextCookieOptions, 'httpOnly'> & Partial<Pick<NextCookieOptions, 'maxAge'>>,
): NextCookieOptions {
  return {
    secure: env.isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: env.COOKIE_MAX_AGE_MS,
    ...overrides,
  };
}
