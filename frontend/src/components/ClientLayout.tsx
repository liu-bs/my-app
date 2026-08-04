/**
 * @file ClientLayout.tsx
 * @description 客户端布局组件，组合导航栏、内容区域和页脚，作为客户端渲染的页面外壳
 */
'use client';

import { Navbar } from './layout/Navbar';
import type { ClientLayoutProps } from '@my-app/shared';

/**
 * ClientLayout 客户端布局
 * @param props {@link ClientLayoutProps}
 */
export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      {/* 无障碍：跳到主内容 */}
      <a
        href="#main-content"
        className="focus:bg-accent focus:text-page sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
      >
        跳到主内容
      </a>
      {/* 顶部导航栏 */}
      <Navbar />
      {/* 页面内容区域，最小高度适配视口减去导航栏高度 */}
      <main id="main-content" className="min-h-[calc(100vh-64px)] pb-12">
        {children}
      </main>
    </>
  );
}
