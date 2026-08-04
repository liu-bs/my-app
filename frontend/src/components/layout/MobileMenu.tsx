/**
 * @file MobileMenu.tsx
 * @description 移动端折叠菜单 — Client 岛屿
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, isNavLinkActive } from '@/config/site';

export function MobileMenu() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    const handleClick = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [mobileOpen]);

  return (
    <>
      {/* 移动端菜单切换按钮 */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="菜单"
        aria-expanded={mobileOpen}
        className="text-heading hover:bg-surface hidden h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200 max-md:flex"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu 移动端折叠菜单 — inert 防止收起时焦点泄漏 */}
      <div
        ref={mobileMenuRef}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen ? true : undefined}
        style={{
          background: 'color-mix(in srgb, var(--color-page) 78%, transparent)',
          backdropFilter: 'blur(18px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(18px) saturate(1.8)',
        }}
        className={`border-stroke fixed inset-x-0 top-16 z-30 flex flex-col gap-1 border-b p-4 shadow-lg transition-[transform,opacity] duration-200 ease-out max-md:flex ${
          mobileOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        {NAV_LINKS.map((link) => {
          const active = isNavLinkActive(link.href, pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              onClick={() => setMobileOpen(false)}
              className={`nav-item-mobile nav-item-transition rounded-lg px-4 py-3.5 text-(length:--type-base) font-medium ${
                active ? 'nav-link-active' : 'nav-item-inactive'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </>
  );
}
