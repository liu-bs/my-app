/**
 * @file index.ts
 * @description errors 模块的统一导出入口，集中导出所有自定义错误类
 */

export {
  AppError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  TooManyRequestsError,
  InternalServerError,
  ValidationError,
  UnprocessableEntityError,
  ServiceUnavailableError,
} from '@/errors/AppError.ts';
