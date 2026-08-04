import { getContainer } from '@/server/container';
import { sendSuccess, sendError } from '@/server/utils/api-response';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { blogService } = getContainer();
    const tags = await blogService.getTags();
    return sendSuccess({ tags }, '获取成功');
  } catch (err) {
    return sendError(err);
  }
}
