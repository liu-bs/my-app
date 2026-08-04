import { sendSuccess, sendError } from '@/server/utils/api-response';
import { getKV } from '@/server/infrastructure/kv-mock';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const kv = getKV();
    return sendSuccess(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        kv: { adapterType: kv.constructor.name },
      },
      'OK',
    );
  } catch (err) {
    return sendError(err);
  }
}
