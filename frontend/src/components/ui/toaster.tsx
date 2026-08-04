/**
 * @file toaster.tsx
 * @description react-hot-toast Toaster 包装组件
 */

'use client';

import { Toaster as RHTToaster } from 'react-hot-toast';

/**
 * Toaster 全局消息提示
 *
 * 样式由 components.css 中的 .rht-toast 选择器驱动，
 * 遵循低饱和极简设计系统，通过左侧色条 + 柔和状态底色区分语义。
 */
export function Toaster() {
  return (
    <RHTToaster
      position="top-right"
      containerClassName="rht-toaster"
      toastOptions={{
        duration: 3500,
        className: 'rht-toast',
        success: { className: 'rht-success rht-toast' },
        error: { className: 'rht-error rht-toast' },
      }}
    />
  );
}
