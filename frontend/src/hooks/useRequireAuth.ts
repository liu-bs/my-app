'use client';
import { useRouter } from 'next/navigation';
import toast from '@/lib/toast';
import type { User } from '@my-app/shared';

/**
 * 鉴权守卫 hook，未登录时提示并跳转登录页
 * @param user 当前用户（null 表示未登录）
 * @param redirectPath 登录后重定向路径
 * @returns requireAuth 函数，未登录时提示并跳转，已登录时执行传入的 action
 */
export function useRequireAuth(user: User | null, redirectPath: string) {
  const router = useRouter();
  return (action: () => void) => {
    if (!user) {
      toast.info('请先登录');
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }
    action();
  };
}
