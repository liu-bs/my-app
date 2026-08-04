/**
 * @file Tag.tsx
 * @description 标签组件，支持四种配色变体和两种尺寸，提供基于标签名的稳定变体映射工具函数
 */
import type { TagProps, TagVariant } from '@my-app/shared';

/** 标签变体与 CSS 类名的映射表 */
export const tagClassFor: Record<TagVariant, string> = {
  ink: 'tag-ink',
  ember: 'tag-ember',
  crimson: 'tag-crimson',
  slate: 'tag-slate',
};

/** 标签尺寸与 CSS 类名的映射表 */
const sizeClass = {
  sm: 'text-(length:--type-2xs) leading-normal px-2 py-0.5',
  md: 'text-(length:--type-xs) leading-normal px-2.5 py-0.5',
};

/**
 * Tag 标签
 * @param props {@link TagProps}
 */
export function Tag({ children, variant = 'ink', size = 'md', className = '' }: TagProps) {
  return (
    <span className={`${tagClassFor[variant]} ${sizeClass[size]} ${className}`}>{children}</span>
  );
}

/**
 * 根据标签名稳定映射到四种配色变体
 * @param label 标签名称文本
 * @returns 稳定的配色变体
 */
export function tagVariantFor(label: string): TagVariant {
  const variants: TagVariant[] = ['ink', 'ember', 'crimson', 'slate'];
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % variants.length;
  return variants[index];
}
