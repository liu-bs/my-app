/**
 * @file blog.validators.ts
 * @description blog 模块请求参数校验，使用 Zod schema 对文章创建/更新、站点配置、列表查询的请求体进行验证与解析
 */

import type { Request } from 'express';
import { z } from 'zod';
import { ValidationError } from '@/errors';
import { formatZodIssues, trimmedNonEmptyString } from '@/utils/zod.ts';
import type { CreatePostDto, UpdateSiteConfigDto, UpdatePostDto } from '@my-app/shared';

/**
 * 构建去空白的非空正文校验器（无长度上限）
 * @param field 字段名称（用于错误提示）
 * @returns Zod schema
 */
const trimmedNonEmptyContent = (field: string, max = 200000) =>
  z
    .string()
    .min(1, `${field}不能为空`)
    .max(max, `${field}不能超过 ${max} 个字符`)
    .transform((v) => v.trim())
    .refine((v) => v.length > 0, { message: `${field}不能只包含空白字符` });

/** 文章创建请求体校验 schema */
const postCreateSchema = z.object({
  title: trimmedNonEmptyString('标题', 200),
  summary: z.string().max(500, '摘要不能超过 500 个字符').optional(),
  content: trimmedNonEmptyContent('正文'),
  category: trimmedNonEmptyString('分类', 50),
  tags: z
    .string()
    .max(300)
    .or(z.array(z.string().max(30)))
    .optional(),
  isDraft: z.boolean({ message: 'isDraft 必须是布尔值' }),
  pinned: z.boolean().optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
});

/** 文章更新请求体校验 schema（所有字段可选） */
const postUpdateSchema = postCreateSchema.partial();

/** 站点配置更新校验 schema */
const siteConfigSchema = z.object({
  blogName: z.string().max(100, '博客名称不能超过 100 个字符').optional(),
  author: z.string().max(100, '作者名不能超过 100 个字符').optional(),
});

/** 文章列表查询参数校验 schema（query string） */
const listQuerySchema = z.object({
  draft: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  category: z.string().max(50).optional(),
  tag: z.string().max(50).optional(),
  q: z.string().max(100).optional(),
  page: z
    .string()
    .optional()
    .transform((v) => {
      const n = Number(v);
      return Number.isFinite(n) && n > 0 ? n : undefined;
    }),
  limit: z
    .string()
    .optional()
    .transform((v) => {
      const n = Number(v);
      return Number.isFinite(n) && n > 0 ? n : undefined;
    }),
});

/**
 * 解析创建文章请求体
 * @param req Express 请求对象
 * @returns 验证通过的创建文章参数
 * @throws 参数校验失败时抛出 ValidationError
 */
export function parseCreatePostBody(req: Request): CreatePostDto {
  const result = postCreateSchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError('文章参数验证失败', formatZodIssues(result.error.issues));
  }
  return result.data as CreatePostDto;
}

/**
 * 解析更新文章请求体
 * @param req Express 请求对象
 * @returns 验证通过的更新文章参数
 * @throws 参数校验失败时抛出 ValidationError
 */
export function parseUpdatePostBody(req: Request): UpdatePostDto {
  const result = postUpdateSchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError('文章参数验证失败', formatZodIssues(result.error.issues));
  }
  return result.data as UpdatePostDto;
}

/**
 * 解析站点配置更新请求体
 * @param req Express 请求对象
 * @returns 验证通过的站点配置参数
 * @throws 参数校验失败时抛出 ValidationError
 */
export function parseUpdateSiteConfigBody(req: Request): UpdateSiteConfigDto {
  const result = siteConfigSchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError('站点配置参数验证失败', formatZodIssues(result.error.issues));
  }
  return result.data as UpdateSiteConfigDto;
}

/**
 * 解析文章列表查询参数
 * @param req Express 请求对象
 * @returns 验证通过的查询参数（草稿模式、分类、标签、关键词、分页）
 * @throws 参数校验失败时抛出 ValidationError
 */
export function parseListQuery(req: Request): {
  draft?: boolean;
  category?: string;
  tag?: string;
  q?: string;
  page?: number;
  limit?: number;
} {
  const result = listQuerySchema.safeParse(req.query);
  if (!result.success) {
    throw new ValidationError('列表查询参数验证失败', formatZodIssues(result.error.issues));
  }
  return result.data;
}
