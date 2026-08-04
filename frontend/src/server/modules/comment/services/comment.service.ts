/**
 * @file comment.service.ts
 * @description 评论模块的业务逻辑层，提供评论的查询、创建、编辑、删除及按文章批量删除功能
 */

import 'server-only';

import type { Comment, CommentService } from '@my-app/shared';
import { generateId } from '@server/utils/common';
import { ForbiddenError, NotFoundError, ValidationError } from '@server/errors';
import { logger } from '@server/utils/logger';
import sanitizeHtml from 'sanitize-html';
import type { CommentRepository } from '@server/modules/comment/kv-comment.repository';
import type { BlogRepository } from '@server/modules/blog/kv-blog.repository';
import type { UserRepository } from '@server/modules/auth/kv-user.repository';
import type { CreateCommentDto, ListCommentsOptions } from '@my-app/shared';

/**
 * 将评论内容转为纯文本 — 移除所有 HTML 标签，防止存储型 XSS
 * @param content 原始评论内容
 * @returns 去除 HTML 标签后的纯文本
 */
function sanitizeCommentContent(content: string): string {
  return sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} }).trim();
}

export type { CommentService };

/**
 * 创建评论 service
 * @description 接收 repository 依赖，返回一组评论业务操作方法
 * @param deps 依赖对象，包含评论、博客、用户 repository
 * @returns CommentService 实现
 */
export function createCommentService(deps: {
  commentRepo: CommentRepository;
  blogRepo: BlogRepository;
  userRepo: UserRepository;
}): CommentService {
  /**
   * 查询指定文章下的评论列表，按创建时间降序排列
   * @param options 查询选项，包含 postId
   * @returns 评论列表
   */
  async function listComments(options: ListCommentsOptions): Promise<Comment[]> {
    const comments = await deps.commentRepo.findByPostId(options.postId);
    return comments.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  /**
   * 创建评论
   * @description 校验文章和用户存在性后写入评论，并原子更新文章评论计数，失败时回滚已创建的评论
   * @param dto 创建评论的数据，包含 postId、userId、content
   * @returns 新建的评论对象
   * @throws 文章不存在时抛出 NotFoundError，更新评论计数失败时回滚并重新抛出异常
   */
  async function createComment(
    dto: CreateCommentDto & { postId: string; userId: string },
  ): Promise<Comment> {
    const db = await deps.blogRepo.read();
    const post = db.posts.find((p) => p.id === dto.postId);
    if (!post) {
      throw new NotFoundError('文章不存在');
    }
    // 草稿文章不允许评论
    if (post.isDraft) {
      throw new ForbiddenError('草稿文章不可评论');
    }

    const user = await deps.userRepo.findById(dto.userId);
    if (!user) {
      throw new NotFoundError('用户不存在');
    }

    const now = new Date().toISOString();
    const comment: Comment = {
      id: generateId(),
      postId: dto.postId,
      userId: dto.userId,
      userName: `${user.firstName} ${user.lastName}`.trim() || user.username,
      userAvatar: user.avatar || undefined,
      content: sanitizeCommentContent(dto.content),
      createdAt: now,
      updatedAt: now,
    };

    await deps.commentRepo.create(comment);

    // 使用原子增量方法更新 commentsCount——若失败则回滚已创建的评论
    try {
      await deps.blogRepo.updateCommentsCount(dto.postId, 1);
    } catch (err) {
      await deps.commentRepo.delete(comment.id).catch((rollbackErr) => {
        logger.error('回滚评论创建失败', { commentId: comment.id, error: String(rollbackErr) });
      });
      throw err;
    }

    return comment;
  }

  /**
   * 编辑评论内容
   * @description 校验评论存在性和操作权限后更新评论内容和更新时间
   * @param id 评论 ID
   * @param content 新的评论内容
   * @param currentUserId 当前用户 ID
   * @returns 更新后的评论对象
   * @throws 评论不存在时抛出 NotFoundError，非作者操作时抛出 ForbiddenError，内容为空时抛出 ValidationError
   */
  async function updateComment(
    id: string,
    content: string,
    currentUserId: string,
  ): Promise<Comment> {
    const comment = await deps.commentRepo.findById(id);
    if (!comment) {
      throw new NotFoundError('评论不存在');
    }
    if (comment.userId !== currentUserId) {
      throw new ForbiddenError('无权编辑该评论');
    }

    const trimmed = sanitizeCommentContent(content);
    if (trimmed.length === 0) {
      throw new ValidationError('评论内容不能为空');
    }

    const now = new Date().toISOString();
    const updated = await deps.commentRepo.update(id, { content: trimmed, updatedAt: now });
    if (!updated) {
      throw new NotFoundError('评论不存在');
    }
    return updated;
  }

  /**
   * 删除评论
   * @description 校验评论存在性和操作权限（评论作者或文章作者）后删除评论，并原子递减文章评论计数
   * @param id 评论 ID
   * @param currentUserId 当前用户 ID
   * @throws 评论不存在时抛出 NotFoundError，无权删除时抛出 ForbiddenError
   */
  async function deleteComment(id: string, currentUserId: string): Promise<void> {
    const comment = await deps.commentRepo.findById(id);
    if (!comment) {
      throw new NotFoundError('评论不存在');
    }

    const db = await deps.blogRepo.read();
    const post = db.posts.find((p) => p.id === comment.postId);

    // 仅评论作者或文章作者可删除
    const isCommentAuthor = comment.userId === currentUserId;
    const isPostAuthor = post?.authorId === currentUserId;
    if (!isCommentAuthor && !isPostAuthor) {
      throw new ForbiddenError('无权删除该评论');
    }

    await deps.commentRepo.delete(id);

    if (post) {
      // 使用原子增量方法更新 commentsCount，避免竞态
      await deps.blogRepo.updateCommentsCount(comment.postId, -1);
    }
  }

  /**
   * 根据文章 ID 批量删除评论
   * @param postId 文章 ID
   * @returns 删除的评论数量
   */
  async function deleteCommentsByPostId(postId: string): Promise<number> {
    return deps.commentRepo.deleteByPostId(postId);
  }

  return { listComments, createComment, updateComment, deleteComment, deleteCommentsByPostId };
}
