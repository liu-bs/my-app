/**
 * @file global-error.tsx
 * @description 根布局错误边界，捕获 layout.tsx 级别错误，必须渲染自己的 html/body
 */
'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <div
          className="flex min-h-screen flex-col items-center justify-center text-center"
          style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}
        >
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>出错了</h1>
          <p style={{ color: '#666', marginBottom: '2rem', maxWidth: '400px' }}>
            应用发生了严重错误。请尝试重新加载，如果问题持续出现请稍后再试。
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            重新加载
          </button>
        </div>
      </body>
    </html>
  );
}
