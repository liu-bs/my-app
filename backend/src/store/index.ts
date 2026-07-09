/**
 * @file index.ts
 * @description 数据存储模块统一导出入口：对外暴露 JSON 文件存储类及全局单例获取函数
 */
import { JsonFileStore } from './JsonFileStore.js';

/** 全局单例实例（避免每次请求都创建新实例，确保内存缓存有效） */
let storeInstance: JsonFileStore | null = null;

/**
 * 获取全局存储实例
 * @description 单例模式，确保整个应用共享同一个存储实例，避免并发问题和缓存失效
 * @returns JsonFileStore 实例
 */
export function getStore(): JsonFileStore {
  if (!storeInstance) {
    storeInstance = new JsonFileStore();
  }
  return storeInstance;
}

export { JsonFileStore };
