/**
 * @file AboutStats.tsx
 * @description 关于页数据统计区组件，以 2x4 网格形式展示平台的关键指标（文章数、用户数等）
 */
import { FC } from "react";
import { ABOUT_STATS } from "@/constans";

/**
 * 关于页统计区组件的 Props（当前未传任何参数，预留扩展位）
 */
interface AboutStatsProps {}

/**
 * 关于页统计区组件
 * 遍历 ABOUT_STATS 常量数组，渲染每条数据（数值 + 标签），移动端 2 列、桌面端 4 列
 * @param [props] 当前未使用，保留以便后续扩展
 * @returns 渲染完成的统计区 JSX
 */
const AboutStats: FC<AboutStatsProps> = (_props) => {
  return (
    <>{/* 关于页数据统计区容器，上下边框分隔 */}
      <section className="border-border border-y py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 统计卡片网格容器，移动端 2 列，桌面端 4 列 */}
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {/* 遍历渲染统计指标，每条数据对应一个数值与一个标签 */}
            {ABOUT_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                {/* 指标数值展示行，突出显示 */}
                <p className="text-accent mb-2 text-3xl font-bold sm:text-4xl">{stat.value}</p>
                {/* 指标标签说明文案 */}
                <p className="text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutStats;
