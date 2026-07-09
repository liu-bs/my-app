/**
 * @file ArticleRelatedPosts.tsx
 * @description 文章详情页相关推荐组件，按相同标签筛选最多 3 篇相关文章以网格形式展示
 */
import { FC } from "react";
import Link from "next/link";
import { ArrowRight, Heart, MessageSquare } from "lucide-react";
import { ARTICLES } from "@/constans";
import { ArticleDetailItem } from "@/typeing";

/**
 * 相关推荐组件的 Props
 */
interface ArticleRelatedPostsProps {
  /** 当前文章详情数据，使用其 tag 与 id 进行相关推荐筛选 */
  article: ArticleDetailItem;
}

/**
 * 文章详情页相关推荐组件
 * 从 ARTICLES 常量中按相同 tag 筛选、排除当前文章，最多取 3 篇，以卡片网格展示并提供"查看全部"链接
 * @param props 组件入参
 * @param props.article 文章详情数据
 * @returns 渲染完成的相关推荐 JSX；无相关文章时返回 null
 */
const ArticleRelatedPosts: FC<ArticleRelatedPostsProps> = ({ article }) => {
  // 从全量文章列表中按相同 tag 过滤，并排除当前文章，最多取 3 篇
  const relatedArticles = ARTICLES.filter((a) => a.tag === article.tag && a.id !== article.id).slice(0, 3);

  // 无相关文章时不渲染
  if (relatedArticles.length === 0) return null;

  return (
    <>{/* 相关推荐区容器 */}
      <section className="mt-12">
        {/* 区域标题区：标题 + 查看全部链接 */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-text-primary text-xl font-semibold">Related Articles</h2>
          {/* 查看全部链接：点击跳转到当前 tag 对应的分类页 */}
          <Link href={`/category/${article.tag.toLowerCase()}`} className="text-accent hover:text-accent-hover flex items-center gap-1 text-sm font-medium transition-colors">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 推荐文章卡片网格，移动端 1 列，平板 2 列，桌面 3 列 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 遍历渲染相关推荐文章卡片，点击跳转至文章详情 */}
          {relatedArticles.map((related) => (
            <Link key={related.id} href={`/article/${related.id}`} className="border-border bg-surface hover:border-accent/50 group overflow-hidden rounded-xl border transition-all">
              {/* 封面图容器，hover 时图片缩放放大 */}
              <div className="overflow-hidden">
                <img src={related.image} alt={related.title} className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              {/* 卡片文本信息区 */}
              <div className="p-4">
                {/* 文章分类标签 */}
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${related.tagClass}`}>{related.tag}</span>
                {/* 文章标题展示，最多 2 行 */}
                <h3 className="text-text-primary group-hover:text-accent mt-2 line-clamp-2 text-sm font-semibold transition-colors">{related.title}</h3>
                {/* 文章摘要展示，最多 2 行 */}
                <p className="text-text-secondary mt-1 line-clamp-2 text-xs">{related.excerpt}</p>
                {/* 卡片底部元信息：点赞数、评论数、阅读时长 */}
                <div className="text-text-secondary mt-3 flex items-center gap-3 text-xs">
                  {/* 点赞数展示，含心形图标 */}
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {related.likes}
                  </span>
                  {/* 评论数展示，含消息图标 */}
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {related.comments}
                  </span>
                  {/* 阅读时长展示 */}
                  <span>{related.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default ArticleRelatedPosts;
