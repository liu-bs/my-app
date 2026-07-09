/**
 * @file ReadingListArticles.tsx
 * @description 阅读清单文章列表组件，渲染已收藏文章并支持鼠标悬停时移除
 */

"use client";

import { FC, useState } from "react";
import { Bookmark, Trash2 } from "lucide-react";
import Article from "@/components/common/Article";
import { READING_LIST_ARTICLES } from "@/constans";
import type { Article as ArticleType } from "@/typeing";

/** 阅读清单文章列表组件 Props（当前无入参，预留扩展） */
interface ReadingListArticlesProps {}

/**
 * 阅读清单文章列表组件
 * @returns 渲染已保存文章列表或空态提示
 */
const ReadingListArticles: FC<ReadingListArticlesProps> = () => {
  // 本地维护的文章列表，支持移除操作
  const [articles, setArticles] = useState<ArticleType[]>(READING_LIST_ARTICLES);

  /**
   * 从阅读清单中移除指定文章
   * @param id 文章唯一 ID（number 或 string 类型）
   */
  const handleRemove = (id: number | string) => {
    // 过滤掉指定 id 的文章
    setArticles(articles.filter((a) => a.id !== id));
  };

  // 空列表：渲染空态提示
  if (articles.length === 0) {
    return (
      // 空态容器：居中展示引导插画与文案
      <div className="py-16 text-center">
        {/* 圆形图标背景容器 */}
        <div className="bg-surface-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          {/* 书签图标 */}
          <Bookmark className="text-text-secondary h-8 w-8" />
        </div>
        {/* 空态主提示 */}
        <h3 className="text-text-primary mb-1 text-lg font-medium">No articles saved</h3>
        {/* 空态辅助说明 */}
        <p className="text-text-secondary">Start saving articles to read them later.</p>
      </div>
    );
  }

  return (
    // 文章列表容器：垂直排列文章卡片
    <div className="space-y-4">
      {/* 遍历渲染阅读清单文章列表 */}
      {articles.map((article) => (
        // 文章卡片容器：相对定位便于放置悬浮操作按钮
        <div key={article.id} className="group relative">
          {/* 通用文章卡片组件，展示文章信息 */}
          <Article article={article} />
          {/* 点击触发移除操作：阻止默认行为与冒泡，避免触发卡片自身的跳转 */}
          <button
            onClick={(e) => {
              // 阻止默认行为与冒泡，避免触发卡片自身的跳转
              e.preventDefault();
              e.stopPropagation();
              // 从列表中移除该文章
              handleRemove(article.id);
            }}
            // 悬浮时显示的删除按钮
            className="text-text-secondary hover:bg-error/10 hover:text-error absolute top-4 right-4 rounded-lg p-2 opacity-0 transition-all group-hover:opacity-100"
            title="Remove from reading list"
          >
            {/* 垃圾桶图标 */}
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReadingListArticles;
