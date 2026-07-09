/**
 * @file styles/commonStyle.ts
 * @description 通用 Tailwind class 集合，集中管理可复用的视觉样式（链接、按钮、卡片、标签等）。
 * 所有样式均使用 Tailwind CSS 类名，配合 design token 实现主题切换。
 */

const Style = {
  /** 通用链接样式：主题色文本 + hover 下划线 */
  link: "text-link-text hover:text-link-hover-text hover:underline-link-hover-underline transition-all",
  /** 主按钮样式：主题色实心背景 + hover 状态过渡 */
  btn: "bg-btn-primary-bg text-btn-primary-text hover:bg-btn-primary-hover-bg hover:text-btn-primary-hover-text hover:border-btn-primary-hover-border transition-all",
  /** 主按钮激活态样式：用于当前选中或按下状态 */
  btnActive:
    "bg-btn-primary-active-bg text-btn-primary-active-text border-btn-primary-active-border hover:bg-btn-primary-active-hover-bg hover:text-btn-primary-active-hover-text hover:border-btn-primary-active-hover-border transition-all",
  /** 通用卡片样式：背景 + 边框 + hover 高亮 */
  card: "bg-card-bg border text-card-text border-card-border hover:bg-card-hover-bg hover:text-card-hover-text hover:border-card-hover-border transition-all",
  /** 主文本色 */
  text: "text-text-primary",
  /** 次级文本色 */
  textSecondary: "text-text-secondary",
  /** 通用边框色 */
  border: "border-border",
  /** 通用边框 hover 色 */
  borderHover: "border-border-hover",
  /** 全局背景色 */
  background: "bg-bg",
  /** 蓝色标签样式 */
  tagBlue: "bg-tag-blue-bg text-tag-blue-text",
  /** 粉色标签样式 */
  tagPink: "bg-tag-pink-bg text-tag-pink-text",
  /** 翠绿色标签样式 */
  tagEmerald: "bg-tag-emerald-bg text-tag-emerald-text",
  /** 靛蓝色标签样式 */
  tagIndigo: "bg-tag-indigo-bg text-tag-indigo-text",
  /** 紫罗兰色标签样式 */
  tagViolet: "bg-tag-violet-bg text-tag-violet-text",
  /** 青色标签样式 */
  tagCyan: "bg-tag-cyan-bg text-tag-cyan-text",
  /** 导航项默认样式 */
  navItem: "bg-nav-bg text-nav-text hover:bg-nav-hover-bg hover:text-nav-hover-text hover:border-nav-hover-border transition-all",
  /** 导航项激活态样式 */
  navItemActive: "bg-nav-active-bg text-nav-active-text hover:bg-nav-active-hover-bg hover:text-nav-active-hover-text hover:border-nav-active-hover-border transition-all",
  /** 成功状态样式（绿色调） */
  success: "bg-success-bg text-success",
  /** 警告状态样式（橙色调） */
  warning: "bg-warning-bg text-warning",
  /** 错误状态样式（红色调） */
  error: "bg-error-bg text-error",
  /** 信息状态样式（蓝色调） */
  info: "bg-info-bg text-info",
};

export default Style;
