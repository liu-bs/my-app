import 'server-only';

/**
 * 内存滑动窗口限频器。
 * ponytail: 单实例内存方案，多实例部署需替换为 Redis 版（如 @upstash/ratelimit）。
 * 过期条目在 check 时惰性清理，无需定时器。
 */

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

/** 惰性清理过期记录，返回剩余有效请求数 */
function consume(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const cutoff = now - windowMs;
  const bucket = buckets.get(key);

  // 清理过期时间戳
  const valid = bucket ? bucket.timestamps.filter((t) => t > cutoff) : [];

  if (valid.length >= limit) {
    buckets.set(key, { timestamps: valid });
    return { allowed: false, remaining: 0 };
  }

  valid.push(now);
  buckets.set(key, { timestamps: valid });
  return { allowed: true, remaining: limit - valid.length };
}

/**
 * 检查限频。超限返回 true（被限流），否则返回 false。
 * @param key 限频维度标识（如 `login:${ip}` 或 `register:${ip}`）
 * @param limit 窗口内最大请求数
 * @param windowMs 窗口时长（ms）
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  return !consume(key, limit, windowMs).allowed;
}

/**
 * 从 NextRequest 提取客户端 IP
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
