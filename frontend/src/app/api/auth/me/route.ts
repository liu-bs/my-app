import { type NextRequest } from 'next/server';
import { getContainer, toSafeUser } from '@/server/container';
import { sendSuccess, sendError } from '@/server/utils/api-response';
import { requireAuth } from '@/server/modules/auth/auth.guard';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { authService, tokenService, userRepo } = getContainer();
    const auth = await requireAuth(request, { tokenService, userRepo });
    const user = await authService.getMe(auth.id);
    return sendSuccess({ user: toSafeUser(user) }, '获取成功');
  } catch (err) {
    return sendError(err);
  }
}
