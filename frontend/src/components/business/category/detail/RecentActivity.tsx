/**
 * @file RecentActivity.tsx
 * @description 分类详情页近期动态组件，列表展示文章发布、评论、点赞、精选四类活动
 */
import { FC } from "react";
import { Clock, FileText, Heart, MessageSquare, Star } from "lucide-react";

interface ActivityItem {
  /** 活动项唯一标识 */
  id: string;
  /** 活动类型：article 新文章 / comment 评论 / like 点赞 / featured 精选 */
  type: "article" | "comment" | "like" | "featured";
  /** 活动对应内容标题或描述 */
  title: string;
  /** 触发者姓名 */
  author: string;
  /** 触发者头像 URL */
  avatar: string;
  /** 相对时间字符串，如 "2 hours ago" */
  time: string;
}

/** 近期动态静态数据：含 5 条最新文章发布、评论、点赞、精选活动 */
const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    type: "article",
    title: "Building Scalable Microservices with Node.js",
    author: "Alex Chen",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    time: "2 hours ago",
  },
  {
    id: "2",
    type: "comment",
    title: "Great insights on system design patterns!",
    author: "Sarah Miller",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    time: "4 hours ago",
  },
  {
    id: "3",
    type: "featured",
    title: "Advanced TypeScript Patterns for React",
    author: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    time: "6 hours ago",
  },
  {
    id: "4",
    type: "like",
    title: "CSS Grid vs Flexbox: When to Use Which",
    author: "Emily Watson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    time: "8 hours ago",
  },
  {
    id: "5",
    type: "article",
    title: "Understanding WebAssembly for Web Developers",
    author: "David Kim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    time: "12 hours ago",
  },
];

/** 活动类型与展示配置（图标、配色、动作标签）的映射表 */
const ACTIVITY_CONFIG = {
  /** 新发布文章活动配置 */
  article: {
    icon: FileText,
    color: "text-blue-500 bg-blue-500/10",
    label: "New article",
  },
  /** 评论活动配置 */
  comment: {
    icon: MessageSquare,
    color: "text-green-500 bg-green-500/10",
    label: "Comment",
  },
  /** 点赞活动配置 */
  like: {
    icon: Heart,
    color: "text-red-500 bg-red-500/10",
    label: "Liked",
  },
  /** 精选活动配置 */
  featured: {
    icon: Star,
    color: "text-yellow-500 bg-yellow-500/10",
    label: "Featured",
  },
};

/**
 * 分类详情页近期动态组件
 * @returns 渲染「Recent Activity」卡片，列表展示 5 条最新动态
 */
const RecentActivity: FC = () => {
  return (
    <section className="border-border bg-surface rounded-xl border p-6"> {/* 近期动态卡片容器：圆角带边框，背景色为 surface */}
      <div className="mb-4 flex items-center justify-between">
        {/* 卡片标题 */}
        <h3 className="text-text-primary font-semibold">Recent Activity</h3>
        {/* 实时状态指示：含 Live 文字与时钟图标 */}
        <span className="text-text-secondary flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" />
          Live
        </span>
      </div>

      {/* 动态列表：列表项纵向间距 16px（space-y-4） */}
      <div className="space-y-4">
        {/* 遍历渲染所有近期动态项 */}
        {RECENT_ACTIVITIES.map((activity) => {
          const config = ACTIVITY_CONFIG[activity.type];
          const Icon = config.icon;

          return (
            <div key={activity.id} className="flex items-start gap-3"> {/* 单条动态项：含头像、文字描述与类型徽章 */}
              {/* 触发者头像：宽高 32px（h-8 w-8）圆形 */}
              <img src={activity.avatar} alt={activity.author} className="mt-0.5 h-8 w-8 shrink-0 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                {/* 动态描述行：触发者 + 动作类型 */}
                <p className="text-text-primary text-sm">
                  {/* 触发者姓名 */}
                  <span className="font-medium">{activity.author}</span> <span className="text-text-secondary">{config.label.toLowerCase()}</span>
                </p>
                {/* 动态关联内容标题：单行截断 */}
                <span className="text-text-secondary hover:text-accent line-clamp-1 text-xs transition-colors">{activity.title}</span>
                {/* 动态相对时间展示 */}
                <span className="text-text-secondary mt-0.5 block text-xs">{activity.time}</span>
              </div>
              {/* 活动类型图标徽章：宽高 28px（h-7 w-7）圆形 */}
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${config.color}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentActivity;
