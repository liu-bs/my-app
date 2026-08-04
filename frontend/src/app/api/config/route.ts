import { type NextRequest } from 'next/server';
import { getContainer } from '@/server/container';
import { sendSuccess, sendError } from '@/server/utils/api-response';
import { requireAuth } from '@/server/modules/auth/auth.guard';
import { parseUpdateSiteConfigBody } from '@/server/modules/blog/blog.validators';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { blogService } = getContainer();
    const config = await blogService.getConfig();
    return sendSuccess({ config }, '获取成功');
  } catch (err) {
    return sendError(err);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { blogService, tokenService, userRepo } = getContainer();
    const auth = await requireAuth(request, { tokenService, userRepo });
    const body = await request.json();
    const dto = parseUpdateSiteConfigBody(body);
    const config = await blogService.updateConfig(dto, auth.id);
    return sendSuccess({ config }, '更新成功');
  } catch (err) {
    return sendError(err);
  }
}
