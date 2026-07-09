/**
 * @file AuthorProfileHeader.tsx
 * @description 作者个人资料页头部组件，展示作者头像、昵称、简介、标签及关注/分享等操作
 */
"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { Calendar, CheckCircle2, LinkIcon, Mail, MapPin, MoreHorizontal, Share2 } from "lucide-react";
import { UserInfo } from "@/typeing";

interface AuthorProfileHeaderProps {
  /** 作者完整信息对象 */
  author: UserInfo;
}

/**
 * 作者个人资料头部组件
 * @param props 组件入参
 * @param props.author 作者信息（昵称、头像、bio、位置、标签等）
 * @returns 渲染作者资料头部 UI
 */
const AuthorProfileHeader: FC<AuthorProfileHeaderProps> = ({ author }) => {
  /** 是否已关注该作者：true=已关注 false=未关注 */
  const [following, setFollowing] = useState(false);
  /** 是否显示「更多」操作菜单：true=显示 false=隐藏 */
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  /** 是否显示「分享」操作菜单：true=显示 false=隐藏 */
  const [showShareMenu, setShowShareMenu] = useState(false);
  /** 是否已复制链接（用于反馈提示）：true=已复制 false=未复制 */
  const [copied, setCopied] = useState(false);

  /**
   * 分享处理：复制当前页面链接到剪贴板
   * 复制成功后短暂显示 "Copied!" 提示，2000ms（2s）后恢复
   */
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      // 2s（2000ms）后重置复制状态
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 复制失败时静默回退 */
    }
    setShowShareMenu(false);
  };

  return (
    <div className="mb-8 flex flex-col gap-6 sm:flex-row"> {/* 作者资料头部分栏容器：移动端纵向、桌面端左右分栏 */}
      {/* 头像区域：含作者头像与已认证徽标 */}
      <div className="relative">
        {/* 作者头像：尺寸 128px（h-32 w-32），圆角带边框 */}
        <img src={author.avatar} alt={author.name} className="border-background h-32 w-32 rounded-2xl border-4 object-cover shadow-lg" />
        {/* 已认证作者显示右下角徽标 */}
        {author.verified && (
          <div className="bg-accent absolute -right-2 -bottom-2 rounded-full p-1.5">
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
        )}
      </div>

      {/* 基础信息区域：含昵称/简介/元信息/标签及操作按钮 */}
      <div className="flex-1 pt-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {/* 作者昵称标题 */}
            <h1 className="text-text-primary flex items-center gap-2 text-2xl font-bold sm:text-3xl">{author.name}</h1>
            {/* 作者用户名（@前缀） */}
            <p className="text-text-secondary">@{author.username}</p>
            {/* 作者个人简介 */}
            <p className="text-text-secondary mt-2 max-w-xl">{author.bio}</p>

            <div className="text-text-secondary mt-4 flex flex-wrap items-center gap-4 text-sm">
              {/* 所在地展示行 */}
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {author.location}
              </span>
              {/* 个人网站外链（可选） */}
              {author.website && (
                <a href={author.website} target="_blank" rel="noopener noreferrer" className="hover:text-accent flex items-center gap-1 transition-colors">
                  <LinkIcon className="h-4 w-4" />
                  {author.website.replace("https://", "")}
                </a>
              )}
              {/* 加入时间展示行 */}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {author.joined}
              </span>
            </div>

            {/* 作者标签云：遍历渲染作者标签集合 */}
            <div className="mt-4 flex flex-wrap gap-2">
              {author.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-text-secondary bg-surface-secondary hover:bg-accent rounded-full px-3 py-1 text-xs font-medium transition-colors hover:text-white"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* 操作按钮区：关注、邮件、分享、更多 */}
          <div className="flex items-center gap-3">
            {/* 关注/取消关注切换按钮 */}
            <button
              onClick={() => setFollowing(!following)}
              className={`rounded-lg px-6 py-2.5 font-medium transition-colors ${
                following ? "border-border text-text-secondary hover:bg-error/10 hover:text-error hover:border-error border" : "bg-accent hover:bg-accent-hover text-white"
              }`}
            >
              {following ? "Unfollow" : "Follow"}
            </button>
            {/* 邮件联系作者外链 */}
            <a
              href={`mailto:${author.social.twitter ? author.social.twitter.replace("@", "") + "@twitter.com" : author.username + "@example.com"}`}
              className="border-border hover:bg-surface-secondary rounded-lg border p-2.5 transition-colors"
            >
              <Mail className="text-text-secondary h-5 w-5" />
            </a>
            {/* 分享菜单触发按钮与下拉 */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowShareMenu(!showShareMenu);
                  setShowMoreMenu(false);
                }}
                className="border-border hover:bg-surface-secondary rounded-lg border p-2.5 transition-colors"
              >
                <Share2 className="text-text-secondary h-5 w-5" />
              </button>
              {/* 条件渲染：仅在分享菜单打开时显示 */}
              {showShareMenu && (
                <div className="border-border bg-surface absolute top-full right-0 z-10 mt-1 rounded-lg border p-1 shadow-lg">
                  {/* 复制链接按钮：点击后复制当前页面 URL */}
                  <button
                    onClick={handleShare}
                    className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary w-full rounded px-3 py-2 text-left text-sm transition-colors"
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                  {/* 分享至 Twitter 按钮：点击打开新窗口发起推文 */}
                  <button
                    onClick={() => {
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(author.name)}`, "_blank");
                      setShowShareMenu(false);
                    }}
                    className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary w-full rounded px-3 py-2 text-left text-sm transition-colors"
                  >
                    Twitter
                  </button>
                </div>
              )}
            </div>
            {/* 更多菜单触发按钮与下拉 */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowMoreMenu(!showMoreMenu);
                  setShowShareMenu(false);
                }}
                className="border-border hover:bg-surface-secondary rounded-lg border p-2.5 transition-colors"
              >
                <MoreHorizontal className="text-text-secondary h-5 w-5" />
              </button>
              {/* 条件渲染：仅在更多菜单打开时显示 */}
              {showMoreMenu && (
                <div className="border-border bg-surface absolute top-full right-0 z-10 mt-1 rounded-lg border p-1 shadow-lg">
                  {/* 举报作者按钮：点击触发举报逻辑（占位实现） */}
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                    }}
                    className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary w-full rounded px-3 py-2 text-left text-sm transition-colors"
                  >
                    Report Profile
                  </button>
                  {/* 屏蔽作者按钮：点击触发屏蔽逻辑（占位实现） */}
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
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
      </div>
    </div>
  );
};

export default AuthorProfileHeader;
