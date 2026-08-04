/**
 * @file ThemeToggle.tsx
 * @description 主题切换按钮组件，使用 next-themes 的 useTheme 驱动，带太阳/月亮图标过渡动画
 */
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * ThemeToggle 主题切换按钮
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  const toggle = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <button
      onClick={toggle}
      aria-label="切换主题"
      className="text-muted hover:bg-surface hover:text-heading relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg transition-[background-color,color,box-shadow] duration-200 ease-out hover:shadow-[inset_0_0_0_1px_var(--color-stroke-strong)]"
    >
      {/* 太阳图标（亮色模式时显示） */}
      <span
        className={`absolute transition-[opacity,transform] duration-300 ease-out ${
          mounted && isDark
            ? 'translate-y-4 rotate-90 opacity-0'
            : 'translate-y-0 rotate-0 opacity-100'
        }`}
      >
        <Sun size={16} />
      </span>
      {/* 月亮图标（暗色模式时显示） */}
      <span
        className={`absolute transition-[opacity,transform] duration-300 ease-out ${
          mounted && isDark
            ? 'translate-y-0 rotate-0 opacity-100'
            : '-translate-y-4 -rotate-90 opacity-0'
        }`}
      >
        <Moon size={16} />
      </span>
      {/* 无障碍可读文本 */}
      <span className="sr-only">切换主题</span>
    </button>
  );
}
