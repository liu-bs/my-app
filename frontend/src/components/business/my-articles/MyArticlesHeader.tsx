/**
 * @file MyArticlesHeader.tsx
 * @description 我的文章页头部组件，展示文章统计信息并提供新建文章入口
 */

"use client";

import { FC } from "react";
import Link from "next/link";
import { PenLine } from "lucide-react";

/**
 * 我的文章页头部组件 Props
 */
interface MyArticlesHeaderProps {
  /** 文章总数（含已发布、草稿、已归档） */
  totalCount: number;
  /** 已发布文章数 */
  publishedCount: number;
  /** 草稿文章数 */
  draftCount: number;
}

/**
 * 我的文章页头部组件
 * @param props 组件属性
 * @param props.totalCount 文章总数（含已发布、草稿、已归档）
 * @param props.publishedCount 已发布文章数
 * @param props.draftCount 草稿文章数
 * @returns 渲染页面标题、文章统计与"新建文章"按钮
 */
const MyArticlesHeader: FC<MyArticlesHeaderProps> = ({ totalCount, publishedCount, draftCount }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> {/* 头部容器：左侧标题与统计，右侧新建文章按钮 */}
      {/* 标题与文章统计区 */}
      <div>
        {/* 页面主标题 */}
        <h1 className="text-text-primary mb-1 text-2xl font-bold">My Articles</h1>
        {/* 文章统计文案：总数、已发布、草稿数 */}
        <p className="text-text-secondary text-sm">
          {totalCount} total · {publishedCount} published · {draftCount} drafts
        </p>
      </div>
      {/* 点击跳转至写作页面，触发新建文章流程 */}
      <Link href="/write" className="bg-accent hover:bg-accent-hover inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors">
        {/* 写作图标 */}
        <PenLine className="h-4 w-4" />
        New Article
      </Link>
    </div>
  );
};

export default MyArticlesHeader;
