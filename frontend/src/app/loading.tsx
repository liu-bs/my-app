import { Container } from '@/components/ui/Container';

/**
 * 全局路由加载态
 * @description 骨架屏匹配首页布局：Hero 区 + 文章卡片网格
 */
export default function Loading() {
  return (
    <>
      {/* Hero 区骨架 */}
      <section className="hero-section">
        <Container>
          <div className="grid grid-cols-1 items-center gap-(--space-10) max-lg:gap-8 lg:grid-cols-[1fr_480px]">
            {/* 左文案 */}
            <div className="max-w-130 max-lg:max-w-none">
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-surface h-1.5 w-1.5 shrink-0 animate-pulse rounded-full" />
                <div className="bg-surface h-4 w-32 animate-pulse rounded" />
              </div>
              <div className="bg-surface mb-6 h-16 w-full animate-pulse rounded-lg" />
              <div className="bg-surface mb-6 h-16 w-3/4 animate-pulse rounded-lg" />
              <div className="bg-surface mb-8 h-5 w-80 max-w-full animate-pulse rounded" />
              <div className="flex items-center gap-3">
                <div className="bg-accent h-11 w-28 animate-pulse rounded-lg" />
                <div className="bg-surface h-11 w-28 animate-pulse rounded-lg" />
              </div>
            </div>
            {/* 右 Mac 代码窗口 */}
            <div className="hero-code-window overflow-hidden">
              <div className="hero-titlebar row-sm border-stroke border-b px-4 py-3">
                <span className="bg-surface h-3 w-3 shrink-0 animate-pulse rounded-full" />
                <span className="bg-surface h-3 w-3 shrink-0 animate-pulse rounded-full" />
                <span className="bg-surface h-3 w-3 shrink-0 animate-pulse rounded-full" />
                <span className="bg-surface ml-auto h-3 w-32 animate-pulse rounded" />
              </div>
              <div className="px-4.5 py-3.5">
                <div className="space-y-2">
                  <div className="bg-surface h-3 w-3/4 animate-pulse rounded" />
                  <div className="bg-surface h-3 w-full animate-pulse rounded" />
                  <div className="bg-surface h-3 w-5/6 animate-pulse rounded" />
                  <div className="bg-surface h-3 w-2/3 animate-pulse rounded" />
                  <div className="bg-surface h-3 w-full animate-pulse rounded" />
                  <div className="bg-surface h-3 w-1/2 animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 近期文章区骨架 */}
      <section className="page-section">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="bg-surface h-8 w-32 animate-pulse rounded-lg" />
              <div className="bg-surface mt-1.5 h-4 w-48 animate-pulse rounded" />
            </div>
            <div className="bg-surface h-9 w-24 animate-pulse rounded-lg" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card p-3">
                <div className="bg-stroke mb-3 aspect-16/10 w-full animate-pulse rounded-lg" />
                <div className="space-y-2">
                  <div className="bg-stroke h-3 w-16 animate-pulse rounded" />
                  <div className="bg-stroke h-5 w-3/4 animate-pulse rounded" />
                  <div className="bg-stroke h-3 w-full animate-pulse rounded" />
                  <div className="bg-stroke h-3 w-1/2 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
