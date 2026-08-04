/**
 * @file errorHandler.ts
 * @description 全局错误处理中间件，统一捕获并格式化 AppError 和未知错误，提供 404 兜底处理
 */

import { type Request, type Response, type NextFunction } from 'express';
import { AppError, InternalServerError, NotFoundError } from '@/errors';
import { env } from '@/config';
import { logger } from '@/utils/logger.ts';

/**
 * 全局错误处理中间件
 * @description 将未知错误包装为 InternalServerError，记录日志后返回统一的 JSON 错误响应
 * @param err 错误对象
 * @param _req Express 请求对象
 * @param res Express 响应对象
 * @param _next Express next 函数
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  const isOperational = err instanceof AppError;
  const error = isOperational
    ? err
    : new InternalServerError(env.isProd ? '服务器内部错误' : err.message);

  if (error.statusCode >= 500) {
    logger.error(`${error.statusCode}: ${error.message}`, {
      code: error.code,
      stack: err.stack,
    });
  } else {
    logger.warn(`${error.statusCode}: ${error.message}`, {
      code: error.code,
    });
  }

  res.status(error.statusCode).json({
    code: error.statusCode,
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
  });
}

/**
 * 404 路由兜底处理
 * @description 对未匹配到任何路由的请求返回 NotFoundError 响应
 * @param req Express 请求对象
 * @param res Express 响应对象
 */
export function notFoundHandler(req: Request, res: Response): void {
  const error = new NotFoundError(`接口不存在: ${req.method} ${req.originalUrl}`);
  logger.warn(error.message, { method: req.method, path: req.originalUrl });
  res.status(error.statusCode).json({
    code: error.statusCode,
    message: error.message,
  });
}
