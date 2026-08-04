import { Container } from '@/components/ui/Container';

/**
 * 文章详情页加载骨架屏
 * @description 匹配详情页实际布局：返回链接 + 文章头部 + 封面 + 正文 + TOC 侧边栏
 */
export default function Loading() {
  return (
    <Container className="page-section">
      <div className="grid grid-cols-1 gap-10 pb-12 max-lg:gap-0 max-lg:pb-8 lg:grid-cols-[1fr_220px]">
        <article>
          {/* 返回链接 */}
          <div className="bg-surface mb-6 h-4 w-20 animate-pulse rounded" />

          {/* article head */}
          <header className="mb-8">
            {/* 分类 */}
            <div className="mb-4 flex gap-2">
              <div className="bg-surface h-6 w-16 animate-pulse rounded-full" />
            </div>
            {/* 标题 */}
            <div className="bg-surface mb-4 h-10 w-2/3 animate-pulse rounded-lg max-md:h-8" />
            {/* 摘要 */}
            <div className="bg-surface mb-2 h-4 w-full animate-pulse rounded" />
            <div className="bg-surface mb-6 h-4 w-3/4 animate-pulse rounded" />
            {/* 作者信息 + 统计 */}
            <div className="border-stroke mt-6 flex items-center gap-3 border-t pt-6">
              <div className="bg-surface h-10 w-10 animate-pulse rounded-full" />
              <div className="space-y-1">
                <div className="bg-surface h-4 w-24 animate-pulse rounded" />
                <div className="bg-surface h-3 w-36 animate-pulse rounded" />
              </div>
              <div className="ml-auto flex gap-3">
                <div className="bg-surface h-4 w-12 animate-pulse rounded" />
                <div className="bg-surface h-4 w-12 animate-pulse rounded" />
                <div className="bg-surface h-4 w-12 animate-pulse rounded" />
              </div>
            </div>
          </header>

          {/* 封面图 */}
          <div className="bg-surface mb-8 aspect-[21/9] w-full animate-pulse rounded-2xl max-md:aspect-[16/9]" />

          {/* 正文 */}
          <div className="space-y-3">
            <div className="bg-surface h-4 w-full animate-pulse rounded" />
            <div className="bg-surface h-4 w-full animate-pulse rounded" />
            <div className="bg-surface h-4 w-3/4 animate-pulse rounded" />
            <div className="bg-surface h-4 w-full animate-pulse rounded" />
            <div className="bg-surface h-4 w-5/6 animate-pulse rounded" />
            <div className="bg-surface h-4 w-full animate-pulse rounded" />
            <div className="bg-surface h-4 w-2/3 animate-pulse rounded" />
          </div>
        </article>

        {/* TOC 侧边栏骨架 */}
        <div className="hidden lg:block">
          <div className="sticky top-20 space-y-2">
            <div className="bg-surface h-3 w-12 animate-pulse rounded" />
            <div className="bg-surface h-3 w-32 animate-pulse rounded" />
            <div className="bg-surface h-3 w-24 animate-pulse rounded" />
            <div className="bg-surface h-3 w-28 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </Container>
  );
}
