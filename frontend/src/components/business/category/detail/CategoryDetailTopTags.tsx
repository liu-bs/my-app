/**
 * @file CategoryDetailTopTags.tsx
 * @description 分类详情页热门话题区块组件，展示该分类下的 topTags 标签集合
 */
import { FC } from "react";
import Link from "next/link";
import { CATEGORY_DETAILS_DATA } from "@/constans";

interface CategoryDetailTopTagsProps {
  /** 分类详情数据（从中读取 topTags 字段） */
  category: typeof CATEGORY_DETAILS_DATA.engineering;
}

/**
 * 分类详情页热门话题组件
 * @param props 组件入参
 * @param props.category 分类详情数据（需包含 topTags 数组）
 * @returns 渲染「Popular Topics」标题与标签胶囊列表
 */
const CategoryDetailTopTags: FC<CategoryDetailTopTagsProps> = ({ category }) => {
  return (
    <section className="mb-12"> {/* 热门话题区块容器：底部外边距 48px（mb-12） */}
      {/* 区块标题 */}
      <h2 className="text-text-primary mb-4 text-lg font-semibold">Popular Topics</h2>
      {/* 标签胶囊容器：flex 布局横向排列，子元素间距 8px（gap-2） */}
      <div className="flex flex-wrap gap-2">
        {/* 遍历渲染该分类下所有热门话题胶囊链接 */}
        {category.topTags.map((tag) => (
          <Link
            key={tag}
            href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-text-secondary bg-surface border-border hover:border-accent hover:text-accent rounded-full border px-4 py-2 text-sm font-medium transition-colors"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryDetailTopTags;
