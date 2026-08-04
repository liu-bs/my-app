/**
 * @file auth.module.ts
 * @description auth 模块装配入口，组装 repository、service、guard、router 并对外暴露 AuthModule
 */

import type { AuthModule } from '@my-app/shared';
import type { UserRepository } from './repository/auth.repository.ts';
import type { CommentRepository } from '../comment/repository/comment.repository.ts';
import type { BlogRepository } from '../blog/repository/blog.repository.ts';
import { seedAuthData } from './repository/auth.seed.ts';
import { createAuthService } from './services/auth.service.ts';
import { createAuthGuard, createOptionalAuthGuard } from './services/auth.guard.ts';
import { createPasswordService } from './services/password.service.ts';
import { createTokenService } from './services/token.service.ts';
import { createAuthCookieHelper } from './routes/auth-cookie.helper.ts';
import { createAuthRouter } from './routes/auth.routes.ts';

/**
 * 创建 auth 模块实例
 * @param userRepo 用户仓储实例
 * @param commentRepo 评论仓储实例（用于更新资料时同步评论作者信息）
 * @param blogRepo 博客仓储实例（用于更新资料时同步文章作者名）
 * @returns 组装完成的 AuthModule
 */
export function createAuthModule(
  userRepo: UserRepository,
  commentRepo: CommentRepository,
  blogRepo: BlogRepository,
): AuthModule {
  // 创建各层服务实例
  const passwordService = createPasswordService();
  const tokenService = createTokenService();
  const authService = createAuthService({ userRepo, passwordService, commentRepo, blogRepo });
  // 创建必选/可选鉴权守卫
  const authGuard = createAuthGuard({ tokenService, userRepo });
  const optionalAuthGuard = createOptionalAuthGuard({ tokenService, userRepo });
  // 创建 Cookie 工具
  const authCookieHelper = createAuthCookieHelper({ tokenService });
  // 创建路由
  const router = createAuthRouter({ authService, authGuard, authCookieHelper, tokenService });

  return {
    router,
    authGuard,
    optionalAuthGuard,
    seed: () => seedAuthData(userRepo, passwordService),
  };
}
