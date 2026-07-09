/**
 * @file trending.routes.ts
 * @description 热门趋势模块路由，定义趋势相关的 HTTP 接口：热门文章、热门标签、推荐作者
 */
import { Router, type Request, type Response } from 'express';
import { getStore } from '@store/index.js';
import { getPagination, buildPaginationMeta, success } from '@utils/index.js';
import type { Article, TrendingTag, FeaturedAuthor } from '@my-app/shared';

/** Express 路由实例 */
const router: Router = Router();
/** JSON 文件存储实例，用于读取趋势类数据 */
const store = getStore();

/**
 * GET /api/trending/articles
 * @description 获取热门文章列表，支持分页
 * @param {Request} req Express 请求对象
 * @param [params.query.page] 页码，默认 1
 * @param [params.query.limit] 每页条数，默认 20
 * @param {Response} res Express 响应对象
 * @returns {Promise<void>} 返回 200 携带分页热门文章列表与分页元信息
 */
router.get('/articles', async (req: Request, res: Response) => {
  const { page, limit } = getPagination(req.query as Record<string, unknown>);
  // 计算分页偏移量
  const offset = (page - 1) * limit;

  const articles = await store.find<Article>('trending_articles');
  const total = articles.length;
  const items = articles.slice(offset, offset + limit);

  res.json(
    success({
      items,
      pagination: buildPaginationMeta(page, limit, total),
    }),
  );
});

/**
 * GET /api/trending/tags
 * @description 获取热门标签列表
 * @param {Request} _req Express 请求对象，未使用具体入参
 * @param {Response} res Express 响应对象
 * @returns {Promise<void>} 返回 200 携带热门标签数组
 */
router.get('/tags', async (_req: Request, res: Response) => {
  const tags = await store.find<TrendingTag>('trending_tags');
  res.json(success(tags));
});

/**
 * GET /api/trending/authors
 * @description 获取推荐作者列表
 * @param {Request} _req Express 请求对象，未使用具体入参
 * @param {Response} res Express 响应对象
 * @returns {Promise<void>} 返回 200 携带推荐作者数组
 */
router.get('/authors', async (_req: Request, res: Response) => {
  const authors = await store.find<FeaturedAuthor>('featured_authors');
  res.json(success(authors));
});

export default router;
