/**
 * @file logger.ts
 * @description 轻量级日志工具，支持 debug/info/warn/error 四级日志，生产环境输出 JSON 格式，开发环境输出带颜色的控制台格式
 */

import { env } from '@server/config/env';
import type { LogLevel } from '@my-app/shared';

/**
 * 日志级别优先级映射
 */
const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/** 当前环境配置的日志级别 */
const configuredLevel: LogLevel = env.isProd ? 'info' : 'debug';

/**
 * 判断指定日志级别是否达到输出阈值
 * @param level 日志级别
 * @returns 是否启用
 */
function isEnabled(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[configuredLevel];
}

/**
 * 格式化当前时间戳为 ISO 8601 字符串
 * @returns ISO 格式时间戳
 */
function formatTimestamp(): string {
  return new Date().toISOString();
}

/**
 * 输出日志到控制台
 * @description 生产环境输出 JSON 格式，开发环境输出带颜色的高亮格式
 * @param level 日志级别
 * @param message 日志消息
 * @param meta 附带的元数据
 */
function output(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  if (!isEnabled(level)) return;

  const payload = {
    timestamp: formatTimestamp(),
    level: level.toUpperCase(),
    message,
    ...meta,
  };

  if (env.isProd) {
    console.log(JSON.stringify(payload));
    return;
  }

  const color = {
    debug: '\x1b[36m',
    info: '\x1b[32m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
  }[level];
  const reset = '\x1b[0m';
  const metaStr = meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  console.log(`[${payload.timestamp}] ${color}${payload.level}${reset} ${message}${metaStr}`);
}

/**
 * 日志工具对象
 * @description 提供 debug/info/warn/error 四级日志方法
 */
export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => output('debug', message, meta),
  info: (message: string, meta?: Record<string, unknown>) => output('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => output('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => output('error', message, meta),
};
