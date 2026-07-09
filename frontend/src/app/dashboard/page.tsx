/**
 * @file page.tsx
 * @description 仪表盘页面：汇总展示头部、统计、互动图表、近期评论、热门文章等模块
 */
"use client";
import DashboardHeader from "@/components/business/dashboard/DashboardHeader";
import EngagementChart from "@/components/business/dashboard/EngagementChart";
import RecentComments from "@/components/business/dashboard/RecentComments";
import StatsGrid from "@/components/business/dashboard/StatsGrid";
import TopPerformingPosts from "@/components/business/dashboard/TopPerformingPosts";

/**
 * 仪表盘页面
 * @returns 由头部、统计卡片、互动图表、近期评论与热门文章组成的仪表盘布局
 */
export default function DashboardPage() {
  return (
    <>
      {/* 仪表盘顶部欢迎/概览信息区 */}
      <DashboardHeader />
      {/* 统计卡片网格，展示关键运营指标 */}
      <StatsGrid />

      {/* 互动图表与近期评论的双列响应式布局容器 */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* 互动趋势图表，展示阅读/点赞/评论随时间变化 */}
        <EngagementChart />
        {/* 近期评论列表，呈现用户最新互动内容 */}
        <RecentComments />
      </div>

      {/* 热门文章表现区块容器 */}
      <div className="mt-8">
        {/* 表现最佳的热门文章榜单 */}
        <TopPerformingPosts />
      </div>
    </>
  );
}
