/**
 * @file common.ts
 * @description 通用工具函数集合，提供 ID 生成和统一响应结构构建能力
 */

import { v4 as uuidv4 } from 'uuid';
import type { ApiResponse } from '@my-app/shared';

/**
 * 生成全局唯一 ID（UUID v4）
 * @returns UUID v4 字符串
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * 构建统一的成功响应结构
 * @param data 响应数据
 * @param message 响应消息
 * @returns 统一格式的 ApiResponse
 */
export function createSuccessResponse<T>(data: T, message = '操作成功'): ApiResponse<T> {
  return { code: 0, data, message };
}
