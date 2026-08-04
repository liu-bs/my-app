/**
 * @file blog.repository.ts
 * @description 博客数据仓储的 JSON 文件实现，提供文章/分类/配置的读写及浏览量、评论计数维护
 */

import { InternalServerError, ServiceUnavailableError } from '@/errors';
import { JsonDocumentStore } from '@/infrastructure/JsonDocumentStore.ts';
import { logger } from '@/utils/logger.ts';
import type { BlogDB, SiteConfig, BlogRepository } from '@my-app/shared';

export type { BlogRepository };

/** 默认站点配置 */
const DEFAULT_SITE_CONFIG: SiteConfig = {
  blogName: '我的博客',
  author: '匿名',
};

/** 默认博客数据库结构（空数据） */
const DEFAULT_BLOG_DB: BlogDB = {
  posts: [],
  categories: [],
  siteConfig: DEFAULT_SITE_CONFIG,
};

/**
 * 规范化博客数据库，确保所有字段存在且类型正确
 * @param data 原始数据（可能未经过校验）
 * @returns 规范化后的 BlogDB
 */
function normalizeBlogDB(data: unknown): BlogDB {
  const db = data as Partial<BlogDB> | undefined;
  return {
    posts: Array.isArray(db?.posts) ? db.posts : [],
    categories: Array.isArray(db?.categories) ? db.categories : [],
    siteConfig: {
      blogName: db?.siteConfig?.blogName || DEFAULT_SITE_CONFIG.blogName,
      author: db?.siteConfig?.author || DEFAULT_SITE_CONFIG.author,
    },
  };
}

/**
 * 博客 JSON 文件仓储实现
 * @description 基于 JsonDocumentStore 提供博客数据的持久化读写、浏览量递增、评论计数更新
 */
export class BlogJsonRepository implements BlogRepository {
  private readonly store: JsonDocumentStore<BlogDB>;

  /**
   * 初始化博客仓储，指定 JSON 文件名为 blog.json
   */
  constructor() {
    this.store = new JsonDocumentStore<BlogDB>('blog.json', DEFAULT_BLOG_DB);
  }

  /**
   * 读取博客数据
   * @returns 规范化后的 BlogDB
   * @throws 读取失败时抛出 InternalServerError
   */
  async read(): Promise<BlogDB> {
    try {
      const raw = await this.store.read();
      return normalizeBlogDB(raw);
    } catch {
      throw new InternalServerError('读取博客数据失败');
    }
  }

  /**
   * 写入博客数据
   * @param db 待写入的 BlogDB
   * @throws 写入遇到锁冲突时抛出 ServiceUnavailableError，其他失败抛出 InternalServerError
   */
  async write(db: BlogDB): Promise<void> {
    try {
      await this.store.write(db);
    } catch (err) {
      if ((err as Error).message?.includes(' lock ') || (err as Error).name?.includes('Lock')) {
        throw new ServiceUnavailableError();
      }
      throw new InternalServerError('写入博客数据失败');
    }
  }

  /**
   * 带乐观锁重试的更新操作（read-modify-write 原子化）
   * @description 与 JsonRepository.update() 相同的乐观锁模式：比较写入前后的版本号检测并发修改，冲突时自动重试一次
   * @param mutate 对 db 对象执行的修改函数
   */
  async updateWithRetry(mutate: (db: BlogDB) => void): Promise<void> {
    const MAX_RETRIES = 1;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const db = await this.read();
      const versionBefore = this.store.getVersion();
      mutate(db);
      await this.write(db);
      if (this.store.getVersion() === versionBefore + 1) return;
      if (attempt < MAX_RETRIES) {
        logger.warn('博客数据乐观锁冲突，重试', { attempt: attempt + 1 });
      }
    }
  }

  /**
   * 递增指定文章的浏览量
   * @param postId 文章 ID
   */
  async incrementView(postId: string): Promise<void> {
    await this.updateWithRetry((db) => {
      const post = db.posts.find((p) => p.id === postId);
      if (!post) return;
      post.views = (post.views ?? 0) + 1;
    });
  }

  /**
   * 更新指定文章的评论计数（增减）
   * @param postId 文章 ID
   * @param delta 变化量，1 为增加，-1 为减少
   */
  async updateCommentsCount(postId: string, delta: 1 | -1): Promise<void> {
    await this.updateWithRetry((db) => {
      const post = db.posts.find((p) => p.id === postId);
      if (!post) return;
      post.commentsCount = Math.max(0, (post.commentsCount ?? 0) + delta);
    });
  }
}
