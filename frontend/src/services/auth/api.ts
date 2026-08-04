/**
 * @file api.ts
 * @description 认证模块 API 层。对齐后端 API.md，前缀 /auth，采用 HttpOnly Cookie 鉴权，
 *              提供登录/注册/登出/修改密码/更新资料等接口调用。
 */
import { api } from '@/lib/api/request';
import type {
  AuthUserResponse,
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  UpdateProfileDto,
} from '@my-app/shared';

/**
 * 认证模块 API 集合
 */
export const authApi = {
  /** 获取当前登录用户（authGuard），skipAuthRedirect 避免未登录时触发重定向 */
  me: () => api.get<AuthUserResponse>('/auth/me', undefined, { skipAuthRedirect: true }),

  /** 登录（无鉴权，限流），成功后端下发 Cookie @param dto 登录表单数据 */
  login: (dto: LoginDto) => api.post<null>('/auth/login', dto, { skipAuthRedirect: true }),

  /** 注册（无鉴权，限流），仅创建用户，不下发登录态 @param dto 注册表单数据 */
  register: (dto: RegisterDto) => api.post<AuthUserResponse>('/auth/register', dto),

  /** 登出（authGuard），清除 Cookie 并使 Token 失效 */
  logout: () => api.post<null>('/auth/logout'),

  /** 修改密码（authGuard，限流），成功后清除登录态 @param dto 修改密码表单数据 */
  changePassword: (dto: ChangePasswordDto) => api.post<null>('/auth/change-password', dto),

  /** 更新个人资料（authGuard），同步评论/文章冗余字段 @param dto 更新资料表单数据 */
  updateProfile: (dto: UpdateProfileDto) => api.put<AuthUserResponse>('/auth/profile', dto),
};
