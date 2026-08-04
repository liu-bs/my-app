/**
 * @file toc.ts
 * @description 文章目录（Table of Contents）数据结构，用于文章正文右侧的目录导航
 */

/**
 * 目录项
 */
export interface TocItem {
  /** 标题锚点 ID */
  id: string;
  /** 标题文本 */
  text: string;
  /** 是否为子标题（h3 及以下） */
  sub: boolean;
}
