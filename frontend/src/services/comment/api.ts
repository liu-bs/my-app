/**
 * @file api.ts
 * @description 评论模块 API 层。对齐后端 API.md，
 *              列表/发表用 /posts/:postId/comments，编辑/删除用 /comments/:id。
 */
import { api } from '@/lib/api/request';
import type { CommentData, CommentsListData, CreateCommentDto } from '@my-app/shared';

/**
 * 评论模块 API 集合
 */
export const commentApi = {
  /** 指定文章的评论列表，optional 鉴权 @param postId 文章ID */
  list: (postId: string) => api.get<CommentsListData>(`/posts/${postId}/comments`),

  /** 发表评论，authGuard，递增文章 commentsCount @param postId 文章ID @param dto 评论表单数据 */
  create: (postId: string, dto: CreateCommentDto) =>
    api.post<CommentData>(`/posts/${postId}/comments`, dto),

  /** 编辑评论，authGuard，仅评论作者 @param commentId 评论ID @param dto 评论表单数据 */
  update: (commentId: string, dto: CreateCommentDto) =>
    api.put<CommentData>(`/comments/${commentId}`, dto),

  /** 删除评论，authGuard，仅评论作者，递减文章 commentsCount @param commentId 评论ID */
  remove: (commentId: string) => api.delete<null>(`/comments/${commentId}`),
};
