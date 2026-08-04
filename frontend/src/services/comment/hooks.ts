/**
 * @file hooks.ts
 * @description 评论模块 React Query Hooks。基于 commentApi 封装，提供评论列表查询及
 *              评论发表/编辑/删除等 mutation，自动维护评论列表与文章 commentsCount 缓存一致性。
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from '@/lib/toast';
import type { CreateCommentDto, UpdateCommentMutationVars } from '@my-app/shared';
import { blogKeys } from '@/services/blog/hooks';
import { STALE_TIME } from '@/config/query';
import { commentApi } from './api';

/**
 * Comment 模块 Query Key 集合
 */
export const commentKeys = {
  /** 文章评论列表 @param postId 文章ID */
  list: (postId: string) => ['comment', 'list', postId] as const,
};

/**
 * 文章评论列表查询 Hook
 * @param postId 文章ID
 * @returns 评论列表 query 结果
 */
export function useComments(postId: string) {
  return useQuery({
    queryKey: commentKeys.list(postId),
    queryFn: () => commentApi.list(postId),
    enabled: !!postId,
    staleTime: STALE_TIME.short,
  });
}

/**
 * 发表评论 Mutation Hook
 * @description 成功后使评论列表与文章（commentsCount）失效
 * @param postId 文章ID
 * @param dto 评论表单数据
 */
export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCommentDto) => commentApi.create(postId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });
      queryClient.invalidateQueries({ queryKey: blogKeys.post(postId) });
      toast.success('评论已发表');
    },
    onError: () => toast.error('发表评论失败'),
  });
}

/**
 * 编辑评论 Mutation Hook
 * @description 成功后使评论列表失效
 * @param postId 文章ID
 * @param vars 包含评论ID和评论表单数据的变量对象
 */
export function useUpdateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, dto }: UpdateCommentMutationVars) =>
      commentApi.update(commentId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });
      toast.success('评论已更新');
    },
    onError: (err: Error) => {
      // 403 非评论作者
      toast.error(err.message || '编辑评论失败');
    },
  });
}

/**
 * 删除评论 Mutation Hook
 * @description 成功后使评论列表与文章失效
 * @param postId 文章ID
 * @param commentId 评论ID
 */
export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => commentApi.remove(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });
      queryClient.invalidateQueries({ queryKey: blogKeys.post(postId) });
      toast.success('评论已删除');
    },
    onError: (err: Error) => {
      toast.error(err.message || '删除评论失败');
    },
  });
}
