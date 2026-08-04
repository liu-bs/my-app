/**
 * @file comment.ts
 * @description 评论模块后端服务与仓储层接口，定义评论的增删改查及按文章批量删除、用户信息同步等业务操作契约
 */

import type { Comment, CreateCommentDto, ListCommentsOptions } from '../comment';

/**
 * 评论业务服务接口
 */
export interface CommentService {
  /** 获取评论列表 */
  listComments(options: ListCommentsOptions): Promise<Comment[]>;
  /** 创建评论 */
  createComment(dto: CreateCommentDto & { postId: string; userId: string }): Promise<Comment>;
  /** 更新评论内容 */
  updateComment(id: string, content: string, currentUserId: string): Promise<Comment>;
  /** 删除评论 */
  deleteComment(id: string, currentUserId: string): Promise<void>;
  /** 按文章 ID 批量删除评论，返回删除条数 */
}

/**
 * 评论数据仓储接口（底层持久化操作）
 */
export interface CommentRepository {
  /** 查询全部评论 */
  findAll(): Promise<Comment[]>;
  /** 按 ID 查询评论 */
  findById(id: string): Promise<Comment | undefined>;
  /** 按文章 ID 查询评论列表 */
  findByPostId(postId: string): Promise<Comment[]>;
  /** 创建评论 */
  create(comment: Comment): Promise<Comment>;
  /** 部分更新评论 */
  update(id: string, partial: Partial<Comment>): Promise<Comment | undefined>;
  /** 删除评论 */
  delete(id: string): Promise<boolean>;
  /** 按文章 ID 删除全部评论，返回删除条数 */
  deleteByPostId(postId: string): Promise<number>;
  /** 按 用户ID 批量更新评论中的用户名与头像，返回更新条数 */
  updateUserInfoByUserId(userId: string, userName: string, userAvatar?: string): Promise<number>;
  /** 种子数据初始化 */
  seed(data: Comment[]): Promise<void>;
}
