/**
 * @file page.tsx
 * @description 收藏与阅读列表页面：支持收藏/阅读列表两个 Tab，可按话题过滤，并提供清空阅读列表等操作
 */
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bookmark, Clock, Heart, Search, Trash2 } from "lucide-react";
import Article from "@/components/common/Article";
import { FAVORITE_ARTICLES, READING_LIST_ARTICLES, TOPICS } from "@/constans";
import type { Article as ArticleType } from "@/typeing";

/** 页面 Tab 类型 */
type Tab = "favorites" | "reading-list";

/**
 * 收藏与阅读列表内容组件
 * 负责交互逻辑：Tab 切换、话题过滤、阅读列表移除
 */
function FavoritesContent() {
  const searchParams = useSearchParams();
  // 从查询参数中读取默认 Tab
  const tabParam = searchParams.get("tab");
  /** 当前激活的 Tab，默认为 favorites */
  const [activeTab, setActiveTab] = useState<Tab>(tabParam === "reading-list" ? "reading-list" : "favorites");
  /** 当前话题过滤项，"all" 表示不过滤 */
  const [activeTopic, setActiveTopic] = useState("all");
  /** 收藏文章列表（只读） */
  const [favorites] = useState<ArticleType[]>(FAVORITE_ARTICLES);
  /** 阅读列表文章（可移除） */
  const [readingList, setReadingList] = useState<ArticleType[]>(READING_LIST_ARTICLES);

  // 按话题过滤收藏文章
  const filteredFavorites = activeTopic === "all" ? favorites : favorites.filter((a) => a.tag.toLowerCase() === activeTopic);

  return (
    <>
      {/* 页面头部：图标 + 标题 + 描述 */}
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-accent/10 text-accent flex h-10 w-10 items-center justify-center rounded-xl">
          {/* 收藏图标标识 */}
          <Bookmark className="h-5 w-5" />
        </div>
        <div>
          {/* 页面主标题 */}
          <h1 className="text-text-primary text-2xl font-bold">My Collection</h1>
          {/* 页面副标题描述 */}
          <p className="text-text-secondary text-sm">Articles you&apos;ve favorited and saved for later reading.</p>
        </div>
      </div>

      {/* Tab 切换栏：favorites / reading-list */}
      <div className="border-border mb-6 flex gap-1 border-b">
        <button
          onClick={() => setActiveTab("favorites")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "favorites" ? "border-accent text-accent" : "text-text-secondary hover:text-text-primary border-transparent"
          }`}
        >
          {/* 收藏 Tab 的心形图标 */}
          <Heart className="h-4 w-4" />
          Favorites
          {/* 收藏数量徽标 */}
          <span className="bg-surface-secondary rounded-full px-2 py-0.5 text-xs">{favorites.length}</span>
        </button>
        <button
          onClick={() => setActiveTab("reading-list")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "reading-list" ? "border-accent text-accent" : "text-text-secondary hover:text-text-primary border-transparent"
          }`}
        >
          {/* 阅读列表 Tab 的书签图标 */}
          <Bookmark className="h-4 w-4" />
          Reading List
          {/* 阅读列表数量徽标 */}
          <span className="bg-surface-secondary rounded-full px-2 py-0.5 text-xs">{readingList.length}</span>
        </button>
      </div>

      {/* favorites Tab 内容：话题过滤 + 文章列表/空态 */}
      {activeTab === "favorites" && (
        <>
          {favorites.length === 0 ? (
            // 收藏为空时的空态视图
            <div className="py-16 text-center">
              <div className="bg-surface-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Heart className="text-text-secondary h-8 w-8" />
              </div>
              <h3 className="text-text-primary mb-1 text-lg font-medium">No favorites yet</h3>
              <p className="text-text-secondary mb-4">Start favoriting articles to see them here.</p>
              <Link href="/search" className="bg-accent hover:bg-accent-hover inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors">
                {/* 跳转发现文章按钮 */}
                <Search className="h-4 w-4" />
                Discover Articles
              </Link>
            </div>
          ) : (
            <>
              {/* 话题过滤按钮组 */}
              <div className="mb-6 flex flex-wrap gap-2">
                {TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setActiveTopic(topic.id)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      activeTopic === topic.id ? "bg-accent text-white" : "bg-surface-secondary text-text-secondary hover:bg-surface-secondary/80"
                    }`}
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
              {/* 话题过滤后收藏列表 / 过滤为空提示 */}
              {filteredFavorites.length > 0 ? (
                <div className="space-y-6">
                  {filteredFavorites.map((article) => (
                    <Article key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-text-secondary">No favorite articles in this category.</p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* reading-list Tab 内容：阅读列表 + 移除按钮 */}
      {activeTab === "reading-list" && (
        <>
          {/* 列表元信息：文章数 + 预计阅读时长 */}
          <div className="mb-4 flex items-center gap-4">
            <span className="text-text-secondary flex items-center gap-1.5 text-sm">
              <Bookmark className="h-4 w-4" />
              {readingList.length} articles saved
            </span>
            <span className="text-text-secondary flex items-center gap-1.5 text-sm">
              <Clock className="h-4 w-4" />
              ~27 min total reading time
            </span>
          </div>
          {readingList.length === 0 ? (
            // 阅读列表为空时的空态视图
            <div className="py-16 text-center">
              <div className="bg-surface-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Bookmark className="text-text-secondary h-8 w-8" />
              </div>
              <h3 className="text-text-primary mb-1 text-lg font-medium">No articles saved</h3>
              <p className="text-text-secondary">Start saving articles to read them later.</p>
            </div>
          ) : (
            // 阅读列表渲染
            <div className="space-y-4">
              {readingList.map((article) => (
                <div key={article.id} className="group relative">
                  <Article article={article} />
                  {/* 悬停出现的移除按钮，点击从阅读列表移除当前文章 */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // 从阅读列表中移除该文章
                      setReadingList(readingList.filter((a) => a.id !== article.id));
                    }}
                    className="text-text-secondary hover:bg-error/10 hover:text-error absolute top-4 right-4 rounded-lg p-2 opacity-0 transition-all group-hover:opacity-100"
                    title="Remove from reading list"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

/**
 * 收藏与阅读列表页面
 * 使用 Suspense 包裹客户端内容组件，避免 useSearchParams 触发 CSR bailout
 * @returns 收藏/阅读列表视图
 */
export default function FavoritesPage() {
  return (
    <Suspense>
      <FavoritesContent />
    </Suspense>
  );
}
