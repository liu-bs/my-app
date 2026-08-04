/**
 * @file PostsSearchInput.tsx
 * @description 文章列表搜索输入框，防抖更新 URL 搜索参数并保持外部同步
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import type { PostsSearchInputProps } from '@my-app/shared';

/** 防抖延迟（ms） */
const DEBOUNCE_MS = 300;

/**
 * PostsSearchInput 文章搜索输入框
 * @param props {@link PostsSearchInputProps}
 */
export function PostsSearchInput({ initialValue }: PostsSearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  /** 当前搜索输入值 */
  const [query, setQuery] = useState(initialValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  /**
   * 防抖更新 URL 搜索参数，将搜索关键词同步到 URL
   */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const urlQ = params.get('q') ?? '';
      if (query.trim() === urlQ) return;
      if (query.trim()) params.set('q', query.trim());
      else params.delete('q');
      params.delete('page');
      const qs = params.toString();
      router.push(qs ? `/posts?${qs}` : '/posts');
    }, DEBOUNCE_MS);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * 外部 URL 参数变化时同步内部输入值（如清除筛选）
   */
  useEffect(() => {
    if (initialValue !== query) {
      setQuery(initialValue);
    }
  }, [initialValue]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * 清除搜索词并跳回无 q 的列表
   */
  const clearSearch = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    params.delete('page');
    const qs = params.toString();
    router.push(qs ? `/posts?${qs}` : '/posts');
  };

  return (
    <div className="relative flex items-center">
      <Search
        size={16}
        className="text-faint pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
      />
      <input
        id="posts-search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索文章..."
        className="border-stroke-strong bg-page text-body placeholder:text-faint input-focus h-9 w-full max-w-50 rounded-lg border py-0 pr-3 pl-9 text-(length:--type-sm) leading-normal"
      />
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="清除搜索"
          className="text-faint hover:bg-surface hover:text-heading absolute top-1/2 right-2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full transition-colors duration-150"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
