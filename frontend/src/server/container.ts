import 'server-only';
import { KVUserRepository } from '@server/modules/auth/kv-user.repository';
import { KVBlogRepository } from '@server/modules/blog/kv-blog.repository';
import { KVCommentRepository } from '@server/modules/comment/kv-comment.repository';
import { createPasswordService } from '@server/modules/auth/services/password.service';
import { createTokenService } from '@server/modules/auth/services/token.service';
import { createAuthService, toSafeUser } from '@server/modules/auth/services/auth.service';
import { createBlogService } from '@server/modules/blog/services/blog.service';
import { createCommentService } from '@server/modules/comment/services/comment.service';
import { createAuthCookieHelper } from '@server/modules/auth/auth-cookie.helper';

export interface Container {
  userRepo: KVUserRepository;
  blogRepo: KVBlogRepository;
  commentRepo: KVCommentRepository;
  passwordService: ReturnType<typeof createPasswordService>;
  tokenService: ReturnType<typeof createTokenService>;
  authService: ReturnType<typeof createAuthService>;
  blogService: ReturnType<typeof createBlogService>;
  commentService: ReturnType<typeof createCommentService>;
  authCookieHelper: ReturnType<typeof createAuthCookieHelper>;
}

// 挂到 globalThis，避免 serverless 冷启动时模块缓存丢失导致重复创建实例
// ponytail: 单实例全局容器，多实例部署时每个实例独立初始化，无跨实例共享。
const globalForContainer = globalThis as unknown as { __appContainer?: Container };

export function getContainer(): Container {
  if (globalForContainer.__appContainer) return globalForContainer.__appContainer;

  const userRepo = new KVUserRepository();
  const blogRepo = new KVBlogRepository();
  const commentRepo = new KVCommentRepository();

  const passwordService = createPasswordService();
  const tokenService = createTokenService();

  const authService = createAuthService({
    userRepo,
    passwordService,
    commentRepo,
    blogRepo,
  });

  const blogService = createBlogService({
    repo: blogRepo,
    userRepo,
    commentRepo,
  });

  const commentService = createCommentService({
    commentRepo,
    blogRepo,
    userRepo,
  });

  const authCookieHelper = createAuthCookieHelper({ tokenService });

  globalForContainer.__appContainer = {
    userRepo,
    blogRepo,
    commentRepo,
    passwordService,
    tokenService,
    authService,
    blogService,
    commentService,
    authCookieHelper,
  };

  return globalForContainer.__appContainer;
}

export { toSafeUser };
