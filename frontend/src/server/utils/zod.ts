/**
 * @file zod.ts
 * @description Zod 校验工具函数，供各模块 validator 复用
 */

import { z } from 'zod';

/**
 * 将 Zod 校验错误格式化为可读的 issue 数组
 */
export function formatZodIssues(issues: z.ZodIssue[]): Array<Record<string, unknown>> {
  return issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}

/**
 * 创建 trim + 非空 + 长度限制的字符串 schema
 */
export function trimmedNonEmptyString(field: string, max: number) {
  return z
    .string()
    .min(1, `${field}不能为空`)
    .max(max, `${field}不能超过 ${max} 个字符`)
    .transform((v) => v.trim())
    .refine((v) => v.length > 0, { message: `${field}不能只包含空白字符` });
}
