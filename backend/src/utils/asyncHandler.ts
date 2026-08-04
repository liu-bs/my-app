/**
 * @file asyncHandler.ts
 * @description 异步路由处理器包装工具，将 async 函数的 Promise 异常自动传递给 Express 错误处理中间件
 */

import type { RequestHandler } from 'express';
import type { AsyncRequestHandler } from '@my-app/shared';

/**
 * 包装异步路由处理器
 * @description 捕获 async 函数中的 rejected Promise 并传递给 next，确保异常被全局错误处理中间件捕获
 * @param fn 异步路由处理函数
 * @returns Express RequestHandler
 */
export function asyncHandler(fn: AsyncRequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
