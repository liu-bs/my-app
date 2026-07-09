/**
 * @file TagSidebar.tsx
 * @description 标签页侧边栏组件，展示标签信息卡、关注按钮与订阅模块
 */

"use client";

import { FC, useState } from "react";
import { Users } from "lucide-react";
import Newsletter from "@/components/common/Newsletter";

/** 标签侧边栏组件 Props */
interface TagSidebarProps {
  /** 标签名称（不含 #） */
  tagName: string;
  /** 该标签下的文章数 */
  articleCount: number;
  /** 当前关注者数 */
  followerCount: number;
}

/**
 * 标签页侧边栏组件
 * 渲染标签信息卡（带关注按钮）与邮件订阅模块，
 * 关注状态变化时本地累计关注者数量
 *
 * @param props 组件入参
 * @param props.tagName 标签名称（不含 #）
 * @param props.articleCount 该标签下的文章数
 * @param props.followerCount 当前关注者数
 */
const TagSidebar: FC<TagSidebarProps> = ({ tagName, articleCount, followerCount }) => {
  /** 是否已关注；本地状态，不持久化 */
  const [following, setFollowing] = useState(false);

  /**
   * 切换关注状态
   */
  const handleFollow = () => {
    setFollowing(!following);
  };

  return (
    <div className="space-y-6"> {/* 侧边栏整体容器：标签信息卡 + 订阅模块，垂直排列 */}
      {/* 标签信息卡：含标签名、文章数、关注者数、关注按钮 */}
      <div className="border-border bg-surface rounded-xl border p-5">
        {/* 标签名标题，带 # 前缀 */}
        <h2 className="text-text-primary mb-2 text-xl font-bold">#{tagName}</h2>
        {/* 文章数与关注者数指标行 */}
        <div className="text-text-secondary mb-4 flex items-center gap-4 text-sm">
          <span>{articleCount} articles</span>
          <span className="flex items-center gap-1">
            {/* 用户图标 */}
            <Users className="h-3.5 w-3.5" />
            {/* 已关注时本地累加 +1，未关注时显示原统计 */}
            {followerCount + (following ? 1 : 0)} followers
          </span>
        </div>
        {/* 关注切换按钮：点击后切换 following 状态 */}
        <button
          onClick={handleFollow}
          className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            following ? "border-border text-text-secondary hover:bg-error/10 hover:text-error hover:border-error border" : "bg-accent hover:bg-accent-hover text-white"
          }`}
        >
          {following ? "Unfollow" : "Follow"}
        </button>
      </div>

      {/* 邮件订阅通用组件，紧凑样式 */}
      <Newsletter title="Newsletter" description={`Get the latest articles about #${tagName} delivered to your inbox.`} variant="compact" />
    </div>
  );
};

export default TagSidebar;
