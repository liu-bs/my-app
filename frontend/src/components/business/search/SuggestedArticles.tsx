/**
 * @file SuggestedArticles.tsx
 * @description 搜索页推荐文章列表组件
 */

import { FC } from "react";
import Article from "@/components/common/Article";
import { SUGGESTED_ARTICLES } from "@/constans";

/**
 * 推荐文章列表组件
 * 渲染 "Suggested Articles" 标题与全局推荐文章卡片列表
 */
const SuggestedArticles: FC = () => {
  return (
    <div> {/* 推荐文章列表容器 */}
      {/* 区块标题 */}
      <h2 className="text-text-primary mb-6 text-lg font-semibold">Suggested Articles</h2>
      {/* 文章卡片列表，垂直排列 */}
      <div className="space-y-6">
        {/* 遍历渲染推荐文章卡片 */}
        {SUGGESTED_ARTICLES.map((article) => (
          <Article key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default SuggestedArticles;
