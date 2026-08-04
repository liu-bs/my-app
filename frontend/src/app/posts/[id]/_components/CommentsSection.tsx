/**
 * @file CommentsSection.tsx
 * @description 文章评论区，支持发表、编辑、删除评论，未登录时引导登录
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, MessageCircle } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  useComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from '@/services/comment/hooks';
import { getInitials, formatRelativeTime } from '@/lib/format';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import type { CommentsSectionProps } from '@my-app/shared';

/**
 * CommentsSection 评论区
 * @param props {@link CommentsSectionProps}
 */
export function CommentsSection({ postId, user, postAuthorId }: CommentsSectionProps) {
  const { data: commentsData, isError, refetch } = useComments(postId);
  /** 评论列表 */
  const comments = commentsData?.comments ?? [];
  /** 创建评论 mutation */
  const createCommentMutation = useCreateComment(postId);
  /** 更新评论 mutation */
  const updateCommentMutation = useUpdateComment(postId);
  /** 删除评论 mutation */
  const deleteCommentMutation = useDeleteComment(postId);

  /** 新评论输入文本 */
  const [commentText, setCommentText] = useState('');
  /** 当前正在编辑的评论 ID */
  const [editingId, setEditingId] = useState<string | null>(null);
  /** 编辑评论的文本内容 */
  const [editText, setEditText] = useState('');
  /** 评论展示数量（分页每次加载5条） */
  const [visibleCount, setVisibleCount] = useState(5);

  // 评论列表变化时，确保 visibleCount 不超过评论总数（删除评论后修正）
  useEffect(() => {
    if (visibleCount > comments.length) {
      setVisibleCount(Math.min(visibleCount, comments.length));
    }
  }, [comments.length, visibleCount]);
  /** 待删除的评论 ID（用于确认弹窗） */
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  /**
   * 鉴权守卫，未登录时提示并跳转登录页
   */
  const requireAuth = useRequireAuth(user, `/posts/${postId}`);

  /**
   * 提交新评论
   */
  const submitComment = () => {
    const text = commentText.trim();
    if (!text) return;
    requireAuth(() =>
      createCommentMutation.mutate(
        { content: text },
        {
          onSuccess: () => {
            setCommentText('');
          },
        },
      ),
    );
  };

  /**
   * 进入评论编辑模式
   * @param cId 评论 ID
   * @param content 评论原始内容
   */
  const startEdit = (cId: string, content: string) => {
    setEditingId(cId);
    setEditText(content);
  };

  /**
   * 保存编辑后的评论
   */
  const saveEdit = () => {
    const text = editText.trim();
    if (!text || !editingId) return;
    updateCommentMutation.mutate(
      { commentId: editingId, dto: { content: text } },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditText('');
        },
      },
    );
  };

  return (
    <section className="mt-8 mb-10">
      <h2 className="text-heading mb-5 text-(length:--type-2xl) leading-snug font-semibold">
        评论{' '}
        <span className="text-muted ml-1.5 text-(length:--type-md) font-normal">
          · {comments.length}
        </span>
      </h2>

      {/* comment form */}
      <div className="mb-6">
        {user ? (
          <>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  submitComment();
                }
              }}
              placeholder="写下你的想法...（1-2000 字符，⌘/Ctrl+Enter 发送）"
              maxLength={2000}
              rows={4}
              className="textarea-field"
            />
            <div className="mt-3 flex justify-end">
              <Button
                onClick={submitComment}
                disabled={!commentText.trim() || createCommentMutation.isPending}
                loading={createCommentMutation.isPending}
              >
                发表评论
              </Button>
            </div>
          </>
        ) : (
          <div className="card border-stroke text-muted rounded-xl border p-5 text-center text-(length:--type-base) leading-normal">
            <Link href={`/login?redirect=/posts/${postId}`} className="text-accent hover:underline">
              登录
            </Link>
            后参与评论
          </div>
        )}
      </div>

      {/* comment list */}
      <div className="card-list">
        {isError ? (
          <EmptyState
            icon={<AlertCircle size={20} />}
            title="评论加载失败"
            action={
              <Button variant="ghost" size="sm" onClick={() => refetch()}>
                重试
              </Button>
            }
          />
        ) : (
          comments.length === 0 && (
            <EmptyState
              icon={<MessageCircle size={20} />}
              title="还没有评论"
              description="来说点什么吧"
            />
          )
        )}
        {comments.slice(0, visibleCount).map((c) => {
          const isCommentAuthor = !!user && c.userId === user.id;
          const canDelete =
            isCommentAuthor || (!!user && !!postAuthorId && postAuthorId === user.id);
          return (
            <div key={c.id} className="card card-hover row-md p-4">
              <Avatar
                initials={getInitials(
                  c.userName.split(' ')[0] || '',
                  c.userName.split(' ').slice(1).join(' ') || '',
                )}
                src={c.userAvatar || undefined}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <div className="row-md mb-1.5">
                  <span className="text-heading text-(length:--type-base) leading-normal font-semibold">
                    {c.userName}
                  </span>
                  <span className="meta-text">{formatRelativeTime(c.createdAt)}</span>
                </div>

                {editingId === c.id ? (
                  <div className="mt-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      maxLength={2000}
                      className="textarea-field resize-y"
                    />
                    <div className="row-sm mt-3">
                      <Button
                        size="sm"
                        onClick={saveEdit}
                        loading={updateCommentMutation.isPending}
                      >
                        保存
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingId(null);
                          setEditText('');
                        }}
                      >
                        取消
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-body text-(length:--type-base) leading-normal break-words">
                      {c.content}
                    </p>
                    {(isCommentAuthor || canDelete) && (
                      <div className="row-sm mt-2">
                        {isCommentAuthor && (
                          <button
                            onClick={() => startEdit(c.id, c.content)}
                            className="text-muted hover:text-heading text-(length:--type-xs) leading-normal transition-colors duration-200"
                          >
                            编辑
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => setDeleteTargetId(c.id)}
                            className="text-muted hover:text-heading text-(length:--type-xs) leading-normal transition-colors duration-200"
                          >
                            删除
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
        {comments.length > visibleCount && (
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm" onClick={() => setVisibleCount((c) => c + 5)}>
              加载更多评论（剩余 {comments.length - visibleCount} 条）
            </Button>
          </div>
        )}
      </div>

      {/* 删除确认弹窗 */}
      <Modal
        open={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        title="删除评论"
      >
        <p className="text-body text-(length:--type-base) leading-normal">
          确认删除这条评论吗？此操作不可撤销。
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleteTargetId(null)}>
            取消
          </Button>
          <Button
            variant="danger"
            loading={deleteCommentMutation.isPending}
            onClick={() => {
              if (deleteTargetId) {
                deleteCommentMutation.mutate(deleteTargetId, {
                  onSettled: () => setDeleteTargetId(null),
                });
              }
            }}
          >
            确认删除
          </Button>
        </div>
      </Modal>
    </section>
  );
}
