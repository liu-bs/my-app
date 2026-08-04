/**
 * @file Modal.tsx
 * @description 通用模态弹窗组件，支持 Escape 关闭、点击遮罩关闭、焦点管理和标题展示
 */
'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { ModalProps } from '@my-app/shared';

/**
 * Modal 模态弹窗
 * @param props {@link ModalProps}
 */
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-sm' }: ModalProps) {
  /**
   * 弹窗内容容器 Ref，用于打开时聚焦
   */
  const dialogRef = useRef<HTMLDivElement>(null);

  /**
   * 弹窗打开时注册 Escape 键监听并聚焦弹窗容器，
   * 关闭时移除监听
   */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      // 焦点陷阱：Tab / Shift+Tab 循环在弹窗内
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`w-full ${maxWidth} border-card-border bg-card-bg animate-fade-in rounded-2xl border p-6 shadow-lg focus:outline-none`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏与关闭按钮 */}
        {title && (
          <div className="row-md mb-4 justify-between">
            <h3
              id="modal-title"
              className="text-heading text-(length:--type-xl) leading-normal font-semibold"
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-faint hover:bg-stroke hover:text-heading inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200"
              aria-label="关闭"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {/* 弹窗内容区域 */}
        {children}
      </div>
    </div>
  );
}
