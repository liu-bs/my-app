/**
 * @file FeaturedArticleCard.tsx
 * @description 精选文章卡片组件，展示封面图、标签、标题、摘要、作者及点赞/评论数
 */
import { FC } from "react";
import Link from "next/link";
import { Clock, Heart, MessageSquare } from "lucide-react";
import { CATEGORY_DETAILS_ARTICLE } from "@/constans";

interface FeaturedArticleCardProps {
  /** 文章数据（取自 CATEGORY_DETAILS_ARTICLE 元组中的元素类型） */
  article: (typeof CATEGORY_DETAILS_ARTICLE)[0];
}

/**
 * 精选文章卡片组件
 * @param props 组件入参
 * @param props.article 文章对象（含标题、作者、标签、点赞数、评论数等）
 * @returns 渲染一张可整片点击跳转到文章详情的大卡片
 */
const FeaturedArticleCard: FC<FeaturedArticleCardProps> = ({ article }) => {
  return (
    <div className="group border-border bg-surface hover:border-accent/50 relative flex flex-col gap-6 rounded-xl border p-6 transition-all hover:shadow-md sm:flex-row"> {/* 精选文章卡片容器：移动端纵向，桌面端左右分栏，hover 时图片轻微放大 300ms */}
      {/* 整卡点击区：覆盖在最上层的透明链接，点击跳转至文章详情 */}
      <Link href={`/article/${article.id}`} className="absolute inset-0 z-0" aria-label={article.title} />
      {/* 封面图容器：移动端宽 100% 高 128px（h-32），桌面端固定宽 192px（sm:w-48） */}
      <div className="shrink-0 sm:w-48">
        {/* 文章封面图：移动端高 128px，桌面端占满 192px 宽侧栏；hover 时图片轻微放大 300ms */}
        <img src={article.image} alt={article.title} className="h-32 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105 sm:h-full" />
      </div>
      <div className="relative flex flex-1 flex-col">
        <div className="mb-3 flex items-center gap-3">
          {/* 文章分类标签胶囊 */}
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${article.tagClass}`}>{article.tag}</span>
          {/* 文章阅读时长展示 */}
          <span className="text-text-secondary flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" />
            {article.readTime}
          </span>
        </div>
        {/* 文章标题：hover 时变为主题色 */}
        <h3 className="text-text-primary group-hover:text-accent mb-2 text-lg font-semibold transition-colors">{article.title}</h3>
        {/* 文章摘要：最多展示 2 行 */}
        <p className="text-text-secondary mb-4 line-clamp-2 text-sm">{article.excerpt}</p>
        <div className="mt-auto flex items-center justify-between">
          {/* 作者信息链接：使用更高 z-index 避免被整卡链接拦截点击 */}
          <Link href={`/author/${article.author.name.toLowerCase().replace(/\s+/g, "-")}`} className="group/author relative z-10 flex items-center gap-2">
            {/* 作者头像：宽高 24px（h-6 w-6） */}
            <img src={article.author.avatar} alt={article.author.name} className="h-6 w-6 rounded-full object-cover" />
            {/* 作者名称 */}
            <span className="text-text-secondary group-hover/author:text-accent text-sm transition-colors">{article.author.name}</span>
          </Link>
          {/* 文章互动数据：点赞数与评论数 */}
          <div className="text-text-secondary flex items-center gap-4 text-xs">
            {/* 文章点赞数 */}
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {article.likes}
            </span>
            {/* 文章评论数 */}
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {article.comments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticleCard;
