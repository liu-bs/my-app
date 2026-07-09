/**
 * @file index.ts
 * @description Express 应用入口：负责服务器启动、中间件注册、API 路由挂载与种子数据初始化
 */
import express, { type Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { errorHandler, notFoundHandler } from '@middleware/errorHandler.js';
import { requestLogger } from '@middleware/requestLogger.js';
import { getStore } from '@store/index.js';
import { seedData } from '@seed/index.js';
import authRoutes from '@modules/auth/auth.routes.js';
import articlesRoutes from '@modules/articles/articles.routes.js';
import categoriesRoutes from '@modules/categories/categories.routes.js';
import tagsRoutes from '@modules/tags/tags.routes.js';
import dashboardRoutes from '@modules/dashboard/dashboard.routes.js';
import commentsRoutes from '@modules/comments/comments.routes.js';
import notificationsRoutes from '@modules/notifications/notifications.routes.js';
import searchRoutes from '@modules/search/search.routes.js';
import trendingRoutes from '@modules/trending/trending.routes.js';
import favoritesRoutes from '@modules/favorites/favorites.routes.js';
import aboutRoutes from '@modules/about/about.routes.js';
import newsletterRoutes from '@modules/newsletter/newsletter.routes.js';
import uploadRoutes from '@modules/upload/upload.routes.js';
import usersRoutes from '@modules/users/users.routes.js';
import profileRoutes from '@modules/profile/profile.routes.js';
import settingsRoutes from '@modules/settings/settings.routes.js';
import myArticlesRoutes from '@modules/my-articles/my-articles.routes.js';

// 当前模块文件所在目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** 服务监听端口（默认 3001，可通过环境变量 PORT 覆盖） */
const PORT = process.env.PORT || 3001;

/** Express 应用实例 */
const app: Express = express();

// 跨域资源共享配置：仅允许本地开发前端（端口 3000/3004）访问，并允许携带 Cookie
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3004'],
    credentials: true,
  }),
);
// 解析请求中的 Cookie 头部，填充到 req.cookies
app.use(cookieParser());
// 解析 application/json 请求体
app.use(express.json());
// 解析 application/x-www-form-urlencoded 请求体，支持嵌套对象
app.use(express.urlencoded({ extended: true }));

// 暴露上传目录为静态资源（图片等），挂载在 /uploads 路径下
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// 请求日志中间件：记录所有 HTTP 请求
app.use(requestLogger);

// 注册业务模块路由
app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/trending', trendingRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/my-articles', myArticlesRoutes);

/**
 * 健康检查接口
 * @param _req Express 请求对象（未使用）
 * @param res Express 响应对象
 */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 注册兜底中间件：先 404 兜底，再统一错误处理
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * 启动服务器
 * @description 初始化 JSON 文件存储与种子数据，随后启动 HTTP 服务监听 PORT 端口
 * @returns {Promise<void>} 启动流程结束后 resolve
 */
async function start(): Promise<void> {
  // 实例化存储并写入预置数据（仅在数据文件为空时生效）
  const store = getStore();
  await seedData(store);

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📖 API docs: http://localhost:${PORT}/api/health`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  // 启动失败时以非零退出码终止进程
  process.exit(1);
});

export default app;
