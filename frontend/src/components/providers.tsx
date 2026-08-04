/**
 * @file providers.tsx
 * @description 客户端 Provider 聚合层，组合 ThemeProvider、React Query、Toaster 和开发环境 DevTools
 */
'use client';

import { lazy, Suspense } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { Toaster } from '@/components/ui/toaster';
import type { ProvidersProps } from '@my-app/shared';

/** 开发环境懒加载 ReactQueryDevtools，避免进入生产 bundle */
const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? lazy(() =>
        import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })),
      )
    : null;

/**
 * Providers 客户端 Provider 聚合
 * - ThemeProvider：明暗主题（next-themes，class 策略，SSR 安全无 FOUC）
 * - QueryClientProvider：服务端状态管理（SSR 安全的单例工厂）
 * - Toaster：全局消息提示（react-hot-toast）
 * - ReactQueryDevtools：仅开发环境挂载
 * @param props {@link ProvidersProps}
 */
export function Providers({ children }: ProvidersProps) {
  /** 获取 SSR 安全的 QueryClient 单例 */
  const queryClient = getQueryClient();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* 全局消息提示 */}
        <Toaster />
        {/* 开发环境 React Query 调试面板 */}
        {process.env.NODE_ENV === 'development' && ReactQueryDevtools ? (
          <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
          </Suspense>
        ) : null}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
