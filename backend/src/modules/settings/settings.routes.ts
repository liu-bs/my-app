/**
 * @file settings.routes.ts
 * @description 设置模块路由，定义用户设置相关的 HTTP 接口：获取设置、更新个人资料、通知设置与外观设置
 */
import { Router, type Request, type Response } from 'express';
import { getStore } from '@store/index.js';
import { authGuard } from '@middleware/auth.js';
import { success } from '@utils/index.js';
import type { User, UpdateNotificationSettingsDto } from '@my-app/shared';

/** Express 路由实例 */
const router: Router = Router();
/** JSON 文件存储实例，用于读写本地用户数据 */
const store = getStore();

/**
 * GET /api/settings
 * @description 获取当前登录用户的设置信息，包含个人资料、通知、外观三部分
 * @param {Request} req Express 请求对象，需通过 authGuard 注入 req.user
 * @param {Response} res Express 响应对象
 * @returns {Promise<void>} 返回 200 携带 settings 数据；用户不存在时返回 404
 */
router.get('/', authGuard, async (req: Request, res: Response) => {
  // 通过认证中间件注入的当前用户 ID 查找用户记录
  const user = await store.findById<User>('users', req.user!.id);
  if (!user) {
    res.status(404).json({ message: '用户不存在', statusCode: 404, error: 'NotFound' });
    return;
  }

  // 组装返回结构：个人资料字段透传，通知与外观使用默认值
  const settings = {
    profile: {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      coverImage: user.coverImage,
      location: user.location,
      website: user.website,
      company: user.company,
      social: user.social,
    },
    notifications: {
      // 是否通过邮件接收评论提醒（true=开启  false=关闭）
      emailComments: true,
      // 是否通过邮件接收点赞提醒（true=开启  false=关闭）
      emailLikes: true,
      // 是否通过邮件接收新增粉丝提醒（true=开启  false=关闭）
      emailFollows: true,
      // 是否通过邮件接收 @ 提及提醒（true=开启  false=关闭）
      emailMentions: true,
      // 是否订阅周报邮件（true=开启  false=关闭）
      emailNewsletter: true,
    },
    appearance: {
      // 主题模式：system=跟随系统  light=浅色  dark=深色
      theme: 'system',
      // 字号档位：small=小  medium=中  large=大
      fontSize: 'medium',
    },
  };

  res.json(success(settings));
});

/**
 * PATCH /api/settings/profile
 * @description 更新当前登录用户的个人资料，仅允许白名单字段写入
 * @param {Request} req Express 请求对象，body 中包含待更新字段
 * @param {Response} res Express 响应对象
 * @returns {Promise<void>} 返回 200 携带更新后的安全用户对象；用户不存在时返回 404
 */
router.patch('/profile', authGuard, async (req: Request, res: Response) => {
  // 允许更新的字段白名单，防止越权修改敏感字段
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
  ];
  // 写入时同步更新 updatedAt 时间戳
  const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };

  // 仅复制白名单内且请求体中显式提供的字段
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const updated = await store.update('users', req.user!.id, updates as Partial<User>);
  if (!updated) {
    res.status(404).json({ message: '用户不存在', statusCode: 404, error: 'NotFound' });
    return;
  }

  // 移除 password 字段，避免敏感信息泄漏给前端
  const { password: _, ...safeUser } = updated;
  res.json(success(safeUser, '资料更新成功'));
});

/**
 * PATCH /api/settings/notifications
 * @description 更新通知设置（简化实现：直接回显请求体，业务上视为已保存）
 * @param {Request<object, object, UpdateNotificationSettingsDto>} req Express 请求对象，body 为通知设置 DTO
 * @param params.body.emailComments 是否接收评论邮件（true=开启  false=关闭）
 * @param [params.body.emailLikes] 是否接收点赞邮件（true=开启  false=关闭）
 * @param [params.body.emailFollows] 是否接收新粉丝邮件（true=开启  false=关闭）
 * @param [params.body.emailMentions] 是否接收 @ 提及邮件（true=开启  false=关闭）
 * @param [params.body.emailNewsletter] 是否订阅周报邮件（true=开启  false=关闭）
 * @param {Response} res Express 响应对象
 * @returns {Promise<void>} 返回 200 携带回显的设置数据
 */
router.patch(
  '/notifications',
  authGuard,
  async (req: Request<object, object, UpdateNotificationSettingsDto>, res: Response) => {
    // 简化实现：通知设置当前无持久化，直接回显请求体表示成功
    res.json(success(req.body, '通知设置更新成功'));
  },
);

/**
 * PATCH /api/settings/appearance
 * @description 更新外观设置（简化实现：直接回显请求体）
 * @param {Request} req Express 请求对象，body 为外观设置
 * @param params.body.theme 主题模式：system=跟随系统  light=浅色  dark=深色
 * @param params.body.fontSize 字号档位：small=小  medium=中  large=大
 * @param {Response} res Express 响应对象
 * @returns {Promise<void>} 返回 200 携带回显的设置数据
 */
router.patch('/appearance', authGuard, async (req: Request, res: Response) => {
  res.json(success(req.body, '外观设置更新成功'));
});

export default router;
