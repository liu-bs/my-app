/**
 * @file Avatar.tsx
 * @description 用户头像组件，优先展示图片头像，无图片时回退为首字母缩写渐变圆形
 */
import Image from 'next/image';
import type { AvatarProps, AvatarSize } from '@my-app/shared';

/** 头像尺寸映射表，包含容器尺寸、文字尺寸和像素大小 */
const sizeMap: Record<AvatarSize, { container: string; text: string; px: number }> = {
  xs: { container: 'h-5 w-5', text: 'text-(length:--type-2xs)', px: 20 },
  sm: { container: 'h-6 w-6', text: 'text-(length:--type-2xs)', px: 24 },
  md: { container: 'h-9 w-9', text: 'text-(length:--type-sm)', px: 36 },
  lg: { container: 'h-10 w-10', text: 'text-(length:--type-md)', px: 40 },
  xl: { container: 'h-16 w-16', text: 'text-(length:--type-3xl)', px: 64 },
};

/**
 * Avatar 用户头像
 * @param props {@link AvatarProps}
 */
export function Avatar({ initials, size = 'md', src, alt, className = '' }: AvatarProps) {
  if (src) {
    const { container, px } = sizeMap[size];
    return (
      <Image
        src={src}
        alt={alt || ''}
        width={px}
        height={px}
        className={`${container} shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      className={`${sizeMap[size].container} ${sizeMap[size].text} avatar-gradient flex shrink-0 items-center justify-center rounded-full font-semibold ${className}`}
    >
      {initials}
    </span>
  );
}
