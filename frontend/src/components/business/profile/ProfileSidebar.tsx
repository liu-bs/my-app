/**
 * @file ProfileSidebar.tsx
 * @description 个人资料页侧边栏组件，渲染分组标签导航与底部快捷入口链接
 */

"use client";

import { FC } from "react";
import Link from "next/link";
import { Bookmark, FileText, Heart } from "lucide-react";
import { SIDEBAR_ITEMS } from "@/constans";

/** 快捷入口链接项 */
interface QuickLink {
  /** 链接唯一 ID */
  id: string;
  /** 链接展示文案 */
  label: string;
  /** 链接图标组件 */
  icon: typeof FileText;
  /** 目标路由 */
  href: string;
}

/**
 * 个人资料页侧边栏组件 Props
 */
interface ProfileSidebarProps {
  /** 当前激活的标签 id */
  activeTab: string;
  /** 标签切换回调，参数为新的标签 id */
  onTabChange: (tab: string) => void;
}

/** 底部快捷入口配置：我的文章 / 收藏 / 待读清单 */
const QUICK_LINKS: QuickLink[] = [
  {
    id: "my-articles",
    label: "My Articles",
    icon: FileText,
    href: "/my-articles",
  },
  { id: "favorites", label: "Favorites", icon: Heart, href: "/favorites" },
  {
    id: "reading-list",
    label: "Reading List",
    icon: Bookmark,
    href: "/reading-list",
  },
];

/**
 * 个人资料页侧边栏组件
 * @param props 组件属性
 * @param props.activeTab 当前激活的标签 id
 * @param props.onTabChange 标签切换回调，参数为新的标签 id
 * @returns 渲染分组标签导航与底部快捷入口
 */
const ProfileSidebar: FC<ProfileSidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    // 侧边栏容器：固定宽度 256px（lg:w-64），内部纵向排布标签与快捷入口
    <div className="shrink-0 lg:w-64">
      {/* 分组标签导航 */}
      <nav className="space-y-1">
        {/* 遍历渲染分组标签 */}
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            // 点击切换激活标签
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              // 激活态使用强调色，未激活态使用中性色
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                activeTab === item.id ? "bg-accent/10 text-accent" : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
              }`}
            >
              {/* 标签图标 */}
              <Icon className="h-4 w-4" />
              {/* 标签文案 */}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* 底部快捷入口分组 */}
      <div className="border-border mt-6 border-t pt-4">
        {/* 分组标题 */}
        <p className="text-text-secondary mb-2 px-4 text-xs font-medium uppercase">Quick Links</p>
        {/* 遍历渲染快捷入口链接 */}
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            // 点击跳转至对应业务路由
            <Link
              key={link.id}
              href={link.href}
              className="text-text-secondary hover:bg-surface-secondary hover:text-text-primary flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
            >
              {/* 链接图标 */}
              <Icon className="h-4 w-4" />
              {/* 链接文案 */}
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSidebar;
