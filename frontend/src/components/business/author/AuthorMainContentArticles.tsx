/**
 * @file AuthorMainContentArticles.tsx
 * @description 作者主页主体内容组件，左侧展示已发布文章列表，右侧为社交链接与举报入口
 */
"use client";

import { FC } from "react";
import Link from "next/link";
import { ArrowRight, Eye, Flag, Heart } from "lucide-react";
import { AUTHORS_ARTICLES } from "@/constans";
import { UserInfo } from "@/typeing";

interface AuthorMainContentArticlesProps {
  /** 作者完整信息（用于读取 social 社交账号） */
  author: UserInfo;
}

/**
 * 作者主体内容组件（文章列表 + 侧边栏）
 * @param props 组件入参
 * @param props.author 作者信息（含 social.twitter/github/linkedin）
 * @returns 渲染两栏布局：已发布文章 + 侧边栏（社交/举报）
 */
const AuthorMainContentArticles: FC<AuthorMainContentArticlesProps> = ({ author }) => {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3"> {/* 主体内容两栏容器：移动端单列，桌面端 2:1 分栏 */}
      {/* 主体：已发布文章列表（占 2/3 宽） */}
      <div className="lg:col-span-2">
        <div className="mb-6 flex items-center justify-between">
          {/* 文章列表区标题 */}
          <h2 className="text-text-primary text-xl font-semibold">Published Articles</h2>
          {/* 查看全部按钮：点击跳转至搜索页 */}
          <Link href="/search" className="text-accent hover:text-accent-hover flex items-center gap-1 text-sm font-medium transition-colors">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 文章列表容器：列表项纵向间距 16px（space-y-4） */}
        <div className="space-y-4">
          {/* 遍历渲染已发布文章列表项 */}
          {AUTHORS_ARTICLES.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="border-border bg-surface hover:border-accent/50 group flex gap-4 rounded-xl border p-4 transition-all"
            >
              {/* 文章封面缩略图：宽 128px（w-32）高 96px（h-24） */}
              <img src={article.image} alt={article.title} className="h-24 w-32 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  {/* 文章分类标签 */}
                  <span className={`text-xs font-medium ${article.tagClass}`}>{article.tag}</span>
                  {/* 文章阅读时长 */}
                  <span className="text-text-secondary text-xs">{article.readTime}</span>
                </div>
                {/* 文章标题 */}
                <h3 className="text-text-primary group-hover:text-accent truncate font-medium transition-colors">{article.title}</h3>
                {/* 文章摘要 */}
                <p className="text-text-secondary mt-1 line-clamp-1 text-sm">{article.excerpt}</p>
                {/* 文章元信息：发布日期、点赞数、阅读数 */}
                <div className="text-text-secondary mt-3 flex items-center gap-4 text-xs">
                  {/* 文章发布日期 */}
                  <span>{article.date}</span>
                  {/* 文章点赞数 */}
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {article.likes}
                  </span>
                  {/* 文章阅读数 */}
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {article.views}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 侧边栏（占 1/3 宽）：含社交链接卡片与举报按钮 */}
      <div className="space-y-6">
        {/* 社交链接卡片 */}
        <section className="border-border bg-surface rounded-xl border p-6">
          {/* 社交链接卡片标题 */}
          <h3 className="text-text-primary mb-4 font-semibold">Connect</h3>
          <div className="space-y-3">
            {/* 遍历渲染社交平台链接项 */}
            {[
              { platform: "Twitter", handle: author.social.twitter },
              { platform: "GitHub", handle: author.social.github },
              { platform: "LinkedIn", handle: author.social.linkedin },
            ].map((social) => (
              <a
                key={social.platform}
                href={social.handle ? `https://${social.platform.toLowerCase()}.com/${social.handle.replace("@", "")}` : "#"}
                onClick={(e) => {
                  // 未填写社交账号时阻止跳转
                  if (!social.handle) e.preventDefault();
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-surface-secondary flex items-center gap-3 rounded-lg p-3 transition-colors"
              >
                {/* 平台 logo 容器：宽高 32px（h-8 w-8） */}
                <div className="bg-surface-secondary flex h-8 w-8 items-center justify-center rounded-lg">
                  {/* 条件渲染：Twitter 平台 logo */}
                  {social.platform === "Twitter" && (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )}
                  {/* 条件渲染：GitHub 平台 logo */}
                  {social.platform === "GitHub" && (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  )}
                  {/* 条件渲染：LinkedIn 平台 logo */}
                  {social.platform === "LinkedIn" && (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  {/* 平台名称 */}
                  <p className="text-text-primary text-sm font-medium">{social.platform}</p>
                  {/* 平台账号 handle */}
                  <p className="text-text-secondary text-xs">{social.handle}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 举报作者按钮：点击后 2s 反馈态切换为「Reported!」 */}
        <button
          onClick={() => {
            const btn = document.activeElement as HTMLButtonElement;
            // 防止重复点击：已显示 "Reported!" 时不再触发
            if (btn.textContent?.includes("Reported")) return;
            btn.textContent = "Reported!";
            // 2000ms（2s）后恢复文案
            setTimeout(() => {
              btn.textContent = "Report Profile";
            }, 2000);
          }}
          className="border-border bg-surface text-text-secondary hover:text-error hover:border-error flex w-full items-center justify-center gap-2 rounded-xl border p-4 transition-colors"
        >
          {/* 举报图标 */}
          <Flag className="h-4 w-4" />
          Report Profile
        </button>
      </div>
    </div>
  );
};

export default AuthorMainContentArticles;
