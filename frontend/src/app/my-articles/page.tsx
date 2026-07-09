/**
 * @file page.tsx
 * @description 我的文章页面：根据状态（全部/已发布/草稿/已归档）筛选并展示作者的文章列表
 */
"use client";

import { useState } from "react";
import MyArticlesFilter from "@/components/business/my-articles/MyArticlesFilter";
import MyArticlesHeader from "@/components/business/my-articles/MyArticlesHeader";
import MyArticlesList from "@/components/business/my-articles/MyArticlesList";
import { MY_ARTICLES } from "@/components/business/my-articles/myArticlesData";

/**
 * 我的文章页面
 * @returns 我的文章视图（头部、过滤器、文章列表）
 */
export default function MyArticlesPage() {
  /** 当前激活的状态过滤器，默认 "all" */
  const [activeFilter, setActiveFilter] = useState("all");

  // 根据激活的过滤器筛选文章
  const filteredArticles = activeFilter === "all" ? MY_ARTICLES : MY_ARTICLES.filter((a) => a.status === activeFilter);

  // 统计各状态文章数量
  const counts = {
    /** 全部文章数量 */
    all: MY_ARTICLES.length,
    /** 已发布文章数量 */
    published: MY_ARTICLES.filter((a) => a.status === "published").length,
    /** 草稿文章数量 */
    draft: MY_ARTICLES.filter((a) => a.status === "draft").length,
    /** 已归档文章数量 */
    archived: MY_ARTICLES.filter((a) => a.status === "archived").length,
  };

  return (
    // 页面根容器
    <div className="bg-background min-h-screen">
      <main className="mx-auto max-w-4xl">
        {/* 文章统计与入口头部 */}
        <MyArticlesHeader totalCount={counts.all} publishedCount={counts.published} draftCount={counts.draft} />
        {/* 状态过滤组件 */}
        <MyArticlesFilter onFilterChange={setActiveFilter} activeFilter={activeFilter} counts={counts} />
        {/* 过滤后的文章列表 */}
        <MyArticlesList articles={filteredArticles} />
      </main>
    </div>
  );
}
