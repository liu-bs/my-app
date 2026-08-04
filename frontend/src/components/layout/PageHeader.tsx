/**
 * @file PageHeader.tsx
 * @description 页面头部组件，展示标题、副标题和操作区域，标题支持字符串或自定义节点
 */
import type { PageHeaderProps } from '@my-app/shared';

/**
 * PageHeader 页面头部
 * @param props {@link PageHeaderProps}
 */
export function PageHeader({ title, subtitle, actions, className = '' }: PageHeaderProps) {
  return (
    <header
      className={`page-header anim-fade-up stagger-1 ${
        actions ? 'page-actions' : ''
      } ${className}`.trim()}
    >
      {/* 标题与副标题区域 */}
      <div>
        {typeof title === 'string' ? (
          <h1 className="page-title max-md:page-title-mobile">{title}</h1>
        ) : (
          title
        )}
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {/* 右侧操作区域 */}
      {actions}
    </header>
  );
}
