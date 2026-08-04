/**
 * @file originCheck.ts
 * @description CSRF 纵深防御中间件 — 校验写操作的 Origin/Referer 头与 CORS 白名单一致
 */

import type { Request, Response, NextFunction } from 'express';
import { env } from '@/config';

/** CORS 白名单 origin Set，用于 O(1) 查询 */
const allowedOrigins = new Set(env.CORS_ORIGINS);

/**
 * 从请求头提取 Origin 或 Referer 的 origin 部分
 * @param req Express 请求对象
 * @returns origin 字符串或 null
 */
function getOrigin(req: Request): string | null {
  const origin = req.headers.origin;
  if (origin) return origin;
  const referer = req.headers.referer;
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * CSRF Origin 校验中间件 — 对写操作（POST/PUT/DELETE/PATCH）校验 Origin 头
 * 仅当请求携带 cookie（潜在登录态）时才强制校验，避免影响无状态读请求
 */
export function originCheck(req: Request, res: Response, next: NextFunction): void {
  // 仅校验写方法
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return next();
  }
  // 无 cookie 的请求不校验（未登录请求由 authGuard 拦截）
  if (!req.headers.cookie) {
    return next();
  }
  const origin = getOrigin(req);
  if (!origin || !allowedOrigins.has(origin)) {
    res.status(403).json({ code: 403, message: '跨站请求被拒绝' });
    return;
  }
  next();
}
