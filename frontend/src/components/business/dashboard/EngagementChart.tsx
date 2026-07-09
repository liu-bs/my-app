/**
 * @file EngagementChart.tsx
 * @description 互动趋势对比柱状图，展示近几个月的访问量与互动量
 */

import { FC } from "react";
import { BarChart3 } from "lucide-react";

/** 月度互动数据模型 */
interface MonthlyData {
  /** 月份缩写，如 Jun、Jul */
  month: string;
  /** 当月访问量（次） */
  views: number;
  /** 当月互动量（次） */
  engagement: number;
}

/** 近 6 个月的访问量与互动量模拟数据（单位：次） */
const MONTHLY_DATA: MonthlyData[] = [
  { month: "Jun", views: 65, engagement: 42 },
  { month: "Jul", views: 78, engagement: 55 },
  { month: "Aug", views: 52, engagement: 38 },
  { month: "Sep", views: 90, engagement: 68 },
  { month: "Oct", views: 85, engagement: 72 },
  { month: "Nov", views: 95, engagement: 80 },
];

/**
 * 互动概览柱状图
 * 使用纯 CSS 实现的双柱对比图，无第三方图表库依赖
 * 支持顶部时间范围切换（视觉层面，无实际逻辑）
 */
const EngagementChart: FC = () => {
  // 取所有月份中访问量的最大值作为柱状图高度归一化的基准
  const maxViews = Math.max(...MONTHLY_DATA.map((d) => d.views));

  return (
    <div className="border-border bg-surface rounded-xl border p-6"> {/* 图表卡片容器 */}
      {/* 卡片头部：左侧标题 + 右侧时间范围选择 */}
      <div className="mb-6 flex items-center justify-between">
        {/* 标题区域：图标 + 文字 */}
        <div className="flex items-center gap-2">
          {/* 柱状图小图标 */}
          <BarChart3 className="text-accent h-5 w-5" />
          {/* 图表标题 */}
          <h2 className="text-text-primary text-lg font-semibold">Engagement Overview</h2>
        </div>
        {/* 时间范围下拉选择器，切换不同统计区间 */}
        <select className="border-border bg-surface text-text-primary focus:border-accent rounded-lg border px-3 py-1.5 text-sm focus:outline-none">
          <option>Last 6 months</option>
          <option>Last 12 months</option>
          <option>This year</option>
        </select>
      </div>

      {/* 图表区域：固定高度 200px 的双柱并列条形图 */}
      <div className="flex items-end gap-3" style={{ height: "200px" }}>
        {/* 遍历渲染每个月份的双柱 */}
        {MONTHLY_DATA.map((data) => (
          <div key={data.month} className="flex flex-1 flex-col items-center gap-1"> {/* 单个月份柱状组容器 */}
            {/* 柱体区域容器，高度 170px */}
            <div className="flex w-full flex-col items-center gap-1" style={{ height: "170px" }}>
              <div className="flex w-full flex-1 flex-col justify-end gap-1">
                {/* 访问量柱容器：水平居中 */}
                <div className="flex w-full justify-center">
                  {/* 访问量柱：按比例缩放，最大高度 120px */}
                  <div
                    className="bg-accent w-4 rounded-t transition-all sm:w-6"
                    style={{
                      height: `${(data.views / maxViews) * 120}px`,
                    }}
                  />
                </div>
                {/* 互动量柱容器：水平居中 */}
                <div className="flex w-full justify-center">
                  {/* 互动量柱：同样以访问量最大值为基准进行缩放 */}
                  <div
                    className="bg-success w-4 rounded-t transition-all sm:w-6"
                    style={{
                      height: `${(data.engagement / maxViews) * 120}px`,
                    }}
                  />
                </div>
              </div>
            </div>
            {/* 月份标签 */}
            <span className="text-text-secondary text-xs">{data.month}</span>
          </div>
        ))}
      </div>

      {/* 图例区域：色块 + 文字说明 */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        {/* 访问量图例项 */}
        <span className="flex items-center gap-1.5">
          {/* 访问量颜色色块 */}
          <span className="bg-accent h-2.5 w-2.5 rounded-sm" />
          {/* 访问量文字说明 */}
          <span className="text-text-secondary">Views</span>
        </span>
        {/* 互动量图例项 */}
        <span className="flex items-center gap-1.5">
          {/* 互动量颜色色块 */}
          <span className="bg-success h-2.5 w-2.5 rounded-sm" />
          {/* 互动量文字说明 */}
          <span className="text-text-secondary">Engagement</span>
        </span>
      </div>
    </div>
  );
};

export default EngagementChart;
