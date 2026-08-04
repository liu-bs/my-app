/**
 * @file request.ts
 * @description 前端请求层的统一错误类，携带 HTTP 状态码、业务 code 和校验详情，并提供鉴权状态判断
 */

import type { ValidationErrorDetail } from '../ui';

/**
 * 请求错误（携带 HTTP 状态码、业务 code、校验详情）
 */
export class ApiRequestError extends Error {
  /**
   * @param status HTTP 状态码
   * @param code 业务错误码
   * @param message 错误消息
   * @param details 字段校验详情列表
   */
  constructor(
    /** HTTP 状态码 */
    public readonly status: number,
    /** 业务错误码 */
    public readonly code: number,
    message: string,
    /** 字段校验详情列表 */
    public readonly details?: ValidationErrorDetail[],
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }

  /** 是否未授权（需登录跳转） */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /** 是否无权限操作 */
  get isForbidden(): boolean {
    return this.status === 403;
  }
}
