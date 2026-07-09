/**
 * @file WriteHeader.tsx
 * @description 写作页头部组件，展示页面主标题
 */

"use client";

import { FC } from "react";

/**
 * 写作页头部组件
 * 渲染页面主标题 "Write New Article"
 */
const WriteHeader: FC = () => {
  return (
    <div className="mb-8"> {/* 写作页头部容器，控制与下方内容的间距 */}
      {/* 页面主标题 */}
      <h1 className="text-text-primary text-2xl font-bold">Write New Article</h1>
    </div>
  );
};

export default WriteHeader;
