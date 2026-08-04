import { type NextRequest } from 'next/server';
import { getContainer, toSafeUser } from '@/server/container';
import { sendCreated, sendError } from '@/server/utils/api-response';
import { parseRegisterBody } from '@/server/modules/auth/auth.validators';
import { isRateLimited, getClientIp } from '@/server/utils/rate-limit';
import { RateLimitError } from '@/server/errors';

export const runtime = 'nodejs';

/** 5 分钟内最多 5 次尝试 */
const LIMIT = 5;
const WINDOW_MS = 5 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(`register:${ip}`, LIMIT, WINDOW_MS)) {
      throw new RateLimitError('注册过于频繁，请 5 分钟后再试');
    }

    const body = await request.json();
    const dto = parseRegisterBody(body);
    const { authService } = getContainer();
    const user = await authService.register(dto);
    return sendCreated({ user: toSafeUser(user) }, '注册成功，请登录');
  } catch (err) {
    return sendError(err);
  }
}
