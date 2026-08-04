/**
 * @file layout.tsx
 * @description 应用根布局，注册全局字体、元数据、Provider 链（含 next-themes 主题管理）
 */
import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_SC } from 'next/font/google';
import './globals.css';
import { ClientLayout } from '@/components/ClientLayout';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: '我的博客',
  description: '个人技术写作 · 极致极简 · 黑白灰质感',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: '我的博客',
    description: '个人技术写作 · 极致极简 · 黑白灰质感',
    type: 'website',
    locale: 'zh_CN',
    siteName: '我的博客',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: '我的博客',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '我的博客',
    description: '个人技术写作 · 极致极简 · 黑白灰质感',
    images: ['/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

/** Inter 无衬线拉丁字体实例（400 正文 / 500 强调 / 600 标题 / 700 粗体） */
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

/** Noto Sans SC 中文无衬线字体实例（400 正文 / 500 标题 / 700 粗体，CJK 字体体积大不预加载） */
const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
  preload: false,
});

/**
 * 根布局组件
 * @description 注入字体变量、主题初始化脚本、Provider 链与客户端布局壳
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${notoSansSC.variable}`}
    >
      <body className="antialiased">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
