/**
 * @file auth.ts
 * @description JWT 认证中间件模块：提供令牌生成、验证及 Express 强制/可选认证守卫
 *
 * Token 生命周期闭环：
 * - 登录/注册 → 签发 JWT（含 tokenVersion）→ 种 Cookie
 * - 每次请求 → authGuard 解码 JWT → 对比用户存储中的 tokenVersion
 *   - 版本一致 → 放行
 *   - 版本不一致 → 401（Token 已被登出/改密作废）
 * - 登出/改密 → tokenVersion +1 → 旧 JWT 中的版本号过期
 */
import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getStore } from '@store/index.js';

/** JWT 签名密钥（优先使用环境变量，开发环境有默认值） */
const JWT_SECRET = process.env.JWT_SECRET || 'my-app-secret-key-2024';

/** JWT 过期时间（7 天），由 jsonwebtoken 在 expiresIn 中解析 */
const JWT_EXPIRES_IN = '7d';

export { JWT_SECRET };

/**
 * 生成 JWT Token
 * @param payload 令牌载荷
 * @param payload.id 用户唯一标识
 * @param payload.email 用户邮箱
 * @param payload.tokenVersion 用户 Token 版本号（用于登出/改密后作废旧 Token）
 * @returns 签名后的 JWT 字符串
 */
export function generateToken(payload: {
  id: string;
  email: string;
  tokenVersion: number;
}): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * 验证 JWT Token
 * @param token 待验证的 JWT 字符串
 * @returns 解码后的载荷对象（包含 id、email、tokenVersion），验证失败返回 null
 */
export function verifyToken(
  token: string,
): { id: string; email: string; tokenVersion: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; tokenVersion: number };
  } catch {
    // 签名错误、过期、格式异常等均视为无效
    return null;
  }
}

/**
 * 强制认证中间件 - 验证 Bearer Token
 * @description 从 Cookie 或 Authorization 头提取 Token，验证签名与版本号，通过后将用户信息挂载到 req.user
 * @param req Express 请求对象
 * @param res Express 响应对象
 * @param next Express next 回调
 * @returns {Promise<void>} resolve 后流程结束（成功 next() 或已写入 401 响应）
 */
export async function authGuard(req: Request, res: Response, next: NextFunction): Promise<void> {
  // 优先从 auth_token Cookie 读取，回退到 Authorization 头的 Bearer Token
  const authHeader = req.headers.authorization;
  const token =
    req.cookies?.auth_token ||
    (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined);

  if (!token) {
    res.status(401).json({ message: '未授权，请先登录', statusCode: 401, error: 'Unauthorized' });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ message: 'Token 无效或已过期', statusCode: 401, error: 'Unauthorized' });
    return;
  }

  // 对比 JWT 中的 tokenVersion 与用户存储中的版本号，不一致说明 Token 已被作废（登出/改密）
  const store = getStore();
  const user = await store.findById<{ id: string; tokenVersion?: number }>('users', decoded.id);
  // 数据库 tokenVersion 缺失时视为 0（旧数据兼容）
  if (user && (user.tokenVersion ?? 0) !== decoded.tokenVersion) {
    res
      .status(401)
      .json({ message: 'Token 已失效，请重新登录', statusCode: 401, error: 'Unauthorized' });
    return;
  }

  // 将解码后的用户信息挂载到 req 上，供下游处理函数使用
  (req as Request & { user?: { id: string; email: string; tokenVersion: number } }).user = decoded;
  next();
}

/**
 * 可选认证中间件 - 有 Token 则解析验证，无 Token 也放行
 * @description 用于既支持匿名访问又支持登录态个性化内容的接口；版本不一致时视作未登录
 * @param req Express 请求对象
 * @param _res Express 响应对象（未使用）
 * @param next Express next 回调
 * @returns {Promise<void>} resolve 后流程结束
 */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  // 优先从 auth_token Cookie 读取，回退到 Authorization 头的 Bearer Token
  const authHeader = req.headers.authorization;
  const token =
    req.cookies?.auth_token ||
    (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined);
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      // 可选认证同样校验 tokenVersion，版本不一致则视为未登录，不挂载 req.user
      const store = getStore();
      const user = await store.findById<{ id: string; tokenVersion?: number }>('users', decoded.id);
      if (user && (user.tokenVersion ?? 0) === decoded.tokenVersion) {
        (req as Request & { user?: { id: string; email: string; tokenVersion: number } }).user =
          decoded;
      }
    }
  }
  next();
}

/** 扩展 Express Request 类型，注入 user 属性供全局访问 */
declare global {
  namespace Express {
    interface Request {
      /** 已认证的用户信息（id、email、tokenVersion），未认证或版本失效时为 undefined */
      user?: { id: string; email: string; tokenVersion: number };
    }
  }
}
