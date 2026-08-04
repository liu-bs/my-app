/**
 * @file UserMenu.tsx
 * @description 用户菜单 — Client 岛屿，包含登录/未登录状态、头像下拉菜单
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, PenLine, Settings, UserCircle } from 'lucide-react';
import toast from '@/lib/toast';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { useMe, useLogout } from '@/services/auth/hooks';
import { getInitials } from '@/lib/format';

/** 用户下拉菜单项配置 */
const userMenuItems = [
  { href: '/profile', label: '个人中心', icon: UserCircle },
  { href: '/write', label: '写文章', icon: PenLine },
  { href: '/settings', label: '账号设置', icon: Settings },
];

export function UserMenu() {
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const meQuery = useMe();
  const logoutMutation = useLogout();
  const user = meQuery.data?.user;
  const isLoggedIn = !!user;
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('已登出');
        setUserMenuOpen(false);
        router.push('/');
      },
      onError: () => {
        toast.error('登出失败，请重试');
      },
    });
  };

  useEffect(() => {
    if (!userMenuOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false);
    };
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [userMenuOpen]);

  if (!isLoggedIn) {
    return (
      <Button href="/login" variant="ghost" size="sm">
        <User size={15} />
        <span className="max-md:hidden">登录</span>
      </Button>
    );
  }

  return (
    <div
      ref={userMenuRef}
      className="relative"
      onMouseEnter={() => setUserMenuOpen(true)}
      onMouseLeave={() => setUserMenuOpen(false)}
      onFocus={() => setUserMenuOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setUserMenuOpen(false);
        }
      }}
    >
      {/* 用户头像按钮 */}
      <button
        onClick={() => setUserMenuOpen((v) => !v)}
        aria-label="用户菜单"
        aria-expanded={userMenuOpen}
        aria-haspopup="menu"
        className="flex items-center rounded-full transition-opacity duration-200 hover:opacity-90"
      >
        <Avatar
          initials={getInitials(user?.firstName ?? '', user?.lastName ?? '')}
          src={user?.avatar || undefined}
          size="sm"
          alt={`${user?.firstName ?? ''} ${user?.lastName ?? ''}的头像`}
        />
      </button>

      {/* 用户下拉菜单 */}
      {userMenuOpen && (
        <div className="absolute top-full left-1/2 z-50 -translate-x-1/2 pt-2">
          <div className="border-card-border bg-page animate-fade-in w-55 overflow-hidden rounded-2xl border shadow-md">
            {/* 用户信息头 */}
            <div className="row-md px-3.5 py-3">
              <Avatar
                initials={getInitials(user?.firstName ?? '', user?.lastName ?? '')}
                src={user?.avatar || undefined}
                size="md"
                alt={`${user?.firstName ?? ''} ${user?.lastName ?? ''}的头像`}
              />
              <div className="min-w-0">
                <p className="text-heading m-0 truncate text-(length:--type-sm) leading-normal font-semibold">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-muted m-0 mt-0.5 truncate text-(length:--type-xs) leading-normal">
                  @{user?.username}
                </p>
              </div>
            </div>

            <div className="border-stroke/60 mx-2 border-t" />

            {/* 菜单项 */}
            <div className="p-1.5">
              {userMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setUserMenuOpen(false)}
                    className="row-md text-body hover:bg-surface hover:text-heading group rounded-lg px-2.5 py-2 text-(length:--type-sm) leading-normal font-medium transition-[background-color,color] duration-150"
                  >
                    <Icon
                      size={15}
                      className="text-faint group-hover:text-heading shrink-0 transition-colors duration-150"
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="border-stroke/60 mx-2 border-t" />

            {/* 退出登录 */}
            <div className="p-1.5">
              <button
                onClick={handleLogout}
                className="row-md text-body hover:bg-state-error-bg hover:text-state-error w-full rounded-lg px-2.5 py-2 text-(length:--type-sm) leading-normal font-medium transition-[background-color,color] duration-150"
              >
                <LogOut size={15} className="text-faint shrink-0" />
                退出登录
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
