/**
 * @file TrendingTopics.tsx
 * @description 趋势页热门主题网格组件，渲染主题卡片
 */

import { FC } from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { TRENDING_TAGS } from "@/constans";

/** 主题数据结构（用于网格展示） */
interface Topic {
  /** 主题唯一 ID */
  id: number;
  /** 主题名称（显示用） */
  name: string;
  /** 主题下文章数 */
  count: number;
  /** 主题对应的 Tailwind 主题色 class（如 "bg-blue-500/10 text-blue-500"） */
  color: string;
}

/** 趋势页热门主题组件 Props */
interface TrendingTopicsProps {
  /** 主题列表；未传时从 TRENDING_TAGS 派生并循环分配颜色 */
  topics?: Topic[];
}

/** 主题候选色板，按下标循环分配给主题 */
const TOPIC_COLORS = [
  "bg-blue-500/10 text-blue-500",
  "bg-purple-500/10 text-purple-500",
  "bg-green-500/10 text-green-500",
  "bg-orange-500/10 text-orange-500",
  "bg-pink-500/10 text-pink-500",
  "bg-cyan-500/10 text-cyan-500",
  "bg-yellow-500/10 text-yellow-500",
  "bg-red-500/10 text-red-500",
];

/**
 * 趋势页热门主题网格组件
 * 当未传入 topics 时，从全局 TRENDING_TAGS 派生并循环分配颜色
 *
 * @param props 组件入参
 * @param [props.topics] 主题列表
 */
const TrendingTopics: FC<TrendingTopicsProps> = ({ topics }) => {
  /**
   * 展示用主题列表：优先使用 props.topics，
   * 否则从 TRENDING_TAGS 派生并按 i % TOPIC_COLORS.length 循环分配颜色
   */
  const displayTopics: Topic[] =
    topics ||
    TRENDING_TAGS.map((tag, i) => ({
      id: i,
      name: tag.name,
      count: parseInt(tag.count),
      color: TOPIC_COLORS[i % TOPIC_COLORS.length],
    }));

  return (
    <div> {/* 主题网格整体容器 */}
      {/* 区块标题行：图标 + 标题 */}
      <div className="mb-4 flex items-center gap-2">
        {/* 趋势图标 */}
        <TrendingUp className="text-accent h-5 w-5" />
        <h2 className="text-text-primary text-lg font-semibold">Trending Topics</h2>
      </div>
      {/* 主题网格：响应式 2/3/4 列 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {/* 遍历渲染主题卡片 */}
        {displayTopics.map((topic) => (
          /* 主题跳转链接：点击进入对应标签详情页 */
          <Link
            key={topic.id}
            href={`/tag/${topic.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="border-border bg-surface hover:border-accent/50 group flex flex-col items-center gap-2 rounded-xl border p-4 transition-all"
          >
            {/* 主题图标圆形徽章，按 color 着色 */}
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${topic.color}`}>
              <TrendingUp className="h-5 w-5" />
            </div>
            {/* 主题名 */}
            <span className="text-text-primary group-hover:text-accent font-medium transition-colors">{topic.name}</span>
            {/* 主题下文章数 */}
            <span className="text-text-secondary text-xs">{topic.count} articles</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics;
