/**
 * @file ArticleCommentsSection.tsx
 * @description 文章详情页评论区组件，支持发表评论、回复评论、对评论点赞
 */
"use client";

import { FC, useState } from "react";
import { ArticleDetailItem } from "@/typeing";

/**
 * 评论区组件的 Props
 */
interface ArticleCommentsSectionProps {
  /** 文章详情数据，当前未直接使用，保留以便扩展 */
  article: ArticleDetailItem;
}

/**
 * 单条评论数据结构
 */
interface CommentItem {
  /** 评论唯一 ID */
  id: number;
  /** 评论者姓名 */
  name: string;
  /** 评论者头像 URL（空字符串时退化为首字母占位） */
  avatar: string;
  /** 评论文本 */
  text: string;
  /** 评论相对发布时间 */
  time: string;
  /** 当前点赞数 */
  likes: number;
  /** 当前用户是否已点赞，false=未点赞 true=已点赞 */
  liked: boolean;
}

/**
 * 文章详情页评论区组件
 * 渲染评论输入框与评论列表，支持发布新评论、对指定评论进行回复、对单条评论点赞；评论以最新在前顺序展示
 * @param props 组件入参
 * @param props.article 文章详情数据
 * @returns 渲染完成的评论区 JSX
 */
const ArticleCommentsSection: FC<ArticleCommentsSectionProps> = ({ article }) => {
  // 评论输入框的实时文本
  const [commentText, setCommentText] = useState("");
  // 当前评论列表（包含主评论与回复，回复以 @用户名 开头展示）
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 1,
      name: "Emily Watson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      text: "Great article! This really helped me understand the concept better. Looking forward to more content like this.",
      time: "2 hours ago",
      likes: 3,
      liked: false,
    },
  ]);

  // 当前正在回复的评论 ID；null 表示未在回复
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  // 回复输入框的实时文本
  const [replyText, setReplyText] = useState("");

  /**
   * 发布新评论，要求评论内容非空；提交后插入到列表头部并清空输入框
   */
  const handlePostComment = () => {
    if (!commentText.trim()) return;
    const newComment: CommentItem = {
      id: Date.now(),
      name: "Alex Chen",
      avatar: "",
      text: commentText,
      time: "Just now",
      likes: 0,
      liked: false,
    };
    // 新评论插入到列表头部，最新评论优先展示
    setComments([newComment, ...comments]);
    setCommentText("");
  };

  /**
   * 向指定评论提交回复，要求回复内容非空；新回复以 @被回复者 开头并插入到列表头部
   * @param commentId 被回复的评论 ID
   */
  const handlePostReply = (commentId: number) => {
    if (!replyText.trim()) return;
    const target = comments.find((c) => c.id === commentId);
    const newReply: CommentItem = {
      id: Date.now(),
      name: "Alex Chen",
      avatar: "",
      text: `@${target?.name || ""} ${replyText}`,
      time: "Just now",
      likes: 0,
      liked: false,
    };
    // 新回复插入到列表头部，最新回复优先展示
    setComments([newReply, ...comments]);
    setReplyText("");
    setReplyingTo(null);
  };

  /**
   * 切换对某条评论的点赞状态并同步增减点赞数
   * @param id 评论 ID
   */
  const handleLikeComment = (id: number) => {
    setComments(
      comments.map((c) =>
        c.id === id
          ? {
              ...c,
              liked: !c.liked,
              // 取消点赞时 -1，新点赞时 +1
              likes: c.liked ? c.likes - 1 : c.likes + 1,
            }
          : c
      )
    );
  };

  return (
    <>{/* 评论区容器，作为锚点供操作栏的评论按钮跳转 */}
      <section id="comments" className="mt-12">
        {/* 评论区标题：含评论总数 */}
        <h2 className="text-text-primary mb-6 text-xl font-semibold">Comments ({comments.length})</h2>

        {/* 评论输入区 */}
        <div className="mb-8 flex gap-4">
          {/* 当前用户头像占位（首字母 A） */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-purple-500 text-sm font-medium text-white">A</div>
          {/* 输入框与发布按钮容器 */}
          <div className="flex-1">
            {/* 评论输入文本域：受控绑定 commentText */}
            <textarea
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="border-border bg-surface text-text-primary placeholder:text-text-secondary focus:ring-accent/20 focus:border-accent w-full resize-none rounded-lg border p-3 focus:ring-2 focus:outline-none"
              rows={3}
            />
            {/* 发布按钮区：右对齐发布按钮 */}
            <div className="mt-2 flex justify-end">
              {/* 发表评论按钮：内容为空时禁用 */}
              <button
                onClick={handlePostComment}
                disabled={!commentText.trim()}
                className="bg-accent hover:bg-accent-hover rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>

        {/* 评论列表区，遍历渲染所有评论与回复 */}
        <div className="space-y-6">
          {/* 遍历渲染评论与回复列表，每条数据按最新在前顺序展示 */}
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              {/* 头像：优先展示 URL，缺失时退化为首字母占位 */}
              {comment.avatar ? (
                <img src={comment.avatar} alt={comment.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-purple-500 text-sm font-medium text-white">
                  {comment.name[0]}
                </div>
              )}
              {/* 评论主体内容区 */}
              <div className="flex-1">
                {/* 评论者信息行：姓名 + 发布时间 */}
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-text-primary font-medium">{comment.name}</span>
                  <span className="text-text-secondary text-xs">{comment.time}</span>
                </div>
                {/* 评论文本展示 */}
                <p className="text-text-secondary text-sm">{comment.text}</p>
                {/* 评论操作行：回复 + 点赞 */}
                <div className="mt-2 flex items-center gap-4">
                  {/* 回复按钮：点击切换当前评论的回复输入框展开/收起 */}
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className={`text-xs transition-colors ${replyingTo === comment.id ? "text-accent" : "text-text-secondary hover:text-accent"}`}
                  >
                    Reply
                  </button>
                  {/* 点赞按钮：点击切换点赞状态并更新点赞数 */}
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`text-xs transition-colors ${comment.liked ? "text-error" : "text-text-secondary hover:text-error"}`}
                  >
                    Like{comment.likes > 0 && ` (${comment.likes})`}
                  </button>
                </div>
                {/* 条件渲染：仅在当前评论为回复目标时显示回复输入区 */}
                {replyingTo === comment.id && (
                  <div className="mt-3 flex gap-3">
                    {/* 回复输入框：受控绑定 replyText，按回车键提交 */}
                    <input
                      type="text"
                      placeholder={`Reply to ${comment.name}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handlePostReply(comment.id);
                      }}
                      className="border-border bg-surface text-text-primary placeholder:text-text-secondary focus:ring-accent/20 focus:border-accent flex-1 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                      autoFocus
                    />
                    {/* 发送回复按钮：内容为空时禁用 */}
                    <button
                      onClick={() => handlePostReply(comment.id)}
                      disabled={!replyText.trim()}
                      className="bg-accent hover:bg-accent-hover rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ArticleCommentsSection;
