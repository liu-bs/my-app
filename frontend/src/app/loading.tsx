/**
 * @file loading.tsx
 * @description Next.js 全局加载状态组件，在页面加载时显示加载动画
 */

/**
 * 全局加载状态组件
 *
 * 当页面正在加载时（如路由跳转、数据获取），Next.js 会显示此组件。
 * 使用旋转动画和加载提示文本提升用户体验。
 *
 * @returns 加载状态 UI
 */
export default function Loading() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center">
      {/* 加载动画 */}
      <div className="mb-4">
        <svg
          className="text-accent h-12 w-12 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>

      {/* 加载提示文本 */}
      <p className="text-text-secondary text-sm font-medium">加载中...</p>
    </div>
  );
}