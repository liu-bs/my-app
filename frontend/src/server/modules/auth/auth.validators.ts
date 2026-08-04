import 'server-only';
import { z } from 'zod';
import { ValidationError } from '@server/errors';
import { formatZodIssues } from '@server/utils/zod';

const passwordSchema = z.string().min(6, '密码长度不能少于6位').max(128, '密码长度不能超过128位');

export const registerSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: passwordSchema,
  firstName: z.preprocess(
    (val) => (typeof val === 'string' ? val.trim() : val),
    z.string().min(1, 'firstName 不能为空').max(50, 'firstName 不能超过50个字符'),
  ),
  lastName: z.preprocess(
    (val) => (typeof val === 'string' ? val.trim() : val),
    z.string().min(1, 'lastName 不能为空').max(50, 'lastName 不能超过50个字符'),
  ),
  username: z.preprocess(
    (val) => (typeof val === 'string' ? val.trim() : val),
    z
      .string()
      .min(3, '用户名长度不能少于3位')
      .max(30, '用户名长度不能超过30位')
      .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  ),
});

export const loginSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(1, '密码不能为空'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, '当前密码不能为空'),
    newPassword: passwordSchema,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: '新密码不能与当前密码相同',
    path: ['newPassword'],
  });

export const updateProfileSchema = z.object({
  firstName: z.string().max(50, '名不能超过50个字符').optional(),
  lastName: z.string().max(50, '姓不能超过50个字符').optional(),
  avatar: z
    .string()
    .max(500, '头像URL不能超过500个字符')
    .refine((url) => url === '' || /^https?:\/\//.test(url), '头像URL必须以 http:// 或 https:// 开头')
    .optional(),
  bio: z.string().max(280, '简介不能超过280个字符').optional(),
  location: z.string().max(100, '所在地不能超过100个字符').optional(),
  website: z
    .string()
    .max(200, '网站URL不能超过200个字符')
    .refine((url) => url === '' || /^https?:\/\//.test(url), '网站URL必须以 http:// 或 https:// 开头')
    .optional(),
});

export function parseRegisterBody(body: unknown): {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
} {
  const result = registerSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError('注册参数验证失败', formatZodIssues(result.error.issues));
  }
  return {
    ...result.data,
    email: result.data.email.toLowerCase(),
  };
}

export function parseLoginBody(body: unknown): { email: string; password: string } {
  const result = loginSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError('登录参数验证失败', formatZodIssues(result.error.issues));
  }
  return {
    ...result.data,
    email: result.data.email.toLowerCase(),
  };
}

export function parseChangePasswordBody(body: unknown): {
  currentPassword: string;
  newPassword: string;
} {
  const result = changePasswordSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError('修改密码参数验证失败', formatZodIssues(result.error.issues));
  }
  return result.data;
}

export function parseUpdateProfileBody(body: unknown): Record<string, string | undefined> {
  const result = updateProfileSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError('资料参数验证失败', formatZodIssues(result.error.issues));
  }
  const data: Record<string, string | undefined> = {};
  const { firstName, lastName, avatar, bio, location, website } = result.data;
  if (firstName !== undefined) data.firstName = firstName.trim();
  if (lastName !== undefined) data.lastName = lastName.trim();
  if (avatar !== undefined) data.avatar = avatar;
  if (bio !== undefined) data.bio = bio.trim();
  if (location !== undefined) data.location = location.trim();
  if (website !== undefined) data.website = website.trim();
  return data;
}
