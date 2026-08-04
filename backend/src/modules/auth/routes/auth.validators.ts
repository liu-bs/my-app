/**
 * @file auth.validators.ts
 * @description auth 模块请求参数校验，使用 Zod schema 对注册、登录、修改密码的请求体进行验证与解析
 */

import { z } from 'zod';
import type { Request } from 'express';
import { ValidationError } from '@/errors';
import { formatZodIssues } from '@/utils/zod.ts';

/** 密码格式校验 schema：长度 6-128 位 */
const passwordSchema = z.string().min(6, '密码长度不能少于6位').max(128, '密码长度不能超过128位');

/** 注册请求体校验 schema */
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

/** 登录请求体校验 schema */
export const loginSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(1, '密码不能为空'),
});

/** 修改密码请求体校验 schema，额外校验新密码不可与当前密码相同 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, '当前密码不能为空'),
    newPassword: passwordSchema,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: '新密码不能与当前密码相同',
    path: ['newPassword'],
  });

/**
 * 解析注册请求体
 * @param req Express 请求对象
 * @returns 验证通过的注册参数（邮箱已转小写）
 * @throws 参数校验失败时抛出 ValidationError
 */
export function parseRegisterBody(req: Request): {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
} {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError('注册参数验证失败', formatZodIssues(result.error.issues));
  }
  return {
    ...result.data,
    email: result.data.email.toLowerCase(),
  };
}

/**
 * 解析登录请求体
 * @param req Express 请求对象
 * @returns 验证通过的登录参数（邮箱已转小写）
 * @throws 参数校验失败时抛出 ValidationError
 */
export function parseLoginBody(req: Request): { email: string; password: string } {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError('登录参数验证失败', formatZodIssues(result.error.issues));
  }
  return {
    ...result.data,
    email: result.data.email.toLowerCase(),
  };
}

/**
 * 解析修改密码请求体
 * @param req Express 请求对象
 * @returns 验证通过的修改密码参数
 * @throws 参数校验失败时抛出 ValidationError
 */
export function parseChangePasswordBody(req: Request): {
  currentPassword: string;
  newPassword: string;
} {
  const result = changePasswordSchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError('修改密码参数验证失败', formatZodIssues(result.error.issues));
  }
  return result.data;
}

/** 更新个人资料请求体校验 schema（所有字段可选，带长度上限） */
export const updateProfileSchema = z.object({
  firstName: z.string().max(50, '名不能超过50个字符').optional(),
  lastName: z.string().max(50, '姓不能超过50个字符').optional(),
  avatar: z
    .string()
    .max(500, '头像URL不能超过500个字符')
    .refine((url) => /^https?:\/\//.test(url), '头像URL必须以 http:// 或 https:// 开头')
    .optional(),
  bio: z.string().max(280, '简介不能超过280个字符').optional(),
  location: z.string().max(100, '所在地不能超过100个字符').optional(),
  website: z
    .string()
    .max(200, '网站URL不能超过200个字符')
    .refine((url) => /^https?:\/\//.test(url), '网站URL必须以 http:// 或 https:// 开头')
    .optional(),
});

/**
 * 解析更新个人资料请求体
 * @param req Express 请求对象
 * @returns 验证通过的字段对象
 * @throws 参数校验失败时抛出 ValidationError
 */
export function parseUpdateProfileBody(req: Request): Record<string, string | undefined> {
  const result = updateProfileSchema.safeParse(req.body);
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
