/**
 * @file CategoryHeader.tsx
 * @description 分类列表页头部标题组件，展示「探索主题」标题及副标题描述
 */
import { FC } from "react";

/** 分类列表页头部组件入参：无外部参数 */
interface CategoryHeaderProps {}

/**
 * 分类列表页头部组件（纯展示）
 * @returns 渲染居中的标题与副标题文案
 */
const CategoryHeader: FC<CategoryHeaderProps> = () => {
  return (
    <div className="mb-12 text-center"> {/* 分类页头容器：底部外边距 48px（mb-12），文字居中 */}
      {/* 页面主标题：移动端 3xl，桌面端 4xl */}
      <h1 className="text-text-primary mb-4 text-3xl font-bold sm:text-4xl">Explore Topics</h1>
      {/* 页面副标题：最大宽度 672px（max-w-2xl）描述文案 */}
      <p className="text-text-secondary mx-auto max-w-2xl text-lg">Discover articles organized by categories. Find content that matches your interests and expertise.</p>
    </div>
  );
};

export default CategoryHeader;
