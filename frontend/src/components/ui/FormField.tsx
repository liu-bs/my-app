/**
 * @file FormField.tsx
 * @description 表单字段组件，封装 label、提示文案、错误提示，并通过自动提取子元素 id 关联 label
 */
import type { FormFieldProps } from '@my-app/shared';

/**
 * FormField 表单字段
 * @param props {@link FormFieldProps}
 */
export function FormField({
  label,
  hint,
  error,
  required,
  className = '',
  children,
}: FormFieldProps) {
  /**
   * 从子元素中提取 id 关联到 label
   * @returns 子元素的 id 属性值
   */
  const childId = (() => {
    if (children && typeof children === 'object' && 'props' in children) {
      return (children as { props: { id?: string } }).props.id;
    }
  })();

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* 标签，通过 htmlFor 关联表单控件 */}
      <label
        htmlFor={childId}
        className="text-heading text-(length:--type-sm) leading-normal font-medium"
      >
        {label}
        {required && (
          <span className="text-state-error ml-0.5" aria-label="必填">
            *
          </span>
        )}
      </label>
      {children}
      {/* 错误提示，优先于 hint 展示 */}
      {error && (
        <span className="text-state-error text-(length:--type-xs) leading-normal">{error}</span>
      )}
      {/* 辅助提示，仅在无错误时展示 */}
      {hint && !error && (
        <span className="text-faint text-(length:--type-xs) leading-normal">{hint}</span>
      )}
    </div>
  );
}
