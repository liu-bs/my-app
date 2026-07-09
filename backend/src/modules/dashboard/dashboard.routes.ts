/**
 * @file dashboard.routes.ts
 * @description 仪表盘模块路由定义：统计数据、图表数据、热门文章、最近评论
 */
import { Router, type Request, type Response } from 'express';
import { getStore } from '@store/index.js';
import { authGuard } from '@middleware/auth.js';
import { success } from '@utils/index.js';
import type { Stat, TopPost } from '@my-app/shared';

/** Express 路由实例 */
const router: Router = Router();
/** JSON 文件存储实例 */
const store = getStore();

/**
 * GET /api/dashboard/stats - 获取统计数据
 * @description 需要认证；返回浏览量、点赞数、评论数、已发布文章数等聚合统计
 * @param req 携带已认证用户信息的请求对象
 * @param res 响应对象
 * @returns 成功返回 Stat 数组
 */
router.get('/stats', authGuard, async (req: Request, res: Response) => {
  const articles = await store.find<import('@my-app/shared').ArticleDetailItem>('articles');
  // 简化逻辑：当前返回全局统计，后续应改为按 authorId 过滤当前用户文章
  const userArticles = articles.filter((a) => a.author?.name && true);

  // 累加各维度统计值
  const totalViews = userArticles.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalLikes = userArticles.reduce((sum, a) => sum + (a.likes || 0), 0);
  const totalComments = userArticles.reduce((sum, a) => sum + (a.comments || 0), 0);
  const publishedCount = userArticles.filter((a) => a.status === 'published').length;

  // 浏览量大于 1000 时格式化为 K 形式，例如 1.2K
  const stats: Stat[] = [
    {
      id: '1',
      title: 'Total Views',
      value: totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}K` : String(totalViews),
      change: '+12.5%',
      trend: 'up', // 趋势：up=上升 down=下降
    },
    {
      id: '2',
      title: 'Total Likes',
      value: totalLikes.toLocaleString(),
      change: '+5.2%',
      trend: 'up',
    },
    {
      id: '3',
      title: 'Comments',
      value: totalComments.toLocaleString(),
      change: '-2.1%',
      trend: 'down', // 趋势：down=下降
    },
    { id: '4', title: 'Published Posts', value: String(publishedCount), change: '+2', trend: 'up' },
  ];

  res.json(success(stats));
});

/**
 * GET /api/dashboard/chart - 获取图表数据
 * @description 需要认证；支持按周（week）/月（month）维度返回浏览量与互动量图表数据
 * @param req.query.period 时间维度：week|month（默认 week）
 * @param res 响应对象
 * @returns 成功返回图表数据（labels + datasets）
 */
router.get('/chart', authGuard, async (req: Request, res: Response) => {
  const period = (req.query.period as string | undefined) || 'week';

  // 维度切换：week 输出 7 个标签（月-日），month 输出 12 个标签（1-12 月）
  const chartData = {
    labels:
      period === 'week'
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Views',
        data:
          period === 'week'
            ? [1200, 1900, 1500, 2100, 1800, 2400, 2200]
            : [4500, 5200, 4800, 6100, 5800, 7200, 6900, 8100, 7500, 9200, 8800, 10500],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
      },
      {
        label: 'Engagement',
        data:
          period === 'week'
            ? [300, 450, 380, 520, 460, 610, 580]
            : [1200, 1500, 1300, 1800, 1600, 2100, 1900, 2400, 2200, 2800, 2600, 3200],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      },
    ],
  };

  res.json(success(chartData));
});

/**
 * GET /api/dashboard/top-posts - 获取热门文章
 * @description 需要认证；按浏览量降序返回前 5 篇已发布文章
 * @param req 携带已认证用户信息的请求对象
 * @param res 响应对象
 * @returns 成功返回 TopPost 数组（最多 5 条）
 */
router.get('/top-posts', authGuard, async (req: Request, res: Response) => {
  const articles = await store.find<import('@my-app/shared').ArticleDetailItem>('articles');
  // 仅取已发布文章并按浏览量降序，截取前 5 条
  const topPosts: TopPost[] = articles
    .filter((a) => a.status === 'published')
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      title: a.title,
      published: a.date,
      views: a.views > 1000 ? `${(a.views / 1000).toFixed(1)}K` : String(a.views),
      // engagement 模拟值，范围 70% - 95%，上限 99%
      engagement: `${Math.min(99, 70 + Math.floor(Math.random() * 25))}%`,
    }));

  res.json(success(topPosts));
});

/**
 * GET /api/dashboard/recent-comments - 获取最近评论
 * @description 需要认证；按创建时间倒序返回最近 10 条评论
 * @param req 携带已认证用户信息的请求对象
 * @param res 响应对象
 * @returns 成功返回 Comment 数组（最多 10 条）
 */
router.get('/recent-comments', authGuard, async (req: Request, res: Response) => {
  const comments = await store.find<import('@my-app/shared').Comment>('comments');
  // 按 createdAt 降序，截取前 10 条
  const recent = comments
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  res.json(success(recent));
});

export default router;
