/**
 * @file FavoritesHeader.tsx
 * @description "我的收藏"页面顶部标题栏，展示页面标题与副标题
 */

import { FC } from "react";
import { Bookmark } from "lucide-react";

/**
 * 收藏页顶部标题栏
 * 渲染书签图标、页面主标题"My Favorites"与提示副标题
 */
const FavoritesHeader: FC = () => {
  return (
    <div className="mb-8 flex items-center gap-3"> {/* 标题栏容器：图标 + 标题文本块 */}
      {/* 书签图标背景容器 */}
      <div className="bg-accent/10 text-accent flex h-10 w-10 items-center justify-center rounded-xl">
        {/* 书签图标 */}
        <Bookmark className="h-5 w-5" />
      </div>
      {/* 标题与副标题文本块 */}
      <div>
        {/* 页面主标题 */}
        <h1 className="text-text-primary text-2xl font-bold">My Favorites</h1>
        {/* 页面副标题提示 */}
        <p className="text-text-secondary">Articles you&apos;ve saved for later reading.</p>
      </div>
    </div>
  );
};

export default FavoritesHeader;
