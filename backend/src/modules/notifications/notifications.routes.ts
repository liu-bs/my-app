/**
 * @file notifications.routes.ts
 * @description 通知路由模块，定义通知相关的 HTTP 路由
 */
import { Router, type Request, type Response } from 'express';
import { getStore } from '@store/index.js';
import { authGuard } from '@middleware/auth.js';
import { success } from '@utils/index.js';
import type { Notification } from '@my-app/shared';

/** Express 路由实例 */
const router: Router = Router();
/** JSON 文件存储实例 */
const store = getStore();

/**
 * GET /api/notifications - 获取当前用户的通知列表
 * @description 需要认证，支持按 Tab（unread/mentions）与通知类型筛选，按时间倒序返回
 * @param {Request} req - Express 请求对象，query 携带 tab/filter
 * @param {Response} res - Express 响应对象
 * @returns {Promise<void>} 无返回值，结果以 JSON 形式写入响应
 * @throws {Error} 当存储层查询失败时抛出
 */
router.get('/', authGuard, async (req: Request, res: Response) => {
  // @param req.query.tab - 通知分栏：unread=未读 mentions=@提及 其余=全部
  // @param req.query.filter - 通知类型过滤：all=全部 其余=精确匹配 type
  const tab = req.query.tab as string | undefined;
  const filter = req.query.filter as string | undefined;

  let notifications = await store.find<Notification>('notifications');
  // 仅返回当前登录用户自己的通知
  notifications = notifications.filter((n) => n.userId === req.user!.id);

  // read=false 表示未读
  if (tab === 'unread') notifications = notifications.filter((n) => !n.read);
  if (tab === 'mentions') notifications = notifications.filter((n) => n.type === 'mention');
  // filter=all 时不过滤
  if (filter && filter !== 'all') notifications = notifications.filter((n) => n.type === filter);

  // 按 createdAt 倒序，最新通知排前
  notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(success(notifications));
});

/**
 * PATCH /api/notifications/:id/read - 将指定通知标记为已读
 * @description 需要认证，仅可操作属于自己的通知
 * @param {Request} req - Express 请求对象，params.id 为通知 ID
 * @param {Response} res - Express 响应对象
 * @returns {Promise<void>} 无返回值，成功返回更新后的通知
 * @throws {Error} 当存储层读写失败时抛出
 */
router.patch('/:id/read', authGuard, async (req: Request, res: Response) => {
  // @param req.params.id - 通知 ID
  const id = req.params.id as string;
  const notification = await store.findById<Notification>('notifications', id);
  if (!notification) {
    res.status(404).json({ message: '通知不存在', statusCode: 404, error: 'NotFound' });
    return;
  }
  // 越权访问：禁止操作他人的通知
  if (notification.userId !== req.user!.id) {
    res.status(403).json({ message: '无权操作', statusCode: 403, error: 'Forbidden' });
    return;
  }

  // read=true 表示已读
  const updated = await store.update('notifications', id, { read: true } as Partial<Notification>);
  res.json(success(updated));
});

/**
 * POST /api/notifications/read-all - 全部标记已读
 * @description 需要认证，将当前用户所有未读通知批量标记为已读
 * @param {Request} req - Express 请求对象
 * @param {Response} res - Express 响应对象
 * @returns {Promise<void>} 无返回值，响应包含成功消息
 * @throws {Error} 当存储层批量更新失败时抛出
 */
router.post('/read-all', authGuard, async (req: Request, res: Response) => {
  const notifications = await store.find<Notification>('notifications');
  const userNotifications = notifications.filter((n) => n.userId === req.user!.id);

  // 仅更新尚未标记为已读的通知，避免无谓的写操作
  for (const n of userNotifications) {
    if (!n.read) {
      await store.update('notifications', n.id, { read: true } as Partial<Notification>);
    }
  }

  res.json(success(null, '全部标记已读'));
});

/**
 * DELETE /api/notifications/:id - 删除指定通知
 * @description 需要认证，仅可删除属于自己的通知
 * @param {Request} req - Express 请求对象，params.id 为通知 ID
 * @param {Response} res - Express 响应对象
 * @returns {Promise<void>} 无返回值，成功删除返回成功消息
 * @throws {Error} 当存储层删除失败时抛出
 */
router.delete('/:id', authGuard, async (req: Request, res: Response) => {
  // @param req.params.id - 通知 ID
  const id = req.params.id as string;
  const notification = await store.findById<Notification>('notifications', id);
  if (!notification) {
    res.status(404).json({ message: '通知不存在', statusCode: 404, error: 'NotFound' });
    return;
  }
  // 越权访问：禁止删除他人的通知
  if (notification.userId !== req.user!.id) {
    res.status(403).json({ message: '无权操作', statusCode: 403, error: 'Forbidden' });
    return;
  }

  await store.delete('notifications', id);
  res.json(success(null, '通知已删除'));
});

export default router;
