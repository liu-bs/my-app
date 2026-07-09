/**
 * @file my-articles.routes.ts
 * @description 我的文章路由模块，定义当前登录用户相关文章的 HTTP 路由
 */
import { Router, type Request, type Response } from 'express';
import { getStore } from '@store/index.js';
import { authGuard } from '@middleware/auth.js';
import { getPagination, buildPaginationMeta, success } from '@utils/index.js';
import type { ArticleDetailItem, MyArticle } from '@my-app/shared';

/** Express 路由实例 */
const router: Router = Router();
/** JSON 文件存储实例 */
const store = getStore();

/**
 * GET /api/my-articles - 获取当前用户的文章列表及状态计数
 * @description 需要认证，支持按状态（all/published/draft/archived）筛选，并返回分页结果
 * @param {Request} req - Express 请求对象，query 携带 status 与分页参数
 * @param {Response} res - Express 响应对象
 * @returns {Promise<void>} 无返回值，JSON 响应包含 items/counts/pagination
 * @throws {Error} 当存储层查询失败时抛出
 */
router.get('/', authGuard, async (req: Request, res: Response) => {
  // @param req.query.status - 文章状态过滤值：all=全部 published=已发布 draft=草稿 archived=已归档
  const status = req.query.status as string | undefined;
  // @param req.query.page - 当前页码（从 1 开始）
  // @param req.query.limit - 每页条数
  const { page, limit } = getPagination(req.query as Record<string, unknown>);
  // 通过偏移量实现分页
  const offset = (page - 1) * limit;

  const user = await store.findById<import('@my-app/shared').User>('users', req.user!.id);
  if (!user) {
    res.status(404).json({ message: '用户不存在', statusCode: 404, error: 'NotFound' });
    return;
  }

  const articles = await store.find<ArticleDetailItem>('articles');
  // 类型谓词：判断文章是否属于当前用户
  const isOwnArticle = (a: ArticleDetailItem): boolean => a.authorId === req.user!.id;
  let userArticles = articles.filter(isOwnArticle);

  // status=all 时不过滤，其它值按状态精确匹配
  if (status && status !== 'all') {
    userArticles = userArticles.filter((a) => a.status === status);
  }

  const total = userArticles.length;
  const items = userArticles.slice(offset, offset + limit);

  // 将 ArticleDetailItem 投影为前端所需的 MyArticle 形态
  const myArticles: MyArticle[] = items.map((a) => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    status: a.status,
    tag: a.tag,
    tagClass: a.tagClass,
    date: a.date,
    readTime: a.readTime,
    // 阅览量过千时以 K 为单位格式化（保留 1 位小数）
    views: a.views > 1000 ? `${(a.views / 1000).toFixed(1)}K` : String(a.views),
    likes: a.likes,
    comments: a.comments,
  }));

  // 各状态计数，便于前端 Tab 角标展示
  const counts = {
    all: articles.filter(isOwnArticle).length,
    published: articles.filter((a) => isOwnArticle(a) && a.status === 'published').length,
    draft: articles.filter((a) => isOwnArticle(a) && a.status === 'draft').length,
    archived: articles.filter((a) => isOwnArticle(a) && a.status === 'archived').length,
  };

  res.json(
    success({
      items: myArticles,
      counts,
      pagination: buildPaginationMeta(page, limit, total),
    }),
  );
});

export default router;
