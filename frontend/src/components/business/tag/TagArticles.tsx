/**
 * @file TagArticles.tsx
 * @description 标签页文章列表组件，支持排序与分页加载
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MessageSquare } from "lucide-react";

/** 标签页文章组件 Props */
interface TagArticlesProps {
  /** 文章列表数据 */
  articles: {
    /** 文章唯一 ID */
    id: string;
    /** 文章标题 */
    title: string;
    /** 文章摘要 */
    excerpt: string;
    /** 封面图地址 */
    image: string;
    /** 作者信息 */
    author: {
      /** 作者名称 */
      name: string;
      /** 作者头像地址 */
      avatar: string;
    };
    /** 预计阅读时长（已格式化的字符串，如 "8 min read"） */
    readTime: string;
    /** 发布日期（已格式化的字符串） */
    date: string;
    /** 点赞数 */
    likes: number;
    /** 评论数 */
    comments: number;
  }[];
}

/**
 * 标签页文章列表组件
 * 支持按 latest / popular / trending 排序，并以 5 条为一页进行分页加载更多
 *
 * @param props 组件入参
 * @param props.articles 文章列表数据
 */
const TagArticles: React.FC<TagArticlesProps> = ({ articles: initialArticles }) => {
  const router = useRouter();
  /** 排序方式：latest 最新 / popular 最热 / trending 趋势 */
  const [sortBy, setSortBy] = useState("latest");
  /** 已显示的文章数量，用于"加载更多"分页 */
  const [displayCount, setDisplayCount] = useState(5);

  /**
   * 根据 sortBy 对文章列表排序
   * popular 按点赞数降序，trending 按评论数降序，其它保持原序
   */
  const sortedArticles = [...initialArticles].sort((a, b) => {
    if (sortBy === "popular") return b.likes - a.likes;
    if (sortBy === "trending") return b.comments - a.comments;
    return 0;
  });

  /** 当前页显示的文章切片 */
  const displayedArticles = sortedArticles.slice(0, displayCount);
  /** 是否还有更多文章可加载 */
  const hasMore = displayCount < initialArticles.length;

  return (
    <div className="lg:col-span-2"> {/* 文章列表主区域，占大屏 2/3 列宽 */}
      {/* 列表标题 + 排序选择器 */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-text-primary text-xl font-semibold">Latest Articles</h2>
        {/* 排序选择器：切换时更新 sortBy 触发列表重排 */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border-border bg-surface text-text-primary focus:border-accent rounded-lg border px-3 py-1.5 text-sm focus:outline-none"
          >
            <option value="latest">Latest</option>
            <option value="popular">Popular</option>
            <option value="trending">Trending</option>
          </select>
        </div>
      </div>

      {/* 文章卡片列表，垂直排列 */}
      <div className="space-y-4">
        {/* 遍历渲染当前页显示的文章卡片 */}
        {displayedArticles.map((article) => (
          /* 文章卡片：点击整卡跳转至文章详情 */
          <div
            key={article.id}
            onClick={() => router.push(`/article/${article.id}`)}
            className="border-border bg-surface hover:border-accent/50 group flex cursor-pointer flex-col gap-6 rounded-xl border p-6 transition-all hover:shadow-md sm:flex-row"
          >
            {/* 封面图容器 */}
            <div className="shrink-0 sm:w-48">
              {/* 文章封面图，hover 时放大 */}
              <img src={article.image} alt={article.title} className="h-32 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105 sm:h-full" />
            </div>
            {/* 文本信息区域 */}
            <div className="flex flex-1 flex-col">
              {/* 文章标题 */}
              <h3 className="text-text-primary group-hover:text-accent mb-2 text-lg font-semibold transition-colors">{article.title}</h3>
              {/* 文章摘要，最多展示 2 行 */}
              <p className="text-text-secondary mb-4 line-clamp-2 text-sm">{article.excerpt}</p>
              {/* 底部作者 + 互动数据行 */}
              <div className="mt-auto flex items-center justify-between">
                {/* 作者信息与阅读时长 */}
                <div className="flex items-center gap-2">
                  {/* 作者跳转链接：阻止冒泡以避免触发卡片整体跳转 */}
                  <Link
                    href={`/author/${article.author.name.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={(e) => e.stopPropagation()}
                    className="group/author flex items-center gap-2"
                  >
                    {/* 作者头像 */}
                    <img src={article.author.avatar} alt={article.author.name} className="h-6 w-6 rounded-full object-cover" />
                    {/* 作者名 */}
                    <span className="text-text-secondary group-hover/author:text-accent text-sm transition-colors">{article.author.name}</span>
                  </Link>
                  {/* 阅读时长 */}
                  <span className="text-text-secondary text-xs">{article.readTime}</span>
                </div>
                {/* 互动数据：点赞数 / 评论数 */}
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 条件渲染：还有更多文章时展示"加载更多"按钮 */}
      {hasMore && (
        <div className="mt-8 text-center">
          {/* 加载更多按钮：每次点击 +5 条 */}
          <button
            onClick={() => setDisplayCount((prev) => prev + 5)}
            className="border-border text-text-secondary hover:bg-surface-secondary rounded-lg border px-6 py-2.5 font-medium transition-colors"
          >
            Load More Articles
          </button>
        </div>
      )}
      {/* 条件渲染：已展示完全部且超过 5 条时展示"已无更多"提示 */}
      {!hasMore && displayedArticles.length > 5 && (
        <div className="mt-8 text-center">
          <p className="text-text-secondary text-sm">No more articles to load.</p>
        </div>
      )}
    </div>
  );
};

export default TagArticles;
