/**
 * @file rateLimiter.ts
 * @description 限流中间件，基于 express-rate-limit 提供全局限流和认证接口限流能力
 */

import { rateLimit, type Options } from 'express-rate-limit';
import { TooManyRequestsError } from '@/errors';
import { env } from '@/config';
import type { RateLimiterOptions } from '@my-app/shared';

/**
 * 创建限流中间件
 * @param options 限流配置选项
 * @returns Express 限流中间件
 */
export function createRateLimiter(options: RateLimiterOptions) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
      next(new TooManyRequestsError(options.message));
    },
  } as Partial<Options>);
}

/** 全局限流中间件，按环境变量配置窗口时间和最大请求数 */
export const globalRateLimiter = createRateLimiter({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
});

/**
 * 创建认证接口限流中间件
 * @description 使用更严格的限流参数，防止认证接口被暴力破解
 * @returns Express 限流中间件
 */
export function createAuthRateLimiter() {
  return createRateLimiter({
    windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
    max: env.AUTH_RATE_LIMIT_MAX,
    message: '认证请求过于频繁，请稍后再试',
  });
}
