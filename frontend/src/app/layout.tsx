/**
 * @file layout.tsx
 * @description Next.js 应用根布局，注入全局字体、主题与鉴权 Provider。
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import { ToastProvider } from "@/components/common/Toast";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/services/auth/context";

/** Geist 无衬线字体实例，挂载到 CSS 变量 --font-geist-sans */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/** Geist Mono 等宽字体实例，挂载到 CSS 变量 --font-geist-mono */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** 全站元数据（标题、描述），用于 SEO 与浏览器标签 */
export const metadata: Metadata = {
  title: "Personal Blog - Share Your Ideas",
  description: "A modern personal blog platform for sharing ideas and stories",
};

/**
 * 应用根布局
 *
 * 作为 Next.js App Router 的顶层布局，负责：
 * - 注入字体变量到 <html>
 * - 包裹 ThemeProvider（主题切换）与 AuthProvider（鉴权上下文）
 * - 渲染全局 Header 与内容容器
 *
 * @param props 组件属性
 * @param props.children 路由级子页面内容
 * @returns 包含 Provider 嵌套结构的 HTML 根节点
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      {/* 主体容器：挂载全局 Provider 链路（主题 → 鉴权 → 业务） */}
      <body className="min-h-screen">
        {/* Toast 通知 Provider，提供全局通知功能 */}
        <ToastProvider>
          {/* React Query Provider，提供数据请求和缓存功能 */}
          <QueryProvider>
            {/* 主题切换上下文 Provider，控制明暗主题与设计变量 */}
            <ThemeProvider>
              {/* 认证上下文 Provider，提供用户登录状态 */}
              <AuthProvider>
            {/* 全局内容容器：居中布局 + 最小高度撑满屏幕 */}
            <div className="container mx-auto min-h-screen">
              {/* 全局顶部导航栏，展示 Logo 与主导航 */}
              <Header />
              {/* 路由级主内容区，承载各页面 children */}
              <main className="w-full px-4 py-8 sm:px-6 lg:px-8">{children}</main>
            </div>
            </AuthProvider>
            </ThemeProvider>
          </QueryProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
