/**
 * @file errorHandler.ts
 * @description Express 错误处理中间件模块：提供统一错误响应与 404 路由兜底
 */
import { type Request, type Response, type NextFunction } from 'express';

/**
 * 统一错误处理中间件
 * @description 捕获下游传递的错误对象，记录日志后以 HTTP 500 状态码返回统一格式
 * @param err 错误对象，包含 message 与 stack 等字段
 * @param _req Express 请求对象（未使用）
 * @param res Express 响应对象
 * @param _next Express next 回调（未使用）
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  // 输出错误日志便于排查，包含 message 与调用栈
  console.error(`[Error] ${err.message}`, err.stack);

  // 本地开发环境返回详细错误堆栈，便于调试
  const isDev = process.env.NODE_ENV !== 'production';

  res.status(500).json({
    message: err.message || '服务器内部错误',
    statusCode: 500,
    error: 'InternalServerError',
    // 本地开发返回堆栈信息便于调试
    ...(isDev && { stack: err.stack }),
  });
}

/**
 * 404 路由未找到处理
 * @description 当请求未命中任何路由时返回 404，统一响应中包含请求方法与原始 URL
 * @param req Express 请求对象
 * @param res Express 响应对象
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    message: `接口不存在: ${req.method} ${req.originalUrl}`,
    statusCode: 404,
    error: 'NotFound',
  });
}
