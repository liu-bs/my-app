/**
 * @file error.tsx
 * @description Next.js 全局错误边界组件，捕获渲染错误并显示友好的错误页面
 */
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

/**
 * 错误边界组件 Props
 */
interface ErrorProps {
  /** 捕获的错误对象 */
  error: Error & { digest?: string };
  /** 重置错误的函数，调用后尝试重新渲染页面 */
  reset: () => void;
}

/**
 * 全局错误边界组件
 *
 * 当页面渲染过程中抛出错误时，Next.js 会捕获并渲染此组件。
 * 提供错误信息展示和重试、返回首页等操作。
 *
 * @param props 组件属性
 * @param props.error 错误对象
 * @param props.reset 重置函数
 * @returns 错误页面 UI
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  // 记录错误日志到控制台
  useEffect(() => {
    console.error("[Error Boundary]", error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      {/* 错误图标 */}
      <div className="mb-6">
        <AlertTriangle className="text-error h-16 w-16" />
      </div>

      {/* 错误标题 */}
      <h1 className="text-text-primary mb-2 text-2xl font-bold">出现了一些问题</h1>

      {/* 错误描述 */}
      <p className="text-text-secondary mb-6 text-center text-sm">
        页面加载时发生了错误，请尝试刷新页面或返回首页。
      </p>

      {/* 开发环境显示详细错误信息 */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-error/10 border-error/30 mb-6 max-w-2xl rounded-lg border p-4">
          <p className="text-error mb-2 text-sm font-medium">错误详情：</p>
          <pre className="text-error overflow-auto text-xs">{error.message}</pre>
          {error.digest && (
            <p className="text-text-secondary mt-2 text-xs">错误 ID: {error.digest}</p>
          )}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-accent hover:bg-accent-hover flex items-center gap-2 rounded-lg px-6 py-2.5 font-medium text-white transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          重试
        </button>
        <Link
          href="/"
          className="border-border text-text-secondary hover:text-text-primary hover:bg-surface-secondary flex items-center gap-2 rounded-lg border px-6 py-2.5 font-medium transition-colors"
        >
          <Home className="h-4 w-4" />
          返回首页
        </Link>
      </div>
    </div>
  );
}