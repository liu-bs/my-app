/**
 * @file Toast.tsx
 * @description 全局 Toast 通知组件，用于显示错误、成功等提示信息
 */
"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

/**
 * Toast 类型
 */
type ToastType = "success" | "error" | "info";

/**
 * Toast 数据
 */
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

/**
 * Toast Context 值
 */
interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * 使用 Toast Hook
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

/**
 * Toast Provider 组件
 *
 * 提供全局 Toast 通知功能，子组件可以通过 useToast() hook 调用。
 *
 * @param props 组件属性
 * @param props.children 子组件
 * @returns Toast Provider 组件
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    // 3秒后自动移除
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast 容器 */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all ${
              toast.type === "error"
                ? "border-error/30 bg-error/10 text-error"
                : toast.type === "success"
                  ? "border-green-500/30 bg-green-500/10 text-green-600"
                  : "border-accent/30 bg-accent/10 text-accent"
            }`}
          >
            {/* 图标 */}
            {toast.type === "error" && <AlertCircle className="h-4 w-4 shrink-0" />}
            {toast.type === "success" && <CheckCircle className="h-4 w-4 shrink-0" />}
            {toast.type === "info" && <Info className="h-4 w-4 shrink-0" />}

            {/* 消息文本 */}
            <span className="text-sm font-medium">{toast.message}</span>

            {/* 关闭按钮 */}
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 opacity-60 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}