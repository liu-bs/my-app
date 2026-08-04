import 'server-only';
import type { NextResponse } from 'next/server';
import type { User } from '@my-app/shared';
import { buildCookieOptions } from '@server/utils/cookie';
import type { TokenService } from './services/token.service';

export interface AuthCookieHelper {
  setAuthCookies(res: NextResponse, user: User): void;
  clearAuthCookies(res: NextResponse): void;
}

export function createAuthCookieHelper(deps: { tokenService: TokenService }): AuthCookieHelper {
  return {
    setAuthCookies: (res: NextResponse, user: User): void => {
      const token = deps.tokenService.generate({
        id: user.id,
        email: user.email,
        tokenVersion: user.tokenVersion ?? 0,
      });
      res.cookies.set('auth_token', token, buildCookieOptions({ httpOnly: true }));
      res.cookies.set('auth_status', '1', buildCookieOptions({ httpOnly: false }));
    },
    clearAuthCookies: (res: NextResponse): void => {
      res.cookies.set('auth_token', '', buildCookieOptions({ httpOnly: true, maxAge: 0 }));
      res.cookies.set('auth_status', '', buildCookieOptions({ httpOnly: false, maxAge: 0 }));
    },
  };
}
