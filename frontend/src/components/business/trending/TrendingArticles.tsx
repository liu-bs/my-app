/**
 * @file TrendingArticles.tsx
 * @description 趋势页热门文章列表组件，带排名序号
 */

"use client";

import { FC } from "react";
import Link from "next/link";
import { Heart, MessageSquare } from "lucide-react";
import { TRENDING_ARTICLES } from "@/constans";

/**
 * 趋势页热门文章列表组件
 * 渲染 "Trending Articles" 标题与带排名的热门文章卡片列表
 */
const TrendingArticles: FC = () => {
  return (
    <div> {/* 热门文章列表容器 */}
      {/* 区块标题 */}
      <h2 className="text-text-primary mb-4 text-lg font-semibold">Trending Articles</h2>
      {/* 文章卡片列表，垂直排列 */}
      <div className="space-y-4">
        {/* 遍历渲染热门文章卡片 */}
        {TRENDING_ARTICLES.map((article, index) => (
          /* 文章跳转链接：点击进入对应文章详情页 */
          <Link key={article.id} href={`/article/${article.id}`} className="border-border bg-surface hover:bg-surface-secondary flex gap-5 rounded-xl border p-5 transition-colors">
            {/* 排名序号方块 */}
            <div className="from-accent/20 to-accent/5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br">
              {/* 排名序号：数组下标 + 1 */}
              <span className="text-accent text-lg font-bold">{index + 1}</span>
            </div>
            {/* 文章文本信息区域 */}
            <div className="min-w-0 flex-1">
              {/* 标签 + 阅读时长行 */}
              <div className="mb-2 flex items-center gap-2">
                {/* 文章标签徽标 */}
                <span className="bg-tag-engineering-bg text-tag-engineering-text rounded-full px-2.5 py-0.5 text-xs font-medium">{article.tag}</span>
                {/* 阅读时长 */}
                <span className="text-text-secondary text-xs">{article.readTime}</span>
              </div>
              {/* 文章标题 */}
              <h3 className="text-text-primary mb-1 text-base font-semibold">{article.title}</h3>
              {/* 文章摘要，最多展示 2 行 */}
              <p className="text-text-secondary mb-3 line-clamp-2 text-sm">{article.excerpt}</p>
              {/* 互动数据：点赞 / 评论 / 发布日期 */}
              <div className="text-text-secondary flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  {/* 点赞图标 */}
                  <Heart className="h-3.5 w-3.5" />
                  {article.likes}
                </span>
                <span className="flex items-center gap-1">
                  {/* 评论图标 */}
                  <MessageSquare className="h-3.5 w-3.5" />
                  {article.comments}
                </span>
                <span className="text-text-secondary">{article.date}</span>
              </div>
            </div>
            {/* 封面图，小屏隐藏 */}
            <div className="hidden shrink-0 sm:block">
              <img src={article.image} alt={article.title} className="h-24 w-32 rounded-lg object-cover" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingArticles;
