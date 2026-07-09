/**
 * @file typeing/index.ts
 * @description 全局 TypeScript 类型与接口定义，集中管理跨模块共享的数据结构。
 */

import type { LucideIcon } from "lucide-react";

/** 顶部导航项配置 */
export interface NavItem {
  /** 导航链接地址 */
  href: string;
  /** 导航显示文本 */
  label: string;
  /** 导航图标（lucide-react 组件） */
  icon: LucideIcon;
}

/** 侧边栏项，继承 id + NavItem 字段（不含 href） */
export type SidebarItem = { id: string } & Omit<NavItem, "href">;

/** 文章列表项（卡片/摘要场景） */
export interface Article {
  /** 文章唯一 ID */
  id: string;
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  excerpt: string;
  /** 封面图 URL */
  image: string;
  /** 标签文案 */
  tag: string;
  /** 标签样式类名 */
  tagClass: string;
  /** 阅读时长文案（如 "8 min read"） */
  readTime: string;
  /** 发布日期文案 */
  date: string;
  /** 点赞数 */
  likes: number;
  /** 评论数 */
  comments: number;
}

/** 文章分类 */
export interface Category {
  /** 分类唯一 ID */
  id: string;
  /** 分类名称 */
  name: string;
  /** 分类描述 */
  description: string;
  /** 图标名称（字符串标识，由业务层映射到具体组件） */
  icon: string;
  /** 背景色样式类名 */
  color: string;
  /** 文本色样式类名 */
  textColor: string;
  /** 该分类下文章数量 */
  articleCount: number;
  /** 关注者数（已格式化为 "1.2k" 等字符串） */
  followers: string;
}

/** 仪表盘统计指标 */
export interface Stat {
  /** 指标唯一 ID */
  id: string;
  /** 指标名称 */
  title: string;
  /** 指标当前值（已格式化） */
  value: string;
  /** 变化量文案（如 "+12.5%"） */
  change: string;
  /** 变化趋势：up=上升 / down=下降 */
  trend: string;
  /** 指标图标 */
  icon: LucideIcon;
  /** 图标容器 Tailwind 样式类 */
  iconBg: string;
}

/** 热门文章条目 */
export interface TopPost {
  /** 文章唯一 ID */
  id: string;
  /** 文章标题 */
  title: string;
  /** 发布日期文案 */
  published: string;
  /** 浏览量（已格式化，如 "45.2K"） */
  views: string;
  /** 互动率（百分比字符串） */
  engagement: string;
}

/** 标签项 */
export interface Tag {
  /** 标签 ID */
  id: string;
  /** 标签显示文本 */
  label: string;
  /** 标签样式类名 */
  class: string;
}

/** 文章详情作者信息 */
interface ArticleDetailAuthor {
  /** 作者姓名 */
  name: string;
  /** 作者头像 URL */
  avatar: string;
  /** 作者简介 */
  bio: string;
}

/** 文章详情数据结构 */
export interface ArticleDetailItem {
  /** 文章唯一 ID */
  id: string;
  /** 文章标题 */
  title: string;
  /** 文章正文 HTML 内容 */
  content: string;
  /** 封面图 URL */
  image: string;
  /** 标签文案 */
  tag: string;
  /** 标签样式类名 */
  tagClass: string;
  /** 阅读时长文案 */
  readTime: string;
  /** 发布日期文案 */
  date: string;
  /** 点赞数 */
  likes: number;
  /** 评论数 */
  comments: number;
  /** 浏览量（原始数值） */
  views: number;
  /** 发布状态：published=已发布 / draft=草稿 / archived=已归档 */
  status: "published" | "draft" | "archived";
  /** 可见性：public=公开 / private=私有 */
  visibility: "public" | "private";
  /** 是否精选文章（true=精选） */
  featured: boolean;
  /** 所属分类 ID */
  categoryId: string;
  /** 文章标签列表 */
  tags: string[];
  /** 作者信息 */
  author: ArticleDetailAuthor;
}

/** 用户统计指标 */
export interface UserStats {
  /** 发布文章数 */
  articles: number;
  /** 粉丝数（已格式化字符串） */
  followers: string;
  /** 关注数（原始数值） */
  following: number;
  /** 累计获赞数（已格式化字符串） */
  likes: string;
  /** 累计阅读量（已格式化字符串） */
  views: string;
}

/** 用户社交账号 */
export interface UserSocial {
  /** Twitter 账号 */
  twitter: string;
  /** GitHub 账号 */
  github: string;
  /** LinkedIn 账号 */
  linkedin: string;
}

/** 用户完整信息 */
export interface UserInfo {
  /** 用户唯一 ID */
  id: string;
  /** 用户显示名 */
  name: string;
  /** 用户名（@handle） */
  username: string;
  /** 个人简介 */
  bio: string;
  /** 头像 URL */
  avatar: string;
  /** 封面图 URL */
  coverImage: string;
  /** 所在地区 */
  location: string;
  /** 个人网站 */
  website: string;
  /** 加入时间文案 */
  joined: string;
  /** 职位 */
  role: string;
  /** 公司 */
  company: string;
  /** 是否认证用户（true=已认证） */
  verified: boolean;
  /** 用户统计指标 */
  stats: UserStats;
  /** 社交账号 */
  social: UserSocial;
  /** 兴趣标签列表 */
  tags: string[];
}

/** 用户信息字典，键为用户 ID */
export type UserRecord = Record<string, UserInfo>;

/** 作者主页文章列表项 */
export interface AuthorArticle {
  /** 文章唯一 ID */
  id: string;
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  excerpt: string;
  /** 封面图 URL */
  image: string;
  /** 标签文案 */
  tag: string;
  /** 标签样式类名 */
  tagClass: string;
  /** 阅读时长文案 */
  readTime: string;
  /** 发布日期文案 */
  date: string;
  /** 点赞数 */
  likes: number;
  /** 浏览量（已格式化字符串） */
  views: string;
}

/** 关于页统计指标 */
export interface AboutStat {
  /** 指标值（已格式化） */
  value: string;
  /** 指标说明 */
  label: string;
}

/** 关于页价值观条目 */
export interface AboutValue {
  /** 价值观图标 */
  icon: LucideIcon;
  /** 价值观标题 */
  title: string;
  /** 价值观描述 */
  description: string;
}

/** 关于页团队成员 */
export interface AboutTeamMember {
  /** 成员姓名 */
  name: string;
  /** 职位 */
  role: string;
  /** 个人简介 */
  bio: string;
  /** 头像 URL */
  avatar: string;
}

/** 设置页 Tab 配置 */
export interface SettingsTab {
  /** Tab 唯一 ID */
  id: string;
  /** Tab 显示文本 */
  label: string;
  /** Tab 图标 */
  icon: LucideIcon;
}

/** 分类详情页文章列表项 */
export interface CategoryDetailArticle {
  /** 文章唯一 ID */
  id: string;
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  excerpt: string;
  /** 封面图 URL */
  image: string;
  /** 标签文案 */
  tag: string;
  /** 标签样式类名 */
  tagClass: string;
  /** 阅读时长文案 */
  readTime: string;
  /** 发布日期文案 */
  date: string;
  /** 点赞数 */
  likes: number;
  /** 评论数 */
  comments: number;
  /** 文章作者简略信息 */
  author: {
    /** 作者姓名 */
    name: string;
    /** 作者头像 URL */
    avatar: string;
  };
  /** 是否精选文章（true=精选） */
  featured: boolean;
}

/** 分类详情页头部作者 */
export interface CategoryDetailTopAuthor {
  /** 作者姓名 */
  name: string;
  /** 作者头像 URL */
  avatar: string;
  /** 作者职位 */
  role: string;
  /** 发布文章数 */
  articles: number;
  /** 粉丝数（已格式化字符串） */
  followers: string;
  /** 是否认证（true=已认证） */
  verified: boolean;
}

/** 学习路径条目 */
export interface LearningPath {
  /** 路径标题 */
  title: string;
  /** 路径描述 */
  description: string;
  /** 步骤数 */
  steps: number;
  /** 预计学习时长文案 */
  duration: string;
  /** 难度等级文案 */
  level: string;
}

/** 趋势标签 */
export interface TrendingTag {
  /** 标签名称 */
  name: string;
  /** 文章数量文案 */
  count: string;
  /** 增长趋势文案 */
  trend: string;
}

/** 首页精选作者 */
export interface FeaturedAuthor {
  /** 作者姓名 */
  name: string;
  /** 作者头像 URL */
  avatar: string;
  /** 作者职位 */
  role: string;
  /** 发布文章数 */
  articles: number;
  /** 粉丝数（已格式化字符串） */
  followers: string;
  /** 作者路由 slug */
  slug: string;
}
