/**
 * @file hooks.ts
 * @description 认证模块 React Query Hooks。基于 authApi 封装，提供当前用户查询、
 *              登录/注册/登出/修改密码/更新资料等 mutation，自动维护缓存一致性。
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ChangePasswordDto, LoginDto, RegisterDto, UpdateProfileDto } from '@my-app/shared';
import { STALE_TIME } from '@/config/query';
import { authApi } from './api';

/**
 * Auth 模块 Query Key 集合
 */
export const authKeys = {
  /** 当前登录用户 */
  me: ['auth', 'me'] as const,
};

/**
 * 检查 auth_status cookie（后端登录时设置，httpOnly: false，JS 可读）
 * @description 存在说明用户已登录，才需要请求 /auth/me 获取用户信息；
 *              不存在则跳过请求，避免未登录用户每次路由切换都触发 401
 * @returns 是否存在 auth_status=1 cookie
 */
function hasAuthStatus(): boolean {
  if (typeof document === 'undefined') return false; // SSR 时无法读取 cookie，默认不触发请求
  return document.cookie.includes('auth_status=1');
}

/**
 * 当前登录用户查询 Hook
 * @description 仅在 auth_status cookie 存在时才请求 /auth/me；
 *              /auth/me 为 authGuard 接口，未登录时后端返回 401，query 进入 error 态视为游客；
 *              retry:false 避免 401 自动重试；staleTime 5min 减少重复请求；
 *              登录/登出后由对应 mutation 主动 refetch/remove 触发响应式更新
 * @returns 当前用户 query 结果
 */
export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authApi.me,
    enabled: hasAuthStatus(),
    retry: false,
    staleTime: STALE_TIME.medium,
  });
}

/**
 * 登录 Mutation Hook
 * @description 成功后 refetch me——登录前 enabled 可能为 false（无 auth_status cookie），
 *              invalidateQueries 不会激活 disabled query，需用 refetchQueries 强制拉取
 * @param dto 登录表单数据
 */
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: authKeys.me });
    },
  });
}

/**
 * 注册 Mutation Hook
 * @description 仅创建用户，不下发登录态，需显式登录
 * @param dto 注册表单数据
 */
export function useRegister() {
  return useMutation({
    mutationFn: (dto: RegisterDto) => authApi.register(dto),
  });
}

/**
 * 登出 Mutation Hook
 * @description 成功后移除 me 缓存，UI 回到游客态
 */
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.me });
    },
  });
}

/**
 * 修改密码 Mutation Hook
 * @description 成功后登录态被清除，需重新登录
 * @param dto 修改密码表单数据
 */
export function useChangePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: ChangePasswordDto) => authApi.changePassword(dto),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.me });
    },
  });
}

/**
 * 更新个人资料 Mutation Hook
 * @description 成功后 invalidate me 同步最新资料
 * @param dto 更新资料表单数据
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => authApi.updateProfile(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}
