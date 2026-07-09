/**
 * @file comments.routes.ts
 * @description 评论模块路由定义：获取文章评论树、创建评论、删除评论、点赞评论
 */
import { Router, type Request, type Response } from 'express';
import { getStore } from '@store/index.js';
import { authGuard } from '@middleware/auth.js';
import { generateId, success } from '@utils/index.js';
import type { Comment, CreateCommentDto } from '@my-app/shared';

/** Express 路由实例 */
const router: Router = Router();
/** JSON 文件存储实例 */
const store = getStore();

/**
 * GET /api/comments/:articleId - 获取文章评论
 * @description 获取指定文章的评论并构建父子关系的树形结构
 * @param req.params.articleId 文章 ID
 * @param res 响应对象
 * @returns 成功返回评论树（根评论 + replies）
 */
router.get('/:articleId', async (req: Request, res: Response) => {
  const articleId = req.params.articleId as string;
  const comments = await store.find<Comment>('comments');
  const articleComments = comments.filter((c) => c.articleId === articleId);

  // 根评论：没有 parentId 的评论
  const rootComments = articleComments.filter((c) => !c.parentId);
  // 递归构建子评论树
  const buildTree = (parentId: string): Comment[] => {
    return articleComments
      .filter((c) => c.parentId === parentId)
      .map((c) => ({ ...c, replies: buildTree(c.id) }));
  };

  const tree = rootComments.map((c) => ({ ...c, replies: buildTree(c.id) }));
  res.json(success(tree));
});

/**
 * POST /api/comments - 创建评论
 * @description 需要认证；创建评论后同步更新对应文章的评论计数
 * @param req.body 请求体（CreateCommentDto）
 * @param req.body.articleId 文章 ID（必填）
 * @param req.body.content 评论内容（必填）
 * @param [req.body.parentId] 父评论 ID；缺省则为根评论
 * @param res 响应对象
 * @returns 创建成功返回 201；字段缺失返回 400
 */
router.post(
  '/',
  authGuard,
  async (req: Request<object, object, CreateCommentDto>, res: Response) => {
    const { articleId, content, parentId } = req.body;

    if (!articleId || !content) {
      res
        .status(400)
        .json({ message: '文章ID和评论内容不能为空', statusCode: 400, error: 'BadRequest' });
      return;
    }

    const user = await store.findById<import('@my-app/shared').User>('users', req.user!.id);

    const comment: Comment = {
      id: generateId(),
      articleId,
      userId: req.user!.id,
      userName: user ? `${user.firstName} ${user.lastName}` : 'Anonymous',
      userAvatar: user?.avatar || '',
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      parentId: parentId || undefined,
    };

    await store.create('comments', comment);

    // 更新文章评论数（+1）
    const article = await store.findById<import('@my-app/shared').ArticleDetailItem>(
      'articles',
      articleId,
    );
    if (article) {
      await store.update('articles', articleId, { comments: article.comments + 1 } as Partial<
        import('@my-app/shared').ArticleDetailItem
      >);
    }

    res.status(201).json(success(comment, '评论成功', 201));
  },
);

/**
 * DELETE /api/comments/:id - 删除评论
 * @description 需要认证；仅评论作者可删除自己的评论
 * @param req.params.id 评论 ID
 * @param res 响应对象
 * @returns 删除成功返回 200；评论不存在返回 404；非作者返回 403
 */
router.delete('/:id', authGuard, async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const comment = await store.findById<Comment>('comments', id);
  if (!comment) {
    res.status(404).json({ message: '评论不存在', statusCode: 404, error: 'NotFound' });
    return;
  }
  // 鉴权：仅本人可删除
  if (comment.userId !== req.user!.id) {
    res.status(403).json({ message: '无权删除此评论', statusCode: 403, error: 'Forbidden' });
    return;
  }

  await store.delete('comments', id);
  res.json(success(null, '评论已删除'));
});

/**
 * POST /api/comments/:id/like - 点赞评论
 * @description 需要认证；将指定评论的点赞数 +1
 * @param req.params.id 评论 ID
 * @param res 响应对象
 * @returns 成功返回更新后的评论；评论不存在返回 404
 */
router.post('/:id/like', authGuard, async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const comment = await store.findById<Comment>('comments', id);
  if (!comment) {
    res.status(404).json({ message: '评论不存在', statusCode: 404, error: 'NotFound' });
    return;
  }
  const updated = await store.update('comments', id, {
    likes: comment.likes + 1,
  } as Partial<Comment>);
  res.json(success(updated));
});

export default router;
