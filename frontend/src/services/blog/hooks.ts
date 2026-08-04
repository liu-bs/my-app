/**
 * @file hooks.ts
 * @description 博客模块 React Query Hooks。基于 blogApi 封装，提供文章列表/详情/分类/标签/
 *              配置/收藏查询及文章 CRUD、点赞/收藏/配置更新等 mutation，自动维护缓存一致性。
 */
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from '@/lib/toast';
import type {
  CreatePostDto,
  PostData,
  PostListParams,
  SiteConfig,
  UpdatePostMutationVars,
} from '@my-app/shared';
import { authKeys } from '@/services/auth/hooks';
import { STALE_TIME } from '@/config/query';
import { blogApi } from './api';

/**
 * Blog 模块 Query Key 集合
 */
export const blogKeys = {
  /** 文章列表 */
  posts: ['blog', 'posts'] as const,
  /** 文章详情 @param id 文章ID */
  post: (id: string) => ['blog', 'post', id] as const,
  /** 当前用户收藏列表 */
  favorites: ['blog', 'favorites'] as const,
  /** 分类列表 */
  categories: ['blog', 'categories'] as const,
  /** 标签列表 */
  tags: ['blog', 'tags'] as const,
  /** 站点配置 */
  config: ['blog', 'config'] as const,
};

/** 通用 onError toast */
const toastOperationError = () => toast.error('操作失败');

/**
 * 文章列表查询 Hook（服务端分页/筛选/搜索）
 * @description placeholderData: keepPreviousData 保持上一页数据直到新数据到达，避免闪烁
 * @param params 列表查询参数（分页/筛选/搜索）
 * @returns 文章列表 query 结果
 */
export function usePosts(params: PostListParams = {}) {
  return useQuery({
    queryKey: [...blogKeys.posts, JSON.stringify(params)],
    queryFn: () => blogApi.listPosts(params),
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME.short,
  });
}

/**
 * 文章详情查询 Hook
 * @description 草稿仅作者可见，他人访问后端返回 404
 * @param id 文章ID
 * @returns 文章详情 query 结果
 */
export function usePost(id: string) {
  return useQuery({
    queryKey: blogKeys.post(id),
    queryFn: () => blogApi.getPost(id),
    enabled: !!id,
  });
}

/**
 * 创建文章 Mutation Hook
 * @description 成功后使列表/分类/标签/me 失效（发布文章会更新作者 stats.articles）。
 *              提示文案交由调用方按「草稿/发布」区分，与 auth hooks 约定一致。
 * @param dto 创建文章表单数据
 */
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreatePostDto) => blogApi.createPost(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.posts });
      queryClient.invalidateQueries({ queryKey: blogKeys.categories });
      queryClient.invalidateQueries({ queryKey: blogKeys.tags });
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}

/**
 * 更新文章 Mutation Hook
 * @description 成功后使详情与列表失效
 * @param vars 包含文章ID和更新数据的变量对象
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: UpdatePostMutationVars) => blogApi.updatePost(id, dto),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.post(id) });
      queryClient.invalidateQueries({ queryKey: blogKeys.posts });
      queryClient.invalidateQueries({ queryKey: blogKeys.categories });
      queryClient.invalidateQueries({ queryKey: blogKeys.tags });
    },
  });
}

/**
 * 删除文章 Mutation Hook
 * @description 成功后使列表失效并清理详情缓存
 * @param id 文章ID
 */
export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogApi.deletePost(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: blogKeys.post(id) });
      queryClient.invalidateQueries({ queryKey: blogKeys.posts });
      queryClient.invalidateQueries({ queryKey: blogKeys.favorites });
      queryClient.invalidateQueries({ queryKey: authKeys.me });
      toast.success('文章已删除');
    },
  });
}

/**
 * 切换点赞 Mutation Hook
 * @description 以后端返回 {liked, likes} 为准更新 post 缓存的点赞数，
 *              并 invalidate me（刷新 likedArticles）。不维护本地状态。
 * @param id 文章ID
 */
export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogApi.toggleLike(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData<PostData>(blogKeys.post(id), (old) =>
        old ? { ...old, post: { ...old.post, likes: data.likes } } : old,
      );
      queryClient.invalidateQueries({ queryKey: blogKeys.posts });
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
    onError: toastOperationError,
  });
}

/**
 * 切换收藏 Mutation Hook
 * @description 以后端返回 {favorited, favorites} 为准更新 post 缓存，
 *              并 invalidate me（刷新 favoritedArticles）与收藏列表。
 * @param id 文章ID
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogApi.toggleFavorite(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData<PostData>(blogKeys.post(id), (old) =>
        old ? { ...old, post: { ...old.post, favorites: data.favorites } } : old,
      );
      queryClient.invalidateQueries({ queryKey: blogKeys.posts });
      queryClient.invalidateQueries({ queryKey: blogKeys.favorites });
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
    onError: toastOperationError,
  });
}

/**
 * 更新站点配置 Mutation Hook
 * @description 成功后使配置缓存失效
 * @param dto 站点配置更新数据
 */
export function useUpdateConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: Partial<SiteConfig>) => blogApi.updateConfig(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.config });
      toast.success('配置已更新');
    },
  });
}
