/**
 * @file comment.routes.ts
 * @description 评论模块的路由定义，提供评论的列表查询、创建、删除和编辑接口
 */

import type { Request, Response } from 'express';
import type { CreateCommentRouterDeps } from '@my-app/shared';
import { Router } from 'express';
import { asyncHandler } from '@/utils/asyncHandler.ts';
import { createSuccessResponse } from '@/utils/common.ts';
import { NotFoundError } from '@/errors';
import { parseCreateCommentBody } from './comment.validators.ts';
import { getAuthUser } from '@/modules/auth/services/auth.guard.ts';

/**
 * 从请求参数中提取文章 ID，若缺失或为空则抛出 NotFoundError
 * @param req Express 请求对象
 * @returns 文章 ID
 * @throws 文章 ID 不存在时抛出 NotFoundError
 */
function getPostId(req: Request): string {
  const id = req.params.postId;
  if (typeof id !== 'string' || id.trim() === '') {
    throw new NotFoundError('文章不存在');
  }
  return id;
}

/**
 * 从请求参数中提取评论 ID，若缺失或为空则抛出 NotFoundError
 * @param req Express 请求对象
 * @returns 评论 ID
 * @throws 评论 ID 不存在时抛出 NotFoundError
 */
function getCommentId(req: Request): string {
  const id = req.params.id;
  if (typeof id !== 'string' || id.trim() === '') {
    throw new NotFoundError('评论不存在');
  }
  return id;
}

/**
 * 创建评论路由
 * @param deps 路由依赖，包含评论 service 和认证守卫
 * @returns Express Router 实例
 */
export function createCommentRouter(deps: CreateCommentRouterDeps): Router {
  const router = Router();

  router.get(
    '/posts/:postId/comments',
    deps.optionalAuthGuard,
    asyncHandler(async (req: Request, res: Response) => {
      const comments = await deps.commentService.listComments({
        postId: getPostId(req),
        user: req.user,
      });
      res.json(createSuccessResponse({ comments }, '获取成功'));
    }),
  );

  router.post(
    '/posts/:postId/comments',
    deps.authGuard,
    asyncHandler(async (req: Request, res: Response) => {
      const dto = parseCreateCommentBody(req);
      const comment = await deps.commentService.createComment({
        ...dto,
        postId: getPostId(req),
        userId: getAuthUser(req).id,
      });
      res.status(201).json(createSuccessResponse({ comment }, '发表评论成功'));
    }),
  );

  router.delete(
    '/comments/:id',
    deps.authGuard,
    asyncHandler(async (req: Request, res: Response) => {
      await deps.commentService.deleteComment(getCommentId(req), getAuthUser(req).id);
      res.json(createSuccessResponse(null, '删除成功'));
    }),
  );

  router.put(
    '/comments/:id',
    deps.authGuard,
    asyncHandler(async (req: Request, res: Response) => {
      const dto = parseCreateCommentBody(req);
      const comment = await deps.commentService.updateComment(
        getCommentId(req),
        dto.content,
        getAuthUser(req).id,
      );
      res.json(createSuccessResponse({ comment }, '编辑成功'));
    }),
  );

  return router;
}
