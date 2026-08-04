/**
 * @file page.tsx
 * @description 首页 Hero 区，展示品牌标语、CTA 入口与代码窗口装饰
 */
import { Search } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ArticleCard } from '@/components/ArticleCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { PinnedBadge } from '@/components/ui/PinnedBadge';
import { blogApi } from '@/services/blog/api';

/**
 * 首页
 * @description 展示 Hero 宣传区、品牌标语与 CTA 入口
 */
export default async function HomePage() {
  /** 最新文章列表（接口失败时为 null，区块不渲染） */
  const postsData = await blogApi.listPosts({ page: 1, limit: 6 }).catch(() => null);
  const latestPosts = postsData?.posts ?? [];
  /** 接口是否加载失败（区分空数据与错误态） */
  const postsLoadError = postsData === null;
  /** 是否还有更多文章 */
  const hasMore = (postsData?.total ?? 0) > latestPosts.length;

  return (
    <>
      <section className="hero-section" aria-label="品牌介绍">
        <Container>
          <div className="grid grid-cols-1 items-center gap-(--space-10) max-lg:gap-8 lg:grid-cols-[1fr_480px]">
            {/* 左文案 */}
            <div className="max-w-130 max-lg:max-w-none">
              <div className="anim-fade-up stagger-1 row-md m-0 mb-6 flex">
                <span
                  className="hero-dot animate-breathing inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                  aria-hidden="true"
                />
                <span className="text-muted text-(length:--type-sm) font-medium">
                  多作者技术写作平台
                </span>
              </div>

              <h1
                className="anim-fade-up stagger-2 display-serif text-heading hero-title m-0 mb-6"
                style={{ textWrap: 'balance' } as { textWrap: 'balance' }}
              >
                认真做事的人
                <br />
                工程的{' '}
                <em className="underline-accent text-heading font-medium italic">深度笔记</em>
              </h1>

              <p className="anim-fade-up stagger-3 text-body hero-lead m-0 mb-8">
                聚焦架构与工程实践，记录值得反复读的思考。
              </p>

              <div className="anim-fade-up stagger-4 flex flex-wrap items-center gap-3">
                <Button href="/posts" size="lg">
                  浏览文章
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-200 group-hover:translate-x-[2px]"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Button>
                <Button href="/register" variant="ghost" size="lg">
                  开始写作
                </Button>
              </div>
            </div>

            {/* 右 Mac 代码窗口 */}
            <div className="hero-code-window overflow-hidden" aria-hidden="true">
              {/* 窗口栏 */}
              <div className="hero-titlebar row-sm border-stroke border-b px-4 py-3">
                <span className="hero-dot-close h-3 w-3 shrink-0 rounded-full transition-transform duration-200 hover:scale-110" />
                <span className="hero-dot-minimize h-3 w-3 shrink-0 rounded-full transition-transform duration-200 hover:scale-110" />
                <span className="hero-dot-maximize h-3 w-3 shrink-0 rounded-full transition-transform duration-200 hover:scale-110" />
                <span className="text-muted ml-auto font-mono text-(length:--type-xs) tracking-[0.02em]">
                  middleware/authGuard.ts
                </span>
              </div>

              {/* 代码主体 */}
              <pre className="text-body m-0 overflow-x-auto px-4.5 py-3.5 font-mono text-(length:--type-xs) leading-loose max-md:px-4 max-md:pt-3.5 max-md:pb-5">
                <code className="bg-none font-[inherit]">
                  <span className="tok-comment">{'// 鉴权守卫：Cookie 校验 + 注入 user'}</span>
                  {'\n'}
                  <span className="tok-key">export const</span>{' '}
                  <span className="tok-fn">authGuard</span> <span className="tok-punct">=</span>{' '}
                  <span className="tok-key">async</span> <span className="tok-punct">(</span>
                  {'\n  '}
                  <span className="tok-fn">req</span>
                  <span className="tok-punct">:</span> <span className="tok-type">Request</span>
                  <span className="tok-punct">,</span>
                  {'\n  '}
                  <span className="tok-fn">next</span>
                  <span className="tok-punct">:</span>{' '}
                  <span className="tok-type">NextFunction</span>
                  <span className="tok-punct">,</span>
                  {'\n'}
                  <span className="tok-punct">{') => {'}</span>
                  {'\n  '}
                  <span className="tok-fn">req</span>
                  <span className="tok-punct">.</span>
                  <span className="tok-fn">user</span> <span className="tok-punct">=</span>{' '}
                  <span className="tok-key">await</span> <span className="tok-fn">verifyToken</span>
                  <span className="tok-punct">(</span>
                  <span className="tok-fn">req</span>
                  <span className="tok-punct">.</span>
                  <span className="tok-fn">cookies</span>
                  <span className="tok-punct">.</span>
                  <span className="tok-fn">auth_token</span>
                  <span className="tok-punct">);</span>
                  {'\n  '}
                  <span className="tok-fn">next</span>
                  <span className="tok-punct">();</span>
                  {'\n'}
                  <span className="tok-punct">{'};'}</span>
                </code>
              </pre>
            </div>
          </div>
        </Container>
      </section>

      {/* 最新文章区 — 接口失败或无文章时不渲染 */}
      {postsLoadError ? (
        <section className="page-section" aria-label="近期文章">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="display-serif text-heading m-0 text-(length:--type-3xl) leading-tight font-bold tracking-[-0.02em]">
                  近期文章
                </h2>
              </div>
            </div>
            <EmptyState
              icon={<Search size={20} />}
              title="文章加载失败"
              description="网络异常或服务暂时不可用，请稍后刷新页面重试"
              action={<Button href="/">刷新页面</Button>}
            />
          </Container>
        </section>
      ) : (
        latestPosts.length > 0 && (
          <section className="page-section" aria-label="近期文章">
            <Container>
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <h2 className="display-serif text-heading m-0 text-(length:--type-3xl) leading-tight font-bold tracking-[-0.02em]">
                    近期文章
                  </h2>
                  <p className="text-muted mt-1.5 text-(length:--type-sm) leading-normal">
                    最新发布的技术文章与工程实践
                  </p>
                </div>
                <Button href="/posts" variant="ghost" size="sm">
                  {hasMore ? `查看全部 ${postsData?.total ?? ''} 篇` : '查看全部'}
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {latestPosts.map((p, i) => (
                  <ArticleCard
                    key={p.id}
                    post={p}
                    href={`/posts/${p.id}`}
                    index={i}
                    tags={p.tags}
                    badge={p.pinned ? <PinnedBadge /> : undefined}
                    variant="vertical"
                  />
                ))}
              </div>
            </Container>
          </section>
        )
      )}
    </>
  );
}
