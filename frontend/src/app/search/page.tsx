/**
 * @file page.tsx
 * @description 搜索页面：提供关键字与话题双维度过滤，展示文章搜索结果或推荐内容
 */
"use client";

import { FC, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, MessageSquare, Search, XCircle } from "lucide-react";
import SearchHeader from "@/components/business/search/SearchHeader";
import SuggestedArticles from "@/components/business/search/SuggestedArticles";
import TopicsFilter from "@/components/business/search/TopicsFilter";
import { ARTICLES } from "@/constans";

/**
 * 搜索结果展示组件
 * @template {typeof ARTICLES} T 文章列表类型
 * @param props 组件 props
 * @param props.query 搜索关键字
 * @param props.results 搜索结果文章列表
 * @returns 搜索结果视图，无关键字或无结果时返回 null 或空态
 */
const SearchResults: FC<{
  query: string;
  results: typeof ARTICLES;
}> = ({ query, results }) => {
  // 没有输入关键字时不展示结果
  if (!query.trim()) return null;

  // 无匹配结果时展示空态
  if (results.length === 0) {
    return (
      // 搜索无结果空态
      <div className="py-16 text-center">
        <div className="bg-surface-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Search className="text-text-secondary h-8 w-8" />
        </div>
        <h3 className="text-text-primary mb-1 text-lg font-medium">No results found</h3>
        <p className="text-text-secondary mb-4">No articles matching &ldquo;{query}&rdquo;. Try different keywords.</p>
      </div>
    );
  }

  return (
    <div>
      {/* 结果头部：标题 + 结果数量统计 */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-text-primary text-lg font-semibold">Search Results</h2>
        <span className="text-text-secondary text-sm">
          {results.length} article{results.length !== 1 ? "s" : ""} found
        </span>
      </div>
      {/* 结果列表：点击跳转文章详情 */}
      <div className="space-y-4">
        {results.map((article) => (
          <Link key={article.id} href={`/article/${article.id}`} className="border-border bg-surface hover:border-accent/50 group flex gap-4 rounded-xl border p-4 transition-all">
            {/* 文章封面图 */}
            <img src={article.image} alt={article.title} className="h-24 w-32 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              {/* 标签 + 阅读时长 */}
              <div className="mb-2 flex items-center gap-2">
                <span className={`text-xs font-medium ${article.tagClass}`}>{article.tag}</span>
                <span className="text-text-secondary text-xs">{article.readTime}</span>
              </div>
              {/* 文章标题（hover 变色） */}
              <h3 className="text-text-primary group-hover:text-accent font-medium transition-colors">{article.title}</h3>
              {/* 文章摘要，最多一行 */}
              <p className="text-text-secondary mt-1 line-clamp-1 text-sm">{article.excerpt}</p>
              {/* 元信息：日期 / 点赞 / 评论 */}
              <div className="text-text-secondary mt-3 flex items-center gap-4 text-xs">
                <span>{article.date}</span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {article.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {article.comments}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

/**
 * 搜索页面
 * @returns 搜索视图（搜索头部、输入框、话题过滤、结果/推荐）
 */
export default function SearchPage() {
  /** 搜索关键字 */
  const [searchQuery, setSearchQuery] = useState("");
  /** 当前激活的话题，"all" 表示不过滤 */
  const [activeTopic, setActiveTopic] = useState("all");

  // 依据搜索关键字与话题过滤计算结果
  const searchResults = useMemo(() => {
    let results = ARTICLES;

    // 按话题过滤
    if (activeTopic !== "all") {
      results = results.filter((a) => a.tag.toLowerCase() === activeTopic.toLowerCase());
    }

    // 按关键字过滤（标题/摘要/标签）
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.tag.toLowerCase().includes(q));
    }

    return results;
  }, [searchQuery, activeTopic]);

  /** 是否存在有效搜索关键字 */
  const hasQuery = searchQuery.trim().length > 0;

  return (
    <>
      {/* 搜索页头部标题 */}
      <SearchHeader />

      {/* 搜索输入框：左侧图标 + 右侧清除按钮 */}
      <div className="relative mb-6">
        <Search className="text-text-secondary absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Type to search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-border text-text-primary placeholder:text-text-secondary focus:border-accent focus:ring-accent/20 w-full rounded-xl border py-3 pr-10 pl-12 transition-all focus:ring-2 focus:outline-none"
        />
        {/* 有输入时显示清除按钮，点击清空搜索 */}
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="text-text-secondary hover:text-text-primary absolute top-1/2 right-4 -translate-y-1/2 transition-colors">
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 话题过滤组件 */}
      <TopicsFilter activeTopic={activeTopic} onTopicChange={setActiveTopic} />

      {/* 有关键字或话题过滤时显示搜索结果，否则显示推荐文章 */}
      {hasQuery || activeTopic !== "all" ? <SearchResults query={searchQuery} results={searchResults} /> : <SuggestedArticles />}
    </>
  );
}
