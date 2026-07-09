/**
 * @file NotificationsList.tsx
 * @description 通知列表组件，渲染通知条目并支持点击跳转与删除操作
 */

"use client";

import { useRouter } from "next/navigation";
import { Bell, Trash2 } from "lucide-react";

/**
 * 通知条目数据结构
 */
interface NotificationItem {
  /** 通知唯一 ID */
  id: number;
  /** 通知类型：like / comment / follow / mention / article */
  type: string;
  /** 通知主标题 */
  title: string;
  /** 通知详情文案 */
  message: string;
  /** 通知时间文案，如 "2 minutes ago" */
  time: string;
  /** 是否已读，true 已读 / false 未读 */
  read: boolean;
  /** 点击通知后跳转的链接，可选 */
  link?: string;
  /** 触发通知的用户信息（可选，用于展示头像） */
  user?: {
    /** 用户展示名 */
    name: string;
    /** 用户头像地址 */
    avatar: string;
  };
  /** 自定义图标组件，当无 user 时显示 */
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * 通知列表组件 Props
 */
interface NotificationsListProps {
  /** 待展示的通知列表 */
  notifications: NotificationItem[];
  /** 删除某条通知的回调，参数为通知 id，可选 */
  onDelete?: (id: number) => void;
}

/**
 * 通知列表组件
 * @param props 组件属性
 * @param props.notifications 待展示的通知列表
 * @param [props.onDelete] 删除某条通知的回调，参数为通知 id
 * @returns 渲染通知列表或空态提示
 */
const NotificationsList: React.FC<NotificationsListProps> = ({ notifications, onDelete }) => {
  const router = useRouter();

  // 空列表：渲染空态提示
  if (notifications.length === 0) {
    return (
      // 空态容器：居中展示引导插画与文案
      <div className="py-16 text-center">
        {/* 圆形图标背景容器 */}
        <div className="bg-surface-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          {/* 铃铛图标 */}
          <Bell className="text-text-secondary h-8 w-8" />
        </div>
        {/* 空态主提示 */}
        <h3 className="text-text-primary mb-1 text-lg font-medium">No notifications</h3>
        {/* 空态辅助说明 */}
        <p className="text-text-secondary">You&apos;re all caught up! Check back later for updates.</p>
      </div>
    );
  }

  return (
    // 通知列表容器：垂直排列通知条目
    <div className="space-y-2">
      {/* 遍历渲染通知列表 */}
      {notifications.map((notification) => (
        // 通知条目：未读用强调色，已读用中性色
        <div
          key={notification.id}
          onClick={() => notification.link && router.push(notification.link)}
          // 未读通知使用强调色背景与边框，已读通知使用中性样式
          className={`group flex items-start gap-4 rounded-xl border p-4 transition-all ${notification.link ? "cursor-pointer hover:shadow-md" : ""} ${
            notification.read ? "border-border bg-surface" : "border-accent/30 bg-accent/10"
          }`}
        >
          {/* 左侧图标或头像区 */}
          <div className="shrink-0">
            {notification.user ? (
              // 条件渲染：有关联用户时展示用户头像
              <img src={notification.user.avatar} alt={notification.user.name} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              // 条件渲染：无关联用户时按类型展示图标
              <div className="bg-surface-secondary flex h-10 w-10 items-center justify-center rounded-full">
                {notification.icon && <notification.icon className="text-warning h-5 w-5" />}
              </div>
            )}
          </div>

          {/* 中部内容区：标题、详情、时间 */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                {/* 通知主标题 */}
                <p className="text-text-primary font-medium">{notification.title}</p>
                {/* 通知详情文案 */}
                <p className="text-text-secondary mt-0.5 text-sm">{notification.message}</p>
                {/* 通知时间文案 */}
                <p className="text-text-secondary mt-2 text-xs">{notification.time}</p>
              </div>
              {/* 条件渲染：未读时右侧展示蓝点提示 */}
              {!notification.read && <span className="bg-accent mt-2 h-2 w-2 shrink-0 rounded-full" />}
            </div>
          </div>

          {/* 右侧操作区：悬浮时展示的删除按钮 */}
          <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            {/* 点击触发删除回调，阻止冒泡避免触发行级跳转 */}
            <button
              onClick={(e) => {
                // 阻止冒泡，避免触发行级跳转
                e.stopPropagation();
                // 调用删除回调
                onDelete?.(notification.id);
              }}
              className="text-text-secondary hover:text-error hover:bg-error/10 rounded-lg p-2 transition-colors"
            >
              {/* 垃圾桶图标 */}
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsList;
