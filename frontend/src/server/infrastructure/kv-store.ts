import 'server-only';
import { getKV } from './kv-mock';
import { InternalServerError } from '@server/errors';

/**
 * KV 文档存储，替代 JsonDocumentStore。
 * 用于存储单一文档对象（如 BlogDB），通过 Upstash Redis 的 GET/SET 实现。
 * Redis SET 是原子操作，无需文件锁或写队列。
 */
export class KVDocumentStore<T> {
  private readonly key: string;
  private readonly defaultValue: T;

  constructor(key: string, defaultValue: T) {
    this.key = key;
    this.defaultValue = defaultValue;
  }

  async read(): Promise<T> {
    try {
      const kv = getKV();
      const data = await kv.get<T>(this.key);
      if (data === null) return this.defaultValue;
      return data;
    } catch {
      throw new InternalServerError(`读取数据失败: ${this.key}`);
    }
  }

  async write(data: T): Promise<void> {
    try {
      const kv = getKV();
      await kv.set(this.key, JSON.stringify(data));
    } catch {
      throw new InternalServerError(`写入数据失败: ${this.key}`);
    }
  }

  /**
   * 带重试的 read-modify-write 操作。
   * Redis 单实例下 SET 是原子的，但 read-modify-write 不是。
   * 保留重试以覆盖并发冲突，支持从 mutate 回调返回值。
   * ponytail: 非原子 read-modify-write，3 次重试在高并发写入下仍可能全部失败；升级路径为 Redis WATCH/MULTI 或 Lua 脚本。
   */
  async updateWithRetry<R>(mutate: (data: T) => R): Promise<R> {
    const MAX_RETRIES = 3;
    let lastError: unknown;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const data = await this.read();
        const result = mutate(data);
        await this.write(data);
        return result;
      } catch (err) {
        lastError = err;
        // 最后一次尝试不再等待
        if (attempt < MAX_RETRIES - 1) {
          await new Promise((resolve) => setTimeout(resolve, 50 * (attempt + 1)));
        }
      }
    }
    throw lastError instanceof Error
      ? lastError
      : new InternalServerError('更新数据失败（已重试）');
  }
}
