/**
 * @file WritingSection.tsx
 * @description 首页"最新文章"区块，以列表形式展示文章
 */

import { FC } from "react";
import Link from "next/link";
import Article from "@/components/common/Article";
import { ARTICLES } from "@/constans";
import Style from "@/styles/commonStyle";

/**
 * 最新文章区块
 * 渲染文章列表，并提供"查看全部"入口跳转至搜索页
 */
const WritingSection: FC = () => {
  return (
    <section>{/* 区块容器 */}
      {/* 区块标题行：标题 + 查看全部链接 */}
      <div className="mb-8 flex items-center justify-between">
        {/* 区块标题 */}
        <h2 className="text-text-primary text-xl font-semibold">Latest Writing</h2>
        {/* 查看全部链接，点击跳转至搜索页 */}
        <Link href="/search" className={`${Style.link} text-sm font-medium`}>
          View all posts →
        </Link>
      </div>

      {/* 文章列表容器 */}
      <div className="space-y-6">
        {/* 遍历渲染文章列表 */}
        {ARTICLES.map((article) => (
          // 渲染通用文章组件
          <Article key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
};

export default WritingSection;
