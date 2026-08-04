/**
 * @file site.ts
 * @description 站点级配置：基础 URL、元数据、受保护路由
 */

/** 站点基础 URL（用于 SEO metadata、sitemap、robots） */
export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

/** 站点元数据 */
export const SITE_METADATA = {
  title: '我的博客',
  description: '个人技术写作 · 极致极简 · 黑白灰质感',
  locale: 'zh_CN',
} as const;

/** 受保护路由列表（proxy.ts 路由守卫用） */
export const PROTECTED_ROUTES = ['/write', '/settings', '/profile'];

/** 每页文章数量 */
export const PAGE_SIZE = 9;

/** 顶部导航链接 */
export const NAV_LINKS = [
  { href: '/', label: '首页' },
  { href: '/posts', label: '文章' },
  { href: '/components', label: '组件库' },
] as const;

/** 判断链接是否匹配当前路径（首页精确匹配，其余前缀匹配） */
export function isNavLinkActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}
