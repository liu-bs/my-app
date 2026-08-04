/**
 * @file JsonFileStore.ts
 * @description 通用数组型 JSON 文件存储，基于 JsonDocumentStore 实现，通过单例工厂保证同一文件全局只有一个 store 实例
 */

import { JsonDocumentStore } from '@/infrastructure/JsonDocumentStore.ts';

/** 已创建的 store 实例缓存，key 为文件名 */
const stores = new Map<string, JsonFileStore<{ id: string }>>();

/**
 * 通用数组型 JSON 文件存储。
 *
 * 现在基于 {@link JsonDocumentStore} 实现，复用同一套缓存失效、写队列、
 * proper-lockfile 文件锁与 Windows 原子写入策略。
 * 未来替换为真实数据库时，只需替换底层 store 实现或本层即可。
 */
export class JsonFileStore<T extends { id: string }> {
  /** 底层文档存储实例 */
  private readonly store: JsonDocumentStore<T[]>;

  /**
   * 私有构造函数，通过 getInstance 获取实例
   * @param filename 数据文件名
   */
  private constructor(filename: string) {
    this.store = new JsonDocumentStore<T[]>(filename, []);
  }

  /**
   * 获取指定文件名的单例 store 实例
   * @param filename 数据文件名
   * @returns JsonFileStore 实例
   */
  static getInstance<T extends { id: string }>(filename: string): JsonFileStore<T> {
    const existing = stores.get(filename);
    if (existing) {
      return existing as JsonFileStore<T>;
    }
    const store = new JsonFileStore<T>(filename);
    stores.set(filename, store as JsonFileStore<{ id: string }>);
    return store;
  }

  /**
   * 读取全部数据
   * @returns 数据数组
   */
  async findAll(): Promise<T[]> {
    return this.store.read();
  }

  /**
   * 写入全部数据
   * @param data 数据数组
   */
  async write(data: T[]): Promise<void> {
    return this.store.write(data);
  }

  /**
   * 暴露底层存储版本号，供 JsonRepository 乐观锁使用
   * @returns 当前版本号
   */
  getVersion(): number {
    return this.store.getVersion();
  }
}
