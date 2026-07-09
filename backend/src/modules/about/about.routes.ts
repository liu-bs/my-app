/**
 * @file about.routes.ts
 * @description 关于页模块路由定义：统计、核心价值观、团队成员
 */
import { Router, type Request, type Response } from 'express';
import { getStore } from '@store/index.js';
import { success } from '@utils/index.js';
import type { AboutStat, AboutValue, AboutTeamMember } from '@my-app/shared';

/** Express 路由实例 */
const router: Router = Router();
/** JSON 文件存储实例 */
const store = getStore();

/**
 * GET /api/about/stats - 获取关于页统计数据
 * @description 返回平台统计数据列表
 * @param _req Express 请求对象（未使用）
 * @param res 响应对象
 * @returns 成功返回统计数据
 */
router.get('/stats', async (_req: Request, res: Response) => {
  const stats = await store.find<AboutStat>('about_stats');
  res.json(success(stats));
});

/**
 * GET /api/about/values - 获取核心价值观
 * @description 返回平台核心价值观列表
 * @param _req Express 请求对象（未使用）
 * @param res 响应对象
 * @returns 成功返回核心价值观列表
 */
router.get('/values', async (_req: Request, res: Response) => {
  const values = await store.find<AboutValue>('about_values');
  res.json(success(values));
});

/**
 * GET /api/about/team - 获取团队成员
 * @description 返回团队成员列表
 * @param _req Express 请求对象（未使用）
 * @param res 响应对象
 * @returns 成功返回团队成员列表
 */
router.get('/team', async (_req: Request, res: Response) => {
  const team = await store.find<AboutTeamMember>('about_team');
  res.json(success(team));
});

export default router;
