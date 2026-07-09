/**
 * @file Header.tsx
 * @description 站点顶部 Header 组件，包含 Logo、桌面/移动端导航和右侧功能区。
 */
"use client";
import { FC } from "react";
import Link from "next/link";
import Styles from "@/styles/commonStyle";
import { DesktopNavbar, MobileNavbar } from "./Navbar";
import RightSection from "./RightSection";

/**
 * 站点 Header 组件。
 * @returns JSX.Element 顶部栏，含 Logo、桌面导航、移动端菜单和右侧功能区。
 */
const Header: FC = () => {
  return (
    // 顶部固定栏容器
    <header className="border-border sticky top-0 z-9999 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo 链接 */}
        <Link href="/" className={`flex items-center gap-2 ${Styles.link}`}>
          {/* 站点名 Logo */}
          <span className="block text-lg font-semibold">Blog</span>
        </Link>

        {/* 桌面端导航（居中），md 以上显示 */}
        <div className="hidden md:block">
          <DesktopNavbar />
        </div>

        {/* 右侧区域：移动端菜单 + 主题 + 通知 + 用户菜单 */}
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <MobileNavbar />
          </div>
          <RightSection />
        </div>
      </div>
    </header>
  );
};

export default Header;
