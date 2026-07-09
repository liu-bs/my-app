/**
 * @file AuthorStats.tsx
 * @description 作者关键指标统计组件，以网格形式展示文章数、关注者数、获赞数与总阅读量等
 */
import { FC } from "react";
import { Eye, FileText, Heart, Users } from "lucide-react";
import { UserInfo } from "@/typeing";

interface AuthorStatsProps {
  /** 作者完整信息（用于读取 stats 子对象） */
  author: UserInfo;
}

/**
 * 作者数据概览组件
 * @param props 组件入参
 * @param props.author 作者信息（含 stats.articles/followers/following/likes/views）
 * @returns 渲染五项关键指标的卡片网格
 */
const AuthorStats: FC<AuthorStatsProps> = ({ author }) => {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-5"> {/* 统计卡片网格容器：移动端 2 列，桌面端 5 列；卡片间距 16px（gap-4） */}
      {/* 遍历渲染五项统计指标：文章数、关注者数、关注中、点赞数、总阅读量 */}
      {[
        { label: "Articles", value: author.stats.articles, icon: FileText },
        { label: "Followers", value: author.stats.followers, icon: Users },
        { label: "Following", value: author.stats.following, icon: Users },
        { label: "Likes", value: author.stats.likes, icon: Heart },
        { label: "Views", value: author.stats.views, icon: Eye },
      ].map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="border-border bg-surface rounded-xl border p-4 text-center"> {/* 单个统计指标卡片 */}
            {/* 指标图标 */}
            <Icon className="text-accent mx-auto mb-2 h-5 w-5" />
            {/* 指标数值 */}
            <p className="text-text-primary text-xl font-bold">{stat.value}</p>
            {/* 指标名称 */}
            <p className="text-text-secondary text-xs">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AuthorStats;
