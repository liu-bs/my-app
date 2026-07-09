/**
 * @file ReadingListHeader.tsx
 * @description 阅读清单页头部组件，展示书签图标、标题、文章数量与预估阅读时长
 */

"use client";

import { FC } from "react";
import { Bookmark, Clock } from "lucide-react";
import { READING_LIST_ARTICLES } from "@/constans";

/** 阅读清单页头部组件 Props（当前无入参，预留扩展） */
interface ReadingListHeaderProps {}

/** 预估总阅读时长文案（与列表真实数据无关，仅作展示占位） */
const ESTIMATED_READING_TIME = "~27 min total reading time";

/**
 * 阅读清单页头部组件
 * @returns 渲染书签图标、页面标题、文章数量与总阅读时长
 */
const ReadingListHeader: FC<ReadingListHeaderProps> = () => {
  return (
    // 头部容器：垂直排布标题区与数据概览
    <div className="mb-8">
      {/* 标题区：左侧图标 + 右侧文字 */}
      <div className="flex items-center gap-3">
        {/* 书签图标背景容器 */}
        <div className="bg-accent/10 text-accent flex h-12 w-12 items-center justify-center rounded-xl">
          {/* 书签图标 */}
          <Bookmark className="h-6 w-6" />
        </div>
        <div>
          {/* 页面主标题 */}
          <h1 className="text-text-primary text-2xl font-bold">Reading List</h1>
          {/* 页面副标题 */}
          <p className="text-text-secondary mt-1 text-sm">Articles saved for later reading</p>
        </div>
      </div>
      {/* 数据概览：已保存文章数与总阅读时长 */}
      <div className="mt-4 flex items-center gap-4">
        {/* 已保存文章数 */}
        <span className="text-text-secondary flex items-center gap-1.5 text-sm">
          <Bookmark className="h-4 w-4" />
          {READING_LIST_ARTICLES.length} articles saved
        </span>
        {/* 预估总阅读时长 */}
        <span className="text-text-secondary flex items-center gap-1.5 text-sm">
          <Clock className="h-4 w-4" />
          {ESTIMATED_READING_TIME}
        </span>
      </div>
    </div>
  );
};

export default ReadingListHeader;
