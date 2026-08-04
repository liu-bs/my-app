/**
 * @file blog.service.ts
 * @description blog 模块核心业务服务，提供文章 CRUD、点赞、收藏、分类/标签查询、站点配置管理等操作
 */

import type {
  Post,
  SiteConfig,
  BlogService,
  CreatePostDto,
  ListPostsOptions,
  PostsListData as PaginatedPosts,
  UpdatePostDto,
  UpdateSiteConfigDto,
} from '@my-app/shared';
import { NotFoundError, UnprocessableEntityError, ValidationError, ForbiddenError } from '@/errors';
import { logger } from '@/utils/logger.ts';
import type { BlogRepository } from '../repository/blog.repository.ts';
import type { UserRepository } from '../../auth/repository/auth.repository.ts';
import type { CommentRepository } from '../../comment/repository/comment.repository.ts';
import { generateSummary } from './summary.service.ts';
import { renderMarkdown } from './markdown.service.ts';

/**
 * 防御性数字转换 — 防止 JSON 中存储的字符串/null 导致字符串拼接
 * @param val 原始值
 * @returns 有效数字返回该数字，否则返回 0
 */
function toNum(val: unknown): number {
  if (typeof val === 'number' && !isNaN(val)) return val;
  return 0;
}

/**
 * 生成 URL / 文件友好的 slug
 * @param title 文章标题
 * @returns 规范化后的 slug（小写、去变音符号、非字母数字替换为连字符，最长 30 字符）
 */
export function slug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
}

/**
 * 生成文章 ID
 * @param title 文章标题（用于生成 slug 部分）
 * @returns 时间戳-slug-随机后缀 格式的唯一 ID
 */
export function generatePostId(title: string): string {
  const titleSlug = slug(title);
  const randomSuffix = generateRandomSuffix(6);
  const slugPart = titleSlug || 'post';
  return `${Date.now()}-${slugPart}-${randomSuffix}`;
}

/**
 * 生成指定长度的随机后缀
 * @param length 后缀长度
 * @returns 由小写字母和数字组成的随机字符串
 */
function generateRandomSuffix(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

/**
 * 解析并规范化标签（trim + toLowerCase 去重）
 * @param input 原始标签输入，支持字符串（逗号分隔）或字符串数组
 * @returns 规范化后的标签数组（最多 20 个）
 */
export function parseTags(input: string | string[] | undefined): string[] {
  if (input === undefined || input === null) return [];

  const rawArray = Array.isArray(input) ? input : input.split(',');
  const tags = rawArray
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0)
    .filter((t, index, arr) => arr.indexOf(t) === index)
    .slice(0, 20);

  return tags;
}

/**
 * 校验封面图 URL — 拦截内网/元数据地址，防止 SSRF
 * @param value 封面图 URL
 * @throws 非 http(s) URL 或内网地址时抛出 UnprocessableEntityError
 */
export function validateCoverImage(value: string | undefined): void {
  if (value === undefined || value === '') return;
  if (!/^https?:\/\//i.test(value)) {
    throw new UnprocessableEntityError('coverImage 必须是 http(s) URL');
  }
  try {
    const u = new URL(value);
    const host = u.hostname.toLowerCase();
    // 拦截内网与元数据地址
    const isInternal =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('169.254.') ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
      host.startsWith('fc') ||
      host.startsWith('fd') ||
      host.startsWith('fe80:');
    if (isInternal) {
      throw new UnprocessableEntityError('coverImage 不允许指向内网地址');
    }
  } catch (e) {
    if (e instanceof UnprocessableEntityError) throw e;
    throw new UnprocessableEntityError('coverImage URL 格式无效');
  }
}

/**
 * 计算孤立分类清理后的分类数组
 * @param posts 全部文章列表
 * @returns 已发布文章中去重后的分类数组
 */
export function cleanupCategories(posts: Post[]): string[] {
  const used = new Set<string>();
  for (const post of posts) {
    if (!post.isDraft && post.category) {
      used.add(post.category.trim());
    }
  }
  return Array.from(used);
}

/**
 * 规范化文本：去除首尾空白后校验非空
 * @param value 原始文本
 * @param field 字段名称（用于错误提示）
 * @returns 去空白后的文本
 * @throws 空白字符串时抛出 ValidationError
 */
function normalizeText(value: string, field: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new ValidationError(`${field} 不能为空`);
  }
  return trimmed;
}

/**
 * 断言当前用户为文章所有者
 * @param post 文章对象
 * @param currentUserId 当前用户 ID
 * @throws 文章无作者信息或非作者操作时抛出 ForbiddenError
 */
function assertPostOwner(post: Post, currentUserId: string): void {
  // 缺少 authorId 的文章无法校验所有权，禁止任何用户操作
  if (!post.authorId) {
    throw new ForbiddenError('该文章无作者信息，无法操作');
  }
  if (post.authorId !== currentUserId) {
    throw new ForbiddenError('无权操作该文章');
  }
}

/**
 * 创建 blog 服务
 * @param deps 依赖对象，包含 repo、userRepo、commentRepo
 * @returns BlogService 实例
 */
export function createBlogService(deps: {
  repo: BlogRepository;
  userRepo: UserRepository;
  commentRepo: CommentRepository;
}): BlogService {
  /**
   * 获取文章列表（支持分页、分类、标签、关键词筛选及草稿模式）
   * @param options 列表查询选项
   * @returns 分页后的文章列表数据
   */
  async function listPosts(options: ListPostsOptions): Promise<PaginatedPosts> {
    const db = await deps.repo.read();
    let posts = db.posts;

    const isDraftMode = options.draft === true;
    const hasUser = !!options.user;

    if (isDraftMode) {
      if (!hasUser) {
        return {
          posts: [],
          total: 0,
          page: options.page ?? 1,
          limit: options.limit ?? 10,
          totalPages: 0,
        };
      }
      // 草稿模式仅返回当前用户的草稿，避免跨用户泄漏
      posts = posts.filter((p) => p.isDraft && p.authorId === options.user!.id);
    } else {
      posts = posts.filter((p) => !p.isDraft);
    }

    const category = options.category?.trim();
    if (category) {
      posts = posts.filter((p) => p.category === category);
    }

    const tag = options.tag?.trim();
    if (tag) {
      posts = posts.filter((p) => p.tags.includes(tag));
    }

    const q = options.q?.trim().toLowerCase();
    if (q) {
      posts = posts.filter(
        (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q),
      );
    }

    const sorted = sortPosts(posts, isDraftMode);
    const total = sorted.length;
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 10));
    const start = (page - 1) * limit;
    const paged = sorted.slice(start, start + limit);

    return { posts: paged, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /**
   * 文章排序：草稿按更新时间倒序，已发布按置顶优先 + 发布时间倒序
   * @param posts 待排序文章
   * @param isDraftMode 是否为草稿模式
   * @returns 排序后的文章数组
   */
  function sortPosts(posts: Post[], isDraftMode: boolean): Post[] {
    if (isDraftMode) {
      return posts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }
    return posts.sort((a, b) => {
      const pinnedA = a.pinned ? 1 : 0;
      const pinnedB = b.pinned ? 1 : 0;
      if (pinnedA !== pinnedB) return pinnedB - pinnedA;
      const pa = a.publishedAt || a.createdAt;
      const pb = b.publishedAt || b.createdAt;
      return pb.localeCompare(pa);
    });
  }

  /**
   * 获取文章详情，已发布文章递增浏览量并同步作者统计
   * @param id 文章 ID
   * @param user 当前用户（可选，用于判断草稿访问权限）
   * @returns 文章对象
   * @throws 文章不存在或无权访问时抛出 NotFoundError
   */
  async function getPost(id: string, user?: { id: string }): Promise<Post> {
    const db = await deps.repo.read();
    const post = db.posts.find((p) => p.id === id);
    if (!post) {
      throw new NotFoundError('文章不存在');
    }
    if (post.isDraft) {
      // 草稿仅作者可见：访客和无身份 Cookie 的用户 → 404；非作者登录用户 → 404
      if (!user || user.id !== post.authorId) {
        throw new NotFoundError('文章不存在');
      }
    }

    // 仅已发布文章统计阅读量；作者查看自己的草稿不计入
    if (!post.isDraft) {
      // 使用 repo.incrementView 原子递增，避免 read-modify-write 竞态
      deps.repo.incrementView(post.id).catch((err) => {
        logger.error('浏览量写入失败', {
          postId: post.id,
          error: err instanceof Error ? err.message : String(err),
        });
      });

      // 同步更新作者的 stats.views
      if (post.authorId) {
        deps.userRepo
          .findById(post.authorId)
          .then((author) => {
            if (author) {
              const stats = { ...author.stats, views: toNum(author.stats?.views) + 1 };
              deps.userRepo.update(post.authorId!, { stats }).catch((err) => {
                logger.error('作者浏览量统计更新失败', {
                  authorId: post.authorId,
                  error: err instanceof Error ? err.message : String(err),
                });
              });
            }
          })
          .catch((err) => {
            logger.error('查找作者失败', {
              authorId: post.authorId,
              error: err instanceof Error ? err.message : String(err),
            });
          });
      }
    }

    // 将原始 Markdown 渲染为安全的 HTML，防止 XSS
    // contentRaw 保留原始 Markdown，供编辑器预填（详情页渲染仍用 content）
    const renderedPost: Post = {
      ...post,
      content: renderMarkdown(post.content),
      contentRaw: post.content,
    };

    return renderedPost;
  }

  /**
   * 创建文章
   * @param dto 创建文章参数（含 authorId）
   * @returns 创建成功的文章对象
   * @throws 作者不存在时抛出 NotFoundError，coverImage 格式错误抛出 UnprocessableEntityError
   */
  async function createPost(dto: CreatePostDto & { authorId: string }): Promise<Post> {
    const title = normalizeText(dto.title, '标题');
    const content = normalizeText(dto.content, '正文');
    const category = normalizeText(dto.category, '分类');
    validateCoverImage(dto.coverImage);

    const author = await deps.userRepo.findById(dto.authorId);
    if (!author) {
      throw new NotFoundError('作者不存在');
    }

    const now = new Date().toISOString();
    const tags = parseTags(dto.tags);
    const summary = dto.summary?.trim() || generateSummary(content);
    const isDraft = Boolean(dto.isDraft);

    const post: Post = {
      id: generatePostId(title),
      title,
      summary,
      content,
      category,
      tags,
      createdAt: now,
      updatedAt: now,
      isDraft,
      pinned: isDraft ? false : Boolean(dto.pinned),
      coverImage: dto.coverImage?.trim() || undefined,
      authorId: dto.authorId,
      authorName: `${author.firstName} ${author.lastName}`.trim() || author.username,
      views: 0,
      likes: 0,
      favorites: 0,
      commentsCount: 0,
    };

    // 已发布文章记录 publishedAt
    if (!isDraft) {
      post.publishedAt = now;
    }

    const db = await deps.repo.read();
    db.posts.push(post);

    // 已发布文章需要更新分类列表
    if (!isDraft) {
      db.categories = cleanupCategories(db.posts);
    }

    await deps.repo.write(db);

    // 更新作者的文章统计（仅发布文章计入，草稿不计）
    if (!isDraft) {
      const authorStats = { ...author.stats, articles: toNum(author.stats?.articles) + 1 };
      await deps.userRepo.update(dto.authorId, { stats: authorStats });
    }

    return post;
  }

  /**
   * 更新文章，支持草稿<->发布状态切换并同步作者统计
   * @param id 文章 ID
   * @param dto 更新参数
   * @param currentUserId 当前用户 ID（用于权限校验）
   * @returns 更新后的文章对象
   * @throws 文章不存在抛出 NotFoundError，无权操作抛出 ForbiddenError
   */
  async function updatePost(id: string, dto: UpdatePostDto, currentUserId: string): Promise<Post> {
    const db = await deps.repo.read();
    const index = db.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundError('文章不存在');
    }

    const existing = db.posts[index];
    assertPostOwner(existing, currentUserId);

    const title = dto.title !== undefined ? normalizeText(dto.title, '标题') : existing.title;
    const content =
      dto.content !== undefined ? normalizeText(dto.content, '正文') : existing.content;
    const category =
      dto.category !== undefined ? normalizeText(dto.category, '分类') : existing.category;

    if (dto.coverImage !== undefined) {
      validateCoverImage(dto.coverImage);
    }

    const isDraft = dto.isDraft !== undefined ? Boolean(dto.isDraft) : existing.isDraft;
    const wasDraft = existing.isDraft;

    let summary = existing.summary;
    if (dto.summary !== undefined) {
      summary = dto.summary.trim();
    } else if (dto.content !== undefined) {
      summary = generateSummary(content);
    }

    const now = new Date().toISOString();

    const updated: Post = {
      ...existing,
      title,
      content,
      category,
      summary,
      tags: dto.tags !== undefined ? parseTags(dto.tags) : existing.tags,
      isDraft,
      pinned: isDraft ? false : dto.pinned !== undefined ? Boolean(dto.pinned) : existing.pinned,
      coverImage:
        dto.coverImage !== undefined ? dto.coverImage.trim() || undefined : existing.coverImage,
      updatedAt: now,
    };

    // 草稿转发布：记录 publishedAt
    if (wasDraft && !isDraft) {
      updated.publishedAt = now;
    }

    // 发布转草稿：清除 publishedAt
    if (!wasDraft && isDraft) {
      updated.publishedAt = undefined;
    }

    db.posts[index] = updated;
    db.categories = cleanupCategories(db.posts);

    await deps.repo.write(db);

    // 同步作者 stats：草稿↔已发布状态变更时调整文章计数
    if (wasDraft && !isDraft) {
      // 草稿转发布：articles +1
      if (existing.authorId) {
        const author = await deps.userRepo.findById(existing.authorId);
        if (author) {
          const stats = { ...author.stats, articles: toNum(author.stats?.articles) + 1 };
          await deps.userRepo.update(existing.authorId, { stats });
        }
      }
    } else if (!wasDraft && isDraft) {
      // 发布转草稿：articles -1
      if (existing.authorId) {
        const author = await deps.userRepo.findById(existing.authorId);
        if (author) {
          const articles = Math.max(0, toNum(author.stats?.articles) - 1);
          await deps.userRepo.update(existing.authorId, { stats: { ...author.stats, articles } });
        }
      }
    }

    return updated;
  }

  /**
   * 删除文章，级联删除评论并清理所有用户的点赞/收藏记录
   * @param id 文章 ID
   * @param currentUserId 当前用户 ID（用于权限校验）
   * @throws 文章不存在抛出 NotFoundError，无权操作抛出 ForbiddenError
   */
  async function deletePost(id: string, currentUserId: string): Promise<void> {
    const db = await deps.repo.read();
    const index = db.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundError('文章不存在');
    }
    const post = db.posts[index];
    assertPostOwner(post, currentUserId);

    // 先删除文章本身（写 blog.json），确认成功后再做级联清理
    db.posts.splice(index, 1);
    db.categories = cleanupCategories(db.posts);
    await deps.repo.write(db);

    // 文章删除成功后，级联删除评论（失败仅记录日志，不影响文章删除结果）
    try {
      await deps.commentRepo.deleteByPostId(id);
    } catch (err) {
      logger.error('级联删除评论失败', {
        postId: id,
        error: err instanceof Error ? err.message : String(err),
      });
    }

    // 清理所有用户 likedArticles / favoritedArticles 中的该文章 ID
    try {
      const allUsers = await deps.userRepo.findAll();
      for (const user of allUsers) {
        const likedArticles = user.likedArticles ?? [];
        const favoritedArticles = user.favoritedArticles ?? [];
        const newLiked = likedArticles.filter((aid) => aid !== id);
        const newFavorited = favoritedArticles.filter((aid) => aid !== id);
        if (
          newLiked.length !== likedArticles.length ||
          newFavorited.length !== favoritedArticles.length
        ) {
          await deps.userRepo.update(user.id, {
            likedArticles: newLiked,
            favoritedArticles: newFavorited,
          });
        }
      }
    } catch (err) {
      logger.error('清理用户点赞/收藏记录失败', {
        postId: id,
        error: err instanceof Error ? err.message : String(err),
      });
    }

    // 更新作者的 stats.articles（仅已发布文章才需要减）
    if (!post.isDraft && post.authorId) {
      try {
        const author = await deps.userRepo.findById(post.authorId);
        if (author) {
          const articles = Math.max(0, toNum(author.stats?.articles) - 1);
          await deps.userRepo.update(post.authorId, { stats: { ...author.stats, articles } });
        }
      } catch (err) {
        logger.error('更新作者文章统计失败', {
          authorId: post.authorId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }

  /**
   * 点赞/取消点赞文章，先写用户数据再写博客数据，失败时回滚
   * @param id 文章 ID
   * @param currentUserId 当前用户 ID
   * @returns 点赞状态和总点赞数
   * @throws 文章不存在抛出 NotFoundError，草稿文章抛出 ForbiddenError
   */
  async function likePost(
    id: string,
    currentUserId: string,
  ): Promise<{ liked: boolean; likes: number }> {
    const user = await deps.userRepo.findById(currentUserId);
    if (!user) {
      throw new NotFoundError('用户不存在');
    }

    const likedArticles = new Set(user.likedArticles ?? []);
    const wasLiked = likedArticles.has(id);
    const originalLikedArticles = user.likedArticles ?? []; // 保存原始值用于回滚

    if (wasLiked) {
      likedArticles.delete(id);
    } else {
      likedArticles.add(id);
    }

    // 先写用户数据——若失败则无任何变更发生
    await deps.userRepo.update(currentUserId, {
      likedArticles: Array.from(likedArticles),
    });

    // 再写博客数据（带乐观锁重试）——若失败则回滚用户 likedArticles
    let resultLikes = 0;
    try {
      await deps.repo.updateWithRetry((db) => {
        const post = db.posts.find((p) => p.id === id);
        if (!post) {
          throw new NotFoundError('文章不存在');
        }
        if (post.isDraft) {
          throw new ForbiddenError('草稿文章不可点赞');
        }
        if (wasLiked) {
          post.likes = Math.max(0, (post.likes ?? 0) - 1);
        } else {
          post.likes = (post.likes ?? 0) + 1;
        }
        resultLikes = post.likes;
      });
    } catch (blogErr) {
      // 回滚：恢复原始 likedArticles
      await deps.userRepo
        .update(currentUserId, { likedArticles: originalLikedArticles })
        .catch((rollbackErr) => {
          logger.error('回滚 likedArticles 失败', {
            userId: currentUserId,
            error: String(rollbackErr),
          });
        });
      throw blogErr;
    }

    // 更新文章作者的 stats.likes（非关键统计，失败仅记录）
    // 此处需重新读取 post 获取 authorId
    const dbAfter = await deps.repo.read();
    const postAfter = dbAfter.posts.find((p) => p.id === id);
    if (postAfter?.authorId) {
      try {
        const postAuthor = await deps.userRepo.findById(postAfter.authorId);
        if (postAuthor) {
          const delta = wasLiked ? -1 : 1;
          const likes = Math.max(0, toNum(postAuthor.stats?.likes) + delta);
          await deps.userRepo.update(postAfter.authorId, {
            stats: { ...postAuthor.stats, likes },
          });
        }
      } catch (err) {
        logger.error('更新作者 likes 统计失败', {
          authorId: postAfter.authorId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return { liked: !wasLiked, likes: resultLikes };
  }

  /**
   * 收藏/取消收藏文章，先写用户数据再写博客数据，失败时回滚
   * @param id 文章 ID
   * @param currentUserId 当前用户 ID
   * @returns 收藏状态和总收藏数
   * @throws 文章不存在抛出 NotFoundError，草稿文章抛出 ForbiddenError
   */
  async function toggleFavorite(
    id: string,
    currentUserId: string,
  ): Promise<{ favorited: boolean; favorites: number }> {
    const user = await deps.userRepo.findById(currentUserId);
    if (!user) {
      throw new NotFoundError('用户不存在');
    }

    const favoritedArticles = new Set(user.favoritedArticles ?? []);
    const wasFavorited = favoritedArticles.has(id);
    const originalFavoritedArticles = user.favoritedArticles ?? []; // 保存原始值用于回滚

    if (wasFavorited) {
      favoritedArticles.delete(id);
    } else {
      favoritedArticles.add(id);
    }

    // 先写用户数据——若失败则无任何变更发生
    await deps.userRepo.update(currentUserId, {
      favoritedArticles: Array.from(favoritedArticles),
    });

    // 再写博客数据（带乐观锁重试）——若失败则回滚用户 favoritedArticles
    let resultFavorites = 0;
    try {
      await deps.repo.updateWithRetry((db) => {
        const post = db.posts.find((p) => p.id === id);
        if (!post) {
          throw new NotFoundError('文章不存在');
        }
        if (post.isDraft) {
          throw new ForbiddenError('草稿文章不可收藏');
        }
        if (wasFavorited) {
          post.favorites = Math.max(0, (post.favorites ?? 0) - 1);
        } else {
          post.favorites = (post.favorites ?? 0) + 1;
        }
        resultFavorites = post.favorites;
      });
    } catch (blogErr) {
      await deps.userRepo
        .update(currentUserId, { favoritedArticles: originalFavoritedArticles })
        .catch((rollbackErr) => {
          logger.error('回滚 favoritedArticles 失败', {
            userId: currentUserId,
            error: String(rollbackErr),
          });
        });
      throw blogErr;
    }

    return { favorited: !wasFavorited, favorites: resultFavorites };
  }

  /**
   * 获取当前用户收藏的文章列表
   * @param currentUserId 当前用户 ID
   * @returns 按收藏顺序排列的已发布文章列表
   * @throws 用户不存在时抛出 NotFoundError
   */
  async function listFavoritePosts(currentUserId: string): Promise<Post[]> {
    const user = await deps.userRepo.findById(currentUserId);
    if (!user) {
      throw new NotFoundError('用户不存在');
    }
    const favoritedIds = user.favoritedArticles ?? [];
    if (favoritedIds.length === 0) {
      return [];
    }
    const db = await deps.repo.read();
    // 按收藏顺序返回，仅含已发布文章（草稿不进入收藏列表）
    return favoritedIds
      .map((fid) => db.posts.find((p) => p.id === fid))
      .filter((p): p is Post => !!p && !p.isDraft);
  }

  /**
   * 获取所有分类
   * @returns 分类名称数组
   */
  async function getCategories(): Promise<string[]> {
    const db = await deps.repo.read();
    return db.categories;
  }

  /**
   * 获取所有标签（已发布文章中的标签，去重后按字母排序）
   * @returns 标签列表（含文章数量）
   */
  async function getTags(): Promise<{ name: string; count: number }[]> {
    const db = await deps.repo.read();
    const tagMap = new Map<string, number>();
    for (const post of db.posts) {
      if (!post.isDraft) {
        for (const tag of post.tags) {
          const normalized = tag.trim().toLowerCase();
          if (normalized) {
            tagMap.set(normalized, (tagMap.get(normalized) ?? 0) + 1);
          }
        }
      }
    }
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * 获取站点配置
   * @returns 站点配置对象
   */
  async function getConfig(): Promise<SiteConfig> {
    const db = await deps.repo.read();
    return db.siteConfig;
  }

  /**
   * 更新站点配置
   * @param dto 站点配置参数（博客名称、作者名）
   * @param userId 操作用户 ID
   * @returns 更新后的站点配置
   * @throws 用户不存在时抛出 NotFoundError
   */
  async function updateConfig(dto: UpdateSiteConfigDto, userId: string): Promise<SiteConfig> {
    // 校验请求用户确实存在（防止已删除用户操作）
    const user = await deps.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('用户不存在');
    }
    // 仅管理员可修改站点配置
    if (user.role !== 'Admin') {
      throw new ForbiddenError('无权修改站点配置');
    }

    const db = await deps.repo.read();
    const blogName = dto.blogName?.trim() || '我的博客';
    const author = dto.author?.trim() || '匿名';
    db.siteConfig = { blogName, author };
    await deps.repo.write(db);
    return db.siteConfig;
  }

  /**
   * 获取相邻文章（上一篇/下一篇），仅从已发布文章中查找
   * @param id 当前文章 ID
   * @returns prev 为较新的一篇，next 为较旧的一篇
   */
  async function getNeighborPosts(id: string): Promise<{ prev: Post | null; next: Post | null }> {
    const db = await deps.repo.read();
    const published = db.posts.filter((p) => !p.isDraft);
    const sorted = published.sort((a, b) => {
      const pa = a.publishedAt || a.createdAt;
      const pb = b.publishedAt || b.createdAt;
      return pb.localeCompare(pa);
    });
    const currentIndex = sorted.findIndex((p) => p.id === id);
    if (currentIndex === -1) {
      return { prev: null, next: null };
    }
    return {
      prev: currentIndex > 0 ? sorted[currentIndex - 1] : null,
      next: currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null,
    };
  }

  return {
    listPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    toggleFavorite,
    listFavoritePosts,
    getCategories,
    getTags,
    getConfig,
    updateConfig,
    getNeighborPosts,
  };
}
