/**
 * @file MyArticlesList.tsx
 * @description 我的文章列表组件，渲染文章卡片并支持编辑、归档、重新发布、删除等操作
 */

"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { Archive, Eye, Heart, MessageSquare, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { MyArticle } from "./myArticlesData";

/**
 * 我的文章列表组件 Props
 */
interface MyArticlesListProps {
  /** 初始文章列表 */
  articles: MyArticle[];
  /** 文章列表变更回调（用于通知父组件同步状态），可选 */
  onArticleChange?: (articles: MyArticle[]) => void;
}

/**
 * 文章状态展示配置：包含文案与对应 Tailwind 样式类
 */
const STATUS_CONFIG = {
  published: {
    /** 已发布状态文案 */
    label: "Published",
    /** 已发布状态对应的强调色样式 */
    class: "bg-success/10 text-success",
  },
  draft: {
    /** 草稿状态文案 */
    label: "Draft",
    /** 草稿状态对应的警示色样式 */
    class: "bg-warning/10 text-warning",
  },
  archived: {
    /** 已归档状态文案 */
    label: "Archived",
    /** 已归档状态对应的中性色样式 */
    class: "bg-surface-secondary text-text-secondary",
  },
};

/** 删除二次确认的自动重置等待时长，单位：ms */
const DELETE_CONFIRM_TIMEOUT_MS = 3000;

/**
 * 我的文章列表组件
 * @param props 组件属性
 * @param props.articles 初始文章列表
 * @param [props.onArticleChange] 文章列表变更回调（用于通知父组件同步状态）
 * @returns 渲染文章列表或空态提示
 */
const MyArticlesList: FC<MyArticlesListProps> = ({ articles: initialArticles, onArticleChange }) => {
  // 本地维护的文章列表状态，便于执行各种状态变更
  const [articles, setArticles] = useState(initialArticles);
  // 处于二次确认删除态的文章 id，未确认或已删除时为 null
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  /**
   * 更新文章列表并通知父组件
   * @param newArticles 新的文章列表
   */
  const updateArticles = (newArticles: MyArticle[]) => {
    setArticles(newArticles);
    // 可选回调存在时同步通知父组件
    onArticleChange?.(newArticles);
  };

  /**
   * 归档文章：将指定文章状态置为 archived
   * @param id 文章唯一 ID
   */
  const handleArchive = (id: string) => {
    updateArticles(articles.map((a) => (a.id === id ? { ...a, status: "archived" as const } : a)));
  };

  /**
   * 重新发布文章：将已归档文章状态置为 published
   * @param id 文章唯一 ID
   */
  const handleRepublish = (id: string) => {
    updateArticles(articles.map((a) => (a.id === id ? { ...a, status: "published" as const } : a)));
  };

  /**
   * 删除文章：首次点击进入确认态，3000ms 内再次点击才真正删除
   * @param id 文章唯一 ID
   */
  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      // 二次点击：执行删除并重置确认态
      updateArticles(articles.filter((a) => a.id !== id));
      setConfirmDelete(null);
    } else {
      // 首次点击：进入确认态，并在 3000ms 后自动重置
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), DELETE_CONFIRM_TIMEOUT_MS);
    }
  };

  // 空列表：渲染空态引导用户去写作或调整筛选
  if (articles.length === 0) {
    return (
      // 空态容器：居中展示引导插画、文案与写作入口
      <div className="py-16 text-center">
        {/* 圆形图标背景容器 */}
        <div className="bg-surface-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          {/* 写作图标 */}
          <Pencil className="text-text-secondary h-8 w-8" />
        </div>
        {/* 空态主提示文案 */}
        <h3 className="text-text-primary mb-1 text-lg font-medium">No articles found</h3>
        {/* 空态辅助说明 */}
        <p className="text-text-secondary mb-4">Start writing your first article or change the filter.</p>
        {/* 点击跳转至写作页面 */}
        <Link href="/write" className="bg-accent hover:bg-accent-hover inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors">
          <Pencil className="h-4 w-4" />
          Write Article
        </Link>
      </div>
    );
  }

  return (
    // 文章列表容器：垂直排列的文章卡片
    <div className="space-y-4">
      {/* 遍历渲染文章列表 */}
      {articles.map((article) => {
        // 获取当前文章状态对应的展示配置
        const statusConfig = STATUS_CONFIG[article.status];
        return (
          // 文章卡片容器：水平排列信息区、统计区与操作区
          <div
            key={article.id}
            className="border-border bg-surface hover:border-accent/30 group flex flex-col gap-4 rounded-xl border p-5 transition-all sm:flex-row sm:items-center"
          >
            {/* 文章主信息区：标签、状态、标题、摘要 */}
            <div className="min-w-0 flex-1">
              {/* 标签与状态徽章 */}
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {/* 文章分类标签 */}
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${article.tagClass}`}>{article.tag}</span>
                {/* 文章状态徽章 */}
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.class}`}>{statusConfig.label}</span>
              </div>
              {/* 已发布文章跳转详情页，未发布文章跳转写作页携带 id 参数 */}
              <Link
                href={article.status === "published" ? `/article/${article.id}` : `/write?id=${article.id}`}
                className="text-text-primary hover:text-accent block text-base font-semibold transition-colors"
              >
                {/* 文章标题 */}
                {article.title}
              </Link>
              {/* 文章摘要（单行省略） */}
              <p className="text-text-secondary mt-1 line-clamp-1 text-sm">{article.excerpt}</p>
            </div>

            {/* 文章数据统计区：浏览/点赞/评论数与发布日期，或阅读时长 */}
            <div className="text-text-secondary flex items-center gap-4 text-xs sm:shrink-0">
              {article.status === "published" ? (
                // 已发布文章展示浏览/点赞/评论数与发布日期
                <>
                  {/* 浏览量 */}
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {article.views}
                  </span>
                  {/* 点赞数 */}
                  <span className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5" />
                    {article.likes}
                  </span>
                  {/* 评论数 */}
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {article.comments}
                  </span>
                  {/* 发布日期 */}
                  <span>{article.date}</span>
                </>
              ) : (
                // 草稿/已归档文章仅展示阅读时长
                <span>{article.readTime}</span>
              )}
            </div>

            {/* 文章操作按钮组：编辑、归档、重新发布、删除 */}
            <div className="flex items-center gap-1 sm:shrink-0">
              {/* 点击跳转写作页面对该文章进行编辑 */}
              <Link href={`/write?id=${article.id}`} className="text-text-secondary hover:text-accent hover:bg-accent/10 rounded-lg p-2 transition-colors" title="Edit">
                <Pencil className="h-4 w-4" />
              </Link>
              {article.status === "published" && (
                // 条件渲染：已发布文章展示"归档"按钮
                <button
                  onClick={() => handleArchive(article.id)}
                  className="text-text-secondary hover:text-warning hover:bg-warning/10 rounded-lg p-2 transition-colors"
                  title="Archive"
                >
                  <Archive className="h-4 w-4" />
                </button>
              )}
              {article.status === "archived" && (
                // 条件渲染：已归档文章展示"重新发布"按钮
                <button
                  onClick={() => handleRepublish(article.id)}
                  className="text-text-secondary hover:text-success hover:bg-success/10 rounded-lg p-2 transition-colors"
                  title="Republish"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => handleDelete(article.id)}
                // 删除按钮：处于确认态时高亮提示再次点击确认
                className={`rounded-lg p-2 transition-colors ${confirmDelete === article.id ? "bg-error/10 text-error" : "text-text-secondary hover:text-error hover:bg-error/10"}`}
                title={confirmDelete === article.id ? "Click again to confirm" : "Delete"}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyArticlesList;
