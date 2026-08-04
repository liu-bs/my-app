import { type NextRequest } from 'next/server';
import { getContainer, toSafeUser } from '@/server/container';
import { sendSuccess, sendError } from '@/server/utils/api-response';
import { requireAuth } from '@/server/modules/auth/auth.guard';
import { parseUpdateProfileBody } from '@/server/modules/auth/auth.validators';

export const runtime = 'nodejs';

export async function PUT(request: NextRequest) {
  try {
    const { authService, tokenService, userRepo } = getContainer();
    const auth = await requireAuth(request, { tokenService, userRepo });
    const body = await request.json();
    const profileData = parseUpdateProfileBody(body);
    const user = await authService.updateProfile(auth.id, profileData);
    return sendSuccess({ user: toSafeUser(user) }, '资料更新成功');
  } catch (err) {
    return sendError(err);
  }
}
