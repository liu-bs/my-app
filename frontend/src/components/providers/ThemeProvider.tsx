/**
 * @file ThemeProvider.tsx
 * @description 主题 Provider，基于 next-themes 包装，支持亮/暗主题与系统主题检测。
 */
"use client";

import { type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/** ThemeProvider 组件 props */
interface ThemeProviderProps {
  /** 子节点 */
  children: ReactNode;
}

/**
 * 主题 Provider。
 * @param props.children 子组件树。
 * @returns JSX.Element 包裹 next-themes 的子树；attribute="class" 走 class 主题方案；defaultTheme="system" 跟随系统；enableSystem 启用系统主题检测；enableColorScheme 同步 color-scheme CSS 属性。
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false} enableColorScheme>
      {children}
    </NextThemesProvider>
  );
}
