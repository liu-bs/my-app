/**
 * @file comment.repository.ts
 * @description 评论模块的 JSON 文件 repository 实现，基于 JsonRepository 提供评论数据的 CRUD 及按文章/用户维度的批量操作
 */

import type { Comment, CommentRepository } from '@my-app/shared';
import { JsonRepository } from '@/infrastructure/JsonRepository.ts';

export type { CommentRepository };
/**
 * 基于 JSON 文件的评论 repository 默认实现
 * @description 使用 comments.json 作为持久化文件，提供评论的查询、删除及用户信息同步能力
 */
export class CommentJsonRepository extends JsonRepository<Comment> implements CommentRepository {
  /**
   * 初始化评论 repository，指定数据文件为 comments.json
   */
  constructor() {
    super('comments.json');
  }

  /**
   * 根据文章 ID 查询该文章下的全部评论
   * @param postId 文章 ID
   * @returns 评论列表
   */
  async findByPostId(postId: string): Promise<Comment[]> {
    const comments = await this.findAll();
    return comments.filter((c) => c.postId === postId);
  }

  /**
   * 根据文章 ID 删除该文章下的全部评论
   * @param postId 文章 ID
   * @returns 已删除的评论数量
   */
  async deleteByPostId(postId: string): Promise<number> {
    const comments = await this.findAll();
    const remaining = comments.filter((c) => c.postId !== postId);
    const deletedCount = comments.length - remaining.length;
    if (deletedCount > 0) {
      await this.store.write(remaining);
    }
    return deletedCount;
  }

  /**
   * 根据用户 ID 批量更新评论中的用户信息（昵称和头像）
   * @param userId 用户 ID
   * @param userName 用户名称
   * @param userAvatar 用户头像 URL（可选）
   * @returns 更新的评论数量
   */
  async updateUserInfoByUserId(
    userId: string,
    userName: string,
    userAvatar?: string,
  ): Promise<number> {
    const comments = await this.findAll();
    let updatedCount = 0;
    const updated = comments.map((c) => {
      if (c.userId === userId) {
        updatedCount++;
        return { ...c, userName, userAvatar: userAvatar || undefined };
      }
      return c;
    });
    if (updatedCount > 0) {
      await this.store.write(updated);
    }
    return updatedCount;
  }
}
