/**
 * @file index.ts
 * @description 应用全环境变量集中读取与校验，统一导出 env 配置对象供全站使用
 */

import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 读取字符串类型环境变量，缺失时使用 fallback 或抛出异常
 * @param key 环境变量名
 * @param fallback 缺省值（可选）
 * @returns 环境变量值
 * @throws 无 fallback 且变量未设置时抛出 Error
 */
function getEnv(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value === undefined || value === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * 读取整数类型环境变量，缺失时使用 fallback
 * @param key 环境变量名
 * @param fallback 缺省值
 * @returns 解析后的整数值
 * @throws 值无法解析为整数时抛出 Error
 */
function getInt(key: string, fallback: number): number {
  const value = process.env[key];
  if (value === undefined || value === '') return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) throw new Error(`Environment variable ${key} must be a valid integer`);
  return parsed;
}

/**
 * 将逗号分隔的字符串解析为 CORS 来源数组
 * @param value 逗号分隔的原始字符串
 * @returns 去除空白后的来源数组
 */
function parseOrigins(value: string): string[] {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

/** 运行环境标识 */
const NODE_ENV = getEnv('NODE_ENV', 'development');
/** JWT 签名密钥，生产环境要求至少 32 字符；开发环境随机生成避免入仓泄露 */
const JWT_SECRET = getEnv(
  'JWT_SECRET',
  NODE_ENV === 'production' ? undefined : randomBytes(32).toString('hex'),
);

if (NODE_ENV === 'production' && JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long in production');
}

/**
 * 全局环境配置对象
 * @description 集中管理所有环境变量，包含运行环境、端口、JWT、CORS、限流、数据目录等配置
 */
export const env = {
  /** 运行环境 */
  NODE_ENV,
  /** 是否为开发环境 */
  isDev: NODE_ENV === 'development',
  /** 是否为生产环境 */
  isProd: NODE_ENV === 'production',
  /** 服务监听端口 */
  PORT: getInt('PORT', 3001),
  /** JWT 签名密钥 */
  JWT_SECRET,
  /** JWT 过期时间 */
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '7d'),
  /** bcrypt 加密轮数 */
  BCRYPT_SALT_ROUNDS: getInt('BCRYPT_SALT_ROUNDS', 10),
  /** 允许的 CORS 来源列表 */
  CORS_ORIGINS: parseOrigins(getEnv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:3004')),
  /** Cookie 最大存活时间，单位ms */
  COOKIE_MAX_AGE_MS: getInt('COOKIE_MAX_AGE_MS', 7 * 24 * 60 * 60 * 1000),
  /** 全局限流窗口时间，单位ms */
  RATE_LIMIT_WINDOW_MS: getInt('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
  /** 全局限流窗口内最大请求数 */
  RATE_LIMIT_MAX: getInt('RATE_LIMIT_MAX', NODE_ENV === 'production' ? 100 : 10_000),
  /** 认证接口限流窗口时间，单位ms */
  AUTH_RATE_LIMIT_WINDOW_MS: getInt('AUTH_RATE_LIMIT_WINDOW_MS', 5 * 60 * 1000),
  /** 认证接口限流窗口内最大请求数 */
  AUTH_RATE_LIMIT_MAX: getInt('AUTH_RATE_LIMIT_MAX', NODE_ENV === 'production' ? 5 : 1000),
  /** 种子用户初始密码 */
  SEED_PASSWORD: getEnv('SEED_PASSWORD', 'SeedPass123!'),
  /** JSON 数据文件存储目录 */
  DATA_DIR: path.resolve(__dirname, '../../data'),
} as const;
