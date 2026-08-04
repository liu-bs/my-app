/**
 * @file ui.ts
 * @description UI 组件 Props 类型，定义前后端共享的各类组件声明类型，涵盖基础组件、页面级组件、按钮/输入框、请求层及 Hooks Mutation 参数
 */

import type {
  ReactNode,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  InputHTMLAttributes,
} from 'react';
import type { Post } from './blog';
import type { User } from './user';

/* ---------- 共用基础类型 ---------- */

/**
 * 子节点 Props（通用容器组件基础类型）
 */
export interface ChildrenProps {
  /** 子节点内容 */
  children: ReactNode;
  /** 自定义样式类名 */
  className?: string;
}

/* ---------- Alert ---------- */

/** 提示组件样式变体 */
export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

/**
 * Alert 提示组件 Props
 */
export interface AlertProps {
  /** 样式变体 */
  variant: AlertVariant;
  /** 自定义图标 */
  icon?: ReactNode;
  /** 子节点内容 */
  children: ReactNode;
  /** 是否可见 */
  visible?: boolean;
  /** 自定义样式类名 */
  className?: string;
}

/* ---------- ArticleCard ---------- */

/**
 * 文章卡片组件 Props
 */
export interface ArticleCardProps {
  /** 文章数据 */
  post: Post;
  /** 卡片整体是否为链接（默认 false） */
  href?: string;
  /** 交错动画索引 */
  index?: number;
  /** 分类上方额外标签（如置顶、草稿） */
  badge?: ReactNode;
  /** 标题下方标签列表 */
  tags?: string[];
  /** 底部操作按钮 */
  actions?: ReactNode;
  /** 额外统计项（如评论数） */
  extraStats?: { icon: ReactNode; value: number }[];
  /** 封面容器宽度 */
  coverWidth?: string;
  /** 自定义样式类名 */
  className?: string;
  /** 卡片布局变体：horizontal（水平，默认）或 vertical（垂直，用于网格） */
  variant?: 'horizontal' | 'vertical';
}

/* ---------- Avatar ---------- */

/** 头像尺寸 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * 头像组件 Props
 */
export interface AvatarProps {
  /** 头像首字母（无图片时显示） */
  initials: string;
  /** 头像尺寸 */
  size?: AvatarSize;
  /** 头像图片地址 */
  src?: string;
  /** 头像图片 alt 文本（有 src 时使用，默认为装饰性空 alt） */
  alt?: string;
  /** 自定义样式类名 */
  className?: string;
}

/* ---------- Container ---------- */

/** 容器组件 Props（复用 ChildrenProps） */
export type ContainerProps = ChildrenProps;

/* ---------- CoverFallback ---------- */

/**
 * 封面占位组件 Props
 */
export interface CoverFallbackProps {
  /** 自定义样式类名 */
  className?: string;
}

/* ---------- EmptyState ---------- */

/**
 * 空状态组件 Props
 */
export interface EmptyStateProps {
  /** 图标 */
  icon: ReactNode;
  /** 标题 */
  title: string;
  /** 描述文本 */
  description?: string;
  /** 操作按钮 */
  action?: ReactNode;
  /** 自定义样式类名 */
  className?: string;
}

/* ---------- FormField ---------- */

/**
 * 表单字段组件 Props
 */
export interface FormFieldProps {
  /** 标签文本 */
  label: string;
  /** 提示文本 */
  hint?: string;
  /** 错误信息 */
  error?: string;
  /** 是否必填 */
  required?: boolean;
  /** 自定义样式类名 */
  className?: string;
  /** 子节点内容（表单控件） */
  children: ReactNode;
}

/* ---------- Modal ---------- */

/**
 * 弹窗组件 Props
 */
export interface ModalProps {
  /** 是否打开 */
  open: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 标题 */
  title?: string;
  /** 子节点内容 */
  children: ReactNode;
  /** 最大宽度 */
  maxWidth?: string;
}

/* ---------- PageHeader ---------- */

/**
 * 页面头部组件 Props
 */
export interface PageHeaderProps {
  /** 标题 */
  title: ReactNode;
  /** 副标题 */
  subtitle?: ReactNode;
  /** 操作区域 */
  actions?: ReactNode;
  /** 自定义样式类名 */
  className?: string;
}

/* ---------- PasswordStrength ---------- */

/**
 * 密码强度组件 Props
 */
export interface PasswordStrengthProps {
  /** 密码字符串 */
  password: string;
}

/* ---------- Spinner ---------- */

/**
 * 加载指示器组件 Props
 */
export interface SpinnerProps {
  /** 尺寸 */
  size?: 'sm' | 'md';
  /** 自定义样式类名 */
  className?: string;
}

/* ---------- StatsGrid ---------- */

/**
 * 统计项
 */
export interface StatItem {
  /** 标签 */
  label: ReactNode;
  /** 值 */
  value: ReactNode;
}

/**
 * 统计网格组件 Props
 */
export interface StatsGridProps {
  /** 统计项列表 */
  items: StatItem[];
  /** 自定义样式类名 */
  className?: string;
}

/* ---------- Tag ---------- */

/** 标签样式变体 */
export type TagVariant = 'ink' | 'ember' | 'crimson' | 'slate';

/**
 * 标签组件 Props
 */
export interface TagProps {
  /** 子节点内容 */
  children: ReactNode;
  /** 样式变体 */
  variant?: TagVariant;
  /** 尺寸 */
  size?: 'sm' | 'md';
  /** 自定义样式类名 */
  className?: string;
}

/* ---------- 页面级组件 Props ---------- */

/**
 * 按 postId 操作的按钮组件共用 props
 */
export interface PostIdProps {
  /** 文章ID */
  postId: string;
}

/**
 * 文章搜索输入框组件 Props
 */
export interface PostsSearchInputProps {
  /** 初始搜索值 */
  initialValue: string;
}

/**
 * 文章侧边栏组件 Props
 */
export interface PostSidebarProps {
  /** 分类列表 */
  categories: string[];
  /** 标签列表（含文章数量） */
  tags: { name: string; count: number }[];
  /** 当前选中分类 */
  currentCategory: string;
  /** 当前选中标签 */
  currentTag: string | null;
  /** 子节点内容 */
  children: ReactNode;
  /** 当前列表是否零结果（用于无结果时清除搜索词，可选） */
  zeroResults?: boolean;
}

/**
 * 文章操作区组件 Props
 */
export interface PostActionsProps {
  /** 文章数据 */
  post: Post;
  /** 当前登录用户 */
  user: User | null;
}

/**
 * 评论区组件 Props
 */
export interface CommentsSectionProps {
  /** 文章ID */
  postId: string;
  /** 当前登录用户 */
  user: User | null;
  /** 文章作者ID，用于判断是否有权删除他人评论 */
  postAuthorId?: string;
}

/**
 * 文章目录组件 Props
 */
export interface PostTocProps {
  /** 文章ID */
  articleId: string;
}

/* ---------- Button ---------- */

/** 按钮样式变体 */
export type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'danger';
/** 按钮尺寸 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * 按钮基础 Props
 */
export interface ButtonBaseProps {
  /** 样式变体 */
  variant?: ButtonVariant;
  /** 尺寸 */
  size?: ButtonSize;
  /** 是否加载中 */
  loading?: boolean;
}

/** 按钮作为 button 元素时的 Props */
export type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

/** 按钮作为链接元素时的 Props */
export type ButtonAsLink = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** 按钮组件 Props（button 或链接联合类型） */
export type ButtonProps = ButtonAsButton | ButtonAsLink;

/* ---------- Input ---------- */

/**
 * 输入框组件 Props（扩展原生 input 属性）
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 左侧图标 */
  leftIcon?: ReactNode;
  /** 右侧元素 */
  rightElement?: ReactNode;
  /** 是否错误状态 */
  error?: boolean;
  /** 是否成功状态 */
  success?: boolean;
}

/* ---------- 请求层 ---------- */

/**
 * API 校验错误详情项
 */
export interface ValidationErrorDetail {
  /** 字段路径 */
  path: string;
  /** 错误信息 */
  message: string;
}

/**
 * 请求选项（扩展 fetch RequestInit）
 */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  /** 请求体（自动 JSON 序列化） */
  body?: unknown;
  /** Query 参数（自动拼接到 URL，跳过 null/undefined/空串） */
  query?: Record<string, string | number | boolean | null | undefined>;
  /** 跳过 401 自动重定向（用于 /auth/me 等探测接口） */
  skipAuthRedirect?: boolean;
}

/* ---------- Hooks Mutation 参数 ---------- */

/**
 * useUpdatePost 的 mutation 参数
 */
export interface UpdatePostMutationVars {
  /** 文章ID */
  id: string;
  /** 更新文章请求体 */
  dto: import('./blog').UpdatePostDto;
}

/**
 * useUpdateComment 的 mutation 参数
 */
export interface UpdateCommentMutationVars {
  /** 评论ID */
  commentId: string;
  /** 更新评论请求体 */
  dto: import('./comment').CreateCommentDto;
}
