import 'server-only';
import { KVDocumentStore } from '@server/infrastructure/kv-store';

import type { BlogDB, SiteConfig, BlogRepository } from '@my-app/shared';

const DEFAULT_SITE_CONFIG: SiteConfig = {
  blogName: '我的博客',
  author: '匿名',
};

const DEFAULT_BLOG_DB: BlogDB = {
  posts: [],
  categories: [],
  siteConfig: DEFAULT_SITE_CONFIG,
};

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

export type { BlogRepository };

export class KVBlogRepository implements BlogRepository {
  private readonly store: KVDocumentStore<BlogDB>;

  constructor() {
    this.store = new KVDocumentStore<BlogDB>('blog:db', DEFAULT_BLOG_DB);
  }

  async read(): Promise<BlogDB> {
    return normalizeBlogDB(await this.store.read());
  }

  async write(db: BlogDB): Promise<void> {
    await this.store.write(db);
  }

  async updateWithRetry<R>(mutate: (db: BlogDB) => R): Promise<R> {
    return this.store.updateWithRetry(mutate);
  }

  async incrementView(postId: string): Promise<void> {
    await this.updateWithRetry((db) => {
      const post = db.posts.find((p) => p.id === postId);
      if (!post) return;
      post.views = (post.views ?? 0) + 1;
    });
  }

  async updateCommentsCount(postId: string, delta: 1 | -1): Promise<void> {
    await this.updateWithRetry((db) => {
      const post = db.posts.find((p) => p.id === postId);
      if (!post) return;
      post.commentsCount = Math.max(0, (post.commentsCount ?? 0) + delta);
    });
  }
}
