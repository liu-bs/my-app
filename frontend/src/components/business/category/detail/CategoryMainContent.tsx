/**
 * @file CategoryMainContent.tsx
 * @description 分类详情页主体内容组件，包含精选文章列表与最新文章列表
 */
import { FC } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { CATEGORY_DETAILS_ARTICLE } from "@/constans";
import ArticleListItem from "./ArticleListItem";
import FeaturedArticleCard from "./FeaturedArticleCard";

interface CategoryMainContentProps {
  /** 精选文章列表（将使用 FeaturedArticleCard 渲染） */
  featuredArticles: typeof CATEGORY_DETAILS_ARTICLE;
  /** 普通最新文章列表（将使用 ArticleListItem 渲染） */
  regularArticles: typeof CATEGORY_DETAILS_ARTICLE;
}

/**
 * 分类详情页主体内容组件
 * @param props 组件入参
 * @param props.featuredArticles 精选文章列表
 * @param props.regularArticles 最新文章列表
 * @returns 渲染精选 + 最新两个文章分区
 */
const CategoryMainContent: FC<CategoryMainContentProps> = ({ featuredArticles, regularArticles }) => {
  return (
    <div className="space-y-8 lg:col-span-2"> {/* 主体内容容器：桌面端占 2/3 宽，列表项纵向间距 32px（space-y-8） */}
      {/* 条件渲染：仅在 featuredArticles 非空时显示精选文章区 */}
      {featuredArticles.length > 0 && (
        <section>
          <div className="mb-6 flex items-center gap-2">
            {/* 精选文章区标题图标 */}
            <Star className="text-warning h-5 w-5" />
            {/* 精选文章区标题 */}
            <h2 className="text-text-primary text-xl font-semibold">Featured Articles</h2>
          </div>
          {/* 精选文章列表：卡片纵向间距 24px（gap-6） */}
          <div className="grid gap-6">
            {/* 遍历渲染精选文章卡片 */}
            {featuredArticles.map((article) => (
              <FeaturedArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* 最新文章区 */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          {/* 最新文章区标题 */}
          <h2 className="text-text-primary text-xl font-semibold">Latest Articles</h2>
          {/* 查看全部链接：点击跳转至搜索页 */}
          <Link href="/search" className="text-accent hover:text-accent-hover text-sm font-medium transition-colors">
            View all
          </Link>
        </div>
        {/* 最新文章列表：列表项纵向间距 16px（space-y-4） */}
        <div className="space-y-4">
          {/* 遍历渲染最新文章列表行 */}
          {regularArticles.map((article) => (
            <ArticleListItem key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoryMainContent;
