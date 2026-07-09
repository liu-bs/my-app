/**
 * @file CategoryGrid.tsx
 * @description 分类卡片网格容器组件，按响应式布局（1/2/3 列）渲染所有分类项
 */
import { FC } from "react";
import { CATEGORYS } from "@/constans";
import CategoryItem from "./CategoryItem";

/** 分类卡片网格容器组件入参：无外部参数 */
interface CategoryGridProps {}

/**
 * 分类卡片网格容器组件（纯展示）
 * @returns 渲染分类卡片网格（移动端 1 列，平板 2 列，桌面 3 列）
 */
const CategoryGrid: FC<CategoryGridProps> = () => {
  return (
    <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"> {/* 网格列数：移动端 1 列、md 2 列、lg 3 列；卡片间距 24px（gap-6） */}
      {/* 遍历渲染所有分类卡片 */}
      {CATEGORYS.map((category) => {
        return <CategoryItem key={category.id} category={category} />;
      })}
    </div>
  );
};

export default CategoryGrid;
