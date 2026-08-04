import 'server-only';
import { z } from 'zod';
import { ValidationError } from '@server/errors';
import { formatZodIssues, trimmedNonEmptyString } from '@server/utils/zod';
import type { CreateCommentDto } from '@my-app/shared';

const createCommentSchema = z.object({
  content: trimmedNonEmptyString('评论内容', 2000),
});

export function parseCreateCommentBody(body: unknown): CreateCommentDto {
  const result = createCommentSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError('评论参数验证失败', formatZodIssues(result.error.issues));
  }
  return result.data as CreateCommentDto;
}
