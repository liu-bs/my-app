/**
 * @file PostActions.tsx
 * @description 文章操作栏，提供点赞、收藏与评论数展示，未登录时引导登录
 */
'use client';

import { Heart, Bookmark, MessageCircle } from 'lucide-react';
import toast from '@/lib/toast';
import { useToggleLike, useToggleFavorite, usePost } from '@/services/blog/hooks';
import { useMe } from '@/services/auth/hooks';
import { formatCount } from '@/lib/format';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import type { PostActionsProps } from '@my-app/shared';

/**
 * PostActions 文章操作栏
 * @param props {@link PostActionsProps}
 */
export function PostActions({ post: ssrPost, user: ssrUser }: PostActionsProps) {
  /** 点赞 mutation 实例 */
  const likeMutation = useToggleLike();
  /** 收藏 mutation 实例 */
  const favoriteMutation = useToggleFavorite();

  /** 订阅 client 端 post 缓存，SSR props 作 fallback（hydration 后无 mismatch） */
  const postQuery = usePost(ssrPost.id);
  /** 订阅 client 端 me 缓存，SSR props 作 fallback */
  const meQuery = useMe();
  const post = postQuery.data?.post ?? ssrPost;
  const user = meQuery.data?.user ?? ssrUser;

  /** 当前用户是否已点赞该文章 */
  const liked = !!user?.likedArticles?.includes(post.id);
  /** 当前用户是否已收藏该文章 */
  const favorited = !!user?.favoritedArticles?.includes(post.id);
  /** 未登录时按钮视觉降级，前置提示需登录 */
  const guestCls = !user ? 'opacity-60' : '';

  /**
   * 鉴权守卫，未登录时提示并跳转登录页
   */
  const requireAuth = useRequireAuth(user, `/posts/${post.id}`);

  /**
   * 切换点赞状态
   */
  const toggleLike = () =>
    requireAuth(() =>
      likeMutation.mutate(post.id, {
        onSuccess: (data) => {
          toast.success(data.liked ? '已点赞' : '已取消点赞');
        },
      }),
    );

  /**
   * 切换收藏状态
   */
  const toggleFavorite = () =>
    requireAuth(() =>
      favoriteMutation.mutate(post.id, {
        onSuccess: (data) => {
          toast.success(data.favorited ? '已收藏' : '已取消收藏');
        },
      }),
    );

  return (
    <div className="row-lg border-stroke mt-6 border-t border-b py-6">
      <button
        onClick={toggleLike}
        disabled={likeMutation.isPending}
        aria-pressed={liked}
        title={!user ? '登录后可点赞' : undefined}
        style={
          {
            '--like-hover-shadow':
              '0 0 0 1px color-mix(in srgb, var(--color-state-info) 25%, transparent), 0 4px 16px color-mix(in srgb, var(--color-state-info) 10%, transparent)',
          } as React.CSSProperties
        }
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-(length:--type-sm) font-medium transition-[background-color,color,box-shadow] duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${guestCls} ${
          liked
            ? 'bg-state-info-bg text-heading shadow-(--like-hover-shadow)'
            : 'border-stroke bg-surface text-body hover:bg-card-hover-bg hover:text-heading hover:shadow-(--like-hover-shadow)'
        }`}
      >
        <Heart size={16} className={liked ? 'fill-current' : ''} aria-hidden="true" />
        {likeMutation.isPending ? '处理中...' : liked ? '已点赞' : '点赞'} ·{' '}
        {formatCount(post.likes)}
      </button>

      <button
        onClick={toggleFavorite}
        disabled={favoriteMutation.isPending}
        aria-pressed={favorited}
        title={!user ? '登录后可收藏' : undefined}
        style={
          {
            '--fav-hover-shadow':
              '0 0 0 1px color-mix(in srgb, var(--color-accent) 25%, transparent), 0 4px 16px color-mix(in srgb, var(--color-accent) 10%, transparent)',
          } as React.CSSProperties
        }
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-(length:--type-sm) font-medium transition-[background-color,color,box-shadow] duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${guestCls} ${
          favorited
            ? 'bg-accent text-page shadow-(--fav-hover-shadow)'
            : 'border-stroke bg-surface text-body hover:bg-card-hover-bg hover:text-heading hover:shadow-(--fav-hover-shadow)'
        }`}
      >
        <Bookmark size={16} className={favorited ? 'fill-current' : ''} aria-hidden="true" />
        {favoriteMutation.isPending ? '处理中...' : favorited ? '已收藏' : '收藏'} ·{' '}
        {formatCount(post.favorites ?? 0)}
      </button>

      <span className="text-muted inline-flex items-center gap-1.5 text-(length:--type-sm)">
        <MessageCircle size={16} />
        {post.commentsCount} 条评论
      </span>
    </div>
  );
}
