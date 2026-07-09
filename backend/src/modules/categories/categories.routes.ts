/**
 * @file categories.routes.ts
 * @description 分类模块路由定义：分类列表、详情、分类下文章、热门作者、学习路径
 */
import { Router, type Request, type Response } from 'express';
import { getStore } from '@store/index.js';
import { success } from '@utils/index.js';
import type {
  Category,
  CategoryDetail,
  CategoryDetailArticle,
  CategoryDetailTopAuthor,
  LearningPath,
} from '@my-app/shared';

/** Express 路由实例 */
const router: Router = Router();
/** JSON 文件存储实例 */
const store = getStore();

/**
 * GET /api/categories - 获取分类列表
 * @description 返回所有分类的基本信息
 * @param _req Express 请求对象（未使用）
 * @param res 响应对象
 * @returns 成功返回分类列表
 */
router.get('/', async (_req: Request, res: Response) => {
  const categories = await store.find<Category>('categories');
  res.json(success(categories));
});

/**
 * GET /api/categories/:id - 获取分类详情
 * @description 根据分类 ID 返回分类详细信息
 * @param req.params.id 分类 ID
 * @param res 响应对象
 * @returns 成功返回分类详情；分类不存在返回 404
 */
router.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const category = await store.findById<CategoryDetail>('categories', id);
  if (!category) {
    res.status(404).json({ message: '分类不存在', statusCode: 404, error: 'NotFound' });
    return;
  }
  res.json(success(category));
});

/**
 * GET /api/categories/:id/articles - 获取分类下的文章
 * @description 根据分类 ID 查询该分类下的文章列表，支持分页
 * @param req.params.id 分类 ID
 * @param req.query.page 页码（默认 1）
 * @param req.query.limit 每页条数（默认 20）
 * @param res 响应对象
 * @returns 成功返回分页文章列表
 */
router.get('/:id/articles', async (req: Request, res: Response) => {
  const { page, limit } = {
    page: Number(req.query.page as string) || 1,
    limit: Number(req.query.limit as string) || 20,
  };
  const offsetVal = (page - 1) * limit;

  const articles = await store.find<CategoryDetailArticle>('category_articles');
  // 简化处理：当前不过滤分类，后续应通过关联 categoryId 字段过滤
  const filtered = articles.filter((_a) => {
    return true;
  });

  const total = filtered.length;
  const items = filtered.slice(offsetVal, offsetVal + limit);

  res.json(
    success({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total, // 是否存在下一页
        hasPrev: page > 1, // 是否存在上一页
      },
    }),
  );
});

/**
 * GET /api/categories/:id/top-authors - 获取分类下的热门作者
 * @description 返回该分类下的热门作者列表
 * @param req 请求对象（未使用 req.params）
 * @param res 响应对象
 * @returns 成功返回热门作者列表
 */
router.get('/:id/top-authors', async (req: Request, res: Response) => {
  const topAuthors = await store.find<CategoryDetailTopAuthor>('category_top_authors');
  res.json(success(topAuthors));
});

/**
 * GET /api/categories/:id/learning-paths - 获取学习路径
 * @description 返回该分类下的学习路径列表
 * @param _req Express 请求对象（未使用）
 * @param res 响应对象
 * @returns 成功返回学习路径列表
 */
router.get('/:id/learning-paths', async (_req: Request, res: Response) => {
  const paths = await store.find<LearningPath>('learning_paths');
  res.json(success(paths));
});

export default router;
