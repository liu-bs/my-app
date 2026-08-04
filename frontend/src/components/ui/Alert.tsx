/**
 * @file Alert.tsx
 * @description 提示条组件，根据变体类型展示不同语义的消息提示，支持图标和显隐控制
 */
import type { AlertProps, AlertVariant } from '@my-app/shared';

/** Alert 变体与 CSS 类名的映射表 */
const variantClass: Record<AlertVariant, string> = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error',
};

/**
 * Alert 提示条
 * @param props {@link AlertProps}
 */
export function Alert({ variant, icon, children, visible = true, className = '' }: AlertProps) {
  return (
    <div
      role={variant === 'error' || variant === 'warning' ? 'alert' : 'status'}
      className={`row-sm rounded-lg px-3.5 py-2.5 text-(length:--type-sm) leading-normal shadow-[inset_0_0_0_1px_var(--alert-ring)] ${variantClass[variant]} ${visible ? 'flex' : 'hidden'} ${className}`}
    >
      {/* 左侧图标区域 */}
      {icon && (
        <span className="shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {/* 提示文案内容 */}
      <span>{children}</span>
    </div>
  );
}
