/**
 * @file common.ts
 * @description 通用工具函数集合，提供 ID 生成和统一响应结构构建能力
 */

import { randomUUID } from 'node:crypto';

/**
 * 生成全局唯一 ID（UUID v4）
 */
export function generateId(): string {
  return randomUUID();
}
