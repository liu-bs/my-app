import 'server-only';
import { z } from 'zod';
import { ValidationError } from '@server/errors';
import { formatZodIssues, trimmedNonEmptyString } from '@server/utils/zod';
import type { CreatePostDto, UpdateSiteConfigDto, UpdatePostDto } from '@my-app/shared';

const postCreateSchema = z.object({
  title: trimmedNonEmptyString('标题', 200),
  summary: z.string().max(500, '摘要不能超过 500 个字符').optional(),
  content: trimmedNonEmptyString('正文', 200000),
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

const postUpdateSchema = postCreateSchema.partial();

const siteConfigSchema = z.object({
  blogName: z.string().max(100, '博客名称不能超过 100 个字符').optional(),
  author: z.string().max(100, '作者名不能超过 100 个字符').optional(),
});

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

export function parseCreatePostBody(body: unknown): CreatePostDto {
  const result = postCreateSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError('文章参数验证失败', formatZodIssues(result.error.issues));
  }
  return result.data as CreatePostDto;
}

export function parseUpdatePostBody(body: unknown): UpdatePostDto {
  const result = postUpdateSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError('文章参数验证失败', formatZodIssues(result.error.issues));
  }
  return result.data as UpdatePostDto;
}

export function parseUpdateSiteConfigBody(body: unknown): UpdateSiteConfigDto {
  const result = siteConfigSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError('站点配置参数验证失败', formatZodIssues(result.error.issues));
  }
  return result.data as UpdateSiteConfigDto;
}

export function parseListQuery(query: Record<string, string | string[] | undefined>): {
  draft?: boolean;
  category?: string;
  tag?: string;
  q?: string;
  page?: number;
  limit?: number;
} {
  // 将 Next.js 的 query 对象转换为 Zod 可解析的 plain object
  const plain: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(query)) {
    plain[key] = Array.isArray(value) ? value[0] : value;
  }
  const result = listQuerySchema.safeParse(plain);
  if (!result.success) {
    throw new ValidationError('列表查询参数验证失败', formatZodIssues(result.error.issues));
  }
  return result.data;
}
