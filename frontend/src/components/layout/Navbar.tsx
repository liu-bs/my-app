/**
 * @file Navbar.tsx
 * @description 顶部导航栏 — Server Component 外壳，渲染品牌标识和导航链接
 *              交互部分（用户菜单、移动端菜单）由 Client 岛屿组件承担
 */
import Link from 'next/link';
import { ThemeToggle } from '../ThemeToggle';
import { NavLinks } from './NavLinks';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';

/**
 * Navbar 顶部导航栏
 * @description Server Component 外壳，静态部分直接渲染，交互部分委托 Client 岛屿
 */
export function Navbar() {
  return (
    <>
      {/* 导航栏主体 */}
      <nav
        className="border-stroke sticky top-0 z-40 border-b"
        style={{
          background: 'color-mix(in srgb, var(--color-page) 62%, transparent)',
          backdropFilter: 'blur(18px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(18px) saturate(1.8)',
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Brand 品牌标识 */}
          <Link
            href="/"
            className="row-md text-heading group text-(length:--type-xl) leading-normal font-semibold tracking-[-0.01em]"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-[1.04]">
              <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" width="28" height="28">
                <rect width="28" height="28" rx="8" className="fill-accent" />
                <rect x="6" y="16" width="16" height="2.6" rx="1.3" className="fill-page" />
                <rect
                  x="8"
                  y="11.2"
                  width="12"
                  height="2.6"
                  rx="1.3"
                  className="fill-page"
                  opacity="0.7"
                />
                <rect
                  x="10"
                  y="6.4"
                  width="8"
                  height="2.6"
                  rx="1.3"
                  className="fill-page"
                  opacity="0.4"
                />
              </svg>
            </span>
            <span>我的博客</span>
          </Link>

          {/* Desktop links — Client 岛屿（需要 usePathname 高亮） */}
          <NavLinks />

          {/* Actions 右侧操作区域 */}
          <div className="row-sm">
            <ThemeToggle />
            <UserMenu />
            <MobileMenu />
          </div>
        </div>
      </nav>
    </>
  );
}
