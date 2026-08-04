/**
 * @file modules.ts
 * @description Express 后端模块聚合接口，定义认证、博客、评论各模块对外暴露的路由、服务和仓储
 */

import type { Router, RequestHandler } from 'express';
import type { BlogService } from '../blog';
import type { CommentService } from '../comment';

/**
 * 认证模块
 */
export interface AuthModule {
  /** 认证路由 */
  router: Router;
  /** 强制鉴权中间件 */
  authGuard: RequestHandler;
  /** 可选鉴权中间件 */
  optionalAuthGuard: RequestHandler;
  /** 种子数据初始化 */
  seed(): Promise<void>;
}

/**
 * 博客模块
 */
export interface BlogModule {
  /** 博客路由 */
  router: Router;
  /** 博客业务服务 */
  blogService: BlogService;
}

/**
 * 评论模块
 */
export interface CommentModule {
  /** 评论路由 */
  router: Router;
  /** 评论业务服务 */
  commentService: CommentService;
}
