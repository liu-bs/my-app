import 'server-only';
import { NextResponse } from 'next/server';
import { AppError, InternalServerError } from '@server/errors';
import { logger } from '@server/utils/logger';

export function sendSuccess<T>(data: T, message = '操作成功', status = 200): NextResponse {
  return NextResponse.json({ code: 0, data, message }, { status });
}

export function sendCreated<T>(data: T, message = '创建成功'): NextResponse {
  return sendSuccess(data, message, 201);
}

export function sendError(err: unknown): NextResponse {
  const appError =
    err instanceof AppError
      ? err
      : new InternalServerError(err instanceof Error ? err.message : 'Internal server error');

  if (appError.statusCode >= 500) {
    logger.error(appError.message, {
      code: appError.code,
      statusCode: appError.statusCode,
      stack: err instanceof Error ? err.stack : undefined,
    });
  } else {
    logger.warn(appError.message, { code: appError.code, statusCode: appError.statusCode });
  }

  // 前端通过 HTTP status code 判断错误，body.message 提供错误信息
  return NextResponse.json(
    {
      code: appError.statusCode,
      data: null,
      message: appError.message,
      ...(appError.details ? { details: appError.details } : {}),
    },
    { status: appError.statusCode },
  );
}
