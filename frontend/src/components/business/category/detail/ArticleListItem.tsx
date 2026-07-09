/**
 * @file ArticleListItem.tsx
 * @description 文章列表行组件，展示缩略图、标签、标题、摘要、日期与点赞数，支持收藏
 */
"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { Bookmark, Calendar, Heart } from "lucide-react";
import { CATEGORY_DETAILS_ARTICLE } from "@/constans";

interface ArticleListItemProps {
  /** 文章数据（取自 CATEGORY_DETAILS_ARTICLE 元组中的元素类型） */
  article: (typeof CATEGORY_DETAILS_ARTICLE)[0];
}

/**
 * 文章列表行组件
 * @param props 组件入参
 * @param props.article 文章对象
 * @returns 渲染一行可点击的文章列表项，悬停时显示收藏按钮
 */
const ArticleListItem: FC<ArticleListItemProps> = ({ article }) => {
  /** 当前文章是否已被用户收藏：true=已收藏 false=未收藏 */
  const [saved, setSaved] = useState(false);

  return (
    <Link href={`/article/${article.id}`} className="group border-border bg-surface hover:border-accent/50 flex items-start gap-4 rounded-lg border p-4 transition-all"> {/* 文章列表行链接：点击跳转至文章详情页 */}
      {/* 文章封面缩略图：宽高 80px（h-20 w-20） */}
      <img src={article.image} alt={article.title} className="h-20 w-20 shrink-0 rounded-lg object-cover" />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          {/* 文章分类标签 */}
          <span className={`text-xs font-medium ${article.tagClass}`}>{article.tag}</span>
          {/* 文章阅读时长 */}
          <span className="text-text-secondary text-xs">{article.readTime}</span>
        </div>
        {/* 文章标题：单行截断，hover 时变为主题色 */}
        <h4 className="text-text-primary group-hover:text-accent mb-1 truncate font-medium transition-colors">{article.title}</h4>
        {/* 文章摘要：单行截断 */}
        <p className="text-text-secondary mb-2 line-clamp-1 text-sm">{article.excerpt}</p>
        <div className="text-text-secondary flex items-center gap-3 text-xs">
          {/* 文章发布日期 */}
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {article.date}
          </span>
          {/* 文章点赞数 */}
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {article.likes}
          </span>
        </div>
      </div>
      {/* 收藏按钮：默认透明，悬停时显示；点击阻止冒泡避免触发整行跳转 */}
      <button
        onClick={(e) => {
          // 阻止冒泡：避免点击收藏按钮同时触发外层 Link 跳转
          e.preventDefault();
          e.stopPropagation();
          setSaved(!saved);
        }}
        className={`rounded-lg p-2 opacity-0 transition-colors group-hover:opacity-100 ${saved ? "text-accent bg-accent/10" : "text-text-secondary hover:text-accent hover:bg-accent/10"}`}
      >
        {/* 收藏图标：已收藏时填充图标 */}
        <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
      </button>
    </Link>
  );
};

export default ArticleListItem;
