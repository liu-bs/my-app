/**
 * @file PostSidebar.tsx
 * @description 文章列表侧边栏，提供分类与标签筛选导航
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';
import { tagClassFor, tagVariantFor } from '@/components/ui/Tag';
import type { PostSidebarProps } from '@my-app/shared';
import { buildPostsUrl } from '../_lib/buildPostsUrl';

/**
 * PostSidebar 文章列表侧边栏
 * @param props {@link PostSidebarProps}
 */
export function PostSidebar({
  categories,
  tags,
  currentCategory,
  currentTag,
  children,
  zeroResults,
}: PostSidebarProps) {
  /** 移动端筛选面板展开标记 */
  const [showFilter, setShowFilter] = useState(false);
  const searchParams = useSearchParams();
  /** 零结果时筛选链接附带清除搜索词 q，避免无意义叠加；否则维持 q 现状（传 null=删除不影响，因 buildPostsUrl 只在值为 null/空时删 key） */
  const clearQ: Record<string, string | null> = zeroResults ? { q: null } : {};
  /** 当前分类是否有效（不在分类列表中时切换标签清除分类，避免无效参数叠加） */
  const validCategorySet = new Set(categories);
  const shouldClearCategory = !!(currentCategory && !validCategorySet.has(currentCategory));

  return (
    <>
      <button
        onClick={() => setShowFilter((v) => !v)}
        className={`row-md card card-hover text-heading mb-5 inline-flex px-4 py-2.5 text-(length:--type-base) leading-normal font-medium lg:hidden`}
      >
        <Filter size={16} />
        筛选
      </button>

      <div className="flex gap-10 max-lg:flex-col">
        <aside
          className={`w-65 shrink-0 max-lg:w-full ${showFilter ? 'block' : 'hidden'} lg:block`}
        >
          <div className="content-stack-lg sticky top-20">
            <div className="anim-fade-up stagger-2">
              <h3 className="filter-heading mb-3">分类</h3>
              <ul className="space-y-1">
                {categories.map((name) => {
                  const active = currentCategory === name;
                  return (
                    <li key={name}>
                      <Link
                        href={buildPostsUrl(searchParams, {
                          category: name !== '全部' ? name : null,
                          tag: null,
                          ...clearQ,
                        })}
                        aria-pressed={active}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-(length:--type-sm) font-medium transition-[background-color,color,box-shadow] duration-150 ease-out ${
                          active
                            ? 'bg-accent text-page shadow-sm'
                            : 'text-body hover:bg-surface hover:text-heading'
                        }`}
                      >
                        <span>{name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="anim-fade-up stagger-3">
              <h3 className="filter-heading mb-3">标签</h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => {
                  const tagName = typeof t === 'string' ? t : t.name;
                  const tagCount = typeof t === 'string' ? 0 : t.count;
                  const active = currentTag === tagName;
                  return (
                    <Link
                      key={tagName}
                      href={buildPostsUrl(searchParams, {
                        tag: active ? null : tagName,
                        ...(shouldClearCategory ? { category: null } : {}),
                        ...clearQ,
                      })}
                      aria-pressed={active}
                      className={`rounded-full px-2.5 py-0.5 text-(length:--type-xs) leading-normal font-medium transition-[background-color,color,box-shadow] duration-150 ${
                        active
                          ? 'bg-accent text-page shadow-sm'
                          : `${tagClassFor[tagVariantFor(tagName)]} hover:brightness-[1.06]`
                      }`}
                    >
                      {tagName}
                      {tagCount > 0 && <span className="ml-1 opacity-60">{tagCount}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </>
  );
}
