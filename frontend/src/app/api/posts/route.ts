import { type NextRequest } from 'next/server';
import { getContainer } from '@/server/container';
import { sendSuccess, sendCreated, sendError } from '@/server/utils/api-response';
import { requireAuth, tryAuth } from '@/server/modules/auth/auth.guard';
import { parseCreatePostBody, parseListQuery } from '@/server/modules/blog/blog.validators';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { blogService, tokenService, userRepo } = getContainer();
    const user = await tryAuth(request, { tokenService, userRepo });
    const params = request.nextUrl.searchParams;
    const query = parseListQuery(Object.fromEntries(params.entries()));
    const result = await blogService.listPosts({ ...query, user: user ?? undefined });
    return sendSuccess(result, '获取成功');
  } catch (err) {
    return sendError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { blogService, tokenService, userRepo } = getContainer();
    const auth = await requireAuth(request, { tokenService, userRepo });
    const body = await request.json();
    const dto = parseCreatePostBody(body);
    const post = await blogService.createPost({ ...dto, authorId: auth.id });
    return sendCreated({ post }, '创建成功');
  } catch (err) {
    return sendError(err);
  }
}
