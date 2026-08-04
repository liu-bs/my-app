/**
 * @file blog.ts
 * @description 博客模块后端服务与仓储层接口，定义文章 CRUD、点赞收藏、分类标签和站点配置等业务操作契约
 */

import type {
  Post,
  SiteConfig,
  BlogDB,
  CreatePostDto,
  UpdatePostDto,
  UpdateSiteConfigDto,
  ListPostsOptions,
  PostsListData,
} from '../blog';

/**
 * 博客业务服务接口
 */
export interface BlogService {
  /** 获取文章分页列表 */
  listPosts(options: ListPostsOptions): Promise<PostsListData>;
  /** 获取文章详情 */
  getPost(id: string, user?: { id: string }): Promise<Post>;
  /** 创建文章 */
  createPost(dto: CreatePostDto & { authorId: string }): Promise<Post>;
  /** 更新文章 */
  updatePost(id: string, dto: UpdatePostDto, currentUserId: string): Promise<Post>;
  /** 删除文章 */
  deletePost(id: string, currentUserId: string): Promise<void>;
  /** 点赞/取消点赞文章 */
  likePost(id: string, currentUserId: string): Promise<{ liked: boolean; likes: number }>;
  /** 收藏/取消收藏文章 */
  toggleFavorite(
    id: string,
    currentUserId: string,
  ): Promise<{ favorited: boolean; favorites: number }>;
  /** 获取当前用户的收藏文章列表 */
  listFavoritePosts(currentUserId: string): Promise<Post[]>;
  /** 获取全部分类 */
  getCategories(): Promise<string[]>;
  /** 获取全部标签 */
  getTags(): Promise<{ name: string; count: number }[]>;
  /** 获取站点配置 */
  getConfig(): Promise<SiteConfig>;
  /** 更新站点配置 */
  updateConfig(dto: UpdateSiteConfigDto, userId: string): Promise<SiteConfig>;
  /** 获取相邻文章（上一篇/下一篇） */
  getNeighborPosts(id: string): Promise<{ prev: Post | null; next: Post | null }>;
}

/**
 * 博客数据仓储接口（底层持久化操作）
 */
export interface BlogRepository {
  /** 读取完整数据库 */
  read(): Promise<BlogDB>;
  /** 写入完整数据库 */
  write(db: BlogDB): Promise<void>;
  /** 带乐观锁重试的更新操作（read-modify-write 原子化），支持返回值 */
  updateWithRetry<R>(mutate: (db: BlogDB) => R): Promise<R>;
  /** 文章阅读量自增 */
  incrementView(postId: string): Promise<void>;
  /** 更新文章评论数（增减） */
  updateCommentsCount(postId: string, delta: 1 | -1): Promise<void>;
}
