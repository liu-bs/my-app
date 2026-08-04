/**
 * @file JsonRepository.ts
 * @description 通用 JSON repository 抽象基类，提供基于 JsonFileStore 的 CRUD 操作及乐观锁重试机制
 */

import { JsonFileStore } from '@/infrastructure/JsonFileStore.ts';
import { InternalServerError } from '@/errors';
import { logger } from '@/utils/logger.ts';

/**
 * 通用 JSON repository 抽象基类
 * @description 基于 JsonFileStore 提供 CRUD 操作，更新和删除支持乐观锁重试
 */
export abstract class JsonRepository<T extends { id: string }> {
  /** 底层文件存储实例 */
  protected readonly store: JsonFileStore<T>;

  /**
   * 初始化 repository，通过文件名获取单例 JsonFileStore
   * @param filename 数据文件名
   */
  constructor(filename: string) {
    this.store = JsonFileStore.getInstance<T>(filename);
  }

  /**
   * 查询全部数据
   * @returns 数据数组
   * @throws 读取失败时抛出 InternalServerError
   */
  async findAll(): Promise<T[]> {
    try {
      return await this.store.findAll();
    } catch {
      throw new InternalServerError('读取数据失败');
    }
  }

  /**
   * 根据 ID 查询单条数据
   * @param id 数据 ID
   * @returns 匹配的数据，未找到时返回 undefined
   */
  async findById(id: string): Promise<T | undefined> {
    const items = await this.findAll();
    return items.find((item) => item.id === id);
  }

  /**
   * 创建新数据
   * @param item 待创建的数据
   * @returns 创建成功的数据
   * @throws 写入失败时抛出 InternalServerError
   */
  async create(item: T): Promise<T> {
    try {
      const items = await this.findAll();
      items.push(item);
      await this.store.write(items);
      return item;
    } catch {
      throw new InternalServerError('创建数据失败');
    }
  }

  /**
   * 更新数据（带乐观锁重试）。
   *
   * 在 JSON 文件存储中，read->modify->write 不是原子操作。
   * 通过比较写入前后的版本号检测并发修改，冲突时自动重试一次。
   * 单用户博客场景下并发概率极低，一次重试已足够覆盖。
   * @param id 数据 ID
   * @param partial 需更新的部分字段
   * @param retryCount 当前重试次数（内部使用）
   * @returns 更新后的数据，未找到时返回 undefined
   * @throws 写入失败时抛出 InternalServerError
   */
  async update(id: string, partial: Partial<T>, retryCount = 0): Promise<T | undefined> {
    const MAX_RETRIES = 1;
    try {
      const items = await this.findAll();
      const versionBefore = this.store.getVersion();

      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return undefined;

      items[index] = { ...items[index], ...partial, id };

      await this.store.write(items);

      // 写入后检查版本：如果版本已变（被其他写入抢先），且还有重试次数，则重试
      if (this.store.getVersion() !== versionBefore + 1 && retryCount < MAX_RETRIES) {
        logger.warn('乐观锁冲突，重试更新', { id, retryCount: retryCount + 1 });
        return this.update(id, partial, retryCount + 1);
      }

      return items[index];
    } catch {
      throw new InternalServerError('更新数据失败');
    }
  }

  /**
   * 删除数据（带乐观锁重试）。
   * @param id 数据 ID
   * @param retryCount 当前重试次数（内部使用）
   * @returns 删除成功返回 true，未找到返回 false
   * @throws 删除失败时抛出 InternalServerError
   */
  async delete(id: string, retryCount = 0): Promise<boolean> {
    const MAX_RETRIES = 1;
    try {
      const items = await this.findAll();
      const versionBefore = this.store.getVersion();

      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return false;

      items.splice(index, 1);
      await this.store.write(items);

      if (this.store.getVersion() !== versionBefore + 1 && retryCount < MAX_RETRIES) {
        logger.warn('乐观锁冲突，重试删除', { id, retryCount: retryCount + 1 });
        return this.delete(id, retryCount + 1);
      }

      return true;
    } catch {
      throw new InternalServerError('删除数据失败');
    }
  }

  /**
   * 初始化种子数据，仅在数据为空时写入
   * @param data 种子数据数组
   * @throws 写入失败时抛出 InternalServerError
   */
  async seed(data: T[]): Promise<void> {
    const items = await this.findAll();
    if (items.length === 0 && data.length > 0) {
      try {
        await this.store.write(data);
      } catch {
        throw new InternalServerError('初始化数据失败');
      }
    }
  }
}
