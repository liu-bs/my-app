/**
 * @file TrendingHeader.tsx
 * @description 趋势页头部组件，展示页面主标题与副标题
 */

"use client";

import { FC } from "react";
import { TrendingUp } from "lucide-react";

/**
 * 趋势页头部组件
 * 渲染带图标的主标题 "Trending" 与社区热门提示文案
 */
const TrendingHeader: FC = () => {
  return (
    <div className="mb-8"> {/* 趋势页头部容器，控制与下方内容的间距 */}
      {/* 图标 + 标题组合行 */}
      <div className="flex items-center gap-3">
        {/* 趋势图标圆形徽章 */}
        <div className="bg-accent/10 text-accent flex h-12 w-12 items-center justify-center rounded-xl">
          <TrendingUp className="h-6 w-6" />
        </div>
        {/* 标题与副标题文本区 */}
        <div>
          {/* 页面主标题 */}
          <h1 className="text-text-primary text-2xl font-bold">Trending</h1>
          {/* 页面副标题 */}
          <p className="text-text-secondary mt-1 text-sm">Discover what&apos;s hot in the community right now</p>
        </div>
      </div>
    </div>
  );
};

export default TrendingHeader;
