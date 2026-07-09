/**
 * @file FavoriteArticles.tsx
 * @description "我的收藏"页面的文章列表，支持按主题筛选与空状态展示
 */

"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { Heart, Search } from "lucide-react";
import Article from "@/components/common/Article";
import { FAVORITE_ARTICLES, TOPICS } from "@/constans";

/**
 * 收藏文章列表
 * 提供主题标签筛选；空数据时引导用户去发现文章
 * 已收藏但当前主题下无结果时，提示"该分类暂无收藏"
 */
const FavoriteArticles: FC = () => {
  // 当前激活的主题 ID，"all" 表示展示全部收藏
  const [activeTopic, setActiveTopic] = useState("all");

  // 根据当前主题过滤收藏列表；"all" 时直接返回全部
  const filteredArticles = activeTopic === "all" ? FAVORITE_ARTICLES : FAVORITE_ARTICLES.filter((a) => a.tag.toLowerCase() === activeTopic);

  // 整体无收藏数据时的引导视图
  if (FAVORITE_ARTICLES.length === 0) {
    return (
      <div className="py-16 text-center"> {/* 空收藏引导容器 */}
        {/* 引导图标圆形背景容器 */}
        <div className="bg-surface-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          {/* 心形图标 */}
          <Heart className="text-text-secondary h-8 w-8" />
        </div>
        {/* 引导主标题 */}
        <h3 className="text-text-primary mb-1 text-lg font-medium">No favorites yet</h3>
        {/* 引导说明文本 */}
        <p className="text-text-secondary mb-4">Start favoriting articles to see them here.</p>
        {/* 发现文章按钮，点击跳转至搜索页 */}
        <Link href="/search" className="bg-accent hover:bg-accent-hover inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors">
          {/* 搜索图标 */}
          <Search className="h-4 w-4" />
          Discover Articles
        </Link>
      </div>
    );
  }

  return (
    <div> {/* 收藏列表根容器 */}
      {/* 主题筛选标签栏 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {/* 遍历渲染主题筛选标签 */}
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setActiveTopic(topic.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTopic === topic.id ? "bg-accent text-white" : "bg-surface-secondary text-text-secondary hover:bg-surface-secondary/80"
            }`}
          >
            {/* 主题名称 */}
            {topic.label}
          </button>
        ))}
      </div>

      {/* 文章列表区域：条件渲染筛选结果 */}
      {filteredArticles.length > 0 ? (
        {/* 有筛选结果时渲染文章列表 */}
        <div className="space-y-6">
          {/* 遍历渲染筛选后的文章 */}
          {filteredArticles.map((article) => (
            // 渲染通用文章组件
            <Article key={article.id} article={article} />
          ))}
        </div>
      ) : (
        {/* 当前主题无结果时展示的占位提示 */}
        <div className="py-12 text-center">
          {/* 提示文本 */}
          <p className="text-text-secondary">No favorite articles in this category.</p>
        </div>
      )}
    </div>
  );
};

export default FavoriteArticles;
