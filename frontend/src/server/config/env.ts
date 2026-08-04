import 'server-only';
import { randomBytes } from 'node:crypto';

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value === undefined || value === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getInt(key: string, fallback: number): number {
  const value = process.env[key];
  if (value === undefined || value === '') return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) throw new Error(`Environment variable ${key} must be a valid integer`);
  return parsed;
}

const NODE_ENV = getEnv('NODE_ENV', 'development');

// JWT_SECRET：生产环境必须配置，开发环境可 fallback 随机值
const JWT_SECRET = getEnv(
  'JWT_SECRET',
  NODE_ENV === 'production'
    ? undefined // 生产环境未配置时抛错，避免 serverless 冷启动密钥不一致
    : randomBytes(32).toString('hex'),
);

export const env = {
  NODE_ENV,
  isDev: NODE_ENV === 'development',
  isProd: NODE_ENV === 'production',
  JWT_SECRET,
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '7d'),
  BCRYPT_SALT_ROUNDS: getInt('BCRYPT_SALT_ROUNDS', 10),
  COOKIE_MAX_AGE_MS: getInt('COOKIE_MAX_AGE_MS', 7 * 24 * 60 * 60 * 1000),
} as const;
