/**
 * @file CoverFallback.tsx
 * @description 封面图占位组件，在文章无封面图时展示图片图标的兜底区域
 */
import { ImageIcon } from 'lucide-react';
import type { CoverFallbackProps } from '@my-app/shared';

/**
 * CoverFallback 封面占位
 * @param props {@link CoverFallbackProps}
 */
export function CoverFallback({ className = '' }: Omit<CoverFallbackProps, 'aspect'>) {
  return (
    <div
      className={`cover-fallback text-muted flex aspect-[16/10] w-full items-center justify-center rounded-lg ${className}`}
    >
      <ImageIcon size={28} strokeWidth={1.5} aria-hidden="true" />
    </div>
  );
}
