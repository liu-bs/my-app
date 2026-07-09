/**
 * @file ArticleBackLink.tsx
 * @description 文章详情页返回链接组件，点击后调用 router.back() 返回上一页
 */
"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * 文章返回链接组件的 Props（当前未传任何参数，预留扩展位）
 */
interface ArticleBackLinkProps {}

/**
 * 文章详情页返回链接组件
 * 渲染一个带左箭头的"返回文章列表"按钮，点击后调用 Next.js router 的 back 方法返回上一页
 * @param [props] 当前未使用，保留以便后续扩展
 * @returns 渲染完成的返回链接 JSX
 */
const ArticleBackLink: FC<ArticleBackLinkProps> = (_props) => {
  // 注入 Next.js 路由实例，用于返回上一页
  const router = useRouter();
  return (
    <>{/* 返回文章列表按钮：点击触发 router.back() 返回上一页 */}
      <button onClick={() => router.back()} className="text-text-secondary hover:text-text-primary mb-8 inline-flex items-center gap-2 text-sm transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to articles
      </button>
    </>
  );
};

export default ArticleBackLink;
