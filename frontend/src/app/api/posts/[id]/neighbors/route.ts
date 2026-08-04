import { type NextRequest } from 'next/server';
import { getContainer } from '@/server/container';
import { sendSuccess, sendError } from '@/server/utils/api-response';
import { NotFoundError } from '@/server/errors';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { blogService } = getContainer();
    const { id } = await params;
    if (!id?.trim()) throw new NotFoundError('文章不存在');
    const neighbors = await blogService.getNeighborPosts(id);
    return sendSuccess(neighbors, '获取成功');
  } catch (err) {
    return sendError(err);
  }
}
