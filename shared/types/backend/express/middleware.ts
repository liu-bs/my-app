/**
 * @file middleware.ts
 * @description Express 中间件相关类型，定义限流配置和异步请求处理器的类型签名
 */

import type { Request, Response, NextFunction } from 'express';

/**
 * 限流中间件配置项
 */
export interface RateLimiterOptions {
  /** 时间窗口大小，单位 ms */
  windowMs: number;
  /** 窗口内最大请求次数 */
  max: number;
  /** 超限时的提示消息 */
  message?: string;
}

/** 异步请求处理器类型 */
export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;
