/**
 * @file blog.ts
 * @description 博客模块共享类型，涵盖文章实体、站点配置、列表查询参数、创建/更新 DTO 以及各类 API 响应数据结构，供前后端共用
 */

/**
 * 博客文章
 */
export interface Post {
  /** 文章唯一ID */
  id: string;
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  summary: string;
  /** 文章正文内容 */
  content: string;
  /** 文章正文原始 Markdown（仅详情接口返回，供编辑器预填，列表接口不下发） */
  contentRaw?: string;
  /** 文章分类 */
  category: string;
  /** 文章标签列表 */
  tags: string[];
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
  /** 发布时间（草稿未发布时为空） */
  publishedAt?: string;
  /** 是否为草稿 */
  isDraft: boolean;
  /** 是否置顶 */
  pinned?: boolean;
  /** 封面图片地址 */
  coverImage?: string;
  /** 作者ID */
  authorId?: string;
  /** 作者显示名（冗余，避免展示时反复查用户） */
  authorName?: string;
  /** 阅读量 */
  views: number;
  /** 点赞数 */
  likes: number;
  /** 收藏数 */
  favorites?: number;
  /** 评论数 */
  commentsCount: number;
}

/**
 * 站点配置
 */
export interface SiteConfig {
  /** 博客名称 */
  blogName: string;
  /** 作者名称 */
  author: string;
}

/**
 * 文章列表查询参数（对齐 GET /api/posts）
 */
export interface PostListParams {
  /** 草稿模式（仅返回当前用户草稿） */
  draft?: 'true';
  /** 分类筛选 */
  category?: string;
  /** 标签筛选 */
  tag?: string;
  /** 关键词搜索（标题 + 正文） */
  q?: string;
  /** 页码 */
  page?: number;
  /** 每页条数 */
  limit?: number;
}

/**
 * 创建文章请求体
 */
export interface CreatePostDto {
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  summary?: string;
  /** 文章正文内容 */
  content: string;
  /** 文章分类 */
  category: string;
  /** 文章标签（字符串或字符串数组） */
  tags?: string | string[];
  /** 是否为草稿 */
  isDraft: boolean;
  /** 是否置顶 */
  pinned?: boolean;
  /** 封面图片地址 */
  coverImage?: string;
}

/**
 * 更新文章请求体（全部可选）
 */
export type UpdatePostDto = Partial<CreatePostDto>;

/**
 * GET /api/posts 响应数据（data 部分）
 */
export interface PostsListData {
  /** 文章列表 */
  posts: Post[];
  /** 总条数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  limit: number;
  /** 总页数 */
  totalPages: number;
}

/**
 * GET /api/posts/:id 响应数据
 */
export interface PostData {
  /** 文章详情 */
  post: Post;
}

/**
 * POST /api/posts/:id/like 响应数据
 */
export interface LikeData {
  /** 当前用户是否已点赞 */
  liked: boolean;
  /** 文章总点赞数 */
  likes: number;
}

/**
 * POST /api/posts/:id/favorite 响应数据
 */
export interface FavoriteToggleData {
  /** 当前用户是否已收藏 */
  favorited: boolean;
  /** 文章总收藏数 */
  favorites: number;
}

/**
 * GET /api/favorites 响应数据
 */
export interface FavoritesData {
  /** 收藏的文章列表 */
  posts: Post[];
}

/**
 * GET /api/categories 响应数据
 */
export interface CategoriesData {
  /** 分类列表 */
  categories: string[];
}

/**
 * GET /api/tags 响应数据
 */
export interface TagsData {
  /** 标签列表（含文章数量） */
  tags: { name: string; count: number }[];
}

/**
 * GET/PUT /api/config 响应数据
 */
export interface ConfigData {
  /** 站点配置 */
  config: SiteConfig;
}

/**
 * GET /api/posts/:id/neighbors 响应数据
 */
export interface NeighborPostsData {
  /** 上一篇（列表中较新的文章） */
  prev: Post | null;
  /** 下一篇（列表中较旧的文章） */
  next: Post | null;
}

/**
 * 博客数据库对象
 */
export interface BlogDB {
  /** 文章列表 */
  posts: Post[];
  /** 分类列表 */
  categories: string[];
  /** 站点配置 */
  siteConfig: SiteConfig;
}

/**
 * 更新站点配置 DTO
 */
export interface UpdateSiteConfigDto {
  /** 博客名称 */
  blogName?: string;
  /** 作者名称 */
  author?: string;
}

/**
 * 文章列表查询选项（后端内部使用）。
 * `user` 由后端鉴权中间件注入，前端不传。
 */
export interface ListPostsOptions {
  /** 是否草稿模式 */
  draft?: boolean;
  /** 分类筛选 */
  category?: string;
  /** 标签筛选 */
  tag?: string;
  /** 关键词搜索 */
  q?: string;
  /** 页码 */
  page?: number;
  /** 每页条数 */
  limit?: number;
  /** 认证上下文（后端注入） */
  user?: import('./user').AuthPayload;
}
