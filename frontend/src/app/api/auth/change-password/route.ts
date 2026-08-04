import { type NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/server/container';
import { sendError } from '@/server/utils/api-response';
import { requireAuth } from '@/server/modules/auth/auth.guard';
import { parseChangePasswordBody } from '@/server/modules/auth/auth.validators';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { authService, authCookieHelper, tokenService, userRepo } = getContainer();
    const auth = await requireAuth(request, { tokenService, userRepo });
    const body = await request.json();
    const dto = parseChangePasswordBody(body);
    await authService.changePassword(auth.id, dto);
    const response = NextResponse.json(
      { code: 0, data: null, message: '密码修改成功，请重新登录' },
      { status: 200 },
    );
    authCookieHelper.clearAuthCookies(response);
    return response;
  } catch (err) {
    return sendError(err);
  }
}
