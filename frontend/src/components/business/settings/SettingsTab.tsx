/**
 * @file SettingsTab.tsx
 * @description 设置页左侧导航 Tab 组件，渲染设置分类切换菜单
 */

"use client";

import { FC } from "react";
import { SETTINGS_TABS } from "@/constans";

/** 设置 Tab 组件 Props */
interface SettingsTabProps {
  /** 当前激活的 Tab ID */
  activeTab: string;
  /** 切换 Tab 的回调，参数为新 Tab 的 ID */
  setActiveTab: (tab: string) => void;
  /** 是否显示密码明文；true 显示明文，false 隐藏 */
  showPassword: boolean;
  /** 切换密码显隐状态的回调，参数为新的显示状态 */
  setShowPassword: (show: boolean) => void;
}

/**
 * 设置页左侧导航 Tab 组件
 * 渲染设置分类按钮列表，点击按钮切换当前激活 Tab
 *
 * @param props 组件入参
 * @param props.activeTab 当前激活的 Tab ID
 * @param props.setActiveTab 切换 Tab 的回调
 * @param props.showPassword 是否显示密码明文
 * @param props.setShowPassword 切换密码显隐状态的回调
 */
const SettingsTab: FC<SettingsTabProps> = ({ activeTab, setActiveTab, showPassword, setShowPassword }) => {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4"> {/* 整体栅格容器，大屏下左侧 Tab 右侧内容 */}
      {/* 左侧 Tab 区域，占 1/4 列宽 */}
      <div className="lg:col-span-1">
        {/* 导航容器，按钮垂直排列 */}
        <nav className="space-y-1">
          {/* 遍历渲染设置分类 Tab 按钮 */}
          {SETTINGS_TABS.map((tab) => {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "bg-accent/10 text-accent" : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                }`}
              >
                {/* Tab 分类图标 */}
                <tab.icon className="h-4 w-4" />
                {/* Tab 分类文案 */}
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default SettingsTab;
