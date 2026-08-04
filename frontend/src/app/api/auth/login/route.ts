import { type NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/server/container';
import { sendError } from '@/server/utils/api-response';
import { parseLoginBody } from '@/server/modules/auth/auth.validators';
import { isRateLimited, getClientIp } from '@/server/utils/rate-limit';
import { RateLimitError } from '@/server/errors';

export const runtime = 'nodejs';

/** 5 分钟内最多 5 次尝试 */
const LIMIT = 5;
const WINDOW_MS = 5 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(`login:${ip}`, LIMIT, WINDOW_MS)) {
      throw new RateLimitError('尝试过于频繁，请 5 分钟后再试');
    }

    const body = await request.json();
    const dto = parseLoginBody(body);
    const { authService, authCookieHelper } = getContainer();
    const user = await authService.login(dto);
    const response = NextResponse.json(
      { code: 0, data: null, message: '登录成功' },
      { status: 200 },
    );
    authCookieHelper.setAuthCookies(response, user);
    return response;
  } catch (err) {
    return sendError(err);
  }
}
