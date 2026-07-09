/**
 * @file RightSection.tsx
 * @description Header 右侧功能区：主题切换 + 已登录(通知/用户菜单) / 未登录(登录按钮)
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  Bookmark,
  ChevronDown,
  FileText,
  Heart,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/services/auth/context";
import { useLogout } from "@/services/auth/hooks";

// ─── 常量 ────────────────────────────────────────────

/** 用户菜单项 */
const USER_MENU_ITEMS = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/my-articles", label: "My Articles", icon: FileText },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/favorites?tab=reading-list", label: "Reading List", icon: Bookmark },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

/** 未读通知数（临时占位，后续接入通知 API） */
const UNREAD_NOTIFICATION_COUNT = 3;

// ─── 样式片段 ────────────────────────────────────────

const iconBtn =
  "border-border bg-surface text-text-secondary hover:bg-surface-secondary hover:text-text-primary flex h-9 w-9 items-center justify-center rounded-lg border transition-colors";

const menuItem =
  "text-text-secondary hover:bg-surface-secondary hover:text-text-primary flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors";

// ─── 子组件 ──────────────────────────────────────────

/** 主题切换按钮 */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={iconBtn}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

/** 通知铃铛 */
function NotificationBell() {
  return (
    <Link href="/notifications" className={`${iconBtn} relative`}>
      <Bell className="h-4 w-4" />
      {UNREAD_NOTIFICATION_COUNT > 0 && (
        <span className="bg-error absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[10px] font-medium text-white">
          {UNREAD_NOTIFICATION_COUNT}
        </span>
      )}
    </Link>
  );
}

/** 用户头像：有 avatar 用图片，否则取首字母 */
function UserAvatar({ user }: { user: NonNullable<ReturnType<typeof useAuth>["user"]> }) {
  if (user.avatar) {
    return (
      <Image
        src={user.avatar}
        alt={user.username}
        width={32}
        height={32}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-purple-500 text-sm font-medium text-white">
      {user.firstName[0]}
    </div>
  );
}

/** 用户下拉菜单 */
function UserMenu() {
  const { user } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isLoggingOut) return;
    logout();
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg transition-colors hover:opacity-90"
      >
        <UserAvatar user={user!} />
        <ChevronDown
          className={`text-text-secondary h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="border-border absolute top-full right-0 z-50 mt-2 w-52 rounded-xl border p-1.5 shadow-xl"
          style={{ backgroundColor: "var(--color-bg)" }}
        >
          {/* 用户信息 */}
          <div className="border-border border-b px-3 py-2">
            <p className="text-text-primary text-sm font-medium">
              {user!.firstName} {user!.lastName}
            </p>
            <p className="text-text-secondary text-xs">{user!.email}</p>
          </div>

          {/* 菜单项 */}
          <div className="mt-1">
            {USER_MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={menuItem}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* 登出 */}
          <div className="border-border mt-1 border-t pt-1">
            <Link
              href="/login"
              onClick={handleLogout}
              className={`${menuItem} hover:text-error ${isLoggingOut ? "pointer-events-none opacity-50" : ""}`}
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 主组件 ──────────────────────────────────────────

export default function RightSection() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />

      {isAuthenticated ? (
        <div className="border-border flex items-center gap-3 border-l pl-3">
          <NotificationBell />
          <UserMenu />
        </div>
      ) : (
        <Link
          href="/login"
          className="bg-nav-bg hover:bg-nav-active-hover-bg rounded-lg px-4 py-2 text-sm font-medium text-text-primary transition-colors"
        >
          Sign in
        </Link>
      )}
    </div>
  );
}
