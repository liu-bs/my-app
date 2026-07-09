/**
 * @file users.routes.ts
 * @description 用户模块路由，定义用户相关的 HTTP 接口：获取用户公开信息、获取用户的文章列表
 */
import { Router, type Request, type Response } from 'express';
import { getStore } from '@store/index.js';
import { optionalAuth } from '@middleware/auth.js';
import { success } from '@utils/index.js';
import type { User } from '@my-app/shared';

/** Express 路由实例 */
const router: Router = Router();
/** JSON 文件存储实例，用于读取用户与文章数据 */
const store = getStore();

/**
 * GET /api/users/:id
 * @description 获取指定用户的公开信息（不含密码等敏感字段），支持可选认证以便扩展个性化逻辑
 * @param {Request} req Express 请求对象
 * @param params.params.id 用户 ID
 * @param {Response} res Express 响应对象
 * @returns {Promise<void>} 返回 200 携带安全用户对象；用户不存在时返回 404
 */
router.get('/:id', optionalAuth, async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = await store.findById<User>('users', id);
  if (!user) {
    res.status(404).json({ message: '用户不存在', statusCode: 404, error: 'NotFound' });
    return;
  }

  // 解构剔除 password 字段，防止敏感信息泄漏
  const { password: _, ...safeUser } = user;
  res.json(success(safeUser));
});

/**
 * GET /api/users/:id/articles
 * @description 获取指定用户发布的文章列表，支持分页
 * @param {Request} req Express 请求对象
 * @param params.params.id 用户 ID
 * @param [params.query.page] 页码，默认 1
 * @param [params.query.limit] 每页条数，默认 20
 * @param {Response} res Express 响应对象
 * @returns {Promise<void>} 返回 200 携带分页文章列表与分页元信息；用户不存在时返回 404
 */
router.get('/:id/articles', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  // 内联分页参数解析：页码默认 1，每页条数默认 20
  const { page, limit } = {
    page: Number(req.query.page as string) || 1,
    limit: Number(req.query.limit as string) || 20,
  };
  // 计算分页偏移量
  const offset = (page - 1) * limit;

  const user = await store.findById<User>('users', id);
  if (!user) {
    res.status(404).json({ message: '用户不存在', statusCode: 404, error: 'NotFound' });
    return;
  }

  const articles = await store.find<import('@my-app/shared').ArticleDetailItem>('articles');
  // 按 authorId 过滤出该用户的文章
  const userArticles = articles.filter((a) => a.authorId === id);

  const total = userArticles.length;
  const items = userArticles.slice(offset, offset + limit);

  res.json(
    success({
      items,
      pagination: {
        page,
        limit,
        total,
        // 总页数向上取整
        totalPages: Math.ceil(total / limit),
        // 当前页未超出总条数则存在下一页
        hasNext: page * limit < total,
        // 页码大于 1 则存在上一页
        hasPrev: page > 1,
      },
    }),
  );
});

export default router;
