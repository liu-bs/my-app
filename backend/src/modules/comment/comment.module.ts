/**
 * @file comment.module.ts
 * @description 评论模块的组装入口，负责将 repository、service、router 与外部依赖组装为 CommentModule 实例
 */

import type { RequestHandler } from 'express';
import type { CommentModule } from '@my-app/shared';
import { createCommentService } from './services/comment.service.ts';
import { createCommentRouter } from './routes/comment.routes.ts';
import type { CommentRepository } from './repository/comment.repository.ts';
import type { BlogRepository } from '../blog/repository/blog.repository.ts';
import type { UserRepository } from '../auth/repository/auth.repository.ts';

/**
 * 创建评论模块
 * @description 组装评论 service 和 router，注入认证守卫、repository 等依赖
 * @param deps 模块依赖，包含认证守卫、评论/博客/用户 repository
 * @returns CommentModule 实例（含 router 和 commentService）
 */
export function createCommentModule(deps: {
  authGuard: RequestHandler;
  optionalAuthGuard: RequestHandler;
  repo: CommentRepository;
  blogRepo: BlogRepository;
  userRepo: UserRepository;
}): CommentModule {
  const commentService = createCommentService({
    commentRepo: deps.repo,
    blogRepo: deps.blogRepo,
    userRepo: deps.userRepo,
  });
  const router = createCommentRouter({
    commentService,
    authGuard: deps.authGuard,
    optionalAuthGuard: deps.optionalAuthGuard,
  });

  return { router, commentService };
}
