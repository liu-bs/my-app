/**
 * @file newsletter.routes.ts
 * @description 邮件订阅路由模块，定义订阅与取消订阅的 HTTP 路由
 */
import { Router, type Request, type Response } from 'express';
import { getStore } from '@store/index.js';
import { generateId, success } from '@utils/index.js';
import type { NewsletterSubscription, SubscribeDto } from '@my-app/shared';

/** Express 路由实例 */
const router: Router = Router();
/** JSON 文件存储实例 */
const store = getStore();

/**
 * POST /api/newsletter/subscribe - 订阅邮件
 * @description 校验邮箱非空且未订阅过，落地订阅记录
 * @param {Request<object, object, SubscribeDto>} req - Express 请求对象，body 含 email
 * @param {Response} res - Express 响应对象
 * @returns {Promise<void>} 无返回值，成功创建返回 201 与订阅实体
 * @throws {Error} 当存储层读写失败时抛出
 */
router.post('/subscribe', async (req: Request<object, object, SubscribeDto>, res: Response) => {
  // @param req.body.email - 订阅者邮箱
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: '邮箱不能为空', statusCode: 400, error: 'BadRequest' });
    return;
  }

  const subscriptions = await store.find<NewsletterSubscription>('newsletter');
  // 邮箱已存在则视为重复订阅
  if (subscriptions.find((s) => s.email === email)) {
    res.status(409).json({ message: '该邮箱已订阅', statusCode: 409, error: 'Conflict' });
    return;
  }

  const subscription: NewsletterSubscription = {
    id: generateId(),
    email,
    // 订阅时间（ISO 字符串）
    createdAt: new Date().toISOString(),
  };

  await store.create('newsletter', subscription);
  res.status(201).json(success(subscription, '订阅成功', 201));
});

/**
 * POST /api/newsletter/unsubscribe - 取消邮件订阅
 * @description 根据邮箱查找并删除订阅记录
 * @param {Request} req - Express 请求对象，body 形如 { email: string }
 * @param {Response} res - Express 响应对象
 * @returns {Promise<void>} 无返回值，成功删除返回成功消息
 * @throws {Error} 当存储层读写失败时抛出
 */
router.post('/unsubscribe', async (req: Request, res: Response) => {
  // @param req.body.email - 要取消订阅的邮箱
  const { email } = req.body as { email: string };
  if (!email) {
    res.status(400).json({ message: '邮箱不能为空', statusCode: 400, error: 'BadRequest' });
    return;
  }

  const subscriptions = await store.find<NewsletterSubscription>('newsletter');
  const target = subscriptions.find((s) => s.email === email);
  if (!target) {
    res.status(404).json({ message: '订阅记录不存在', statusCode: 404, error: 'NotFound' });
    return;
  }

  await store.delete('newsletter', target.id);
  res.json(success(null, '已取消订阅'));
});

export default router;
