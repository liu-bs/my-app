/**
 * @file RemoveFavoriteButton.tsx
 * @description 取消收藏按钮，调用 toggleFavorite 接口移除收藏并提示结果
 */
'use client';

import { BookmarkX } from 'lucide-react';
import toast from '@/lib/toast';
import { Button } from '@/components/ui/Button';
import { useToggleFavorite } from '@/services/blog/hooks';
import type { PostIdProps } from '@my-app/shared';

/**
 * RemoveFavoriteButton 取消收藏按钮
 * @param props {@link PostIdProps}
 */
export function RemoveFavoriteButton({ postId }: PostIdProps) {
  /** 取消收藏的 mutation 实例 */
  const toggleFavoriteMutation = useToggleFavorite();

  return (
    <Button
      variant="ghost"
      size="sm"
      loading={toggleFavoriteMutation.isPending}
      onClick={() =>
        toggleFavoriteMutation.mutate(postId, {
          onSuccess: () => toast.success('已取消收藏'),
          onError: () => toast.error('操作失败'),
        })
      }
    >
      <BookmarkX size={14} />
      取消收藏
    </Button>
  );
}
