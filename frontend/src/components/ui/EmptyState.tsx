/**
 * @file EmptyState.tsx
 * @description 空状态组件，在列表无数据时展示图标、标题、描述和操作按钮的占位提示
 */
import type { EmptyStateProps } from '@my-app/shared';

/**
 * EmptyState 空状态
 * @param props {@link EmptyStateProps}
 */
export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`border-stroke bg-surface rounded-xl border px-6 py-10 text-center ${className}`}
    >
      {/* 图标区域 */}
      <div className="bg-page text-faint mx-auto mb-3.5 flex h-11 w-11 items-center justify-center rounded-lg">
        {icon}
      </div>
      {/* 标题 */}
      <p className="text-heading mb-1 text-(length:--type-base) leading-normal font-semibold">
        {title}
      </p>
      {/* 描述文案 */}
      {description && (
        <p className="text-muted text-(length:--type-sm) leading-normal">{description}</p>
      )}
      {/* 操作按钮区域 */}
      {action && <div className="mt-3.5">{action}</div>}
    </div>
  );
}
