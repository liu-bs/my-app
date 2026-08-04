/**
 * @file LazyIslands.tsx
 * @description 客户端岛屿懒加载包装器 — next/dynamic 的 ssr:false 必须在 Client Component 中使用
 */
'use client';

import dynamic from 'next/dynamic';
import type { CommentsSectionProps } from '@my-app/shared';

/** 评论区 — 懒加载（首屏外） */
const CommentsSection = dynamic(() => import('./CommentsSection').then((m) => m.CommentsSection), {
  ssr: false,
  loading: () => <div className="bg-surface mt-8 h-32 animate-pulse rounded-xl" />,
});

/** 返回顶部 — 懒加载（滚动后才需要） */
const BackToTop = dynamic(() => import('@/components/BackToTop').then((m) => m.BackToTop), {
  ssr: false,
});

/**
 * 懒加载评论区的包装组件
 */
export function LazyComments(props: CommentsSectionProps) {
  return <CommentsSection {...props} />;
}

/**
 * 懒加载返回顶部的包装组件
 */
export function LazyBackToTop() {
  return <BackToTop />;
}
