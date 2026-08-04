import { type NextRequest, NextResponse } from 'next/server';
import { getContainer, toSafeUser } from '@/server/container';
import { sendError } from '@/server/utils/api-response';
import { UnauthorizedError } from '@/server/errors';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { tokenService, authService, authCookieHelper } = getContainer();
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      throw new UnauthorizedError('无 Token，请重新登录');
    }
    const result = tokenService.verify(token);
    if (!result.success && result.errorType !== 'expired') {
      throw new UnauthorizedError('Token 无效，请重新登录');
    }
    const payload = result.success ? result.payload : tokenService.decode(token);
    if (!payload) {
      throw new UnauthorizedError('Token 无法解析，请重新登录');
    }
    const user = await authService.refresh(payload);
    const response = NextResponse.json(
      { code: 0, data: { user: toSafeUser(user) }, message: 'Token 已刷新' },
      { status: 200 },
    );
    authCookieHelper.setAuthCookies(response, user);
    return response;
  } catch (err) {
    return sendError(err);
  }
}
