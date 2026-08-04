/**
 * @file Input.tsx
 * @description 通用输入框组件，支持左右图标插槽、错误/成功状态样式，通过 forwardRef 暴露 ref
 */
import { forwardRef } from 'react';
import type { InputProps } from '@my-app/shared';

/**
 * Input 通用输入框
 * @param props {@link InputProps}
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, rightElement, error, success, className = '', ...props }, ref) => {
    /** 是否拥有左侧图标或右侧附加元素 */
    const hasAffix = Boolean(leftIcon || rightElement);

    /** 输入框完整class列表，根据图标和状态动态拼接 */
    const inputClass = [
      'input-field input-focus',
      leftIcon ? 'pl-10' : '',
      rightElement ? 'pr-10' : '',
      error ? 'input-error' : success ? 'input-success' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    /* 无图标插槽时直接渲染原生 input */
    if (!hasAffix) {
      return <input ref={ref} className={inputClass} {...props} />;
    }

    /* 带图标插槽时用容器包裹 input 和图标 */
    return (
      <div className="input-icon-wrap">
        {/* 左侧图标 */}
        {leftIcon && <span className="input-icon">{leftIcon}</span>}
        <input ref={ref} className={inputClass} {...props} />
        {/* 右侧附加元素 */}
        {rightElement && (
          <span className="absolute top-1/2 right-3 -translate-y-1/2">{rightElement}</span>
        )}
      </div>
    );
  },
);

/** 组件显示名，用于 React DevTools 识别 */
Input.displayName = 'Input';
