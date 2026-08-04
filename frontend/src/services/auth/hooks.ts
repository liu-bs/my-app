/**
 * @file hooks.ts
 * @description 认证模块 React Query Hooks。基于 authApi 封装，提供当前用户查询、
 *              登录/注册/登出/修改密码/更新资料等 mutation，自动维护缓存一致性。
 */
import { useState, useEffect } from 'react';
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
 * 响应式检测 auth_status cookie
 * @description 使用 useState + useEffect 让 enabled 响应 cookie 变化，
 *              解决登录后 cookie 已写入但 enabled 仍为 false 的问题；
 *              游客无 auth_status cookie 时不发请求，避免无谓 401
 * @returns 是否存在 auth_status=1 cookie
 */
function useAuthStatus(): boolean {
  const [hasStatus, setHasStatus] = useState(false);
  useEffect(() => {
    const check = () => setHasStatus(document.cookie.includes('auth_status=1'));
    check();
    // 监听存储事件（多标签页登出同步）
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, []);
  return hasStatus;
}

/**
 * 当前登录用户查询 Hook
 * @description 仅在 auth_status cookie 存在时才请求 /auth/me；
 *              useAuthStatus 响应式检测 cookie，登录后立即激活 query；
 *              /auth/me 为 authGuard 接口，未登录时后端返回 401，query 进入 error 态视为游客；
 *              retry:false 避免 401 自动重试；staleTime 5min 减少重复请求；
 *              登录/登出后由对应 mutation 主动 refetch/remove 触发响应式更新
 * @returns 当前用户 query 结果
 */
export function useMe() {
  const enabled = useAuthStatus();
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authApi.me,
    enabled,
    retry: false,
    staleTime: STALE_TIME.medium,
  });
}

/**
 * 登录 Mutation Hook
 * @description 成功后直接调 authApi.me() 拿用户数据并 setQueryData，
 *              不依赖 refetchQueries——因为 useAuthStatus 的 useEffect 此时可能还没跑，
 *              enabled 仍为 false，refetchQueries 对 disabled query 无效
 * @param dto 登录表单数据
 */
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
    onSuccess: async () => {
      try {
        const data = await authApi.me();
        queryClient.setQueryData(authKeys.me, data);
      } catch {
        // me 请求失败时不阻塞登录流程，后续路由切换会重试
      }
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
