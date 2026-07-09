/**
 * @file profile.routes.ts
 * @description 个人资料路由模块，定义当前登录用户资料的查询与更新 HTTP 路由
 */
import { Router, type Request, type Response } from 'express';
import { getStore } from '@store/index.js';
import { authGuard } from '@middleware/auth.js';
import { success } from '@utils/index.js';
import type { User, UpdateProfileDto } from '@my-app/shared';

/** Express 路由实例 */
const router: Router = Router();
/** JSON 文件存储实例 */
const store = getStore();

/**
 * GET /api/profile - 获取当前用户完整资料
 * @description 需要认证，剥离敏感字段（如密码）后返回
 * @param {Request} req - Express 请求对象
 * @param {Response} res - Express 响应对象
 * @returns {Promise<void>} 无返回值，JSON 响应包含安全用户对象
 * @throws {Error} 当存储层查询失败时抛出
 */
router.get('/', authGuard, async (req: Request, res: Response) => {
  const user = await store.findById<User>('users', req.user!.id);
  if (!user) {
    res.status(404).json({ message: '用户不存在', statusCode: 404, error: 'NotFound' });
    return;
  }
  // 排除密码等敏感字段后返回
  const { password: _, ...safeUser } = user;
  res.json(success(safeUser));
});

/**
 * PATCH /api/profile - 更新用户资料
 * @description 需要认证，仅允许更新白名单字段，自动追加 updatedAt
 * @param {Request<object, object, UpdateProfileDto>} req - Express 请求对象
 * @param {Response} res - Express 响应对象
 * @returns {Promise<void>} 无返回值，成功返回更新后的安全用户对象
 * @throws {Error} 当存储层写失败时抛出
 */
router.patch(
  '/',
  authGuard,
  async (req: Request<object, object, UpdateProfileDto>, res: Response) => {
    // 允许用户自助修改的字段白名单
    const allowedFields = [
      'firstName',
      'lastName',
      'username',
      'bio',
      'avatar',
      'coverImage',
      'location',
      'website',
      'company',
      'social',
      'tags',
    ];
    const updates: Record<string, unknown> = {};

    // 仅复制白名单中且请求体内显式提供的字段
    for (const field of allowedFields) {
      if (req.body[field as keyof UpdateProfileDto] !== undefined) {
        (updates as Record<string, unknown>)[field] = req.body[field as keyof UpdateProfileDto];
      }
    }

    // 写入更新时间戳
    updates.updatedAt = new Date().toISOString();

    const updated = await store.update('users', req.user!.id, updates as Partial<User>);
    if (!updated) {
      res.status(404).json({ message: '用户不存在', statusCode: 404, error: 'NotFound' });
      return;
    }

    // 排除密码等敏感字段
    const { password: _, ...safeUser } = updated;
    res.json(success(safeUser, '资料更新成功'));
  },
);

export default router;
