/**
 * @file common.ts
 * @description 通用共享类型，定义统一 API 响应结构，供全站各模块复用
 */

/**
 * 统一 API 响应结构
 */
export interface ApiResponse<T> {
  /** 业务状态码 */
  code: number;
  /** 响应数据 */
  data: T;
  /** 提示信息 */
  message?: string;
}
