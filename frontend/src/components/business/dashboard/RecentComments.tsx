/**
 * @file RecentComments.tsx
 * @description 仪表盘最近评论列表，展示用户头像、评论内容、所属文章与点赞数
 */

import { FC } from "react";
import Link from "next/link";
import { MessageSquare, ThumbsUp } from "lucide-react";

/** 最近评论数据结构 */
interface RecentComment {
  /** 评论唯一标识 */
  id: string;
  /** 评论作者昵称 */
  author: string;
  /** 评论作者头像图片 URL */
  avatar: string;
  /** 评论正文内容 */
  content: string;
  /** 评论所属文章标题 */
  articleTitle: string;
  /** 评论所属文章 ID，用于生成跳转链接 */
  articleId: string;
  /** 评论相对时间，如 "2 hours ago" */
  time: string;
  /** 评论获得的点赞数（次） */
  likes: number;
}

/** 最近评论的模拟数据列表 */
const RECENT_COMMENTS: RecentComment[] = [
  {
    id: "1",
    author: "Emily Watson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    content: "Great article! This really helped me understand the concept better.",
    articleTitle: "Mastering React Server Components in 2024",
    articleId: "1",
    time: "2 hours ago",
    likes: 5,
  },
  {
    id: "2",
    author: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    content: "I disagree with the approach suggested in section 2. Have you considered using a different pattern?",
    articleTitle: "Building Resilient APIs with GraphQL",
    articleId: "3",
    time: "5 hours ago",
    likes: 3,
  },
  {
    id: "3",
    author: "Sarah Miller",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content: "The color psychology section was eye-opening. Would love to see a follow-up on cultural differences.",
    articleTitle: "The Psychology of Colors in Digital Products",
    articleId: "2",
    time: "1 day ago",
    likes: 12,
  },
  {
    id: "4",
    author: "David Kim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    content: "This is exactly what I needed. Bookmarked for reference!",
    articleTitle: "Mastering React Server Components in 2024",
    articleId: "1",
    time: "2 days ago",
    likes: 8,
  },
];

/**
 * 最近评论列表
 * 渲染作者头像、昵称、相对时间、评论正文、所属文章与点赞数
 * 提供"查看全部"入口跳转至通知中心
 */
const RecentComments: FC = () => {
  return (
    <div className="border-border bg-surface rounded-xl border p-6"> {/* 列表卡片容器 */}
      {/* 卡片头部：标题 + 查看全部链接 */}
      <div className="mb-4 flex items-center justify-between">
        {/* 区块标题 */}
        <h2 className="text-text-primary text-lg font-semibold">Recent Comments</h2>
        {/* 查看全部链接，点击跳转至通知中心 */}
        <Link href="/notifications" className="text-accent hover:text-accent-hover text-sm font-medium transition-colors">
          View all
        </Link>
      </div>

      {/* 评论列表区域 */}
      <div className="space-y-4">
        {/* 遍历渲染每条评论 */}
        {RECENT_COMMENTS.map((comment) => (
          <div key={comment.id} className="border-border border-b pb-4 last:border-0 last:pb-0"> {/* 单条评论容器：最后一条无下边框 */}
            {/* 评论行：左侧头像 + 右侧内容 */}
            <div className="flex items-start gap-3">
              {/* 评论作者头像 */}
              <img src={comment.avatar} alt={comment.author} className="mt-0.5 h-8 w-8 shrink-0 rounded-full object-cover" />
              {/* 评论主体内容区 */}
              <div className="min-w-0 flex-1">
                {/* 作者与时间行 */}
                <div className="flex items-center gap-2">
                  {/* 作者昵称 */}
                  <span className="text-text-primary text-sm font-medium">{comment.author}</span>
                  {/* 评论相对时间 */}
                  <span className="text-text-secondary text-xs">{comment.time}</span>
                </div>
                {/* 评论正文 */}
                <p className="text-text-secondary mt-1 text-sm">{comment.content}</p>
                {/* 所属文章链接与点赞数 */}
                <div className="mt-2 flex items-center gap-3">
                  {/* 所属文章链接，点击跳转至文章详情页 */}
                  <Link href={`/article/${comment.articleId}`} className="text-accent hover:text-accent-hover text-xs font-medium transition-colors">
                    on &ldquo;{comment.articleTitle}&rdquo;
                  </Link>
                  {/* 点赞数展示 */}
                  <span className="text-text-secondary flex items-center gap-1 text-xs">
                    {/* 点赞小图标 */}
                    <ThumbsUp className="h-3 w-3" />
                    {/* 点赞次数 */}
                    {comment.likes}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentComments;
