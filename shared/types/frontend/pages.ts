/**
 * @file pages.ts
 * @description 前端页面级组件 Props 类型，涵盖组件库演示页、布局容器、错误边界、写文章保存状态及设置页 tab 等
 */

import type { ReactNode } from 'react';

/**
 * 组件库演示页 DemoSection Props
 */
export interface DemoSectionProps {
  /** 区块标题 */
  title: string;
  /** 区块内容 */
  children: ReactNode;
}

/**
 * 组件库演示页 DemoRow Props
 */
export interface DemoRowProps {
  /** 行标签文本 */
  label: string;
  /** 行内容 */
  children: ReactNode;
}

/**
 * 客户端根布局组件 Props
 */
export interface ClientLayoutProps {
  /** 布局子节点 */
  children: ReactNode;
}

/**
 * 全局上下文 Provider 容器组件 Props
 */
export interface ProvidersProps {
  /** Provider 包裹的子节点 */
  children: ReactNode;
}

/**
 * Next.js 错误边界组件 Props
 */
export interface ErrorBoundaryProps {
  /** 捕获到的错误对象（可能含摘要 digest） */
  error: Error & { digest?: string };
  /** 重置错误边界的回调函数 */
  reset: () => void;
}

/** 写文章页面保存状态：idle 空闲 / saved 已保存 */
export type WritePageSaveStatus = 'idle' | 'saved';

/** 设置页面 tab 类型：profile 个人资料 / password 修改密码 */
export type SettingsTab = 'profile' | 'password';
