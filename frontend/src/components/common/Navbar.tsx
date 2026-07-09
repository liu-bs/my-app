/**
 * @file Navbar.tsx
 * @description 导航栏组件，包含桌面端横向导航与移动端弹出式菜单。
 */
"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_BAR_ITEMS } from "@/constans";
import Styles from "@/styles/commonStyle";

/** 导航项定义，来源于 @/constans 中的 NAV_BAR_ITEMS */
type NavItem = (typeof NAV_BAR_ITEMS)[number];

/**
 * 判断当前路径是否匹配导航项。
 * @param pathname 当前路由路径。
 * @param item 导航项。
 * @returns boolean 是否处于该导航项的激活态（精确匹配或子路径匹配）。
 */
function isItemActive(pathname: string, item: NavItem): boolean {
  // 精确匹配或子路径匹配（避免 /article 误匹配 /article-x）
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/**
 * 桌面端横向导航栏。
 * @returns JSX.Element 桌面端导航链接列表。
 */
export function DesktopNavbar() {
  const pathname = usePathname();
  return (
    // 桌面端导航容器
    <nav className="flex items-center gap-1">
      {NAV_BAR_ITEMS.map((item) => {
        const Icon = item.icon;
        // 计算当前项是否激活态
        const isActive = isItemActive(pathname, item);
        return (
          // 单个导航项链接，激活态切换样式
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? Styles.navItemActive : Styles.navItem}`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * 移动端弹出式导航菜单（汉堡按钮触发）。
 * @returns JSX.Element 移动端菜单按钮与下拉面板。
 */
export function MobileNavbar() {
  const pathname = usePathname();
  // 菜单是否打开
  const [mobileOpen, setMobileOpen] = useState(false);
  // 菜单容器 ref（用于点击外部关闭，可扩展）
  const menuRef = useRef<HTMLDivElement>(null);

  // 关闭移动端菜单
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    // 移动端菜单容器
    <div className="relative" ref={menuRef}>
      {/* 汉堡 / 关闭按钮，切换 mobileOpen 状态 */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="border-border text-text-secondary hover:bg-surface-secondary hover:text-text-primary flex h-9 w-9 items-center justify-center rounded-lg border transition-colors"
        aria-label="Menu"
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>
      {/* 弹出式菜单：菜单打开时显示 */}
      {mobileOpen && (
        <div className="border-border absolute top-full right-0 z-100 mt-2 w-48 rounded-xl border p-1.5 shadow-xl" style={{ backgroundColor: "var(--color-bg)" }}>
          {NAV_BAR_ITEMS.map((item) => {
            const Icon = item.icon;
            // 计算当前项是否激活态
            const isActive = isItemActive(pathname, item);
            return (
              // 菜单中的导航链接，点击后关闭菜单
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-accent/10 text-accent" : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
