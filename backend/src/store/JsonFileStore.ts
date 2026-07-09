/**
 * @file JsonFileStore.ts
 * @description 基于 JSON 文件的轻量级数据持久化存储，支持 CRUD、条件查询、计数与种子数据初始化
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 当前模块文件所在目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// 数据文件存储目录（位于 src 上一级的 data 目录）
const DATA_DIR = path.resolve(__dirname, '../../data');

/**
 * 确保数据目录和文件存在
 * @description 若数据文件不存在则递归创建目录，并以默认数据初始化
 * @param filename 数据文件名（如 "users.json"）
 * @param [defaultData] 文件不存在时写入的默认数据，默认空数组
 */
function ensureDataFile(filename: string, defaultData: unknown = []) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    // 目录不存在时一并创建
    fs.mkdirSync(DATA_DIR, { recursive: true });
    // 以 2 空格缩进、UTF-8 编码写入默认数据
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

/**
 * JSON 文件存储类
 * @description 提供基于 JSON 文件的 CRUD 操作，内置内存缓存减少重复磁盘 IO
 */
export class JsonFileStore {
  /** 内存缓存（key=集合名，value=解析后的数据），避免每次读取都访问磁盘 */
  private cache = new Map<string, unknown>();

  constructor() {
    // 初始化所有业务集合对应的数据文件
    ensureDataFile('users.json', []);
    ensureDataFile('articles.json', []);
    ensureDataFile('categories.json', []);
    ensureDataFile('tags.json', []);
    ensureDataFile('comments.json', []);
    ensureDataFile('notifications.json', []);
    ensureDataFile('favorites.json', []);
    ensureDataFile('newsletter.json', []);
  }

  /**
   * 读取整个集合
   * @template T 单条记录类型
   * @param collection 集合名称（对应 data 目录下的 JSON 文件名）
   * @returns 集合中的所有记录数组
   */
  async find<T>(collection: string): Promise<T[]> {
    // 命中缓存则直接返回，否则从磁盘读取并回填缓存
    const data = this.cache.get(collection) ?? this.readFromDisk(collection);
    this.cache.set(collection, data);
    return (data as T[]) ?? [];
  }

  /**
   * 按 ID 查找单条记录
   * @template T 必须包含 id 字段的记录类型
   * @param collection 集合名称
   * @param id 记录唯一标识
   * @returns 查找到的记录，未找到返回 undefined
   */
  async findById<T extends { id: string }>(collection: string, id: string): Promise<T | undefined> {
    const items = await this.find<T>(collection);
    return items.find((item) => (item as { id: string }).id === id);
  }

  /**
   * 条件查询
   * @template T 单条记录类型
   * @param collection 集合名称
   * @param predicate 过滤谓词函数，返回 true 的记录会被保留
   * @returns 符合条件的记录列表
   */
  async findWhere<T>(collection: string, predicate: (item: T) => boolean): Promise<T[]> {
    const items = await this.find<T>(collection);
    return items.filter(predicate);
  }

  /**
   * 新增记录
   * @template T 必须包含 id 字段的记录类型
   * @param collection 集合名称
   * @param item 待新增的完整记录对象
   * @returns 已写入的记录对象
   */
  async create<T extends { id: string }>(collection: string, item: T): Promise<T> {
    const items = await this.find<T>(collection);
    items.push(item);
    await this.writeToDisk(collection, items);
    return item;
  }

  /**
   * 更新记录
   * @template T 必须包含 id 字段的记录类型
   * @param collection 集合名称
   * @param id 记录唯一标识
   * @param partial 要更新的部分字段（id 不会被覆盖）
   * @returns 更新后的记录对象，未找到返回 undefined
   */
  async update<T extends { id: string }>(
    collection: string,
    id: string,
    partial: Partial<T>,
  ): Promise<T | undefined> {
    const items = await this.find<T>(collection);
    const index = items.findIndex((item) => (item as { id: string }).id === id);
    if (index === -1) return undefined;
    // 合并旧记录与新字段，并强制保留 id 不被 partial 覆盖
    items[index] = { ...items[index], ...partial, id };
    await this.writeToDisk(collection, items);
    return items[index];
  }

  /**
   * 删除记录
   * @param collection 集合名称
   * @param id 记录唯一标识
   * @returns 删除成功返回 true，未找到记录返回 false
   */
  async delete(collection: string, id: string): Promise<boolean> {
    const items = await this.find(collection);
    const index = items.findIndex((item) => (item as { id: string }).id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    await this.writeToDisk(collection, items);
    return true;
  }

  /**
   * 统计记录数
   * @param collection 集合名称
   * @param [predicate] 可选的过滤谓词，仅统计满足条件的记录
   * @returns 符合条件的记录数量
   */
  async count(collection: string, predicate?: (item: unknown) => boolean): Promise<number> {
    const items = await this.find(collection);
    if (predicate) return items.filter(predicate).length;
    return items.length;
  }

  /**
   * 初始化种子数据（仅在文件为空且种子非空时生效）
   * @description 不会覆盖已有数据，确保幂等
   * @param collection 集合名称
   * @param data 种子数据数组
   * @returns {Promise<void>} 写入完成 resolve
   */
  async seed(collection: string, data: unknown[]): Promise<void> {
    const items = await this.find(collection);
    // 仅在集合为空且种子数据非空时写入，避免覆盖用户已产生的数据
    if (items.length === 0 && data.length > 0) {
      await this.writeToDisk(collection, data);
    }
  }

  // ---- 私有方法 ----

  /**
   * 从磁盘读取集合数据
   * @param collection 集合名称
   * @returns 解析后的数据；文件不存在或解析失败时返回空数组
   */
  private readFromDisk(collection: string): unknown {
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    } catch {
      // 文件缺失或内容损坏时返回空数组，保证调用方拿到有效数据
      return [];
    }
  }

  /**
   * 将数据写入磁盘并更新内存缓存
   * @param collection 集合名称
   * @param data 要写入的完整数据
   * @returns {Promise<void>} 写入完成 resolve
   */
  private async writeToDisk(collection: string, data: unknown): Promise<void> {
    // 先更新缓存，保证后续读操作立即看到新数据
    this.cache.set(collection, data);
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}
