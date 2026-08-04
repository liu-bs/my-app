/**
 * @file page.tsx
 * @description 文章详情页，展示文章正文、目录、操作栏与评论区，作者可编辑删除
 */
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import {
  Eye,
  Heart,
  MessageCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Avatar } from '@/components/ui/Avatar';
import { formatCount, formatDateCN, getInitials } from '@/lib/format';
import { estimateReadingTime, stripHtml, stripMarkdown } from '@/lib/markdown';
import { tagClassFor, tagVariantFor } from '@/components/ui/Tag';
import { blogApi, getCachedPost } from '@/services/blog/api';
import { getCurrentUser } from '@/services/auth/server';
import { SITE_URL } from '@/config/site';
import type { Post } from '@my-app/shared';
import { PostActions } from './_components/PostActions';
import { PostToc } from './_components/PostToc';
import { DeletePostButton } from './_components/DeletePostButton';
import { LazyComments, LazyBackToTop } from './_components/LazyIslands';

export const dynamic = 'force-dynamic';

/**
 * 生成文章详情页 SEO metadata
 * @description SSR 获取文章数据，返回 title/description/openGraph/twitter
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await getCachedPost(id);
    const post = data.post;
    const cleanTitle = stripMarkdown(post.title);
    const description = stripHtml(post.summary || post.content).slice(0, 160);
    return {
      title: `${cleanTitle} · 我的博客`,
      description,
      alternates: { canonical: `/posts/${id}` },
      openGraph: {
        title: cleanTitle,
        description,
        type: 'article',
        ...(post.coverImage && { images: [{ url: post.coverImage, width: 1200, height: 630 }] }),
      },
      twitter: {
        card: 'summary_large_image',
        title: cleanTitle,
        description,
        ...(post.coverImage && { images: [post.coverImage] }),
      },
    };
  } catch {
    return { title: '文章不存在 · 我的博客' };
  }
}

/**
 * 相邻文章导航 — 异步 Server Component，用 Suspense 包裹实现流式渲染
 */
async function NeighborPosts({ id }: { id: string }) {
  const neighborPosts = await blogApi.getNeighborPosts(id).catch(() => null);
  const prevPost = neighborPosts?.prev ?? null;
  const nextPost = neighborPosts?.next ?? null;

  if (!prevPost && !nextPost) return null;

  return (
    <nav className="mt-10 mb-8 grid gap-4 sm:grid-cols-2">
      {prevPost ? (
        <Link
          href={`/posts/${prevPost.id}`}
          className="card card-hover group flex flex-col gap-1 p-4"
        >
          <span className="text-faint flex items-center gap-1 text-(length:--type-xs) font-medium">
            <ChevronLeft size={14} />
            上一篇
          </span>
          <span className="text-heading group-hover:text-accent line-clamp-2 text-(length:--type-base) font-semibold transition-colors duration-150">
            {stripMarkdown(prevPost.title)}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
      {nextPost ? (
        <Link
          href={`/posts/${nextPost.id}`}
          className="card card-hover group flex flex-col gap-1 p-4 text-right"
        >
          <span className="text-faint flex items-center justify-end gap-1 text-(length:--type-xs) font-medium">
            下一篇
            <ChevronRight size={14} />
          </span>
          <span className="text-heading group-hover:text-accent line-clamp-2 text-(length:--type-base) font-semibold transition-colors duration-150">
            {stripMarkdown(nextPost.title)}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </nav>
  );
}

/**
 * 文章详情页
 * @description 获取并展示文章详情、目录、操作栏与评论区
 */
export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  /** 文章 ID */
  const { id } = await params;

  /** 文章数据 */
  let post: Post | null = null;

  /** 并行获取文章详情、当前用户 */
  const [postResult, user] = await Promise.all([
    getCachedPost(id)
      .then((data) => data.post)
      .catch(() => null),
    getCurrentUser(),
  ]);

  post = postResult;

  if (!post) {
    notFound();
  }

  /** 当前用户是否为该文章的作者 */
  const isAuthor = !!user && post.authorId === user.id;

  /** 作者头像首字母缩写 */
  const authorInitials = post.authorName
    ? getInitials(
        post.authorName.split(' ')[0] || '',
        post.authorName.split(' ').slice(1).join(' ') || '',
      )
    : '';

  return (
    <Container className="page-section">
      <div className="grid grid-cols-1 gap-10 pb-12 max-lg:gap-0 max-lg:pb-8 lg:grid-cols-[1fr_220px]">
        {/* main column */}
        <article>
          {/* 返回列表导航 */}
          <Link
            href="/posts"
            className="text-muted hover:text-heading mb-6 inline-flex items-center gap-1.5 text-(length:--type-sm) font-medium transition-colors duration-150"
          >
            <ArrowLeft size={15} />
            返回文章
          </Link>

          {/* article head */}
          <header className="article-head anim-fade-up stagger-1 mb-8">
            <div className="row-sm mb-4">
              <span className="chip">{post.category}</span>
            </div>

            <h1 className="article-title display-serif text-heading mt-0 text-(length:--type-5xl) leading-tight font-bold tracking-[-0.025em] max-md:text-(length:--type-3xl)">
              {stripMarkdown(post.title)}
            </h1>

            <p className="article-summary text-body mt-4 text-(length:--type-md) leading-normal max-md:text-(length:--type-base)">
              {stripHtml(post.summary)}
            </p>

            <div className="article-meta row-lg border-stroke mt-6 flex-wrap border-t pt-6">
              <div className="author-info flex items-center gap-3 max-md:gap-2.5">
                <Avatar initials={authorInitials} size="lg" />
                <div className="author-detail flex flex-col gap-0.5">
                  <span className="author-name text-heading text-(length:--type-base) leading-normal font-semibold">
                    {post.authorName}
                  </span>
                  <span className="author-sub meta-text">
                    {formatDateCN(post.publishedAt || post.createdAt)} · 约{' '}
                    {estimateReadingTime(post.content)} 分钟阅读
                  </span>
                </div>
              </div>
              <div className="meta-stats row-md text-muted ml-auto text-(length:--type-sm) leading-normal">
                <span className="meta-stat row-xs">
                  <Eye size={14} />
                  {formatCount(post.views)}
                </span>
                <span className="meta-stat-dot meta-dot" />
                <span className="meta-stat row-xs">
                  <Heart size={14} />
                  {formatCount(post.likes)}
                </span>
                <span className="meta-stat-dot meta-dot" />
                <span className="meta-stat row-xs">
                  <MessageCircle size={14} />
                  {post.commentsCount}
                </span>
              </div>
            </div>

            {/* author action buttons — 仅作者可见 */}
            {isAuthor && <DeletePostButton postId={post.id} variant="full" redirectTo="/posts" />}
          </header>

          {/* cover image */}
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={514}
              sizes="100vw"
              priority
              className="article-cover animate-fade-in mb-8 aspect-[21/9] w-full rounded-2xl object-cover max-md:aspect-[16/9]"
            />
          ) : (
            <div className="article-cover-fallback cover-fallback animate-fade-in mb-8 flex aspect-[21/9] w-full items-center justify-center rounded-2xl max-md:aspect-[16/9]">
              <ImageIcon size={48} strokeWidth={1.5} className="text-muted" />
            </div>
          )}

          {/* article content */}
          <div id="article-content" className="article-content-wrapper anim-fade-up stagger-3">
            <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* tags */}
            {post.tags?.length > 0 && (
              <div className="article-tags border-stroke mt-8 flex flex-wrap gap-2 border-t pt-6">
                {post.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/posts?tag=${encodeURIComponent(t)}`}
                    className={`badge-lg ${tagClassFor[tagVariantFor(t)]}`}
                  >
                    {t}
                  </Link>
                ))}
              </div>
            )}

            {/* actions bar — client island */}
            <PostActions post={post} user={user} />

            {/* comments section — client island */}
            <LazyComments postId={post.id} user={user} postAuthorId={post.authorId} />
          </div>

          {/* 上一篇 / 下一篇导航 — Suspense 流式加载，不阻塞文章正文 */}
          <Suspense
            fallback={<div className="bg-surface mt-10 mb-8 h-20 animate-pulse rounded-xl" />}
          >
            <NeighborPosts id={id} />
          </Suspense>
        </article>

        {/* TOC sidebar — client island, reads #article-content from DOM */}
        <PostToc articleId="article-content" />
      </div>

      {/* 返回顶部 */}
      <LazyBackToTop />

      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: stripMarkdown(post.title),
            description: stripHtml(post.summary),
            datePublished: post.publishedAt || post.createdAt,
            dateModified: post.updatedAt || post.publishedAt || post.createdAt,
            author: {
              '@type': 'Person',
              name: post.authorName,
            },
            ...(post.coverImage ? { image: post.coverImage } : {}),
          }).replace(/</g, '\\u003c'),
        }}
      />

      {/* BreadcrumbList 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: '文章', item: `${SITE_URL}/posts` },
              { '@type': 'ListItem', position: 3, name: stripMarkdown(post.title) },
            ],
          }).replace(/</g, '\\u003c'),
        }}
      />
    </Container>
  );
}
