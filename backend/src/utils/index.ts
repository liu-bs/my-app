/**
 * @file index.ts
 * @description 后端通用工具函数：ID 生成、分页处理、统一响应、密码哈希、用户脱敏等
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * 生成全局唯一 ID
 * @returns UUID v4 字符串
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * 从请求中提取并规范化分页参数
 * @description 限制 page >= 1，limit 在 [1, 100] 区间内
 * @param query 请求查询参数对象
 * @returns 包含 page、limit、offset 的分页参数对象
 */
export function getPagination(query: Record<string, unknown>): {
  page: number;
  limit: number;
  offset: number;
} {
  // 页码至少为 1
  const page = Math.max(1, Number(query.page) || 1);
  // 每页条数限制在 [1, 100]，避免单次返回过大集合
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  // 偏移量 = (页码 - 1) * 每页条数
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

/**
 * 构建分页元数据
 * @param page 当前页码（从 1 开始）
 * @param limit 每页条数
 * @param total 总记录数
 * @returns 分页元数据，包含总页数与上下页指示
 */
export function buildPaginationMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    // 总页数向上取整，保证余数部分也能占满一页
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
}

/**
 * 构建统一成功响应对象
 * @template T 业务数据类型
 * @param data 业务数据
 * @param [message] 响应消息，默认 "操作成功"
 * @param [statusCode] HTTP 状态码，默认 200
 * @returns 统一格式的成功响应 { data, message, statusCode }
 */
export function success<T>(data: T, message = '操作成功', statusCode = 200) {
  return { data, message, statusCode };
}

/**
 * 简单密码哈希（演示用，生产环境请改用 bcrypt 等强哈希算法）
 * @param password 明文密码
 * @returns Base64 编码的哈希字符串
 */
export function hashPassword(password: string): string {
  // 仅用于演示场景的极简实现，不具备安全强度
  return Buffer.from(password).toString('base64');
}

/**
 * 验证密码与哈希值是否匹配
 * @param password 明文密码
 * @param hash 已存储的哈希值
 * @returns 密码匹配返回 true，否则返回 false
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * 安全地移除用户对象中的 password 敏感字段
 * @template T 包含 password 字段的对象类型
 * @param user 含敏感字段的用户对象
 * @returns 不含 password 字段的安全用户对象
 */
export function sanitizeUser<T extends Record<string, unknown>>(user: T): Omit<T, 'password'> {
  // 解构剔除 password 字段
  const { password: _password, ...safe } = user;
  return safe;
}
