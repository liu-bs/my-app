/**
 * @file NotificationsHeader.tsx
 * @description 通知页头部组件，展示标题、副标题、标记全部已读按钮与设置入口
 */

"use client";

import Link from "next/link";
import { Check, Settings } from "lucide-react";

/**
 * 通知页头部组件 Props
 */
interface NotificationsHeaderProps {
  /** 标记全部已读按钮的点击回调 */
  onMarkAllRead: () => void;
}

/**
 * 通知页头部组件
 * @param props 组件属性
 * @param props.onMarkAllRead 标记全部已读按钮的点击回调
 * @returns 渲染通知页标题、标记全部已读与设置入口按钮
 */
const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({ onMarkAllRead }) => {
  return (
    // 头部容器：左侧标题与副标题，右侧操作按钮组
    <div className="mb-8 flex items-center justify-between">
      {/* 标题与副标题区 */}
      <div>
        {/* 页面主标题 */}
        <h1 className="text-text-primary text-2xl font-bold">Notifications</h1>
        {/* 页面副标题 */}
        <p className="text-text-secondary mt-1">Stay updated with your activity</p>
      </div>
      {/* 操作按钮组：标记全部已读、设置入口 */}
      <div className="flex items-center gap-3">
        {/* 点击触发"标记全部已读"回调，将所有通知状态置为已读 */}
        <button
          onClick={onMarkAllRead}
          className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          {/* 对勾图标 */}
          <Check className="h-4 w-4" />
          Mark all read
        </button>
        {/* 点击跳转至通知设置页面 */}
        <Link
          href="/settings"
          className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          {/* 齿轮图标 */}
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </div>
  );
};

export default NotificationsHeader;
