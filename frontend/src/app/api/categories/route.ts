import { getContainer } from '@/server/container';
import { sendSuccess, sendError } from '@/server/utils/api-response';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { blogService } = getContainer();
    const categories = await blogService.getCategories();
    return sendSuccess({ categories }, '获取成功');
  } catch (err) {
    return sendError(err);
  }
}
