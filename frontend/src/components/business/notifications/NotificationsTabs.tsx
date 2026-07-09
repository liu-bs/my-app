/**
 * @file NotificationsTabs.tsx
 * @description 通知页标签与类型筛选组件，提供通知分组切换与按类型下拉过滤
 */

"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { NOTIFICATION_TABS } from "./notificationsData";

/** 类型筛选下拉项：id 与展示文案 */
const FILTER_OPTIONS = [
  /** 全部类型筛选 */
  { id: "all", label: "All Types" },
  /** 点赞类型筛选 */
  { id: "like", label: "Likes" },
  /** 评论类型筛选 */
  { id: "comment", label: "Comments" },
  /** 关注类型筛选 */
  { id: "follow", label: "Follows" },
  /** @提及类型筛选 */
  { id: "mention", label: "Mentions" },
  /** 文章精选类型筛选 */
  { id: "article", label: "Articles" },
];

/** 默认的类型筛选 id */
const DEFAULT_FILTER = "all";

/**
 * 通知页标签筛选组件 Props
 */
interface NotificationsTabsProps {
  /** 当前激活的标签 id */
  activeTab: string;
  /** 标签切换回调，参数为新的标签 id */
  onTabChange: (tab: string) => void;
  /** 当前激活的类型筛选 id，默认 "all"，可选 */
  activeFilter?: string;
  /** 类型筛选变更回调，参数为新的筛选 id，可选 */
  onFilterChange?: (filter: string) => void;
}

/**
 * 通知页标签与类型筛选组件
 * @param props 组件属性
 * @param props.activeTab 当前激活的标签 id
 * @param props.onTabChange 标签切换回调，参数为新的标签 id
 * @param [props.activeFilter] 当前激活的类型筛选 id，默认 "all"
 * @param [props.onFilterChange] 类型筛选变更回调，参数为新的筛选 id
 * @returns 渲染标签栏与类型筛选下拉
 */
const NotificationsTabs: React.FC<NotificationsTabsProps> = ({ activeTab, onTabChange, activeFilter = DEFAULT_FILTER, onFilterChange }) => {
  // 控制筛选下拉浮层的显隐状态
  const [showFilter, setShowFilter] = useState(false);

  return (
    // 标签栏容器：左侧标签列表，右侧类型筛选下拉
    <div className="mb-6 flex items-center justify-between">
      {/* 通知分组标签栏 */}
      <div className="flex items-center gap-2">
        {/* 遍历渲染通知分组标签 */}
        {NOTIFICATION_TABS.map((tab) => (
          // 点击切换激活标签
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "bg-accent text-white" : "text-text-secondary hover:bg-surface-secondary"
            }`}
          >
            {/* 标签文案 */}
            {tab.label}
            {/* 标签对应的未读/总数徽章 */}
            <span className={`rounded-full px-2 py-0.5 text-xs ${activeTab === tab.id ? "bg-white/20" : "bg-surface-secondary"}`}>{tab.count}</span>
          </button>
        ))}
      </div>
      {/* 类型筛选下拉容器：相对定位便于浮层对齐 */}
      <div className="relative">
        {/* 点击切换下拉浮层的显隐 */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${activeFilter !== DEFAULT_FILTER ? "bg-accent/10 text-accent" : "text-text-secondary hover:text-text-primary"}`}
        >
          {/* 筛选图标 */}
          <Filter className="h-4 w-4" />
          Filter
          {activeFilter !== DEFAULT_FILTER && (
            // 条件渲染：已选择非"全部"类型时，额外展示清除按钮
            <button
              onClick={(e) => {
                // 阻止冒泡避免触发表格按钮的 onClick
                e.stopPropagation();
                // 重置类型筛选为"全部"
                onFilterChange?.(DEFAULT_FILTER);
              }}
              className="ml-1"
            >
              {/* 清除图标 */}
              <X className="h-3 w-3" />
            </button>
          )}
        </button>
        {showFilter && (
          // 条件渲染：下拉浮层
          <div className="border-border bg-surface absolute top-full right-0 z-10 mt-1 rounded-lg border p-1 shadow-lg">
            {/* 遍历渲染类型筛选选项 */}
            {FILTER_OPTIONS.map((opt) => (
              // 选中后立即应用并收起下拉
              <button
                key={opt.id}
                onClick={() => {
                  // 应用类型筛选并关闭下拉
                  onFilterChange?.(opt.id);
                  setShowFilter(false);
                }}
                className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                  activeFilter === opt.id ? "bg-accent/10 text-accent" : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                }`}
              >
                {/* 筛选选项文案 */}
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsTabs;
