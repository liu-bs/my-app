/**
 * @file page.tsx
 * @description 分类详情页面：根据动态路由 id 加载分类并展示头部、热门标签、精选与常规文章、侧边栏模块
 */
import { notFound } from "next/navigation";
import BackLink from "@/components/business/category/detail/BackLink";
import CategoryDetailHeader from "@/components/business/category/detail/CategoryDetailHeader";
import CategoryDetailTopTags from "@/components/business/category/detail/CategoryDetailTopTags";
import CategoryMainContent from "@/components/business/category/detail/CategoryMainContent";
import LearningPaths from "@/components/business/category/detail/LearningPaths";
import Newsletter from "@/components/business/category/detail/Newsletter";
import QuickStats from "@/components/business/category/detail/QuickStats";
import RecentActivity from "@/components/business/category/detail/RecentActivity";
import TopAuthors from "@/components/business/category/detail/TopAuthors";
import { CATEGORY_DETAILS_ARTICLE, CATEGORY_DETAILS_DATA } from "@/constans";

/**
 * 生成静态路由参数：为每个分类预渲染详情页
 * @returns 分类 id 列表
 */
export function generateStaticParams() {
  return Object.keys(CATEGORY_DETAILS_DATA).map((id) => ({ id }));
}

/** 分类详情页 props 类型 */
interface CategoryPageProps {
  /** 动态路由参数 */
  params: Promise<{ id: string }>;
}

/**
 * 分类详情页面
 * @param props 页面 props
 * @param props.params.id 分类唯一标识
 * @returns 分类详情视图，未找到时触发 404
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  // 在分类数据字典中查找当前分类
  const category = CATEGORY_DETAILS_DATA[id as keyof typeof CATEGORY_DETAILS_DATA];

  // 未找到则进入 404
  if (!category) {
    notFound();
  }

  // 拆分为精选文章与常规文章，分别在主内容区展示
  const featuredArticles = CATEGORY_DETAILS_ARTICLE.filter((a) => a.featured);
  const regularArticles = CATEGORY_DETAILS_ARTICLE.filter((a) => !a.featured);

  return (
    <div className="bg-background min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <BackLink />
        <CategoryDetailHeader category={category} />
        <CategoryDetailTopTags category={category} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <CategoryMainContent featuredArticles={featuredArticles} regularArticles={regularArticles} />
          <div className="space-y-8">
            <RecentActivity />
            <TopAuthors />
            <LearningPaths />
            <Newsletter />
            <QuickStats />
          </div>
        </div>
      </main>
    </div>
  );
}
