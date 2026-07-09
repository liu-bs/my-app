/**
 * @file ArticleActions.tsx
 * @description 文章详情页操作栏组件，提供点赞、评论入口、收藏、分享、举报/拉黑等交互按钮
 */
"use client";

import { FC, useState } from "react";
import { Bookmark, Heart, MessageSquare, MoreHorizontal, Share2 } from "lucide-react";
import { ArticleDetailItem } from "@/typeing";

/**
 * 文章操作栏组件的 Props
 */
interface ArticleActionsProps {
  /** 文章详情数据，提供初始点赞数、评论数与分享文案 */
  article: ArticleDetailItem;
}

/**
 * 文章详情页操作栏组件
 * 渲染点赞（带计数）、评论（点击锚点跳转）、收藏、分享菜单（复制链接 / Twitter / Facebook）以及更多菜单（举报 / 拉黑作者）
 * @param props 组件入参
 * @param props.article 文章详情数据
 * @returns 渲染完成的操作栏 JSX
 */
const ArticleActions: FC<ArticleActionsProps> = ({ article }) => {
  // 当前用户是否已点赞本文，false=未点赞 true=已点赞
  const [liked, setLiked] = useState(false);
  // 当前点赞总数，随点赞操作增减
  const [likeCount, setLikeCount] = useState(article.likes);
  // 当前用户是否已收藏本文，false=未收藏 true=已收藏
  const [saved, setSaved] = useState(false);
  // 是否展开分享菜单，false=隐藏 true=显示
  const [showShareMenu, setShowShareMenu] = useState(false);
  // 是否展开更多菜单（举报 / 拉黑），false=隐藏 true=显示
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  // 分享链接复制成功后短暂提示，false=未提示 true=已提示
  const [copied, setCopied] = useState(false);
  // 举报提交后短暂提示，false=未提示 true=已提示
  const [reported, setReported] = useState(false);

  /**
   * 切换点赞状态，并同步增减点赞数
   */
  const handleLike = () => {
    setLiked(!liked);
    // 根据当前 liked 状态决定是加一还是减一
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  /**
   * 复制当前页面链接到剪贴板，2s 后清除 "Copied" 提示
   */
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      // 2s 后自动清除复制成功提示
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪贴板 API 不可用时静默失败
    }
    setShowShareMenu(false);
  };

  return (
    <>{/* 文章操作栏容器，上下边框分隔 */}
      <div className="border-border flex items-center justify-between border-t border-b py-6">
        {/* 左侧操作区：点赞与评论 */}
        <div className="flex items-center gap-4">
          {/* 点赞按钮：点击切换点赞状态并更新点赞数 */}
          <button onClick={handleLike} className={`flex items-center gap-2 transition-colors ${liked ? "text-error" : "text-text-secondary hover:text-error"}`}>
            <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
            <span className="text-sm font-medium">{likeCount}</span>
          </button>
          {/* 评论按钮：点击平滑滚动到评论区 */}
          <button
            onClick={() => document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" })}
            className="text-text-secondary hover:text-accent flex items-center gap-2 transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm font-medium">{article.comments}</span>
          </button>
        </div>
        {/* 右侧操作区：收藏、分享、更多 */}
        <div className="flex items-center gap-2">
          {/* 收藏按钮：点击切换收藏状态，样式随之变化 */}
          <button
            onClick={() => setSaved(!saved)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              saved ? "bg-accent/10 text-accent" : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
            {saved ? "Saved" : "Save"}
          </button>
          {/* 分享区域，包裹分享按钮与下拉菜单 */}
          <div className="relative">
            {/* 分享按钮：点击展开/收起分享菜单 */}
            <button
              onClick={() => {
                setShowShareMenu(!showShareMenu);
                setShowMoreMenu(false);
              }}
              className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            >
              <Share2 className="h-4 w-4" />
              {copied ? "Copied!" : "Share"}
            </button>
            {/* 条件渲染：仅在分享菜单展开时显示 */}
            {showShareMenu && (
              <div className="border-border bg-surface absolute top-full right-0 z-10 mt-1 rounded-lg border p-1 shadow-lg">
                {/* 复制链接按钮：点击复制当前页 URL 到剪贴板 */}
                <button
                  onClick={handleShare}
                  className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary w-full rounded px-3 py-2 text-left text-sm transition-colors"
                >
                  Copy Link
                </button>
                {/* Twitter 分享按钮：点击打开 Twitter 分享窗口 */}
                <button
                  onClick={() => {
                    const text = `${article.title} ${window.location.href}`;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
                    setShowShareMenu(false);
                  }}
                  className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary w-full rounded px-3 py-2 text-left text-sm transition-colors"
                >
                  Twitter
                </button>
                {/* Facebook 分享按钮：点击打开 Facebook 分享窗口 */}
                <button
                  onClick={() => {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
                    setShowShareMenu(false);
                  }}
                  className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary w-full rounded px-3 py-2 text-left text-sm transition-colors"
                >
                  Facebook
                </button>
              </div>
            )}
          </div>
          {/* 更多区域，包裹更多按钮与下拉菜单 */}
          <div className="relative">
            {/* 更多按钮：点击展开/收起更多菜单 */}
            <button
              onClick={() => {
                setShowMoreMenu(!showMoreMenu);
                setShowShareMenu(false);
              }}
              className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-lg p-2 transition-colors"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {/* 条件渲染：仅在更多菜单展开时显示 */}
            {showMoreMenu && (
              <div className="border-border bg-surface absolute top-full right-0 z-10 mt-1 rounded-lg border p-1 shadow-lg">
                {/* 举报文章按钮：点击触发举报，3s 后清除提示 */}
                <button
                  onClick={() => {
                    setReported(true);
                    setShowMoreMenu(false);
                    setTimeout(() => setReported(false), 3000);
                  }}
                  className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary w-full rounded px-3 py-2 text-left text-sm transition-colors"
                >
                  {reported ? "Reported!" : "Report Article"}
                </button>
                {/* 拉黑作者按钮：点击触发拉黑，3s 后清除提示 */}
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    setReported(true);
                    setTimeout(() => setReported(false), 3000);
                  }}
                  className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary w-full rounded px-3 py-2 text-left text-sm transition-colors"
                >
                  Block Author
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleActions;
