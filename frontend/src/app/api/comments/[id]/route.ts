import { type NextRequest } from 'next/server';
import { getContainer } from '@/server/container';
import { sendSuccess, sendError } from '@/server/utils/api-response';
import { requireAuth } from '@/server/modules/auth/auth.guard';
import { parseCreateCommentBody } from '@/server/modules/comment/comment.validators';
import { NotFoundError } from '@/server/errors';

export const runtime = 'nodejs';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { commentService, tokenService, userRepo } = getContainer();
    const auth = await requireAuth(request, { tokenService, userRepo });
    const { id } = await params;
    if (!id?.trim()) throw new NotFoundError('评论不存在');
    const body = await request.json();
    const dto = parseCreateCommentBody(body);
    const comment = await commentService.updateComment(id, dto.content, auth.id);
    return sendSuccess({ comment }, '编辑成功');
  } catch (err) {
    return sendError(err);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { commentService, tokenService, userRepo } = getContainer();
    const auth = await requireAuth(request, { tokenService, userRepo });
    const { id } = await params;
    if (!id?.trim()) throw new NotFoundError('评论不存在');
    await commentService.deleteComment(id, auth.id);
    return sendSuccess(null, '删除成功');
  } catch (err) {
    return sendError(err);
  }
}
