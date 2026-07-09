/**
 * @file CategoryDetailHeader.tsx
 * @description 分类详情页头部组件，展示分类图标、长描述、订阅/分享操作及增长趋势
 */
"use client";

import { FC, useState } from "react";
import { Bell, Code, FileText, Palette, Rocket, Share2, Shield, TrendingUp, Users, Wrench } from "lucide-react";

/** 图标字符串与 lucide-react 图标组件的映射表 */
const ICON_MAP: Record<string, FC<{ className?: string }>> = {
  Code,
  Palette,
  Rocket,
  Shield,
  Wrench,
};

interface CategoryDetailHeaderProps {
  category: {
    /** 分类唯一标识 */
    id: string;
    /** 分类名称 */
    name: string;
    /** 分类长描述 */
    longDescription: string;
    /** 图标 key，用于 ICON_MAP 索引 */
    icon: string;
    /** 主题背景色（Tailwind class） */
    color: string;
    /** 主题文字色（Tailwind class） */
    textColor: string;
    /** 背景渐变 class */
    bgGradient: string;
    /** 文章总数 */
    articleCount: number;
    /** 关注者数量（字符串，可带 k/m 单位） */
    followers: string;
    /** 趋势热度值 */
    trending: number;
    /** 周增长率字符串（如 "+12%"） */
    weeklyGrowth: string;
  };
}

/**
 * 分类详情页头部组件
 * @param props 组件入参
 * @param props.category 分类详情数据
 * @returns 渲染分类详情头部（图标 + 描述 + 指标 + 订阅/分享）
 */
const CategoryDetailHeader: FC<CategoryDetailHeaderProps> = ({ category }) => {
  /** 是否已订阅该分类：true=已订阅 false=未订阅 */
  const [subscribed, setSubscribed] = useState(false);
  /** 是否显示分享菜单：true=显示 false=隐藏 */
  const [showShareMenu, setShowShareMenu] = useState(false);
  /** 是否已复制链接（控制 Copied! 反馈）：true=已复制 false=未复制 */
  const [copied, setCopied] = useState(false);

  /** 根据 icon 字符串映射到对应图标组件，未匹配时回退到 Code */
  const IconComponent = ICON_MAP[category.icon] || Code;

  /**
   * 分享处理：复制当前页 URL 到剪贴板
   * 复制成功后 2000ms（2s）后恢复文案
   */
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      // 2s（2000ms）后重置复制状态
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 复制失败时静默回退 */
    }
    setShowShareMenu(false);
  };

  return (
    <section className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${category.bgGradient} border-border mb-12 border p-8 sm:p-12`}> {/* 分类详情头容器：渐变背景，溢出隐藏圆角卡片，移动端内边距 32px（p-8），桌面端 48px（sm:p-12） */}
      <div className="relative z-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* 分类图标容器：宽高 80px（h-20 w-20）圆角方块 */}
          <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ${category.color}`}>
            {/* 分类图标：宽高 40px（h-10 w-10） */}
            <IconComponent className={`h-10 w-10 ${category.textColor}`} />
          </div>
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              {/* 分类详情页主标题 */}
              <h1 className="text-text-primary text-3xl font-bold sm:text-4xl">{category.name}</h1>
              {/* 周增长趋势徽章：含趋势图标与百分比文案 */}
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${category.color} ${category.textColor}`}>
                <TrendingUp className="mr-1 h-3 w-3" />
                {category.weeklyGrowth} this week
              </span>
            </div>
            {/* 分类长描述：最大宽度 672px（max-w-2xl） */}
            <p className="text-text-secondary mb-4 max-w-2xl">{category.longDescription}</p>
            {/* 分类核心指标行：文章数、关注者数、热度值 */}
            <div className="text-text-secondary flex flex-wrap items-center gap-4 text-sm">
              {/* 文章总数展示 */}
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                {category.articleCount} articles
              </span>
              {/* 关注者数量展示 */}
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {category.followers} followers
              </span>
              {/* 趋势热度值展示 */}
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4" />
                {category.trending} trending
              </span>
            </div>
          </div>
          {/* 操作按钮组：订阅 + 分享下拉 */}
          <div className="flex flex-col gap-3">
            {/* 订阅/取消订阅切换按钮 */}
            <button
              onClick={() => setSubscribed(!subscribed)}
              className={`flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 font-medium transition-colors ${
                subscribed
                  ? "border-border text-text-secondary hover:bg-error/10 hover:text-error hover:border-error bg-surface border"
                  : "bg-accent hover:bg-accent-hover text-white"
              }`}
            >
              <Bell className="h-4 w-4" />
              {subscribed ? "Unsubscribe" : "Subscribe"}
            </button>
            {/* 分享菜单触发按钮与下拉 */}
            <div className="relative">
              {/* 分享按钮：点击切换分享菜单显示 */}
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="border-border bg-surface text-text-primary hover:bg-surface-secondary flex w-full items-center justify-center gap-2 rounded-lg border px-6 py-2.5 font-medium transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              {/* 条件渲染：仅在分享菜单打开时显示 */}
              {showShareMenu && (
                <div className="border-border bg-surface absolute top-full right-0 z-10 mt-1 w-full rounded-lg border p-1 shadow-lg">
                  {/* 复制链接按钮：点击后复制当前页面 URL */}
                  <button
                    onClick={handleShare}
                    className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary w-full rounded px-3 py-2 text-left text-sm transition-colors"
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                  {/* 分享至 Twitter 按钮：点击打开新窗口发起推文 */}
                  <button
                    onClick={() => {
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(category.name)}`, "_blank");
                      setShowShareMenu(false);
                    }}
                    className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary w-full rounded px-3 py-2 text-left text-sm transition-colors"
                  >
                    Twitter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryDetailHeader;
