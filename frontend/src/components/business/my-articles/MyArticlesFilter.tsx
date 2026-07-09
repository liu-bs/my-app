/**
 * @file MyArticlesFilter.tsx
 * @description 我的文章页筛选器组件，提供按状态过滤文章的按钮组
 */

"use client";

import { FC } from "react";

/**
 * 筛选器选项数量映射
 */
interface FilterCounts {
  /** 全部文章数 */
  all: number;
  /** 已发布文章数 */
  published: number;
  /** 草稿数 */
  draft: number;
  /** 已归档文章数 */
  archived: number;
}

/**
 * 我的文章页筛选器组件 Props
 */
interface MyArticlesFilterProps {
  /** 筛选条件变更回调，参数为新的筛选 id */
  onFilterChange: (filter: string) => void;
  /** 当前激活的筛选 id */
  activeFilter: string;
  /** 各状态对应的文章数量 */
  counts: FilterCounts;
}

/**
 * 我的文章页筛选器组件
 * @param props 组件属性
 * @param props.onFilterChange 筛选条件变更回调，参数为新的筛选 id
 * @param props.activeFilter 当前激活的筛选 id
 * @param props.counts 各状态对应的文章数量
 * @returns 渲染一组筛选按钮
 */
const MyArticlesFilter: FC<MyArticlesFilterProps> = ({ onFilterChange, activeFilter, counts }) => {
  // 筛选选项配置：id 与文案、对应数量
  const filters = [
    { id: "all", label: "All", count: counts.all },
    { id: "published", label: "Published", count: counts.published },
    { id: "draft", label: "Drafts", count: counts.draft },
    { id: "archived", label: "Archived", count: counts.archived },
  ];

  return (
    <div className="mb-6 flex flex-wrap gap-2"> {/* 筛选器容器：横向排列的筛选按钮组 */}
      {/* 遍历渲染筛选按钮列表 */}
      {filters.map((filter) => (
        // 点击切换激活筛选条件
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeFilter === filter.id ? "bg-accent text-white" : "bg-surface-secondary text-text-secondary hover:bg-surface-secondary/80"
          }`}
        >
          {/* 展示筛选文案与对应文章数 */}
          {filter.label} ({filter.count})
        </button>
      ))}
    </div>
  );
};

export default MyArticlesFilter;
