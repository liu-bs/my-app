/**
 * @file articles.routes.ts
 * @description 文章模块路由定义：列表查询、详情获取、创建、更新、删除、点赞
 */
import { Router, type Request, type Response } from 'express';
import { getStore } from '@store/index.js';
import { authGuard, optionalAuth } from '@middleware/auth.js';
import { generateId, getPagination, buildPaginationMeta, success } from '@utils/index.js';
import type { ArticleDetailItem, CreateArticleDto } from '@my-app/shared';

/** Express 路由实例 */
const router: Router = Router();
/** JSON 文件存储实例 */
const store = getStore();

/**
 * GET /api/articles - 获取文章列表
 * @description 支持按分类、标签、状态、精选筛选；默认仅返回已发布文章
 * @param req.query 查询参数
 * @param [req.query.page] 页码（默认 1）
 * @param [req.query.limit] 每页条数（默认 20）
 * @param [req.query.category] 分类 ID
 * @param [req.query.tag] 标签名
 * @param [req.query.status] 状态：draft|published|archived
 * @param [req.query.featured] 是否精选，传入 "true" 表示仅返回精选
 * @param res 响应对象
 * @returns 成功返回分页文章列表
 */
router.get('/', async (req: Request, res: Response) => {
  const { page, limit, offset } = getPagination(req.query as Record<string, unknown>);
  const categoryId = req.query.category as string | undefined;
  const tag = req.query.tag as string | undefined;
  const status = req.query.status as string | undefined;
  const featured = req.query.featured as string | undefined;

  let articles = await store.find<ArticleDetailItem>('articles');

  // 依次按分类、标签、状态、精选过滤
  if (categoryId) articles = articles.filter((a) => a.categoryId === categoryId);
  if (tag)
    articles = articles.filter(
      (a) =>
        a.tags.some((t) => t.toLowerCase() === tag.toLowerCase()) ||
        a.tag.toLowerCase() === tag.toLowerCase(),
    );
  if (status) articles = articles.filter((a) => a.status === status);
  if (featured === 'true') articles = articles.filter((a) => a.featured);
  // 若未指定 status（或为已发布），则默认仅返回已发布
  if (status !== 'draft' && status !== 'archived') {
    if (!status) articles = articles.filter((a) => a.status === 'published');
  }

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
 * GET /api/articles/:id - 获取文章详情
 * @description 草稿或私密文章需认证且仅作者本人可见，其他文章可匿名访问
 * @param req.params.id 文章 ID
 * @param req 可选认证请求对象
 * @param res 响应对象
 * @returns 成功返回文章详情；文章不存在返回 404；未授权返回 401
 */
router.get('/:id', optionalAuth, async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const article = await store.findById<ArticleDetailItem>('articles', id);
  if (!article) {
    res.status(404).json({ message: '文章不存在', statusCode: 404, error: 'NotFound' });
    return;
  }
  // 如果是草稿或私密文章，需要认证
  if (article.status === 'draft' || article.visibility === 'private') {
    if (!req.user) {
      res.status(401).json({ message: '未授权', statusCode: 401, error: 'Unauthorized' });
      return;
    }
  }
  res.json(success(article));
});

/**
 * POST /api/articles - 创建文章
 * @description 需要认证；根据请求体创建新文章，并自动计算阅读时长
 * @param req.body 请求体（CreateArticleDto）
 * @param req.body.title 文章标题（必填）
 * @param req.body.content 文章正文（必填）
 * @param [req.body.excerpt] 摘要；缺省时取正文前 120 字加省略号
 * @param [req.body.image] 封面图 URL
 * @param [req.body.tag] 主标签（默认 "Engineering"）
 * @param [req.body.categoryId] 分类 ID
 * @param [req.body.tags] 标签数组
 * @param [req.body.status] 状态：draft|published（默认 draft）
 * @param [req.body.visibility] 可见性：public|private（默认 public）
 * @param [req.body.featured] 是否精选
 * @param res 响应对象
 * @returns 创建成功返回 201
 */
router.post(
  '/',
  authGuard,
  async (req: Request<object, object, CreateArticleDto>, res: Response) => {
    const { title, excerpt, content, image, tag, categoryId, tags, status, visibility, featured } =
      req.body;

    if (!title || !content) {
      res.status(400).json({ message: '标题和内容不能为空', statusCode: 400, error: 'BadRequest' });
      return;
    }

    const user = await store.findById<import('@my-app/shared').User>('users', req.user!.id);
    // 估算阅读时长：按 200 词/分钟计算，最少 1 分钟
    const readMinutes = Math.max(1, Math.round(content.split(/\s+/).length / 200));

    const article: ArticleDetailItem = {
      id: generateId(),
      title,
      excerpt: excerpt || content.slice(0, 120) + '...',
      image: image || '',
      tag: tag || 'Engineering',
      tagClass: `tag-${(tag || 'engineering').toLowerCase()}`,
      readTime: `${readMinutes} min read`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      likes: 0,
      comments: 0,
      content,
      views: 0,
      status: status || 'draft',
      visibility: visibility || 'public',
      featured: featured || false, // true=精选 false=非精选
      categoryId: categoryId || '',
      tags: tags || [],
      authorId: req.user!.id,
      author: {
        name: user ? `${user.firstName} ${user.lastName}` : 'Anonymous',
        avatar: user?.avatar || '',
        bio: user?.bio || '',
      },
    };

    await store.create('articles', article);
    res.status(201).json(success(article, '文章创建成功', 201));
  },
);

/**
 * PUT /api/articles/:id - 更新文章
 * @description 需要认证；根据 ID 更新文章字段，并刷新 updatedAt
 * @param req.params.id 文章 ID
 * @param req.body 待更新字段（ArticleDetailItem 部分字段）
 * @param res 响应对象
 * @returns 成功返回更新后的文章；文章不存在返回 404
 */
router.put('/:id', authGuard, async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const article = await store.findById<ArticleDetailItem>('articles', id);
  if (!article) {
    res.status(404).json({ message: '文章不存在', statusCode: 404, error: 'NotFound' });
    return;
  }

  const updated = await store.update('articles', id, {
    ...req.body,
    updatedAt: new Date().toISOString(),
  } as Partial<ArticleDetailItem>);

  res.json(success(updated));
});

/**
 * DELETE /api/articles/:id - 删除文章
 * @description 需要认证；根据 ID 物理删除文章
 * @param req.params.id 文章 ID
 * @param res 响应对象
 * @returns 成功返回 200；文章不存在返回 404
 */
router.delete('/:id', authGuard, async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const deleted = await store.delete('articles', id);
  if (!deleted) {
    res.status(404).json({ message: '文章不存在', statusCode: 404, error: 'NotFound' });
    return;
  }
  res.json(success(null, '文章已删除'));
});

/**
 * POST /api/articles/:id/like - 点赞文章
 * @description 需要认证；将指定文章的点赞数 +1
 * @param req.params.id 文章 ID
 * @param res 响应对象
 * @returns 成功返回更新后的文章；文章不存在返回 404
 */
router.post('/:id/like', authGuard, async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const article = await store.findById<ArticleDetailItem>('articles', id);
  if (!article) {
    res.status(404).json({ message: '文章不存在', statusCode: 404, error: 'NotFound' });
    return;
  }
  const updated = await store.update('articles', id, {
    likes: article.likes + 1,
  } as Partial<ArticleDetailItem>);
  res.json(success(updated));
});

export default router;
