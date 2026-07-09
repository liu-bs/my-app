/**
 * @file page.tsx
 * @description 设置页面：左侧为设置 Tab，右侧为对应 Tab 的内容，支持密码显示切换
 */
"use client";

import { useState } from "react";
import SettingsHeader from "@/components/business/settings/SettingsHeader";
import SettingsTab from "@/components/business/settings/SettingsTab";
import SettingsTabContent from "@/components/business/settings/SettingsTabContent";

/**
 * 设置页面
 * @returns 设置视图（头部 + 左侧 Tab + 右侧内容）
 */
export default function SettingsPage() {
  /** 当前激活的设置 Tab，默认 "profile" */
  const [activeTab, setActiveTab] = useState("profile");
  /** 是否显示明文密码，false 为隐藏 */
  const [showPassword, setShowPassword] = useState(false);

  return (
    // 设置页根容器
    <div className="bg-background min-h-screen">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 设置页头部 */}
        <SettingsHeader />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* 左侧 Tab 列表 */}
          <div className="lg:col-span-1">
            <SettingsTab activeTab={activeTab} setActiveTab={setActiveTab} showPassword={showPassword} setShowPassword={setShowPassword} />
          </div>

          {/* 右侧 Tab 内容区域 */}
          <div className="space-y-6 lg:col-span-3">
            <SettingsTabContent activeTab={activeTab} showPassword={showPassword} setShowPassword={setShowPassword} />
          </div>
        </div>
      </main>
    </div>
  );
}
