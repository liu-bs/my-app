/**
 * @file blog.module.ts
 * @description blog 模块装配入口，组装 service 和 router 并对外暴露 BlogModule
 */

import type { RequestHandler } from 'express';
import type { BlogModule } from '@my-app/shared';
import { createBlogService } from './services/blog.service.ts';
import { createBlogRouter } from './routes/blog.routes.ts';
import type { BlogRepository } from './repository/blog.repository.ts';
import type { UserRepository } from '../auth/repository/auth.repository.ts';
import type { CommentRepository } from '../comment/repository/comment.repository.ts';

/**
 * 创建 blog 模块实例
 * @param deps 依赖对象，包含鉴权守卫、博客/用户/评论仓储
 * @returns 组装完成的 BlogModule
 */
export function createBlogModule(deps: {
  authGuard: RequestHandler;
  optionalAuthGuard: RequestHandler;
  repo: BlogRepository;
  userRepo: UserRepository;
  commentRepo: CommentRepository;
}): BlogModule {
  // 创建 blog 服务，注入仓储依赖
  const blogService = createBlogService({
    repo: deps.repo,
    userRepo: deps.userRepo,
    commentRepo: deps.commentRepo,
  });
  // 创建 blog 路由，注入服务和鉴权守卫
  const router = createBlogRouter({
    blogService,
    authGuard: deps.authGuard,
    optionalAuthGuard: deps.optionalAuthGuard,
  });

  return { router, blogService };
}
