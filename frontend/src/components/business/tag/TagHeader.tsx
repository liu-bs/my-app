/**
 * @file TagHeader.tsx
 * @description 标签详情页头部组件，展示标签信息、统计与关注按钮
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, FileText, Hash, TrendingUp, Users } from "lucide-react";

/** 标签头部组件 Props */
interface TagHeaderProps {
  /** 标签基础信息 */
  tag: {
    /** 标签名称（显示用） */
    name: string;
    /** 标签描述 */
    description: string;
    /** 标签下文章数量 */
    articles: number;
    /** 关注者数量（已格式化的字符串，如 "45.2k"） */
    followers: string;
    /** 是否处于热门趋势 */
    trending: boolean;
    /** 周增长率（已格式化的字符串，如 "+23%"） */
    weeklyGrowth: string;
  };
}

/**
 * 标签详情页头部组件
 * 渲染返回链接、标签头图、统计指标与关注/取消关注按钮
 *
 * @param props 组件入参
 * @param props.tag 标签基础信息
 */
const TagHeader: React.FC<TagHeaderProps> = ({ tag }) => {
  /** 是否已关注该标签 */
  const [following, setFollowing] = useState(false);

  return (
    <>
      {/* 返回分类列表的导航链接：点击跳转到 /category */}
      <Link href="/category" className="text-text-secondary hover:text-text-primary mb-6 inline-flex items-center gap-2 text-sm transition-colors">
        {/* 返回箭头图标 */}
        <ArrowLeft className="h-4 w-4" />
        Back to categories
      </Link>

      {/* 标签头图卡片，渐变背景 + 标签信息 */}
      <section className="from-accent-light to-surface-secondary border-accent/20 relative mb-12 overflow-hidden rounded-2xl border bg-gradient-to-br p-8 sm:p-12">
        {/* 内容层，位于渐变背景之上 */}
        <div className="relative z-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* 标签图标方块 */}
            <div className="bg-accent flex h-20 w-20 items-center justify-center rounded-2xl text-white">
              {/* # 标签图标 */}
              <Hash className="h-10 w-10" />
            </div>
            {/* 标签名 / 描述 / 统计指标区域 */}
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                {/* 标签名称主标题 */}
                <h1 className="text-text-primary text-3xl font-bold sm:text-4xl">{tag.name}</h1>
                {/* 条件渲染：标签处于趋势时展示 Trending 徽标 */}
                {tag.trending && (
                  <span className="bg-success-light text-success inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium">
                    {/* 上升趋势图标 */}
                    <TrendingUp className="h-3 w-3" />
                    Trending
                  </span>
                )}
              </div>
              {/* 标签描述文案 */}
              <p className="text-text-secondary mb-4 max-w-2xl">{tag.description}</p>
              {/* 标签统计指标行：文章数 / 关注者数 / 周增长 */}
              <div className="text-text-secondary flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  {/* 文章数图标 */}
                  <FileText className="h-4 w-4" />
                  {tag.articles} articles
                </span>
                <span className="flex items-center gap-1.5">
                  {/* 关注者图标 */}
                  <Users className="h-4 w-4" />
                  {tag.followers} followers
                </span>
                <span className="flex items-center gap-1.5">
                  {/* 周增长图标 */}
                  <TrendingUp className="h-4 w-4" />
                  {tag.weeklyGrowth} this week
                </span>
              </div>
            </div>
            {/* 关注/取消关注操作区 */}
            <div className="flex flex-col gap-3">
              {/* 关注切换按钮：点击后切换 following 状态 */}
              <button
                onClick={() => setFollowing(!following)}
                className={`flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 font-medium transition-colors ${
                  following ? "border-border text-text-secondary hover:bg-error/10 hover:text-error hover:border-error border" : "bg-accent hover:bg-accent-hover text-white"
                }`}
              >
                {/* 通知铃图标 */}
                <Bell className="h-4 w-4" />
                {/* 根据 following 状态显示 Follow / Unfollow */}
                {following ? "Unfollow" : "Follow"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TagHeader;
