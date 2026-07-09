/**
 * @file tags.routes.ts
 * @description 标签模块路由，定义标签相关的 HTTP 接口：标签列表、热门标签、标签详情、标签下文章、标签统计、贡献者
 */
import { Router, type Request, type Response } from 'express';
import { getStore } from '@store/index.js';
import { getPagination, buildPaginationMeta, success } from '@utils/index.js';
import type { TagDetail } from '@my-app/shared';

/** Express 路由实例 */
const router: Router = Router();
/** JSON 文件存储实例，用于读取标签与文章数据 */
const store = getStore();

/**
 * GET /api/tags
 * @description 获取标签列表，支持按关键词模糊搜索和按热门标记过滤
 * @param {Request} req Express 请求对象
 * @param [params.query.search] 搜索关键词，匹配 name 或 description（不区分大小写）
 * @param [params.query.trending] 是否仅返回热门标签，'true' 时启用
 * @param {Response} res Express 响应对象
 * @returns {Promise<void>} 返回 200 携带过滤后的标签数组
 */
router.get('/', async (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;
  const trending = req.query.trending as string | undefined;

  let tags = await store.find<TagDetail>('tags');

  // 关键词过滤：name 或 description 任一包含子串即命中
  if (search) {
    const q = search.toLowerCase();
    tags = tags.filter(
      (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
    );
  }
  // 仅保留热门标签
  if (trending === 'true') {
    tags = tags.filter((t) => t.trending);
  }

  res.json(success(tags));
});

/**
 * GET /api/tags/popular
 * @description 获取热门标签，按关联文章数 articles 降序排序后取前 N 条
 * @param {Request} req Express 请求对象
 * @param [params.query.limit] 返回数量上限，默认 12
 * @param {Response} res Express 响应对象
 * @returns {Promise<void>} 返回 200 携带热门标签数组
 */
router.get('/popular', async (req: Request, res: Response) => {
  // 默认取 12 条热门标签
  const limit = Number(req.query.limit as string) || 12;
  const tags = await store.find<TagDetail>('tags');
  // 按文章数量降序排列并截取
  const popular = tags.sort((a, b) => b.articles - a.articles).slice(0, limit);
  res.json(success(popular));
});

/**
 * GET /api/tags/:name
 * @description 根据标签名称（不区分大小写）获取标签详情
 * @param {Request} req Express 请求对象
 * @param params.params.name 标签名称
 * @param {Response} res Express 响应对象
 * @returns {Promise<void>} 返回 200 携带标签详情；标签不存在时返回 404
 */
router.get('/:name', async (req: Request, res: Response) => {
  const name = req.params.name as string;
  const tags = await store.find<TagDetail>('tags');
  // 名称不区分大小写匹配
  const tag = tags.find((t) => t.name.toLowerCase() === name.toLowerCase());
  if (!tag) {
    res.status(404).json({ message: '标签不存在', statusCode: 404, error: 'NotFound' });
    return;
  }
  res.json(success(tag));
});

/**
 * GET /api/tags/:name/articles
 * @description 根据标签名称查询关联文章列表，支持分页
 * @param {Request} req Express 请求对象
 * @param params.params.name 标签名称
 * @param [params.query.page] 页码，默认 1
 * @param [params.query.limit] 每页条数，默认 20
 * @param {Response} res Express 响应对象
 * @returns {Promise<void>} 返回 200 携带分页文章列表与分页元信息
 */
router.get('/:name/articles', async (req: Request, res: Response) => {
  const name = req.params.name as string;
  const { page, limit } = getPagination(req.query as Record<string, unknown>);
  // 计算分页偏移量
  const offset = (page - 1) * limit;

  const articles = await store.find<import('@my-app/shared').ArticleDetailItem>('articles');
  // 同时兼容 tags 数组与单一 tag 字段两种文章-标签关联方式
  const filtered = articles.filter(
    (a) =>
      a.tags.some((t) => t.toLowerCase() === name.toLowerCase()) ||
      a.tag.toLowerCase() === name.toLowerCase(),
  );

  const total = filtered.length;
  const items = filtered.slice(offset, offset + limit);

  res.json(
    success({
      items,
      pagination: buildPaginationMeta(page, limit, total),
    }),
  );
});

/**
 * GET /api/tags/:name/stats
 * @description 获取指定标签的统计数据，包含最近 4 周的文章与浏览量模拟数据
 * @param {Request} req Express 请求对象
 * @param params.params.name 标签名称
 * @param {Response} res Express 响应对象
 * @returns {Promise<void>} 返回 200 携带标签统计对象；标签不存在时返回 404
 */
router.get('/:name/stats', async (req: Request, res: Response) => {
  const name = req.params.name as string;
  const tags = await store.find<TagDetail>('tags');
  const tag = tags.find((t) => t.name.toLowerCase() === name.toLowerCase());
  if (!tag) {
    res.status(404).json({ message: '标签不存在', statusCode: 404, error: 'NotFound' });
    return;
  }

  // 模拟周维度统计数据：按总文章数比例分配到 4 周
  const stats = {
    name: tag.name,
    weeklyData: [
      // 第 1 周：占总数 12%
      { week: 'Week 1', articles: Math.floor(tag.articles * 0.12), views: 1200 },
      // 第 2 周：占总数 15%
      { week: 'Week 2', articles: Math.floor(tag.articles * 0.15), views: 1580 },
      // 第 3 周：占总数 18%
      { week: 'Week 3', articles: Math.floor(tag.articles * 0.18), views: 2100 },
      // 第 4 周：占总数 20%
      { week: 'Week 4', articles: Math.floor(tag.articles * 0.2), views: 2800 },
    ],
    totalArticles: tag.articles,
    weeklyGrowth: tag.weeklyGrowth,
  };

  res.json(success(stats));
});

/**
 * GET /api/tags/:name/contributors
 * @description 获取指定标签下的贡献者列表
 * @param {Request} _req Express 请求对象，未使用具体入参
 * @param {Response} res Express 响应对象
 * @returns {Promise<void>} 返回 200 携带贡献者数组（name、avatar、articles）
 */
router.get('/:name/contributors', async (req: Request, res: Response) => {
  const contributors = await store.find<{ name: string; avatar: string; articles: number }>(
    'tag_contributors',
  );
  res.json(success(contributors));
});

export default router;
