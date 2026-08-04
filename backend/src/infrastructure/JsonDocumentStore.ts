/**
 * @file JsonDocumentStore.ts
 * @description 通用对象型 JSON 文件存储，提供缓存失效检测、写队列串行化、proper-lockfile 文件锁与 Windows 原子写入策略
 */

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import lockfile from 'proper-lockfile';
import { env } from '@/config';
import type { WriteTask } from '@my-app/shared';

/**
 * 通用对象型 JSON 文件存储。
 *
 * {@link JsonFileStore}（数组型存储）内部委托本类实现，因此全站 JSON 文件存储
 * 共用同一套缓存失效、写队列、proper-lockfile 文件锁与 Windows 原子写入策略。
 * 未来替换为真实数据库时，只需替换对应 store 实现即可。
 */
export class JsonDocumentStore<T> {
  /** 数据文件绝对路径 */
  private readonly filePath: string;
  /** 文件锁路径 */
  private readonly lockFilePath: string;
  /** 数据缺失时的默认值 */
  private readonly defaultValue: T;
  /** 内存缓存，null 表示未缓存 */
  private cache: T | null = null;
  /** 缓存对应的文件修改时间，用于失效检测 */
  private cacheMtimeMs = 0;
  /** 缓存版本号，每次写入自增，供乐观锁比较 */
  private cacheVersion = 0;
  /** 待写入任务队列 */
  private writeQueue: Array<WriteTask<T>> = [];
  /** 是否正在执行写入 */
  private isWriting = false;

  /**
   * 初始化 JSON 文档存储
   * @param filename 数据文件名（相对于 DATA_DIR）
   * @param defaultValue 数据缺失时的默认值
   */
  constructor(filename: string, defaultValue: T) {
    this.filePath = path.join(env.DATA_DIR, filename);
    this.lockFilePath = `${this.filePath}.lock`;
    this.defaultValue = defaultValue;
  }

  /**
   * 从磁盘读取并反序列化 JSON 数据
   * @returns 解析后的数据，读取失败时返回默认值
   */
  private async readFromDisk(): Promise<T> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(raw) as T;
    } catch {
      return this.defaultValue;
    }
  }

  /**
   * 将数据原子写入磁盘
   * @description 使用 proper-lockfile 文件锁和临时文件 rename 实现原子写入，写入后更新缓存
   * @param data 待写入的数据
   */
  private async writeToDisk(data: T): Promise<void> {
    let release: (() => Promise<void>) | undefined;
    const tempPath = `${this.filePath}.tmp`;

    try {
      await fs.mkdir(env.DATA_DIR, { recursive: true });

      // proper-lockfile 在 Windows 上对不存在的目标文件调用 lstat 会抛 ENOENT，
      // 因此先以原子方式创建占位文件（已存在则忽略 EEXIST）
      await fs
        .writeFile(this.filePath, JSON.stringify(this.defaultValue, null, 2), { flag: 'wx' })
        .catch(() => {
          // 文件已存在或创建失败均忽略
        });

      release = await lockfile.lock(this.filePath, {
        lockfilePath: this.lockFilePath,
        stale: 5000,
      });

      await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');

      // Windows 下 fs.rename 目标存在时会失败，先删除目标文件
      if (os.platform() === 'win32') {
        await fs.unlink(this.filePath).catch(() => {
          // 文件不存在时忽略错误
        });
      }

      await fs.rename(tempPath, this.filePath);

      const stat = await fs.stat(this.filePath);
      this.cache = data;
      this.cacheMtimeMs = stat.mtimeMs;
      this.cacheVersion++;
    } finally {
      await fs.unlink(tempPath).catch(() => {
        // 忽略清理错误
      });
      if (release) {
        await release().catch(() => {
          // 忽略释放锁错误
        });
      }
    }
  }

  /**
   * 串行处理写队列中的任务
   * @description 确保同一时间只有一个写入操作在执行，避免并发写入冲突
   */
  private async processQueue(): Promise<void> {
    if (this.isWriting) {
      return;
    }
    this.isWriting = true;

    while (this.writeQueue.length > 0) {
      const task = this.writeQueue.shift();
      if (!task) {
        continue;
      }
      try {
        await this.writeToDisk(task.data);
        task.resolve();
      } catch (err) {
        task.reject(err);
      }
    }

    this.isWriting = false;
  }

  /**
   * 读取数据，优先返回缓存，通过文件 mtime 检测缓存失效
   * @returns 当前存储的数据（深拷贝，防止调用方直接修改缓存导致数据不一致）
   */
  async read(): Promise<T> {
    if (this.cache !== null) {
      try {
        const stat = await fs.stat(this.filePath);
        if (stat.mtimeMs <= this.cacheMtimeMs) {
          return structuredClone(this.cache);
        }
      } catch {
        // 文件不存在或 stat 失败时回退到磁盘读取
      }
    }

    const data = await this.readFromDisk();
    this.cache = data;
    try {
      const stat = await fs.stat(this.filePath);
      this.cacheMtimeMs = stat.mtimeMs;
    } catch {
      this.cacheMtimeMs = 0;
    }
    return structuredClone(data);
  }

  /**
   * 写入数据，将写入任务加入队列异步执行
   * @param data 待写入的数据
   */
  async write(data: T): Promise<void> {
    return new Promise((resolve, reject) => {
      this.writeQueue.push({ data, resolve, reject });
      this.processQueue();
    });
  }

  /**
   * 获取当前缓存版本号，用于乐观锁比较
   * @returns 版本号
   */
  getVersion(): number {
    return this.cacheVersion;
  }
}
