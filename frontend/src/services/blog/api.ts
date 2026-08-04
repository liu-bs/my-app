/**
 * @file api.ts
 * @description 博客模块 API 层。对齐后端 API.md，前缀 /api，
 *              提供文章 CRUD、点赞/收藏、分类/标签、站点配置等接口调用。
 *              读取型接口使用 revalidate 缓存 + React.cache() 请求内去重。
 */
import { cache } from 'react';
import { api } from '@/lib/api/request';
import type {
  CategoriesData,
  ConfigData,
  CreatePostDto,
  FavoriteToggleData,
  FavoritesData,
  LikeData,
  NeighborPostsData,
  PostData,
  PostListParams,
  PostsListData,
  SiteConfig,
  TagsData,
  UpdatePostDto,
} from '@my-app/shared';

/**
 * 博客模块 API 集合
 */
export const blogApi = {
  /** 文章列表（分页/筛选/搜索），optional 鉴权：登录后可查自己草稿 @param params 列表查询参数 */
  listPosts: (params: PostListParams = {}) =>
    api.get<PostsListData>('/posts', params as Record<string, string | number>, { revalidate: 60 }),

  /** 文章详情，optional 鉴权：草稿仅作者可见（他人访问 404） @param id 文章ID */
  getPost: (id: string) => api.get<PostData>(`/posts/${id}`, undefined, { revalidate: 0 }),

  /** 获取相邻文章（上一篇/下一篇），仅已发布文章 @param id 文章ID */
  getNeighborPosts: (id: string) =>
    api.get<NeighborPostsData>(`/posts/${id}/neighbors`, undefined, { revalidate: 60 }),

  /** 创建文章，authGuard @param dto 创建文章表单数据 */
  createPost: (dto: CreatePostDto) => api.post<PostData>('/posts', dto),

  /** 更新文章，authGuard，仅作者 @param id 文章ID @param dto 更新文章表单数据 */
  updatePost: (id: string, dto: UpdatePostDto) => api.put<PostData>(`/posts/${id}`, dto),

  /** 删除文章，authGuard，仅作者，级联删除评论、清理点赞/收藏 @param id 文章ID */
  deletePost: (id: string) => api.delete<null>(`/posts/${id}`),

  /** 切换点赞（toggle），authGuard，草稿不可点赞 @param id 文章ID */
  toggleLike: (id: string) => api.post<LikeData>(`/posts/${id}/like`),

  /** 切换收藏（toggle），authGuard，草稿不可收藏 @param id 文章ID */
  toggleFavorite: (id: string) => api.post<FavoriteToggleData>(`/posts/${id}/favorite`),

  /** 当前用户收藏列表，authGuard（用户私有数据，不缓存） */
  listFavorites: () => api.get<FavoritesData>('/favorites'),

  /** 分类列表（从已发布文章聚合），无鉴权 */
  listCategories: () => api.get<CategoriesData>('/categories', undefined, { revalidate: 300 }),

  /** 标签列表（从已发布文章聚合，小写去重排序），无鉴权 */
  listTags: () => api.get<TagsData>('/tags', undefined, { revalidate: 300 }),

  /** 站点配置，无鉴权 */
  getConfig: () => api.get<ConfigData>('/config', undefined, { revalidate: 600 }),

  /** 更新站点配置，authGuard @param dto 站点配置更新数据 */
  updateConfig: (dto: Partial<SiteConfig>) => api.put<ConfigData>('/config', dto),
};

/**
 * 请求内缓存的 getPost — 避免 generateMetadata 和页面组件重复请求同一篇文章
 */
export const getCachedPost = cache((id: string) => blogApi.getPost(id));
