/**
 * @file StatsGrid.tsx
 * @description 仪表盘核心指标卡片网格，响应式展示多项关键数据
 */

import { FC } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { STATS } from "@/constans";

/**
 * 仪表盘统计卡片网格
 * 从常量 STATS 拉取数据，使用网格布局自适应展示每个指标卡
 * 指标卡包含图标、趋势（涨/跌）、数值与标题
 */
const StatsGrid: FC = () => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"> {/* 卡片网格容器：移动端 1 列，平板 2 列，桌面 4 列 */}
      {/* 遍历渲染指标卡片 */}
      {STATS.map((stat) => {
        // 从配置项中解构图标组件
        const Icon = stat.icon;
        return (
          <div key={stat.id} className="border-border bg-surface rounded-xl border p-6 transition-all hover:shadow-md"> {/* 单个指标卡容器 */}
            {/* 卡片顶部：左侧图标 + 右侧趋势 */}
            <div className="mb-4 flex items-start justify-between">
              {/* 图标圆形背景容器 */}
              <div className={`rounded-lg p-2 ${stat.iconBg}`}>
                {/* 指标对应图标 */}
                <Icon className="h-5 w-5" />
              </div>
              {/* 趋势标识：up 表示上涨（绿色），其他值表示下跌（红色） */}
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === "up" ? "text-success" : "text-error"}`}>
                {/* 趋势箭头：上涨显示上升图标，否则显示下降图标 */}
                {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {/* 变化幅度百分比文本 */}
                {stat.change}
              </div>
            </div>
            {/* 卡片底部：数值 + 标题 */}
            <div>
              {/* 指标数值 */}
              <p className="text-text-primary mb-1 text-2xl font-bold">{stat.value}</p>
              {/* 指标名称 */}
              <p className="text-text-secondary text-sm">{stat.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
