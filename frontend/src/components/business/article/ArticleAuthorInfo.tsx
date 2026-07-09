/**
 * @file ArticleAuthorInfo.tsx
 * @description 文章详情页作者信息组件，展示作者头像、姓名、简介以及"关注/取消关注"按钮
 */
"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { ArticleDetailItem } from "@/typeing";

/**
 * 作者信息组件的 Props
 */
interface ArticleAuthorInfoProps {
  /** 文章详情数据，含作者信息（姓名、头像、简介） */
  article: ArticleDetailItem;
}

/**
 * 文章详情页作者信息组件
 * 渲染带头像、姓名、简介的作者卡片，并提供关注切换按钮，点击后切换"Follow/Unfollow"状态
 * @param props 组件入参
 * @param props.article 文章详情数据
 * @returns 渲染完成的作者信息 JSX
 */
const ArticleAuthorInfo: FC<ArticleAuthorInfoProps> = ({ article }) => {
  // 当前用户是否已关注该作者，false=未关注 true=已关注
  const [following, setFollowing] = useState(false);

  return (
    <>{/* 作者信息卡片容器，浅色背景区分 */}
      <div className="border-border bg-surface mb-8 flex items-center gap-4 rounded-xl border p-4">
        {/* 作者头像链接，点击跳转作者主页 */}
        <Link href={`/author/${article.author.name.toLowerCase().replace(/\s+/g, "-")}`}>
          <img src={article.author.avatar} alt={article.author.name} className="h-12 w-12 cursor-pointer rounded-full object-cover transition-opacity hover:opacity-90" />
        </Link>
        {/* 作者文本信息区：姓名 + 简介 */}
        <div className="flex-1">
          {/* 作者姓名链接，点击跳转作者主页 */}
          <Link href={`/author/${article.author.name.toLowerCase().replace(/\s+/g, "-")}`}>
            <h3 className="text-text-primary hover:text-accent cursor-pointer font-medium transition-colors">{article.author.name}</h3>
          </Link>
          {/* 作者个人简介文案 */}
          <p className="text-text-secondary text-sm">{article.author.bio}</p>
        </div>
        {/* 关注按钮：点击切换关注/取消关注状态，样式随之变化 */}
        <button
          onClick={() => setFollowing(!following)}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            following ? "border-border text-text-secondary hover:bg-error/10 hover:text-error hover:border-error" : "text-accent border-accent hover:bg-accent/10"
          }`}
        >
          {following ? "Unfollow" : "Follow"}
        </button>
      </div>
    </>
  );
};

export default ArticleAuthorInfo;
