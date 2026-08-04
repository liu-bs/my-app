import 'server-only';
import { getKV } from './kv-mock';
import { InternalServerError } from '@server/errors';
import { logger } from '@server/utils/logger';

/**
 * KV 仓储抽象基类，替代 JsonRepository。
 * 使用 Redis Hash 存储实体集合：HSET {collectionKey} {id} {JSON}
 * 提供 CRUD 操作，Redis 原子操作无需乐观锁。
 */
export abstract class KVRepository<T extends { id: string }> {
  protected readonly collectionKey: string;

  constructor(collectionKey: string) {
    this.collectionKey = collectionKey;
  }

  async findAll(): Promise<T[]> {
    try {
      const kv = getKV();
      const raw = await kv.hgetall<Record<string, string>>(this.collectionKey);
      if (!raw) return [];
      return Object.values(raw).map((json) => JSON.parse(json) as T);
    } catch (err) {
      logger.error('读取数据失败', { collection: this.collectionKey, error: String(err) });
      throw new InternalServerError('读取数据失败');
    }
  }

  async findById(id: string): Promise<T | undefined> {
    try {
      const kv = getKV();
      const json = await kv.hget<string>(this.collectionKey, id);
      if (!json) return undefined;
      return JSON.parse(json) as T;
    } catch (err) {
      if (err instanceof InternalServerError) throw err;
      logger.error('读取数据失败', { collection: this.collectionKey, id, error: String(err) });
      throw new InternalServerError('读取数据失败');
    }
  }

  async create(item: T): Promise<T> {
    try {
      const kv = getKV();
      await kv.hset(this.collectionKey, { [item.id]: JSON.stringify(item) });
      return item;
    } catch (err) {
      logger.error('创建数据失败', { collection: this.collectionKey, error: String(err) });
      throw new InternalServerError('创建数据失败');
    }
  }

  async update(id: string, partial: Partial<T>): Promise<T | undefined> {
    try {
      const kv = getKV();
      const json = await kv.hget<string>(this.collectionKey, id);
      if (!json) return undefined;
      const existing = JSON.parse(json) as T;
      const updated = { ...existing, ...partial, id };
      await kv.hset(this.collectionKey, { [id]: JSON.stringify(updated) });
      return updated;
    } catch (err) {
      if (err instanceof InternalServerError) throw err;
      logger.error('更新数据失败', { id, error: String(err) });
      throw new InternalServerError('更新数据失败');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const kv = getKV();
      const result = await kv.hdel(this.collectionKey, id);
      return result > 0;
    } catch (err) {
      logger.error('删除数据失败', { collection: this.collectionKey, id, error: String(err) });
      throw new InternalServerError('删除数据失败');
    }
  }

  async seed(data: T[]): Promise<void> {
    const existing = await this.findAll();
    if (existing.length === 0 && data.length > 0) {
      try {
        const kv = getKV();
        const entries: Record<string, string> = {};
        for (const item of data) {
          entries[item.id] = JSON.stringify(item);
        }
        await kv.hset(this.collectionKey, entries);
      } catch (err) {
        logger.error('初始化数据失败', { collection: this.collectionKey, error: String(err) });
        throw new InternalServerError('初始化数据失败');
      }
    }
  }
}
