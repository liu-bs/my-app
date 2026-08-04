/**
 * @file NavLinks.tsx
 * @description 桌面端导航链接 — Client 岛屿，使用 usePathname 高亮当前路由
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/config/site';

export function NavLinks() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex items-center gap-0.5 max-md:hidden">
      {NAV_LINKS.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`nav-item nav-item-transition relative rounded-lg px-3.5 py-2 text-(length:--type-sm) font-medium ${
              active ? 'nav-link-active' : 'nav-item-inactive'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
