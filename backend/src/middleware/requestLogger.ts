/**
 * @file requestLogger.ts
 * @description 请求日志中间件，记录每个 HTTP 请求的方法、路径、查询参数、请求体（脱敏后）及响应状态和耗时
 */

import { randomUUID } from 'node:crypto';
import { type Request, type Response, type NextFunction } from 'express';
import { logger } from '@/utils/logger.ts';

/** 需要脱敏的敏感字段名集合（全部小写，isSensitiveKey 会先 toLowerCase 再匹配） */
const SENSITIVE_FIELDS = new Set([
  'password',
  'currentpassword',
  'newpassword',
  'token',
  'refreshtoken',
  'authorization',
]);

/**
 * 判断字段名是否为敏感字段（不区分大小写）
 * @param key 字段名
 * @returns 是否敏感
 */
function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase();
  return SENSITIVE_FIELDS.has(lower);
}

/**
 * 递归脱敏处理请求数据，将敏感字段的值替换为 [REDACTED]
 * @param value 待脱敏的值
 * @returns 脱敏后的值
 */
function sanitize(value: unknown): unknown {
  if (value === null || value === undefined) return value;

  if (typeof value === 'string') {
    return value.length > 0 ? '[REDACTED]' : value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(record)) {
      result[key] = isSensitiveKey(key) ? '[REDACTED]' : sanitize(val);
    }
    return result;
  }

  return value;
}

/**
 * 从请求头提取或生成 request ID
 * @param req Express 请求对象
 * @returns request ID 字符串
 */
function pickRequestId(req: Request): string {
  const header = req.headers['x-request-id'];
  if (typeof header === 'string' && header.trim() !== '') {
    return header.trim();
  }
  return randomUUID();
}

/**
 * 请求日志中间件
 * @description 记录请求开始和完成时的日志，包含 request ID、方法、路径、耗时等信息
 * @param req Express 请求对象
 * @param res Express 响应对象
 * @param next Express next 函数
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const requestId = pickRequestId(req);
  req.requestId = requestId;

  const sanitizedBody = req.body && typeof req.body === 'object' ? sanitize(req.body) : undefined;

  logger.info(`→ ${req.method} ${req.path}`, {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query && Object.keys(req.query).length > 0 ? req.query : undefined,
    body: sanitizedBody && Object.keys(sanitizedBody).length > 0 ? sanitizedBody : undefined,
  });

  res.once('finish', () => {
    const duration = Date.now() - start;
    logger.info(`← ${req.method} ${req.path} ${res.statusCode} (${duration}ms)`, {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
    });
  });

  next();
}
