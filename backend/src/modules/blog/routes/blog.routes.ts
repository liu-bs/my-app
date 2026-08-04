/**
 * @file blog.routes.ts
 * @description blog 模块路由定义，包含文章 CRUD、点赞、收藏、分类、标签、站点配置等接口
 */

import type { Request, Response } from 'express';
import type { CreateBlogRouterDeps } from '@my-app/shared';
import { Router } from 'express';
import { asyncHandler } from '@/utils/asyncHandler.ts';
import { createSuccessResponse } from '@/utils/common.ts';
import { NotFoundError } from '@/errors';
import {
  parseCreatePostBody,
  parseUpdatePostBody,
  parseUpdateSiteConfigBody,
  parseListQuery,
} from './blog.validators.ts';

/**
 * 从请求参数中提取文章 ID
 * @param req Express 请求对象
 * @returns 文章 ID
 * @throws 参数缺失或为空时抛出 NotFoundError
 */
function getPostId(req: Request): string {
  const id = req.params.id;
  if (typeof id !== 'string' || id.trim() === '') {
    throw new NotFoundError('文章不存在');
  }
  return id;
}

/**
 * 创建 blog 路由（工厂函数）
 * @param deps 博客相关依赖，包含 blogService、authGuard、optionalAuthGuard
 */
export function createBlogRouter(deps: CreateBlogRouterDeps): Router {
  const router = Router();

  // GET /posts — 获取文章列表（支持分页、分类、标签、关键词筛选、草稿模式）
  router.get(
    '/posts',
    deps.optionalAuthGuard,
    asyncHandler(async (req: Request, res: Response) => {
      const query = parseListQuery(req);
      const result = await deps.blogService.listPosts({
        ...query,
        user: req.user,
      });
      res.json(createSuccessResponse(result, '获取成功'));
    }),
  );

  // GET /posts/:id — 获取文章详情（已发布文章对外可见，草稿仅作者可见）
  router.get(
    '/posts/:id',
    deps.optionalAuthGuard,
    asyncHandler(async (req: Request, res: Response) => {
      const post = await deps.blogService.getPost(getPostId(req), req.user);
      res.json(createSuccessResponse({ post }, '获取成功'));
    }),
  );

  // GET /posts/:id/neighbors — 获取上一篇/下一篇（仅已发布文章）
  router.get(
    '/posts/:id/neighbors',
    asyncHandler(async (req: Request, res: Response) => {
      const neighbors = await deps.blogService.getNeighborPosts(getPostId(req));
      res.json(createSuccessResponse(neighbors, '获取成功'));
    }),
  );

  // POST /posts — 创建文章（含草稿/发布两种模式）
  router.post(
    '/posts',
    deps.authGuard,
    asyncHandler(async (req: Request, res: Response) => {
      const dto = parseCreatePostBody(req);
      const post = await deps.blogService.createPost({ ...dto, authorId: req.user!.id });
      res.status(201).json(createSuccessResponse({ post }, '创建成功'));
    }),
  );

  // PUT /posts/:id — 更新文章（仅作者可操作，支持草稿↔发布状态切换）
  router.put(
    '/posts/:id',
    deps.authGuard,
    asyncHandler(async (req: Request, res: Response) => {
      const dto = parseUpdatePostBody(req);
      const post = await deps.blogService.updatePost(getPostId(req), dto, req.user!.id);
      res.json(createSuccessResponse({ post }, '更新成功'));
    }),
  );

  // DELETE /posts/:id — 删除文章（仅作者可操作，级联删除评论并清理用户收藏/点赞）
  router.delete(
    '/posts/:id',
    deps.authGuard,
    asyncHandler(async (req: Request, res: Response) => {
      await deps.blogService.deletePost(getPostId(req), req.user!.id);
      res.json(createSuccessResponse(null, '删除成功'));
    }),
  );

  // POST /posts/:id/like — 点赞/取消点赞文章
  router.post(
    '/posts/:id/like',
    deps.authGuard,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await deps.blogService.likePost(getPostId(req), req.user!.id);
      res.json(createSuccessResponse(result, '操作成功'));
    }),
  );

  // POST /posts/:id/favorite — 收藏/取消收藏文章
  router.post(
    '/posts/:id/favorite',
    deps.authGuard,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await deps.blogService.toggleFavorite(getPostId(req), req.user!.id);
      res.json(createSuccessResponse(result, '操作成功'));
    }),
  );

  // GET /favorites — 获取当前用户收藏的文章列表
  router.get(
    '/favorites',
    deps.authGuard,
    asyncHandler(async (req: Request, res: Response) => {
      const posts = await deps.blogService.listFavoritePosts(req.user!.id);
      res.json(createSuccessResponse({ posts }, '获取成功'));
    }),
  );

  // GET /categories — 获取所有分类（已发布文章中使用的分类）
  router.get(
    '/categories',
    asyncHandler(async (_req: Request, res: Response) => {
      const categories = await deps.blogService.getCategories();
      res.json(createSuccessResponse({ categories }, '获取成功'));
    }),
  );

  // GET /tags — 获取所有标签（已发布文章中的标签，去重排序）
  router.get(
    '/tags',
    asyncHandler(async (_req: Request, res: Response) => {
      const tags = await deps.blogService.getTags();
      res.json(createSuccessResponse({ tags }, '获取成功'));
    }),
  );

  // GET /config — 获取站点配置
  router.get(
    '/config',
    asyncHandler(async (_req: Request, res: Response) => {
      const config = await deps.blogService.getConfig();
      res.json(createSuccessResponse({ config }, '获取成功'));
    }),
  );

  // PUT /config — 更新站点配置（需登录）
  router.put(
    '/config',
    deps.authGuard,
    asyncHandler(async (req: Request, res: Response) => {
      const dto = parseUpdateSiteConfigBody(req);
      const config = await deps.blogService.updateConfig(dto, req.user!.id);
      res.json(createSuccessResponse({ config }, '更新成功'));
    }),
  );

  return router;
}
