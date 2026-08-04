import { type NextRequest } from 'next/server';
import { getContainer } from '@/server/container';
import { sendSuccess, sendError } from '@/server/utils/api-response';
import { requireAuth, tryAuth } from '@/server/modules/auth/auth.guard';
import { parseUpdatePostBody } from '@/server/modules/blog/blog.validators';
import { NotFoundError } from '@/server/errors';

export const runtime = 'nodejs';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { blogService, tokenService, userRepo } = getContainer();
    const user = await tryAuth(request, { tokenService, userRepo });
    const { id } = await params;
    if (!id?.trim()) throw new NotFoundError('文章不存在');
    const post = await blogService.getPost(id, user ?? undefined);
    return sendSuccess({ post }, '获取成功');
  } catch (err) {
    return sendError(err);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { blogService, tokenService, userRepo } = getContainer();
    const auth = await requireAuth(request, { tokenService, userRepo });
    const { id } = await params;
    if (!id?.trim()) throw new NotFoundError('文章不存在');
    const body = await request.json();
    const dto = parseUpdatePostBody(body);
    const post = await blogService.updatePost(id, dto, auth.id);
    return sendSuccess({ post }, '更新成功');
  } catch (err) {
    return sendError(err);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { blogService, tokenService, userRepo } = getContainer();
    const auth = await requireAuth(request, { tokenService, userRepo });
    const { id } = await params;
    if (!id?.trim()) throw new NotFoundError('文章不存在');
    await blogService.deletePost(id, auth.id);
    return sendSuccess(null, '删除成功');
  } catch (err) {
    return sendError(err);
  }
}
