/**
 * @file page.tsx
 * @description 分类总览页面：依次展示分类头部、分类网格、热门标签与行动召唤模块
 */
import CategoryGrid from "@/components/business/category/CategoryGrid";
import CategoryHeader from "@/components/business/category/CategoryHeader";
import CtaSection from "@/components/business/category/CtaSection";
import PopularTags from "@/components/business/category/PopularTags";

/**
 * 分类总览页面
 * @returns 分类页内容（Header、分类网格、热门标签、CTA）
 */
export default function CategoriesPage() {
  return (
    <>
      {/* 分类页头部区域，展示标题与简介 */}
      <CategoryHeader />
      {/* 分类网格区块，呈现所有文章分类入口 */}
      <CategoryGrid />
      {/* 热门标签区块，引导用户按标签筛选 */}
      <PopularTags />
      {/* 行动召唤区，引导用户进一步操作 */}
      <CtaSection />
    </>
  );
}
