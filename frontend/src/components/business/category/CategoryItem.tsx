/**
 * @file CategoryItem.tsx
 * @description 单个分类卡片组件，展示分类图标、名称、描述、文章数及关注者数
 */
"use client";

import { FC } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Code, Coffee, Layers, Palette, Zap } from "lucide-react";
import Styles from "@/styles/commonStyle";
import { Category } from "@/typeing";

/** 图标字符串与 lucide-react 图标组件的映射表 */
const ICON_MAP: Record<string, FC<{ className?: string }>> = {
  Code,
  Palette,
  Layers,
  Coffee,
  BookOpen,
  Zap,
};

interface CategoryItemProps {
  /** 分类完整信息 */
  category: Category;
}

/**
 * 单个分类卡片组件
 * @param props 组件入参
 * @param props.category 分类信息（含 id/name/description/icon/color/articleCount/followers 等）
 * @returns 渲染一个可点击的分类卡片，悬停时箭头右移
 */
const CategoryItem: FC<CategoryItemProps> = ({ category }) => {
  /** 根据 category.icon 字符串映射到对应图标组件，未匹配时回退到 Code */
  const IconComponent = ICON_MAP[category.icon] || Code;

  return (
    <Link key={category.id} href={`/category/${category.id}`} className={`group ${Styles.card} rounded-xl p-6`}> {/* 分类卡片链接：点击跳转至分类详情页 */}
      <div className="flex items-start gap-4">
        {/* 分类图标容器：宽高 48px（h-12 w-12）圆角方块 */}
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.color}`}>
          {/* 分类图标：宽高 24px（h-6 w-6） */}
          <IconComponent className={`h-6 w-6 ${category.textColor}`} />
        </div>
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            {/* 分类名称标题 */}
            <h3 className="text-text-primary group-hover:text-text-secondary text-lg font-semibold transition-colors">{category.name}</h3>
            {/* 悬停时箭头向右平移 4px（duration-300） */}
            <ArrowRight className="text-text-secondary group-hover:text-text-primary h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
          </div>
          {/* 分类描述：最多展示 2 行 */}
          <p className="text-text-secondary mb-4 line-clamp-2 text-sm">{category.description}</p>
          <div className="text-text-secondary flex items-center gap-4 text-xs">
            {/* 分类下文章数量展示 */}
            <span>{category.articleCount} articles</span>
            {/* 分类关注者数量展示 */}
            <span>{category.followers} followers</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryItem;
