/**
 * @file StatsGrid.tsx
 * @description 统计数据网格组件，以网格布局展示多个统计项的数值和标签
 */
import type { StatsGridProps } from '@my-app/shared';

/**
 * StatsGrid 统计数据网格
 * @param props {@link StatsGridProps}
 */
export function StatsGrid({ items, className = '' }: StatsGridProps) {
  return (
    <div className={`stats-grid ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="stat-item">
          {/* 统计数值 */}
          <div className="stat-value">{item.value}</div>
          {/* 统计标签 */}
          <div className="stat-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
