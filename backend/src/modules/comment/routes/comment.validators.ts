/**
 * @file comment.validators.ts
 * @description 评论模块的请求参数校验，使用 Zod schema 对评论内容进行非空、长度和去空白校验
 */

import type { Request } from 'express';
import { z } from 'zod';
import { ValidationError } from '@/errors';
import { formatZodIssues, trimmedNonEmptyString } from '@/utils/zod.ts';
import type { CreateCommentDto } from '@my-app/shared';

/** 创建评论的 Zod schema，校验评论内容字段 */
const createCommentSchema = z.object({
  content: trimmedNonEmptyString('评论内容', 2000),
});

/**
 * 解析并校验创建评论的请求体
 * @param req Express 请求对象
 * @returns 校验后的 CreateCommentDto
 * @throws 校验失败时抛出 ValidationError
 */
export function parseCreateCommentBody(req: Request): CreateCommentDto {
  const result = createCommentSchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError('评论参数验证失败', formatZodIssues(result.error.issues));
  }
  return result.data as CreateCommentDto;
}
