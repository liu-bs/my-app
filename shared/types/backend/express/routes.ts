/**
 * @file routes.ts
 * @description Express 路由工厂依赖接口，定义认证、博客、评论各路由模块创建时所需的依赖注入结构
 */

import type { RequestHandler, Response } from 'express';
import type { User } from '../../user';
import type { AuthService, TokenService } from '../auth';
import type { BlogService } from '../blog';
import type { CommentService } from '../comment';

/**
 * 认证 Cookie 操作辅助接口
 */
export interface AuthCookieHelper {
  /** 设置认证相关 Cookie */
  setAuthCookies(res: Response, user: User): void;
  /** 清除认证相关 Cookie */
  clearAuthCookies(res: Response): void;
}

/**
 * 创建认证路由的依赖
 */
export interface CreateAuthRouterDeps {
  /** 认证业务服务 */
  authService: AuthService;
  /** 强制鉴权中间件 */
  authGuard: RequestHandler;
  /** 认证 Cookie 操作辅助 */
  authCookieHelper: AuthCookieHelper;
  /** Token 服务（用于 refresh 路由解码过期 Token） */
  tokenService: TokenService;
}

/**
 * 创建博客路由的依赖
 */
export interface CreateBlogRouterDeps {
  /** 博客业务服务 */
  blogService: BlogService;
  /** 强制鉴权中间件 */
  authGuard: RequestHandler;
  /** 可选鉴权中间件（不登录也可访问） */
  optionalAuthGuard: RequestHandler;
}

/**
 * 创建评论路由的依赖
 */
export interface CreateCommentRouterDeps {
  /** 评论业务服务 */
  commentService: CommentService;
  /** 强制鉴权中间件 */
  authGuard: RequestHandler;
  /** 可选鉴权中间件（不登录也可访问） */
  optionalAuthGuard: RequestHandler;
}
