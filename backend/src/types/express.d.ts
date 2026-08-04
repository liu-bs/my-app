/**
 * @file express.d.ts
 * @description Express 类型声明扩展，为 Request 对象添加 user 和 requestId 字段
 */

import type { AuthPayload } from '@my-app/shared';

/**
 * Express Request 扩展声明
 * @description 通过全局命名空间合并，为 Express Request 注入认证和链路追踪字段
 */
declare global {
  namespace Express {
    /**
     * Express Request 扩展接口
     */
    interface Request {
      /** 当前登录用户信息，未认证时为 undefined */
      user?: AuthPayload;
      /** 请求链路追踪 ID */
      requestId?: string;
    }
  }
}
