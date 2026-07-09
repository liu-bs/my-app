/**
 * @file SearchHeader.tsx
 * @description 搜索页头部组件，展示页面主标题与副标题提示
 */

import { FC } from "react";

/**
 * 搜索页头部组件
 * 渲染页面主标题 "Search" 与副标题提示文案
 */
const SearchHeader: FC = () => {
  return (
    <div className="mb-8"> {/* 搜索页头部容器，控制与下方内容的间距 */}
      {/* 页面主标题 */}
      <h1 className="text-text-primary mb-2 text-2xl font-bold">Search</h1>
      {/* 页面副标题，提示搜索用途 */}
      <p className="text-text-secondary">Find articles, tutorials, and insights.</p>
    </div>
  );
};

export default SearchHeader;
