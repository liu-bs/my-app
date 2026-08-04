/**
 * @file zod.ts
 * @description Zod 校验工具函数，供各模块 validator 复用
 */

import { z } from 'zod';

/**
 * 将 Zod 校验错误格式化为可读的 issue 数组
 * @param issues Zod 校验产生的 issue 列表
 * @returns 格式化后的错误信息数组
 */
export function formatZodIssues(issues: z.ZodIssue[]): Array<Record<string, unknown>> {
  return issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}

/**
 * 构建去空白的非空字符串校验器
 * @param field 字段名称（用于错误提示）
 * @param max 最大长度限制
 * @returns Zod schema
 */
export const trimmedNonEmptyString = (field: string, max: number) =>
  z
    .string()
    .min(1, `${field}不能为空`)
    .max(max, `${field}不能超过 ${max} 个字符`)
    .transform((v) => v.trim())
    .refine((v) => v.length > 0, { message: `${field}不能只包含空白字符` });
