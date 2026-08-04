/**
 * @file AppError.ts
 * @description 应用错误类体系，定义统一的 HTTP 错误基类及各业务场景的特定错误子类
 */

/**
 * 应用错误基类
 * @description 携带 HTTP 状态码、错误代码和可选详情信息，所有自定义错误均继承此类
 */
export class AppError extends Error {
  /**
   * 初始化应用错误
   * @param statusCode HTTP 状态码
   * @param code 错误代码字符串
   * @param message 错误信息
   * @param details 额外错误详情（可选）
   */
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: Array<Record<string, unknown>>,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/** 请求参数错误（400） */
export class BadRequestError extends AppError {
  /**
   * @param message 错误信息
   * @param details 额外错误详情
   */
  constructor(message = '请求参数错误', details?: Array<Record<string, unknown>>) {
    super(400, 'BadRequest', message, details);
  }
}

/** 未授权错误（401），表示用户未登录或 token 无效 */
export class UnauthorizedError extends AppError {
  /**
   * @param message 错误信息
   */
  constructor(message = '未授权，请先登录') {
    super(401, 'Unauthorized', message);
  }
}

/** 权限不足错误（403），表示用户已登录但无操作权限 */
export class ForbiddenError extends AppError {
  /**
   * @param message 错误信息
   */
  constructor(message = '权限不足') {
    super(403, 'Forbidden', message);
  }
}

/** 资源不存在错误（404） */
export class NotFoundError extends AppError {
  /**
   * @param message 错误信息
   */
  constructor(message = '资源不存在') {
    super(404, 'NotFound', message);
  }
}

/** 资源冲突错误（409），表示请求与现有资源状态冲突 */
export class ConflictError extends AppError {
  /**
   * @param message 错误信息
   */
  constructor(message = '资源冲突') {
    super(409, 'Conflict', message);
  }
}

/** 服务器内部错误（500） */
export class InternalServerError extends AppError {
  /**
   * @param message 错误信息
   */
  constructor(message = '服务器内部错误') {
    super(500, 'InternalServerError', message);
  }
}

/** 请求参数验证失败（400），携带校验详情 */
export class ValidationError extends AppError {
  /**
   * @param message 错误信息
   * @param details 校验错误详情列表
   */
  constructor(message = '请求参数验证失败', details?: Array<Record<string, unknown>>) {
    super(400, 'ValidationError', message, details);
  }
}

/** 请求内容不符合规则错误（422） */
export class UnprocessableEntityError extends AppError {
  constructor(message = '请求内容不符合规则', details?: Array<Record<string, unknown>>) {
    super(422, 'UnprocessableEntity', message, details);
  }
}

/** 请求过于频繁（429） */
export class RateLimitError extends AppError {
  constructor(message = '请求过于频繁，请稍后再试') {
    super(429, 'RateLimitError', message);
  }
}
