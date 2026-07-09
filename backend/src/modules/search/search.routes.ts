/**
 * @file search.routes.ts
 * @description 搜索路由模块，定义文章搜索与搜索建议的 HTTP 路由
 */
import { Router, type Request, type Response } from 'express';
import { getStore } from '@store/index.js';
import { getPagination, buildPaginationMeta, success } from '@utils/index.js';
import type { ArticleDetailItem } from '@my-app/shared';

/** Express 路由实例 */
const router: Router = Router();
/** JSON 文件存储实例 */
const store = getStore();

/**
 * GET /api/search - 搜索已发布文章
 * @description 支持按关键词、分类、标签筛选，返回分页结果与最多 5 条标签建议
 * @param {Request} req - Express 请求对象，query 携带 q/category/tag 与分页参数
 * @param {Response} res - Express 响应对象
 * @returns {Promise<void>} 无返回值，JSON 响应包含 items/total/suggestions/pagination
 * @throws {Error} 当存储层查询失败时抛出
 */
router.get('/', async (req: Request, res: Response) => {
  // @param req.query.q - 搜索关键词（空串表示不过滤关键词）
  // @param req.query.category - 分类 ID（可选）
  // @param req.query.tag - 标签名（可选）
  // @param req.query.page - 当前页码（从 1 开始）
  // @param req.query.limit - 每页条数
  const q = (req.query.q as string | undefined) || '';
  const category = req.query.category as string | undefined;
  const tag = req.query.tag as string | undefined;
  const { page, limit } = getPagination(req.query as Record<string, unknown>);
  const offset = (page - 1) * limit;

  let articles = await store.find<ArticleDetailItem>('articles');

  // 只搜索已发布的文章，status=published 视为对用户可见
  articles = articles.filter((a) => a.status === 'published');

  // 分类筛选
  if (category) {
    articles = articles.filter((a) => a.categoryId === category);
  }

  // 标签筛选：tags 数组或主 tag 命中即匹配
  if (tag) {
    articles = articles.filter(
      (a) => a.tags.includes(tag) || a.tag.toLowerCase() === tag.toLowerCase(),
    );
  }

  // 关键词搜索：在 title/excerpt/tag/tags 任一字段中做大小写无关的子串匹配
  if (q.trim()) {
    const query = q.toLowerCase();
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query) ||
        a.tag.toLowerCase().includes(query) ||
        a.tags.some((t) => t.toLowerCase().includes(query)),
    );
  }

  const total = articles.length;
  const items = articles.slice(offset, offset + limit);

  // 生成搜索建议（仅在有关键词时生成，最多 5 条标签建议）
  const suggestions: string[] = [];
  if (q.trim()) {
    const allTags = new Set<string>();
    articles.forEach((a) => {
      allTags.add(a.tag);
      a.tags.forEach((t) => allTags.add(t));
    });
    const ql = q.toLowerCase();
    allTags.forEach((t) => {
      if (t.toLowerCase().includes(ql) && suggestions.length < 5) {
        suggestions.push(t);
      }
    });
  }

  res.json(
    success({
      items,
      total,
      suggestions,
      pagination: buildPaginationMeta(page, limit, total),
    }),
  );
});

/**
 * GET /api/search/suggestions - 获取搜索建议
 * @description 根据关键词匹配标签与文章标题，返回合并后的建议列表
 * @param {Request} req - Express 请求对象，query.q 为关键词
 * @param {Response} res - Express 响应对象
 * @returns {Promise<void>} 无返回值，JSON 响应为建议字符串数组
 * @throws {Error} 当存储层查询失败时抛出
 */
router.get('/suggestions', async (req: Request, res: Response) => {
  // @param req.query.q - 搜索关键词，空串直接返回空数组
  const q = (req.query.q as string | undefined) || '';
  if (!q.trim()) {
    res.json(success([]));
    return;
  }

  const articles = await store.find<ArticleDetailItem>('articles');
  // 收集所有可见标签用于匹配建议
  const allTags = new Set<string>();
  articles.forEach((a) => {
    allTags.add(a.tag);
    a.tags.forEach((t) => allTags.add(t));
  });

  const ql = q.toLowerCase();
  // 最多取 8 条标签建议
  const suggestions = Array.from(allTags)
    .filter((t) => t.toLowerCase().includes(ql))
    .slice(0, 8);

  // 再追加最多 3 条匹配的文章标题建议
  const titleSuggestions = articles
    .filter((a) => a.title.toLowerCase().includes(ql))
    .slice(0, 3)
    .map((a) => a.title);

  res.json(success([...suggestions, ...titleSuggestions]));
});

export default router;
