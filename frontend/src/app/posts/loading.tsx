import { Container } from '@/components/ui/Container';

/**
 * 文章列表页加载骨架屏
 * @description 匹配列表页实际布局：PageHeader + 侧边栏 + 卡片列表
 */
export default function Loading() {
  return (
    <Container className="page-section">
      <div className="page-header">
        <div className="bg-surface h-8 w-48 animate-pulse rounded-lg" />
        <div className="bg-surface mt-1.5 h-4 w-72 animate-pulse rounded" />
      </div>

      <div className="flex gap-10 max-lg:flex-col">
        {/* 侧边栏骨架 */}
        <aside className="w-65 shrink-0 max-lg:hidden">
          <div className="content-stack-lg sticky top-20">
            <div>
              <div className="bg-surface mb-3 h-3 w-12 animate-pulse rounded" />
              <div className="space-y-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="bg-surface h-9 w-full animate-pulse rounded-lg" />
                ))}
              </div>
            </div>
            <div>
              <div className="bg-surface mb-3 h-3 w-12 animate-pulse rounded" />
              <div className="flex flex-wrap gap-1.5">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-surface h-6 w-16 animate-pulse rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* 主内容区骨架 */}
        <div className="min-w-0 flex-1">
          {/* 搜索栏 + 筛选条骨架 */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="bg-surface h-4 w-32 animate-pulse rounded" />
            <div className="flex gap-3">
              <div className="bg-surface h-9 w-48 animate-pulse rounded-lg" />
              <div className="bg-surface h-9 w-32 animate-pulse rounded-lg" />
            </div>
          </div>

          {/* 卡片列表骨架 */}
          <div className="card-list">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card flex gap-4 p-4">
                <div className="bg-stroke h-20 w-50 shrink-0 animate-pulse rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="bg-stroke h-3 w-20 animate-pulse rounded" />
                  <div className="bg-stroke h-5 w-3/4 animate-pulse rounded" />
                  <div className="bg-stroke h-3 w-full animate-pulse rounded" />
                  <div className="bg-stroke h-3 w-1/2 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
