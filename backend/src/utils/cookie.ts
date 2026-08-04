/**
 * @file cookie.ts
 * @description Cookie 选项构建工具，为认证 token 和登录状态标记提供不同安全级别的 Cookie 配置
 */

import type { CookieOptions } from 'express';
import { env } from '@/config';

/**
 * 构建 HttpOnly Cookie 选项（用于认证 token）
 * @description 设置 httpOnly 为 true，前端 JS 无法读取，防止 XSS 窃取
 * @returns CookieOptions
 */
export function buildCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: env.COOKIE_MAX_AGE_MS,
  };
}

/**
 * 构建非 HttpOnly Cookie 选项（用于登录状态标记）
 * @description 设置 httpOnly 为 false，允许前端 JS 读取登录状态
 * @returns CookieOptions
 */
export function buildStatusCookieOptions(): CookieOptions {
  return {
    httpOnly: false,
    secure: env.isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: env.COOKIE_MAX_AGE_MS,
  };
}

/**
 * 构建清除 HttpOnly Cookie 的选项
 * @description 用于登出时清除认证 token Cookie
 * @returns CookieOptions
 */
export function buildClearCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax',
    path: '/',
  };
}

/**
 * 构建清除非 HttpOnly Cookie 的选项
 * @description 用于登出时清除登录状态标记 Cookie
 * @returns CookieOptions
 */
export function buildClearStatusCookieOptions(): CookieOptions {
  return {
    httpOnly: false,
    secure: env.isProd,
    sameSite: 'lax',
    path: '/',
  };
}
