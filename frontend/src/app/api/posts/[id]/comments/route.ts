import { type NextRequest } from 'next/server';
import { getContainer } from '@/server/container';
import { sendSuccess, sendCreated, sendError } from '@/server/utils/api-response';
import { requireAuth, tryAuth } from '@/server/modules/auth/auth.guard';
import { parseCreateCommentBody } from '@/server/modules/comment/comment.validators';
import { NotFoundError } from '@/server/errors';

export const runtime = 'nodejs';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { commentService, tokenService, userRepo } = getContainer();
    const user = await tryAuth(request, { tokenService, userRepo });
    const { id: postId } = await params;
    if (!postId?.trim()) throw new NotFoundError('文章不存在');
    const comments = await commentService.listComments({
      postId,
      user: user ?? undefined,
    });
    return sendSuccess({ comments }, '获取成功');
  } catch (err) {
    return sendError(err);
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { commentService, tokenService, userRepo } = getContainer();
    const auth = await requireAuth(request, { tokenService, userRepo });
    const { id: postId } = await params;
    if (!postId?.trim()) throw new NotFoundError('文章不存在');
    const body = await request.json();
    const dto = parseCreateCommentBody(body);
    const comment = await commentService.createComment({
      ...dto,
      postId,
      userId: auth.id,
    });
    return sendCreated({ comment }, '发表评论成功');
  } catch (err) {
    return sendError(err);
  }
}
