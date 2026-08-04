/**
 * @file page.tsx
 * @description 文章列表页，支持分类/标签筛选、搜索、分页与草稿切换
 */
import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ArticleCard } from '@/components/ArticleCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { PinnedBadge } from '@/components/ui/PinnedBadge';
import { PageHeader } from '@/components/layout/PageHeader';
import { blogApi } from '@/services/blog/api';
import { getCurrentUser } from '@/services/auth/server';
import { PAGE_SIZE } from '@/config/site';
import { Suspense } from 'react';
import { PostSidebar } from './_components/PostSidebar';
import { PostsSearchInput } from './_components/PostsSearchInput';
import { buildPostsUrl } from './_lib/buildPostsUrl';

export const metadata: Metadata = {
  title: '全部文章 · 我的博客',
  description: '浏览所有已发布内容，按分类或标签筛选你感兴趣的话题。',
};

export const revalidate = 60;

/**
 * 文章列表页
 * @description 支持分类/标签筛选、搜索、分页与草稿切换，并行获取文章与筛选项数据
 */
export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;

  /** 当前选中的分类 */
  const category = typeof sp.category === 'string' ? sp.category : undefined;
  /** 当前选中的标签 */
  const tag = typeof sp.tag === 'string' ? sp.tag : undefined;
  /** 是否查看草稿 */
  const isDraft = sp.draft === 'true';
  /** 当前页码 */
  const page = Number(sp.page) || 1;
  /** 搜索关键词 */
  const q = typeof sp.q === 'string' ? sp.q : undefined;

  // Base params for URL building
  /** URL 构建的基础参数对象 */
  const baseParams: Record<string, string | undefined> = {
    category,
    tag,
    draft: isDraft ? 'true' : undefined,
    q,
    page: page > 1 ? String(page) : undefined,
  };

  /** 是否已登录 */
  const currentUser = await getCurrentUser();
  const isLoggedIn = !!currentUser;

  // Fetch data in parallel
  const [postsResult, categoriesData, tagsData] = await Promise.all([
    blogApi
      .listPosts({
        draft: isDraft ? 'true' : undefined,
        category: category !== '全部' ? category : undefined,
        tag: tag ?? undefined,
        q: q?.trim() || undefined,
        page,
        limit: PAGE_SIZE,
      })
      .catch(() => null),
    blogApi.listCategories().catch(() => ({ categories: [] })),
    blogApi.listTags().catch(() => ({ tags: [] })),
  ]);

  /** 接口是否加载失败（区分空数据与错误态） */
  const postsLoadError = postsResult === null;

  /** 分类列表（含"全部"选项） */
  const categories = ['全部', ...(categoriesData?.categories ?? [])];
  /** 标签列表 */
  const tags = tagsData?.tags ?? [];
  /** 当前选中的分类（默认"全部"） */
  const currentCategory = category ?? '全部';
  /** 当前选中的标签（无则为 null） */
  const currentTag = tag ?? null;

  /** 草稿模式但未登录且获取失败的错误标记 */
  const draftError = isDraft && !isLoggedIn && !postsResult;

  // 分页页码越界时 redirect 到正确页
  if (
    !postsLoadError &&
    postsResult &&
    page > postsResult.totalPages &&
    postsResult.totalPages > 0
  ) {
    const correctedParams = new URLSearchParams();
    for (const [k, v] of Object.entries(baseParams)) {
      if (v && k !== 'page') correctedParams.set(k, v);
    }
    correctedParams.set('page', String(postsResult.totalPages));
    redirect(`/posts?${correctedParams.toString()}`);
  }

  /** 文章列表 */
  const posts = postsResult?.posts ?? [];
  /** 文章总数 */
  const total = postsResult?.total ?? 0;
  /** 总页数 */
  const totalPages = Math.max(1, postsResult?.totalPages ?? 1);
  /** 当前页码（后端返回值优先，否则用 URL 传入值） */
  const rawPage = postsResult?.page ?? page;
  /** 越界修正后的当前页码，确保落在 [1, totalPages] 区间 */
  const currentPage = Math.min(Math.max(1, rawPage), totalPages);

  /** 是否存在筛选条件（含页码越界场景，便于空态展示"清除筛选"） */
  const hasFilters = !!(q?.trim() || category || tag) || (totalPages > 1 && rawPage > totalPages);

  // Pagination sliding window
  /** 分页滑窗最大页码数 */
  const maxPages = Math.min(5, totalPages);
  /** 分页滑窗起始页码 */
  let pageStart = Math.max(1, currentPage - 2);
  /** 分页滑窗结束页码 */
  const pageEnd = Math.min(totalPages, pageStart + maxPages - 1);
  pageStart = Math.max(1, pageEnd - maxPages + 1);
  /** 当前滑窗内的页码数组 */
  const pageNumbers = Array.from({ length: pageEnd - pageStart + 1 }, (_, i) => pageStart + i);

  return (
    <Container className="page-section">
      <PageHeader
        title="全部文章"
        subtitle="浏览所有已发布内容，按分类或标签筛选你感兴趣的话题。"
      />

      <Suspense fallback={<div className="w-65 animate-pulse" />}>
        <PostSidebar
          categories={categories}
          tags={tags}
          currentCategory={currentCategory}
          currentTag={currentTag}
          zeroResults={posts.length === 0}
        >
          <div className="anim-fade-up stagger-2 mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted text-(length:--type-sm) leading-normal">
              共 {total} 篇{totalPages > 1 ? ` · 第 ${currentPage}/${totalPages} 页` : ''}
            </p>
            <div className="row-md flex-wrap">
              <PostsSearchInput initialValue={q ?? ''} />
              {isLoggedIn && (
                <div className="segmented">
                  <Link
                    href={buildPostsUrl(baseParams, { draft: undefined })}
                    className={`segmented-item ${!isDraft ? 'segmented-item-on' : ''}`}
                  >
                    已发布
                  </Link>
                  <Link
                    href={buildPostsUrl(baseParams, { draft: 'true' })}
                    className={`segmented-item ${isDraft ? 'segmented-item-on' : ''}`}
                  >
                    我的草稿
                  </Link>
                </div>
              )}
            </div>
          </div>

          {draftError ? (
            <EmptyState
              icon={<Search size={20} />}
              title="草稿仅登录后可见"
              description="登录后即可查看你的草稿箱"
              action={
                <Button href="/login" variant="ghost" size="sm">
                  去登录
                </Button>
              }
            />
          ) : postsLoadError ? (
            <EmptyState
              icon={<Search size={20} />}
              title="文章加载失败"
              description="网络异常或服务暂时不可用，请稍后刷新页面重试"
              action={
                <Button href="/posts" variant="ghost" size="sm">
                  刷新页面
                </Button>
              }
            />
          ) : posts.length === 0 ? (
            <EmptyState
              icon={<Search size={20} />}
              title={isDraft ? '还没有草稿' : '没有符合条件的文章'}
              description={isDraft ? '写一篇新文章开始你的创作' : '尝试调整筛选条件或搜索关键词'}
              action={
                hasFilters ? (
                  <Button href="/posts" variant="ghost" size="sm">
                    清除筛选
                  </Button>
                ) : isDraft ? (
                  <Button href="/write" size="sm">
                    写文章
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="card-list">
              {posts.map((p, i) => (
                <ArticleCard
                  key={p.id}
                  post={p}
                  href={`/posts/${p.id}`}
                  index={i}
                  tags={p.tags}
                  badge={p.pinned ? <PinnedBadge /> : undefined}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="分页导航">
              {currentPage === 1 ? (
                <span className="page-btn pointer-events-none w-9 opacity-40" aria-label="上一页">
                  <ChevronLeft size={16} />
                </span>
              ) : (
                <Link
                  href={buildPostsUrl(baseParams, { page: String(Math.max(1, currentPage - 1)) })}
                  className="page-btn w-9"
                  aria-label="上一页"
                >
                  <ChevronLeft size={16} />
                </Link>
              )}
              {pageNumbers.map((n) => (
                <Link
                  key={n}
                  href={buildPostsUrl(baseParams, { page: String(n) })}
                  aria-current={n === currentPage ? 'page' : undefined}
                  aria-label={`第 ${n} 页`}
                  className={`page-btn min-w-9 px-2.5 text-(length:--type-sm) ${
                    n === currentPage
                      ? 'border-accent bg-accent text-page cursor-default font-medium shadow-sm'
                      : ''
                  }`}
                >
                  {n}
                </Link>
              ))}
              {currentPage === totalPages ? (
                <span className="page-btn pointer-events-none w-9 opacity-40" aria-label="下一页">
                  <ChevronRight size={16} />
                </span>
              ) : (
                <Link
                  href={buildPostsUrl(baseParams, {
                    page: String(Math.min(totalPages, currentPage + 1)),
                  })}
                  className="page-btn w-9"
                  aria-label="下一页"
                >
                  <ChevronRight size={16} />
                </Link>
              )}
            </nav>
          )}
        </PostSidebar>
      </Suspense>
    </Container>
  );
}
