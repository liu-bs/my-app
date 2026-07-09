/**
 * @file FeaturedAuthorsSection.tsx
 * @description 首页"精选作者"区块，以卡片网格展示推荐作者
 */

"use client";

import { FC } from "react";
import Link from "next/link";
import { FileText, Users } from "lucide-react";
import { FEATURED_AUTHORS } from "@/constans";

/**
 * 精选作者区块
 * 响应式网格布局展示每位作者的头像、昵称、角色、文章数与粉丝数
 * 点击卡片跳转至作者详情页
 */
const FeaturedAuthorsSection: FC = () => {
  return (
    <section className="mb-16">{/* 区块容器 */}
      {/* 区块标题行：标题 + 查看全部链接 */}
      <div className="mb-6 flex items-center justify-between">
        {/* 区块标题 */}
        <h2 className="text-text-primary text-xl font-semibold">Featured Authors</h2>
        {/* 查看全部链接，点击跳转至搜索页 */}
        <Link href="/search" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">
          View all →
        </Link>
      </div>

      {/* 作者卡片网格容器：移动端 1 列，平板 2 列，桌面 3 列 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* 遍历渲染作者卡片 */}
        {FEATURED_AUTHORS.map((author) => (
          <Link
            key={author.slug}
            href={`/author/${author.slug}`}
            className="border-border bg-surface hover:bg-surface-secondary flex items-center gap-4 rounded-xl border p-5 transition-colors"
          >
            {/* 作者头像 */}
            <img src={author.avatar} alt={author.name} className="h-14 w-14 shrink-0 rounded-full object-cover" />
            {/* 作者信息文本区 */}
            <div className="min-w-0 flex-1">
              {/* 作者昵称 */}
              <h3 className="text-text-primary truncate text-sm font-semibold">{author.name}</h3>
              {/* 作者角色 */}
              <p className="text-text-secondary truncate text-xs">{author.role}</p>
              {/* 文章数与粉丝数展示行 */}
              <div className="text-text-secondary mt-2 flex items-center gap-3 text-xs">
                {/* 文章数展示项 */}
                <span className="flex items-center gap-1">
                  {/* 文章图标 */}
                  <FileText className="h-3 w-3" />
                  {/* 文章数文本 */}
                  {author.articles} articles
                </span>
                {/* 粉丝数展示项 */}
                <span className="flex items-center gap-1">
                  {/* 粉丝图标 */}
                  <Users className="h-3 w-3" />
                  {/* 粉丝数文本 */}
                  {author.followers}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedAuthorsSection;
