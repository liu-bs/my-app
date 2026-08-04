/**
 * @file Container.tsx
 * @description 页面内容容器组件，提供最大宽度限制和水平内边距，统一布局对齐
 */
import type { ContainerProps } from '@my-app/shared';

/**
 * Container 内容容器
 * @param props {@link ContainerProps}
 */
export function Container({ children, className = '' }: ContainerProps) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>;
}
