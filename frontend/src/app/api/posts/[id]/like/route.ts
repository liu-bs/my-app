import { type NextRequest } from 'next/server';
import { getContainer } from '@/server/container';
import { sendSuccess, sendError } from '@/server/utils/api-response';
import { requireAuth } from '@/server/modules/auth/auth.guard';
import { NotFoundError } from '@/server/errors';

export const runtime = 'nodejs';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { blogService, tokenService, userRepo } = getContainer();
    const auth = await requireAuth(request, { tokenService, userRepo });
    const { id } = await params;
    if (!id?.trim()) throw new NotFoundError('文章不存在');
    const result = await blogService.likePost(id, auth.id);
    return sendSuccess(result, '操作成功');
  } catch (err) {
    return sendError(err);
  }
}
