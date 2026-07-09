/**
 * @file page.tsx
 * @description 通知中心页面：按 Tab（全部/未读/@提及）与过滤器筛选通知，并提供全部已读、删除单条等操作
 */
"use client";

import { useState } from "react";
import NotificationsHeader from "@/components/business/notifications/NotificationsHeader";
import NotificationsList from "@/components/business/notifications/NotificationsList";
import NotificationsTabs from "@/components/business/notifications/NotificationsTabs";
import { NOTIFICATIONS } from "@/components/business/notifications/notificationsData";

/**
 * 通知中心页面
 * @returns 通知中心视图（头部、Tab/筛选器、通知列表）
 */
export default function NotificationsPage() {
  /** 当前激活的 Tab，"all" | "unread" | "mentions" */
  const [activeTab, setActiveTab] = useState("all");
  /** 当前激活的类型过滤器，"all" 表示不过滤 */
  const [activeFilter, setActiveFilter] = useState("all");
  /** 通知列表状态 */
  const [notificationList, setNotificationList] = useState(NOTIFICATIONS);

  /**
   * 将全部通知标记为已读
   */
  const markAllAsRead = () => {
    setNotificationList(notificationList.map((n) => ({ ...n, read: true })));
  };

  /**
   * 按 id 删除指定通知
   * @param id 待删除通知的唯一标识
   */
  const handleDelete = (id: number) => {
    setNotificationList(notificationList.filter((n) => n.id !== id));
  };

  // 根据当前 Tab 与过滤器联合筛选通知
  const filteredNotifications = notificationList.filter((n) => {
    // "unread" Tab：排除已读通知
    if (activeTab === "unread" && n.read) return false;
    // "mentions" Tab：仅保留 @提及类型
    if (activeTab === "mentions" && n.type !== "mention") return false;
    // 类型过滤：仅保留匹配的通知
    if (activeFilter !== "all" && n.type !== activeFilter) return false;
    return true;
  });

  return (
    // 页面根容器
    <div className="bg-background min-h-screen">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 通知页头部：标题与全部已读按钮 */}
        <NotificationsHeader onMarkAllRead={markAllAsRead} />
        {/* Tab 切换 + 类型筛选 */}
        <NotificationsTabs activeTab={activeTab} onTabChange={setActiveTab} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        {/* 过滤后的通知列表 */}
        <NotificationsList notifications={filteredNotifications} onDelete={handleDelete} />
        {/* 有结果时显示到底提示 */}
        {filteredNotifications.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-text-secondary text-sm">You&apos;ve seen all notifications.</p>
          </div>
        )}
      </main>
    </div>
  );
}
