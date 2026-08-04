/** 页面级加载骨架屏 */
export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="bg-surface h-8 w-1/4 rounded" />
      <div className="bg-surface h-12 w-full rounded" />
      <div className="bg-surface h-64 rounded-xl" />
    </div>
  );
}
