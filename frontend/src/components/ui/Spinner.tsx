/**
 * @file Spinner.tsx
 * @description 加载旋转指示器组件，通过 CSS 动画实现旋转效果，支持多尺寸
 */

/** 旋转器尺寸与 CSS 类名的映射表 */
const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-[2.5px]',
};

import type { SpinnerProps } from '@my-app/shared';

/**
 * Spinner 加载旋转指示器
 * @param props {@link SpinnerProps}
 */
export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <span
      className={`${sizeMap[size]} border-page inline-block animate-spin rounded-full ${className}`}
      style={{ borderRightColor: 'transparent' }}
      aria-hidden="true"
    />
  );
}
