/**
 * @file DeletePostButton.tsx
 * @description 文章删除按钮组，支持 full(详情页带编辑入口) 与 compact(个人中心仅删除) 两种变体
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit } from 'lucide-react';
import toast from '@/lib/toast';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useDeletePost } from '@/services/blog/hooks';
import type { PostIdProps } from '@my-app/shared';

interface DeletePostButtonProps extends PostIdProps {
  /** 确认弹窗描述文案 */
  description?: string;
  /** 删除成功后跳转的路径，不传则关闭弹窗 */
  redirectTo?: string;
  /** 按钮变体：full=带编辑入口的完整按钮组(详情页), compact=仅删除按钮(个人中心) */
  variant?: 'full' | 'compact';
}

/**
 * DeletePostButton 文章删除按钮组
 * @description 根据变体渲染完整按钮组或紧凑删除按钮，弹出确认弹窗后调用删除接口
 * @param props {@link DeletePostButtonProps}
 */
export function DeletePostButton({
  postId,
  description = '确定要删除这篇文章吗？此操作无法撤销，文章及其所有评论将被永久移除。',
  redirectTo,
  variant = 'full',
}: DeletePostButtonProps) {
  const router = useRouter();
  /** 删除确认弹窗显示状态 */
  const [showDelete, setShowDelete] = useState(false);
  /** 删除文章的 mutation 实例 */
  const deleteMutation = useDeletePost();

  /**
   * 确认删除处理，调用删除接口成功后跳转或关闭弹窗
   */
  const confirmDelete = () => {
    deleteMutation.mutate(postId, {
      onSuccess: () => {
        if (redirectTo) router.push(redirectTo);
        else setShowDelete(false);
      },
      onError: () => toast.error('删除失败，请重试'),
    });
  };

  return (
    <>
      {variant === 'full' ? (
        <div className="row-sm border-stroke mt-4 border-t pt-4">
          <Button variant="ghost" size="sm" href={`/write?id=${postId}`}>
            <Edit size={14} />
            编辑文章
          </Button>
          <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
            <Trash2 size={14} />
            删除文章
          </Button>
        </div>
      ) : (
        <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
          <Trash2 size={14} />
          删除
        </Button>
      )}

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="确认删除">
        <p className="text-muted text-(length:--type-base) leading-normal">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setShowDelete(false)}>
            取消
          </Button>
          <Button variant="danger" onClick={confirmDelete} loading={deleteMutation.isPending}>
            删除
          </Button>
        </div>
      </Modal>
    </>
  );
}
