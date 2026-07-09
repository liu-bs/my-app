/**
 * @file auth.routes.ts
 * @description 认证模块路由定义：注册、登录、登出、获取当前用户、修改密码
 */
import { Router, type Request, type Response } from 'express';
import bcrypt from 'node:crypto';
import { getStore } from '@store/index.js';
import { authGuard, generateToken } from '@middleware/auth.js';
import { generateId } from '@utils/index.js';
import type { User, RegisterDto, LoginDto, ChangePasswordDto, AuthResponse } from '@my-app/shared';

/** Express 路由实例 */
const router: Router = Router();
/** JSON 文件存储实例（基于本地文件系统的数据持久化） */
const store = getStore();

/**
 * 对密码进行 SHA-256 哈希
 * @param password 明文密码
 * @returns 哈希后的十六进制字符串
 */
function hashPwd(password: string): string {
  return bcrypt.createHash('sha256').update(password).digest('hex');
}

/**
 * POST /api/auth/register - 用户注册
 * @description 校验邮箱、用户名唯一性后创建用户。不种 Cookie，注册成功后需跳转登录页由用户自行登录。
 * @param req.body 请求体（RegisterDto）
 * @param req.body.email 注册邮箱
 * @param req.body.password 登录密码
 * @param req.body.firstName 名
 * @param req.body.lastName 姓
 * @param req.body.username 用户名
 * @param res 响应对象
 * @returns 注册成功返回 201；字段缺失返回 400；邮箱/用户名重复返回 409
 */
router.post('/register', async (req: Request<object, object, RegisterDto>, res: Response) => {
  const { email, password, firstName, lastName, username } = req.body;

  // 校验必填字段
  if (!email || !password || !firstName || !lastName || !username) {
    res.status(400).json({ message: '所有字段都是必填的', statusCode: 400, error: 'BadRequest' });
    return;
  }

  const users = await store.find<User>('users');
  // 检查邮箱是否已被注册
  if (users.find((u) => u.email === email)) {
    res.status(409).json({ message: '该邮箱已被注册', statusCode: 409, error: 'Conflict' });
    return;
  }
  // 检查用户名是否已被占用
  if (users.find((u) => u.username === username)) {
    res.status(409).json({ message: '该用户名已被使用', statusCode: 409, error: 'Conflict' });
    return;
  }

  const now = new Date().toISOString();
  const newUser: User = {
    id: generateId(),
    email,
    password: hashPwd(password),
    firstName,
    lastName,
    username,
    avatar: '',
    coverImage: '',
    bio: '',
    location: '',
    website: '',
    joined: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    role: 'Writer',
    company: '',
    verified: false,
    tags: [],
    social: { twitter: '', github: '', linkedin: '' },
    stats: { articles: 0, followers: '0', following: 0, likes: '0', views: '0' },
    tokenVersion: 0,
    createdAt: now,
    updatedAt: now,
  };

  await store.create('users', newUser);
  // 不种 Cookie：注册仅创建账户，用户需通过 POST /auth/login 登录后才会种 Cookie
  res.status(201).json({ data: null, message: '注册成功', statusCode: 201 });
});

/**
 * POST /api/auth/login - 用户登录
 * @description 使用邮箱和密码进行身份验证，校验通过后签发 JWT 令牌
 * @param req.body 请求体（LoginDto）
 * @param req.body.email 登录邮箱
 * @param req.body.password 登录密码
 * @param res 响应对象
 * @returns 登录成功返回 200；字段缺失返回 400；邮箱或密码错误返回 401
 */
router.post('/login', async (req: Request<object, object, LoginDto>, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: '邮箱和密码不能为空', statusCode: 400, error: 'BadRequest' });
    return;
  }

  const users = await store.find<User>('users');
  const user = users.find((u) => u.email === email);
  // 统一返回"邮箱或密码错误"以避免账户枚举
  if (!user || user.password !== hashPwd(password)) {
    res.status(400).json({ message: '邮箱或密码错误', statusCode: 400, error: 'BadRequest' });
    return;
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    tokenVersion: user.tokenVersion ?? 0,
  });

  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天（ms）
  });
  // 非 httpOnly 标识 Cookie，供前端判断是否需要调 /auth/me 探测
  res.cookie('auth_status', '1', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ data: null, message: '登录成功', statusCode: 200 });
});

/**
 * GET /api/auth/me - 获取当前登录用户信息
 * @description 需要认证，从 JWT 令牌中提取用户 ID，查询并返回安全后的用户信息
 * @param req 携带已认证用户信息的请求对象
 * @param res 响应对象
 * @returns 成功返回用户信息；用户不存在返回 404
 */
router.get('/me', authGuard, async (req: Request, res: Response) => {
  const user = await store.findById<User>('users', req.user!.id);
  if (!user) {
    res.status(404).json({ message: '用户不存在', statusCode: 404, error: 'NotFound' });
    return;
  }
  // 移除密码字段，避免敏感信息泄露
  const { password: _, ...safeUser } = user;
  const response: AuthResponse = { user: safeUser };
  res.json({ data: response, message: '获取成功', statusCode: 200 });
});

/**
 * POST /api/auth/logout - 用户登出
 * @description 需要认证；通过 tokenVersion +1 使所有已签发 Token 失效，并清除认证 Cookie
 * @param req 携带已认证用户信息的请求对象
 * @param res 响应对象
 * @returns 登出成功返回 200
 */
router.post('/logout', authGuard, async (req: Request, res: Response) => {
  // tokenVersion +1，使所有已签发的旧 Token 失效
  const user = await store.findById<User>('users', req.user!.id);
  if (user) {
    await store.update('users', user.id, {
      tokenVersion: (user.tokenVersion ?? 0) + 1,
    } as Partial<User>);
  }

  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.clearCookie('auth_status', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.json({ data: null, message: '登出成功', statusCode: 200 });
});

/**
 * POST /api/auth/change-password - 修改密码
 * @description 需要认证；验证当前密码正确后将密码更新为新密码，并使旧 Token 失效
 * @param req.body 请求体（ChangePasswordDto）
 * @param req.body.currentPassword 当前密码
 * @param req.body.newPassword 新密码
 * @param res 响应对象
 * @returns 修改成功返回 200；字段缺失返回 400；当前密码错误返回 400
 */
router.post(
  '/change-password',
  authGuard,
  async (req: Request<object, object, ChangePasswordDto>, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res
        .status(400)
        .json({ message: '当前密码和新密码不能为空', statusCode: 400, error: 'BadRequest' });
      return;
    }

    const user = await store.findById<User>('users', req.user!.id);
    if (!user || user.password !== hashPwd(currentPassword)) {
      res.status(400).json({ message: '当前密码错误', statusCode: 400, error: 'BadRequest' });
      return;
    }

    // 改密后 tokenVersion +1，使旧 Token 失效；同时清除 Cookie，前端跳登录页
    await store.update('users', user.id, {
      password: hashPwd(newPassword),
      tokenVersion: (user.tokenVersion ?? 0) + 1,
    } as Partial<User>);
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    res.clearCookie('auth_status', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    res.json({ data: null, message: '密码修改成功，请重新登录', statusCode: 200 });
  },
);

export default router;
