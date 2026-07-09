/**
 * @file page.tsx
 * @description 热门趋势页面：依次展示趋势头部、热门话题与热门文章
 */
"use client";

import TrendingArticles from "@/components/business/trending/TrendingArticles";
import TrendingHeader from "@/components/business/trending/TrendingHeader";
import TrendingTopics from "@/components/business/trending/TrendingTopics";

/**
 * 热门趋势页面
 * @returns 热门趋势视图（Header、Topics、Articles）
 */
export default function TrendingPage() {
  return (
    <>
      {/* 趋势页头部 */}
      <TrendingHeader />
      {/* 热门话题区块 */}
      <TrendingTopics />
      {/* 热门文章区块 */}
      <TrendingArticles />
    </>
  );
}
