/**
 * @file TagStats.tsx
 * @description 标签每周数据统计组件，展示文章数、互动率及柱状图
 */

import { FC } from "react";
import { BarChart3, FileText, TrendingUp, Users } from "lucide-react";

/** 一周某天的统计数据 */
interface WeeklyData {
  /** 星期标签，如 "Mon"、"Tue" */
  label: string;
  /** 当日文章数 */
  articles: number;
  /** 当日互动率（百分比） */
  engagement: number;
}

/** 模拟一周内 7 天的标签数据 */
const WEEKLY_STATS: WeeklyData[] = [
  { label: "Mon", articles: 12, engagement: 45 },
  { label: "Tue", articles: 18, engagement: 62 },
  { label: "Wed", articles: 25, engagement: 78 },
  { label: "Thu", articles: 20, engagement: 55 },
  { label: "Fri", articles: 30, engagement: 85 },
  { label: "Sat", articles: 15, engagement: 40 },
  { label: "Sun", articles: 22, engagement: 68 },
];

/**
 * 标签每周数据统计组件
 * 渲染本周文章总数、互动率、活跃用户三项摘要卡，
 * 并以柱状图形式展示每日文章数与互动率
 */
const TagStats: FC = () => {
  // 计算文章数的最大值，用于柱状图比例归一化
  const maxArticles = Math.max(...WEEKLY_STATS.map((d) => d.articles));
  // 计算互动率的最大值，用于柱状图比例归一化
  const maxEngagement = Math.max(...WEEKLY_STATS.map((d) => d.engagement));

  // 本周文章总数
  const totalArticles = WEEKLY_STATS.reduce((sum, d) => sum + d.articles, 0);
  // 本周平均互动率（取整）
  const avgEngagement = Math.round(WEEKLY_STATS.reduce((sum, d) => sum + d.engagement, 0) / WEEKLY_STATS.length);

  return (
    <section className="border-border bg-surface rounded-xl border p-6"> {/* 每周统计卡片容器 */}
      {/* 卡片标题行：图标 + 标题 */}
      <div className="mb-4 flex items-center gap-2">
        {/* 柱状图图标 */}
        <BarChart3 className="text-accent h-5 w-5" />
        <h3 className="text-text-primary font-semibold">Weekly Stats</h3>
      </div>

      {/* 三项摘要指标：文章数 / 平均互动率 / 活跃用户 */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {/* 文章数摘要卡 */}
        <div className="bg-surface-secondary rounded-lg p-3 text-center">
          {/* 文章数图标 */}
          <FileText className="text-accent mx-auto mb-1 h-4 w-4" />
          <p className="text-text-primary text-lg font-bold">{totalArticles}</p>
          <p className="text-text-secondary text-xs">Articles</p>
        </div>
        {/* 平均互动率摘要卡 */}
        <div className="bg-surface-secondary rounded-lg p-3 text-center">
          {/* 上升趋势图标 */}
          <TrendingUp className="text-success mx-auto mb-1 h-4 w-4" />
          <p className="text-text-primary text-lg font-bold">{avgEngagement}%</p>
          <p className="text-text-secondary text-xs">Avg Eng.</p>
        </div>
        {/* 活跃用户摘要卡（硬编码 2.4k） */}
        <div className="bg-surface-secondary rounded-lg p-3 text-center">
          {/* 用户图标 */}
          <Users className="mx-auto mb-1 h-4 w-4 text-blue-500" />
          <p className="text-text-primary text-lg font-bold">2.4k</p>
          <p className="text-text-secondary text-xs">Active</p>
        </div>
      </div>

      {/* 每日文章数与互动率柱状图列表 */}
      <div className="space-y-3">
        {/* 遍历渲染一周 7 天的双柱状条 */}
        {WEEKLY_STATS.map((day) => (
          <div key={day.label} className="flex items-center gap-3">
            {/* 星期标签 */}
            <span className="text-text-secondary w-8 text-xs">{day.label}</span>
            {/* 柱状条 + 数值容器 */}
            <div className="flex-1">
              {/* 文章数柱状行 */}
              <div className="flex items-center gap-2">
                <div className="bg-surface-secondary h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="bg-accent h-full rounded-full transition-all"
                    style={{
                      // 文章数柱状宽度：按占当日最大值百分比
                      width: `${(day.articles / maxArticles) * 100}%`,
                    }}
                  />
                </div>
                {/* 文章数数值 */}
                <span className="text-text-secondary w-6 text-right text-xs">{day.articles}</span>
              </div>
              {/* 互动率柱状行 */}
              <div className="mt-1 flex items-center gap-2">
                <div className="bg-surface-secondary h-1.5 flex-1 overflow-hidden rounded-full">
                  <div
                    className="bg-success h-full rounded-full transition-all"
                    style={{
                      // 互动率柱状宽度：按占当日最大值百分比
                      width: `${(day.engagement / maxEngagement) * 100}%`,
                    }}
                  />
                </div>
                {/* 互动率数值 */}
                <span className="text-text-secondary w-6 text-right text-[10px]">{day.engagement}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 图例行：色块 + 文案 */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          {/* 文章数色块 */}
          <span className="bg-accent h-2 w-2 rounded-full" />
          Articles
        </span>
        <span className="flex items-center gap-1.5">
          {/* 互动率色块 */}
          <span className="bg-success h-2 w-2 rounded-full" />
          Engagement
        </span>
      </div>
    </section>
  );
};

export default TagStats;
