/**
 * @file notificationsData.tsx
 * @description 通知页静态数据与按类型获取图标的工具函数
 */

import { Bell, FileText, Heart, MessageSquare, Star, UserPlus } from "lucide-react";

/**
 * 通知页标签配置
 */
export const NOTIFICATION_TABS = [
  /** 全部通知标签 */
  { id: "all", label: "All", count: 12 },
  /** 未读通知标签 */
  { id: "unread", label: "Unread", count: 3 },
  /** @我的 通知标签 */
  { id: "mentions", label: "Mentions", count: 1 },
];

/**
 * 通知静态模拟数据
 */
export const NOTIFICATIONS = [
  {
    /** 通知唯一 ID */
    id: 1,
    /** 通知类型 */
    type: "like",
    /** 通知标题 */
    title: "Sarah Miller liked your article",
    /** 通知详情 */
    message: '"Mastering React Server Components in 2024"',
    /** 时间文案 */
    time: "2 minutes ago",
    /** 是否已读 */
    read: false,
    /** 跳转链接 */
    link: "/article/1",
    /** 触发用户信息 */
    user: {
      /** 用户名 */
      name: "Sarah Miller",
      /** 用户头像地址 */
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
  },
  {
    id: 2,
    type: "comment",
    title: "New comment on your article",
    message: "David Park: Great article! This really helped me understand Server Components better.",
    time: "1 hour ago",
    read: false,
    link: "/article/1",
    user: {
      name: "David Park",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
  },
  {
    id: 3,
    type: "follow",
    title: "Emily Watson started following you",
    message: "You have a new follower",
    time: "3 hours ago",
    read: false,
    link: "/author/emily-watson",
    user: {
      name: "Emily Watson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
  },
  {
    id: 4,
    type: "article",
    title: "Your article was featured",
    message: '"Building Resilient APIs with GraphQL" is now trending in Architecture',
    time: "5 hours ago",
    read: true,
    link: "/article/2",
    /** 文章精选类型通知使用 Star 图标 */
    icon: Star,
  },
  {
    id: 5,
    type: "like",
    title: "Michael Brown and 12 others liked your comment",
    message: "On 'CSS Grid vs Flexbox: When to Use Which'",
    time: "1 day ago",
    read: true,
    link: "/article/3",
    user: {
      name: "Michael Brown",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
  },
  {
    id: 6,
    type: "mention",
    title: "Lisa Zhang mentioned you in a comment",
    message: "@alexchen What do you think about using Server Components with...",
    time: "2 days ago",
    read: true,
    link: "/article/1",
    user: {
      name: "Lisa Zhang",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    },
  },
];

/**
 * 根据通知类型返回对应的图标节点
 * @param type 通知类型：like / comment / follow / article / mention / 其它
 * @returns 对应类型的 React 图标元素
 */
export const getNotificationIcon = (type: string) => {
  switch (type) {
    case "like":
      // 点赞通知：心形图标
      return <Heart className="text-error h-5 w-5" />;
    case "comment":
      // 评论通知：对话气泡图标
      return <MessageSquare className="text-accent h-5 w-5" />;
    case "follow":
      // 关注通知：用户加号图标
      return <UserPlus className="text-success h-5 w-5" />;
    case "article":
      // 文章精选通知：文档图标
      return <FileText className="text-warning h-5 w-5" />;
    case "mention":
      // @提及通知：铃铛图标
      return <Bell className="text-accent h-5 w-5" />;
    default:
      // 未知类型：默认铃铛图标
      return <Bell className="text-text-secondary h-5 w-5" />;
  }
};
