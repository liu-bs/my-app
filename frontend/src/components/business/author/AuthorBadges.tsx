/**
 * @file AuthorBadges.tsx
 * @description 作者成就徽章组件，网格化展示作者已获得与未获得的各类徽章及说明
 */
import { FC } from "react";
import { Award, BookOpen, Flame, Medal, Star, Trophy, Zap } from "lucide-react";
import { UserInfo } from "@/typeing";

interface Badge {
  /** 徽章唯一标识 */
  id: string;
  /** 徽章名称 */
  name: string;
  /** 徽章描述（用于悬浮提示） */
  description: string;
  /** 徽章对应图标组件 */
  icon: FC<{ className?: string }>;
  /** 徽章主题色 class（Tailwind） */
  color: string;
  /** 是否已获得该徽章：true=已获得 false=未获得 */
  earned: boolean;
}

/** 徽章静态配置：包含作者可能获得的七类成就徽章定义 */
const BADGES: Badge[] = [
  {
    id: "pioneer",
    name: "Pioneer",
    description: "One of the first 100 authors",
    icon: Trophy,
    color: "text-yellow-500 bg-yellow-500/10",
    earned: true,
  },
  {
    id: "prolific",
    name: "Prolific Writer",
    description: "Published 50+ articles",
    icon: BookOpen,
    color: "text-blue-500 bg-blue-500/10",
    earned: true,
  },
  {
    id: "influencer",
    name: "Influencer",
    description: "10k+ total article views",
    icon: Zap,
    color: "text-purple-500 bg-purple-500/10",
    earned: true,
  },
  {
    id: "top-author",
    name: "Top Author",
    description: "Featured in top authors list",
    icon: Star,
    color: "text-orange-500 bg-orange-500/10",
    earned: true,
  },
  {
    id: "streak",
    name: "On Fire",
    description: "30-day writing streak",
    icon: Flame,
    color: "text-red-500 bg-red-500/10",
    earned: true,
  },
  {
    id: "mentor",
    name: "Mentor",
    description: "Helped 100+ community members",
    icon: Award,
    color: "text-green-500 bg-green-500/10",
    earned: false,
  },
  {
    id: "legend",
    name: "Legend",
    description: "100k+ total article views",
    icon: Medal,
    color: "text-amber-500 bg-amber-500/10",
    earned: false,
  },
];

interface AuthorBadgesProps {
  /** 作者完整信息（当前仅用于类型占位） */
  author: UserInfo;
}

/**
 * 作者徽章墙组件
 * @param props 组件入参
 * @param props.author 作者信息（当前实现未直接使用，保留以备扩展）
 * @returns 渲染徽章网格及已获数量统计
 */
const AuthorBadges: FC<AuthorBadgesProps> = ({ author }) => {
  /** 当前作者已获得徽章数量，单位：个 */
  const earnedCount = BADGES.filter((b) => b.earned).length;

  return (
    <section className="border-border bg-surface rounded-xl border p-6"> {/* 徽章墙容器：含标题、统计与徽章网格 */}
      <div className="mb-4 flex items-center justify-between">
        {/* 徽章墙标题 */}
        <h3 className="text-text-primary font-semibold">Badges</h3>
        {/* 已获徽章进度展示：已获得数 / 总数 */}
        <span className="text-text-secondary text-xs">
          {earnedCount}/{BADGES.length} earned
        </span>
      </div>

      {/* 徽章网格容器：移动端 3 列，桌面端 4 列 */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {/* 遍历渲染所有徽章配置项 */}
        {BADGES.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`group relative flex flex-col items-center gap-1.5 rounded-lg p-3 transition-colors ${
                // 未获得徽章置灰且不可点击
                badge.earned ? "hover:bg-surface-secondary cursor-pointer" : "cursor-default opacity-40"
              }`}
            >
              {/* 徽章圆形图标容器：宽高 40px（h-10 w-10） */}
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${badge.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              {/* 徽章名称 */}
              <span className="text-text-primary text-center text-xs font-medium">{badge.name}</span>

              {/* 悬浮提示气泡：hover 时放大显示徽章描述 */}
              <div className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 scale-0 rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white shadow-lg transition-transform group-hover:scale-100">
                {badge.description}
                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AuthorBadges;
