/**
 * @file page.tsx
 * @description 文章详情页面：根据动态路由 id 加载文章并展示完整内容、作者信息、目录、评论、相关文章等
 */
import { notFound } from "next/navigation";
import ArticleActions from "@/components/business/article/ArticleActions";
import ArticleAuthorInfo from "@/components/business/article/ArticleAuthorInfo";
import ArticleBackLink from "@/components/business/article/ArticleBackLink";
import ArticleCommentsSection from "@/components/business/article/ArticleCommentsSection";
import ArticleContent from "@/components/business/article/ArticleContent";
import ArticleFeaturedImage from "@/components/business/article/ArticleFeaturedImage";
import ArticleHeader from "@/components/business/article/ArticleHeader";
import ArticleRelatedPosts from "@/components/business/article/ArticleRelatedPosts";
import ArticleTableOfContents from "@/components/business/article/ArticleTableOfContents";
import { ARTICLES_DETAIL_ITEMS } from "@/constans/index";

/**
 * 生成静态路由参数：在构建期为每篇文章预渲染静态页面
 * @returns 文章 id 列表
 */
export function generateStaticParams() {
  return ARTICLES_DETAIL_ITEMS.map((article) => ({
    id: article.id,
  }));
}

/** 文章详情页 props 类型 */
interface ArticlePageProps {
  /** 动态路由参数 */
  params: Promise<{ id: string }>;
}

/**
 * 文章详情页面
 * @param props 页面 props
 * @param props.params.id 文章唯一标识
 * @returns 文章详情视图，未找到时触发 404
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  // 根据 id 在文章列表中查找对应文章
  const article = ARTICLES_DETAIL_ITEMS.find((a) => a.id === id);

  // 未找到则进入 404
  if (!article) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ArticleBackLink />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <ArticleHeader article={article} />
            <ArticleFeaturedImage article={article} />
            <ArticleAuthorInfo article={article} />
            <ArticleContent article={article} />
            <ArticleActions article={article} />
            <ArticleCommentsSection article={article} />
            <ArticleRelatedPosts article={article} />
          </div>

          <div className="hidden lg:block">
            <ArticleTableOfContents content={article.content} />
          </div>
        </div>
      </main>
    </div>
  );
}
