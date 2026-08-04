/**
 * @file auth.ts
 * @description 认证模块后端接口，定义 Token 服务、认证服务、密码服务及用户仓储层契约，覆盖注册、登录、登出、改密、更新资料等操作
 */

import type {
  User,
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  UpdateProfileDto,
  AuthPayload,
} from '../user';

/** Token 校验结果：成功时返回 payload，失败时返回错误类型 */
export type TokenVerifyResult =
  | { success: true; payload: AuthPayload }
  | { success: false; errorType: 'expired' | 'invalid' };

/**
 * Token 服务接口（生成与校验）
 */
export interface TokenService {
  /** 生成 Token */
  generate(payload: AuthPayload): string;
  /** 校验 Token */
  verify(token: string): TokenVerifyResult;
  /** 解码过期 Token（不验签），用于 refresh 场景 */
  decode(token: string): AuthPayload | null;
}

/**
 * 认证业务服务接口
 */
export interface AuthService {
  /** 注册 */
  register(dto: RegisterDto): Promise<User>;
  /** 登录 */
  login(dto: LoginDto): Promise<User>;
  /** 获取当前用户信息 */
  getMe(userId: string): Promise<User>;
  /** 登出 */
  logout(userId: string): Promise<void>;
  /** 修改密码 */
  changePassword(userId: string, dto: ChangePasswordDto): Promise<void>;
  /** 更新个人资料 */
  updateProfile(userId: string, dto: UpdateProfileDto): Promise<User>;
  /** 刷新 Token：校验 payload 有效性后返回用户（供 cookie helper 签发新 token） */
  refresh(decoded: AuthPayload): Promise<User>;
}

/**
 * 密码服务接口（哈希与比对）
 */
export interface PasswordService {
  /** 密码哈希 */
  hash(password: string): Promise<string>;
  /** 明文密码与哈希比对 */
  compare(password: string, hash: string): Promise<boolean>;
}

/**
 * 用户数据仓储接口（底层持久化操作）
 */
export interface UserRepository {
  /** 查询全部用户 */
  findAll(): Promise<User[]>;
  /** 按 ID 查询用户 */
  findById(id: string): Promise<User | undefined>;
  /** 按邮箱查询用户 */
  findByEmail(email: string): Promise<User | undefined>;
  /** 判断邮箱或用户名是否已存在 */
  existsByEmailOrUsername(email: string, username: string): Promise<boolean>;
  /** 创建用户 */
  create(user: User): Promise<User>;
  /** 部分更新用户 */
  update(id: string, partial: Partial<User>): Promise<User | undefined>;
  /** 删除用户 */
  delete(id: string): Promise<boolean>;
  /** 种子数据初始化 */
  seed(data: User[]): Promise<void>;
}
