/**
 * @file format.ts
 * @description 通用格式化工具：头像首字母提取、数字格式化、日期格式化、相对时间计算
 *              （原 utils.ts 拆分而来，供全站组件使用）
 */

/**
 * 首字母头像 — 从 firstName/lastName 提取 initials
 * @param firstName 名
 * @param lastName 姓
 * @returns 大写的姓名首字母组合，无输入时返回 "U"
 */
export function getInitials(firstName: string, lastName: string): string {
  return ((firstName || '').charAt(0) + (lastName || '').charAt(0)).toUpperCase() || 'U';
}

/**
 * 数字格式化 — 千分位逗号分隔，显示完整数字
 * @param n 输入数字
 * @returns 千分位格式化的字符串，如 "1,234,567"
 */
export function formatCount(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 中文日期格式化
 * @param dateStr 日期字符串（可被 Date 解析）
 * @returns 中文日期字符串，如 "2024年4月5日"
 */
export function formatDateCN(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 相对时间格式化
 * @param dateStr 日期字符串（可被 Date 解析）
 * @returns 相对时间字符串："刚刚"、"x 小时前"、"x 天前"、"x 周前"，超过30天返回中文日期
 */
export function formatRelativeTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return '刚刚';
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} 天前`;
  if (days < 30) return `${Math.floor(days / 7)} 周前`;
  return formatDateCN(dateStr);
}
