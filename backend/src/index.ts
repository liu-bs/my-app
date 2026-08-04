/**
 * @file index.ts
 * @description 后端应用入口，负责 Express 实例创建、中间件注册、各业务模块组装与服务启动
 */

import { type Server } from 'node:http';
import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from '@/config';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler.ts';
import { requestLogger } from '@/middleware/requestLogger.ts';
import { globalRateLimiter } from '@/middleware/rateLimiter.ts';
import { originCheck } from '@/middleware/originCheck.ts';
import { getJsonUserRepository } from '@/modules/auth/repository/auth.repository.ts';
import { BlogJsonRepository } from '@/modules/blog/repository/blog.repository.ts';
import { CommentJsonRepository } from '@/modules/comment/repository/comment.repository.ts';
import { createAuthModule } from '@/modules/auth';
import { createBlogModule } from '@/modules/blog';
import { createCommentModule } from '@/modules/comment';
import { logger } from '@/utils/logger.ts';

/** 服务监听端口 */
const PORT = env.PORT;

const app: Express = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGINS,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(globalRateLimiter);
app.use(originCheck);

// 共享 Repository 实例
const userRepo = getJsonUserRepository();
const blogRepo = new BlogJsonRepository();
const commentRepo = new CommentJsonRepository();

const authModule = createAuthModule(userRepo, commentRepo, blogRepo);
const blogModule = createBlogModule({
  authGuard: authModule.authGuard,
  optionalAuthGuard: authModule.optionalAuthGuard,
  repo: blogRepo,
  userRepo,
  commentRepo,
});
const commentModule = createCommentModule({
  authGuard: authModule.authGuard,
  optionalAuthGuard: authModule.optionalAuthGuard,
  repo: commentRepo,
  blogRepo,
  userRepo,
});

app.use('/api/auth', authModule.router);
app.use('/api', blogModule.router);
app.use('/api', commentModule.router);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFoundHandler);
app.use(errorHandler);

/**
 * 启动服务器
 * @description 执行认证模块数据种子初始化后开始监听端口
 */
async function start(): Promise<void> {
  await authModule.seed();

  const server: Server = app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);
    const forceExit = setTimeout(() => {
      logger.warn('Forced shutdown after 10s timeout');
      process.exit(1);
    }, 10_000);
    server.close(() => {
      clearTimeout(forceExit);
      logger.info('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((err) => {
  logger.error('Failed to start server', {
    error: err instanceof Error ? err.message : String(err),
  });
  process.exit(1);
});

export default app;
