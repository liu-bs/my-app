/**
 * @file page.tsx
 * @description 个人资料页面：展示用户头像、邮箱、简介，并提供快捷入口（我的文章、收藏、阅读列表、账户设置）
 */
"use client";

import Link from "next/link";
import { Bookmark, Camera, FileText, Heart, Mail, PenLine, Settings } from "lucide-react";

/**
 * 个人资料页面
 * @returns 个人资料视图（资料卡、快捷入口、账户设置概览）
 */
export default function ProfilePage() {
  /** 当前登录用户信息（本地模拟） */
  const user = {
    /** 名字 */
    firstName: "Alex",
    /** 姓氏 */
    lastName: "Morgan",
    /** 邮箱 */
    email: "alex.morgan@example.com",
    /** 个人简介 */
    bio: "Passionate software engineer and design enthusiast. Building tools for the modern web.",
  };

  return (
    <>
      {/* 页面顶部：标题 + 编辑设置按钮 */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-text-primary text-2xl font-bold">My Profile</h1>
        {/* 点击跳转至设置页 */}
        <Link href="/settings" className="bg-accent hover:bg-accent-hover inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors">
          <Settings className="h-4 w-4" />
          Edit Settings
        </Link>
      </div>

      {/* 用户资料卡片：头像 + 邮箱 + 简介 */}
      <div className="border-border bg-surface rounded-xl border p-6">
        <div className="flex items-center gap-6">
          {/* 头像区域：首字母圆形 + 相机图标 */}
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-purple-500 text-2xl font-medium text-white">
              {user.firstName[0]}
            </div>
            {/* 头像编辑图标 */}
            <div className="bg-accent absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full text-white shadow-md">
              <Camera className="h-3.5 w-3.5" />
            </div>
          </div>
          {/* 文本信息：姓名 + 邮箱 + 简介 */}
          <div className="flex-1">
            <h2 className="text-text-primary text-lg font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-text-secondary flex items-center gap-1.5 text-sm">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </p>
            <p className="text-text-secondary mt-2 text-sm">{user.bio}</p>
          </div>
        </div>
      </div>

      {/* 快捷入口三宫格：我的文章 / 收藏 / 阅读列表 */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* 我的文章入口 */}
        <Link href="/my-articles" className="border-border bg-surface hover:border-accent/50 group flex items-center gap-4 rounded-xl border p-5 transition-colors">
          <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <FileText className="text-accent h-5 w-5" />
          </div>
          <div>
            <p className="text-text-primary group-hover:text-accent font-medium transition-colors">My Articles</p>
            <p className="text-text-secondary text-xs">Manage your posts</p>
          </div>
        </Link>
        {/* 收藏入口 */}
        <Link href="/favorites" className="border-border bg-surface hover:border-accent/50 group flex items-center gap-4 rounded-xl border p-5 transition-colors">
          <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Heart className="text-accent h-5 w-5" />
          </div>
          <div>
            <p className="text-text-primary group-hover:text-accent font-medium transition-colors">Favorites</p>
            <p className="text-text-secondary text-xs">Saved articles</p>
          </div>
        </Link>
        {/* 阅读列表入口（带 tab 参数直跳 reading-list） */}
        <Link href="/favorites?tab=reading-list" className="border-border bg-surface hover:border-accent/50 group flex items-center gap-4 rounded-xl border p-5 transition-colors">
          <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Bookmark className="text-accent h-5 w-5" />
          </div>
          <div>
            <p className="text-text-primary group-hover:text-accent font-medium transition-colors">Reading List</p>
            <p className="text-text-secondary text-xs">Articles to read</p>
          </div>
        </Link>
      </div>

      {/* 账户设置概览卡片：个人信息 / 邮箱 / 密码 / 通知 */}
      <div className="border-border bg-surface mt-6 rounded-xl border p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-text-primary font-semibold">Account Settings</h3>
          {/* 点击跳转设置页编辑 */}
          <Link href="/settings" className="text-accent hover:text-accent-hover flex items-center gap-1 text-sm font-medium transition-colors">
            <PenLine className="h-3.5 w-3.5" />
            Edit
          </Link>
        </div>
        <div className="space-y-3 text-sm">
          {/* 个人信息行 */}
          <div className="border-border flex items-center justify-between border-b py-2">
            <span className="text-text-secondary">Personal Info</span>
            <span className="text-text-primary">
              {user.firstName} {user.lastName}
            </span>
          </div>
          {/* 邮箱行 */}
          <div className="border-border flex items-center justify-between border-b py-2">
            <span className="text-text-secondary">Email</span>
            <span className="text-text-primary">{user.email}</span>
          </div>
          {/* 密码行（掩码展示） */}
          <div className="border-border flex items-center justify-between border-b py-2">
            <span className="text-text-secondary">Password</span>
            <span className="text-text-primary">••••••••</span>
          </div>
          {/* 通知偏好行 */}
          <div className="flex items-center justify-between py-2">
            <span className="text-text-secondary">Notifications</span>
            <span className="text-text-primary">Customized</span>
          </div>
        </div>
      </div>
    </>
  );
}
