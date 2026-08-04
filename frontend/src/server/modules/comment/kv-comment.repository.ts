import 'server-only';
import { getKV } from '@server/infrastructure/kv-mock';
import type { Comment, CommentRepository } from '@my-app/shared';
import { KVRepository } from '@server/infrastructure/kv-repository';

export type { CommentRepository };

export class KVCommentRepository extends KVRepository<Comment> implements CommentRepository {
  constructor() {
    super('comments');
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    const kv = getKV();
    // 优先使用 postId 索引集合
    const ids = await kv.smembers(`comments:post:${postId}`);
    if (ids.length > 0) {
      const jsons = await kv.hmget<string>(this.collectionKey, ...ids);
      const comments: Comment[] = [];
      for (const json of jsons) {
        if (json) comments.push(JSON.parse(json));
      }
      return comments;
    }
    // 回退到全量扫描（用于未建索引的旧数据）
    const all = await this.findAll();
    return all.filter((c) => c.postId === postId);
  }

  async deleteByPostId(postId: string): Promise<number> {
    const kv = getKV();
    const comments = await this.findByPostId(postId);
    if (comments.length === 0) return 0;
    const pipeline = kv.pipeline();
    for (const comment of comments) {
      pipeline.hdel(this.collectionKey, comment.id);
      pipeline.srem(`comments:post:${postId}`, comment.id);
    }
    await pipeline.exec();
    return comments.length;
  }

  async updateUserInfoByUserId(
    userId: string,
    userName: string,
    userAvatar?: string,
  ): Promise<number> {
    const kv = getKV();
    const comments = await this.findAll();
    let updatedCount = 0;
    const pipeline = kv.pipeline();
    for (const c of comments) {
      if (c.userId === userId) {
        updatedCount++;
        const updated = { ...c, userName, userAvatar: userAvatar || undefined };
        pipeline.hset(this.collectionKey, { [c.id]: JSON.stringify(updated) });
      }
    }
    if (updatedCount > 0) {
      await pipeline.exec();
    }
    return updatedCount;
  }

  // 覆盖 create 和 delete 以维护 postId 索引
  async create(comment: Comment): Promise<Comment> {
    const kv = getKV();
    await kv.sadd(`comments:post:${comment.postId}`, comment.id);
    return super.create(comment);
  }

  async delete(id: string): Promise<boolean> {
    const kv = getKV();
    const comment = await this.findById(id);
    if (comment) {
      await kv.srem(`comments:post:${comment.postId}`, id);
    }
    return super.delete(id);
  }
}
