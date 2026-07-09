/**
 * @file favorites.routes.ts
 * @description 收藏路由模块，定义用户收藏文章相关的 HTTP 路由
 */
import { Router, type Request, type Response } from 'express';
import { getStore } from '@store/index.js';
import { authGuard } from '@middleware/auth.js';
import { generateId, success } from '@utils/index.js';
import type { Favorite, AddFavoriteDto, ArticleDetailItem } from '@my-app/shared';

/** Express 路由实例 */
const router: Router = Router();
/** JSON 文件存储实例 */
const store = getStore();

/**
 * GET /api/favorites - 获取当前用户的收藏列表
 * @description 需要认证，支持按收藏类型与文章主题筛选，并返回关联的文章详情
 * @param {Request} req - Express 请求对象
 * @param {Response} res - Express 响应对象
 * @returns {Promise<void>} 无返回值，结果以 JSON 形式写入响应
 * @throws {Error} 当存储层查询失败时抛出
 */
router.get('/', authGuard, async (req: Request, res: Response) => {
  // 收藏类型筛选条件（如 article / topic 等）
  const type = req.query.type as string | undefined;
  // 文章主题筛选条件（all 表示全部）
  const topic = req.query.topic as string | undefined;

  let favorites = await store.find<Favorite>('favorites');
  // 仅返回当前登录用户的收藏
  favorites = favorites.filter((f) => f.userId === req.user!.id);

  if (type) {
    favorites = favorites.filter((f) => f.type === type);
  }

  // 拉取全量文章以便在收藏项中嵌入详情
  const articles = await store.find<ArticleDetailItem>('articles');
  const items = favorites.map((f) => {
    const article = articles.find((a) => a.id === f.articleId);
    return {
      ...f,
      // 若文章不存在则置空，避免前端崩溃
      article: article || null,
    };
  });

  // 按主题（tag）二次筛选，topic 为 all 时不过滤
  let filtered = items;
  if (topic && topic !== 'all') {
    filtered = items.filter(
      (i) => i.article && i.article.tag.toLowerCase() === topic.toLowerCase(),
    );
  }

  res.json(success(filtered));
});

/**
 * POST /api/favorites - 添加一条收藏记录
 * @description 需要认证，校验必填参数并防止重复收藏
 * @param {Request<object, object, AddFavoriteDto>} req - Express 请求对象，body 含 articleId/type
 * @param {Response} res - Express 响应对象
 * @returns {Promise<void>} 无返回值，创建成功返回 201 与收藏实体
 * @throws {Error} 当存储层读写失败时抛出
 */
router.post('/', authGuard, async (req: Request<object, object, AddFavoriteDto>, res: Response) => {
  // @param req.body.articleId - 要收藏的文章 ID
  // @param req.body.type - 收藏类型
  const { articleId, type } = req.body;

  if (!articleId || !type) {
    res.status(400).json({ message: '文章ID和类型不能为空', statusCode: 400, error: 'BadRequest' });
    return;
  }

  // 已存在相同 userId + articleId + type 的收藏则视为重复
  const favorites = await store.find<Favorite>('favorites');
  const exists = favorites.find(
    (f) => f.userId === req.user!.id && f.articleId === articleId && f.type === type,
  );
  if (exists) {
    res.status(409).json({ message: '已收藏该文章', statusCode: 409, error: 'Conflict' });
    return;
  }

  const favorite: Favorite = {
    id: generateId(),
    userId: req.user!.id,
    articleId,
    type,
    // 创建时间（ISO 字符串）
    createdAt: new Date().toISOString(),
  };

  await store.create('favorites', favorite);
  res.status(201).json(success(favorite, '收藏成功', 201));
});

/**
 * DELETE /api/favorites - 取消收藏
 * @description 需要认证，根据 articleId（必传）与 type（可选）定位并删除收藏记录
 * @param {Request} req - Express 请求对象，query 携带 articleId/type
 * @param {Response} res - Express 响应对象
 * @returns {Promise<void>} 无返回值，成功删除后返回成功消息
 * @throws {Error} 当存储层读写失败时抛出
 */
router.delete('/', authGuard, async (req: Request, res: Response) => {
  // @param req.query.articleId - 必填，要取消收藏的文章 ID
  // @param req.query.type - 可选，限定匹配的具体收藏类型
  const articleId = req.query.articleId as string | undefined;
  const type = req.query.type as string | undefined;

  if (!articleId) {
    res.status(400).json({ message: '文章ID不能为空', statusCode: 400, error: 'BadRequest' });
    return;
  }

  const favorites = await store.find<Favorite>('favorites');
  // 若未传 type 则忽略 type 匹配；存在则命中目标
  const target = favorites.find(
    (f) => f.userId === req.user!.id && f.articleId === articleId && (!type || f.type === type),
  );

  if (!target) {
    res.status(404).json({ message: '收藏记录不存在', statusCode: 404, error: 'NotFound' });
    return;
  }

  await store.delete('favorites', target.id);
  res.json(success(null, '已取消收藏'));
});

export default router;
