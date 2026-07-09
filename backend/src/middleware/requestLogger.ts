/**
 * @file requestLogger.ts
 * @description 请求日志中间件：记录所有 HTTP 请求的方法、路径、参数、状态码和响应时间
 */
import { type Request, type Response, type NextFunction } from 'express';

/**
 * 请求日志中间件
 * @description 记录每个请求的详细信息，包括请求参数、响应状态码和处理时间
 * @param req Express 请求对象
 *  @param res Express 响应对象
 * @param next Express next 回调
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  // 请求开始日志
  const logData: Record<string, unknown> = {
    method: req.method,
    path: req.path,
    query: req.query && Object.keys(req.query).length > 0 ? req.query : undefined,
    body: req.body && Object.keys(req.body).length > 0 ? req.body : undefined,
  };

  console.log(`→ ${req.method} ${req.path}`, formatLogData(logData));

  // 响应完成时记录状态码和处理时间（使用 once 避免热重载时监听器泄漏导致 OOM）
  res.once('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    console.log(
      `← ${req.method} ${req.path} ${statusColor}${res.statusCode}\x1b[0m (${duration}ms)`,
    );
  });

  next();
}

/**
 * 格式化日志数据，移除 undefined 字段
 * @param data 原始日志数据
 * @returns 格式化后的日志字符串
 */
function formatLogData(data: Record<string, unknown>): string {
  const filtered = Object.entries(data)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(' ');

  return filtered ? `| ${filtered}` : '';
}