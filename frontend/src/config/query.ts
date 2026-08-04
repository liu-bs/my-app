/**
 * @file query.ts
 * @description React Query 共享 staleTime 常量，避免 magic number 散落
 */
export const STALE_TIME = {
  /** 1 分钟 — 文章列表等频繁变化的数据 */
  short: 60 * 1000,
  /** 5 分钟 — 分类、标签、用户信息等较少变化的数据 */
  medium: 5 * 60 * 1000,
  /** 10 分钟 — 站点配置等极少变化的数据 */
  long: 10 * 60 * 1000,
} as const;
