/**
 * @file PostToc.tsx
 * @description 文章目录侧边栏，从渲染后的 DOM 提取标题、高亮当前章节并展示阅读进度
 */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { PostTocProps, TocItem } from '@my-app/shared';

/**
 * PostToc 文章目录侧边栏
 * @param props {@link PostTocProps}
 */
export function PostToc({ articleId }: PostTocProps) {
  /** 目录标题项列表 */
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  /** 当前高亮的标题 ID */
  const [activeId, setActiveId] = useState<string>('');
  /** 阅读进度（0-1） */
  const [progress, setProgress] = useState(0);
  /**
   * 滚动防抖定时器引用，用于点击目录跳转时暂停 IntersectionObserver 高亮
   */
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * 从渲染后的 DOM 中提取 h2/h3 标题构建目录项
   */
  // Extract headings from rendered DOM
  const extractHeadings = useCallback(() => {
    const article = document.getElementById(articleId);
    if (!article) return;
    const headings = Array.from(
      article.querySelectorAll('.article-content h2, .article-content h3'),
    ) as HTMLHeadingElement[];
    const items: TocItem[] = headings.map((h, idx) => {
      if (!h.id) h.id = `heading-${idx}`;
      return { id: h.id, text: h.textContent || '', sub: h.tagName === 'H3' };
    });
    setTocItems(items);
    setActiveId((prev) => prev || (items.length > 0 ? items[0].id : ''));
  }, [articleId]);

  /**
   * 初始化提取标题并监听 DOM 变化，动态更新目录
   */
  useEffect(() => {
    extractHeadings();
    // 监听 DOM 子树变化（评论计数等动态更新），重新提取 heading 文本
    const article = document.getElementById(articleId);
    if (!article) return;
    const observer = new MutationObserver(() => extractHeadings());
    observer.observe(article, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  /**
   * 监听标题可见性变化高亮当前章节，并计算滚动进度
   */
  // Highlight active heading + scroll progress
  useEffect(() => {
    if (tocItems.length === 0) return;
    const headings = tocItems
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollTimer.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    );
    headings.forEach((h) => observer.observe(h));

    // Scroll progress
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [tocItems]);

  /**
   * 平滑滚动到指定标题
   * @param headingId 标题元素 ID
   */
  const scrollToHeading = useCallback((headingId: string) => {
    const el = document.getElementById(headingId);
    if (!el) return;
    setActiveId(headingId);
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      scrollTimer.current = null;
    }, 800);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  /**
   * 组件卸载时清除滚动防抖定时器
   */
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, []);

  if (tocItems.length === 0) return null;

  /** 当前高亮标题在目录中的索引 */
  const activeIndex = tocItems.findIndex((h) => h.id === activeId);

  return (
    <aside className="toc hidden w-55 shrink-0 lg:block" aria-label="文章目录">
      <div className="animate-fade-in sticky top-20 hidden lg:block">
        {/* 阅读进度条 */}
        <div className="mb-4">
          <div className="text-faint mb-1.5 flex items-center justify-between text-(length:--type-2xs)">
            <span>阅读进度</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="bg-stroke h-0.75 w-full overflow-hidden rounded-full">
            <div
              className="bg-heading h-full rounded-full transition-[width] duration-150 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* 目录标签 */}
        <div className="toc-label text-faint mb-3 flex items-center gap-1.5 text-(length:--type-xs) leading-normal font-semibold tracking-[0.05em] uppercase">
          <span className="inline-block h-3 w-0.5 rounded-full bg-current opacity-50" />
          目录
          <span className="bg-stroke text-muted ml-1 rounded-full px-1.5 py-px text-(length:--type-2xs) font-medium tracking-normal normal-case">
            {tocItems.length}
          </span>
        </div>

        {/* 目录列表 */}
        <nav
          className="toc-list border-stroke flex flex-col gap-0.5 border-l"
          aria-label="文章内导航"
        >
          {tocItems.map((h) => {
            const active = activeId === h.id;
            return (
              <a
                key={h.id}
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(h.id);
                }}
                aria-current={active ? 'location' : undefined}
                aria-label={h.text}
                title={h.text}
                className={`toc-item block border-l-2 py-1.5 text-left leading-snug transition-all duration-200 ${
                  h.sub ? 'pl-6 text-(length:--type-xs)' : 'pl-3 text-(length:--type-sm)'
                } ${
                  active
                    ? 'border-accent text-heading -ml-px font-medium'
                    : 'text-muted hover:border-heading hover:text-heading -ml-px border-transparent transition-colors duration-200'
                }`}
              >
                <span className="block truncate">{h.text}</span>
              </a>
            );
          })}
        </nav>

        {/* 底部位置指示 */}
        {activeIndex >= 0 && (
          <div className="text-faint mt-3 text-(length:--type-2xs)">
            {activeIndex + 1} / {tocItems.length}
          </div>
        )}
      </div>
    </aside>
  );
}
