import { type NextRequest } from 'next/server';
import { getContainer } from '@/server/container';
import { sendSuccess, sendError } from '@/server/utils/api-response';
import { requireAuth } from '@/server/modules/auth/auth.guard';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { blogService, tokenService, userRepo } = getContainer();
    const auth = await requireAuth(request, { tokenService, userRepo });
    const posts = await blogService.listFavoritePosts(auth.id);
    return sendSuccess({ posts }, '获取成功');
  } catch (err) {
    return sendError(err);
  }
}
