/**
 * @file ProfileTabs.tsx
 * @description 个人中心 Tab 切换组件，切换 文章/收藏 两个面板
 */
'use client';

import { useState } from 'react';
import { MessageCircle, Edit, PenLine, FileText, Bookmark } from 'lucide-react';
import { ArticleCard } from '@/components/ArticleCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { DeletePostButton } from '@/app/posts/[id]/_components/DeletePostButton';
import { RemoveFavoriteButton } from './RemoveFavoriteButton';
import type { Post } from '@my-app/shared';

type Tab = 'articles' | 'favorites';

interface ProfileTabsProps {
  drafts: Post[];
  published: Post[];
  favorites: Post[];
}

/**
 * ProfileTabs 个人中心 Tab 切换
 * @param props {@link ProfileTabsProps}
 */
export function ProfileTabs({ drafts, published, favorites }: ProfileTabsProps) {
  const [tab, setTab] = useState<Tab>('articles');

  /** 合并文章列表：草稿在前，已发布在后 */
  const allArticles = [...drafts, ...published];

  return (
    <div className="min-w-0">
      {/* Tab 切换 */}
      <div className="segmented anim-fade-up stagger-2">
        <button
          onClick={() => setTab('articles')}
          className={`segmented-item ${tab === 'articles' ? 'segmented-item-on' : ''}`}
        >
          文章（{allArticles.length}）
        </button>
        <button
          onClick={() => setTab('favorites')}
          className={`segmented-item ${tab === 'favorites' ? 'segmented-item-on' : ''}`}
        >
          收藏（{favorites.length}）
        </button>
      </div>

      {/* 文章列表 */}
      {tab === 'articles' && (
        <div className="anim-fade-up stagger-3 mt-6">
          {allArticles.length === 0 ? (
            <EmptyState
              icon={<FileText size={20} />}
              title="还没有文章"
              description="开始写你的第一篇文章吧"
              action={
                <Button href="/write" size="sm">
                  <PenLine size={14} />
                  写文章
                </Button>
              }
            />
          ) : (
            <div className="card-list">
              {allArticles.map((post, i) => (
                <ArticleCard
                  key={post.id}
                  post={post}
                  href={`/posts/${post.id}`}
                  index={i}
                  extraStats={[
                    { icon: <MessageCircle size={12} />, value: post.commentsCount || 0 },
                  ]}
                  badge={
                    post.isDraft ? (
                      <span className="chip-sm">
                        <Edit size={10} />
                        草稿
                      </span>
                    ) : undefined
                  }
                  actions={
                    <>
                      <Button variant="ghost" size="sm" href={`/write?id=${post.id}`}>
                        <Edit size={14} />
                        编辑
                      </Button>
                      <DeletePostButton
                        postId={post.id}
                        variant="compact"
                        description="确定要删除这篇草稿吗？此操作无法撤销。"
                      />
                    </>
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 收藏列表 */}
      {tab === 'favorites' && (
        <div className="anim-fade-up stagger-3 mt-6">
          {favorites.length === 0 ? (
            <EmptyState
              icon={<Bookmark size={20} />}
              title="还没有收藏"
              description="浏览文章并点击收藏按钮，喜欢的文章会出现在这里"
            />
          ) : (
            <div className="card-list">
              {favorites.map((post, i) => (
                <ArticleCard
                  key={post.id}
                  post={post}
                  href={`/posts/${post.id}`}
                  index={i}
                  actions={<RemoveFavoriteButton postId={post.id} />}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
