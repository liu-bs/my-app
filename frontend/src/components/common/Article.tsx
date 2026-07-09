/**
 * @file Article.tsx
 * @description 文章卡片组件，列表页/首页/搜索结果中复用。
 */
import { FC } from "react";
import Link from "next/link";
import { Heart, MessageSquare } from "lucide-react";
import Style from "@/styles/commonStyle";
import type { Article } from "@/typeing";

/** Article 组件 props */
interface ArticleProps {
  /** 文章数据 */
  article: Article;
}

/**
 * 文章卡片组件。
 * @param props.article 文章数据。
 * @returns JSX.Element 文章卡片链接，含封面、标签、标题、摘要、点赞与评论数。
 */
const Article: FC<ArticleProps> = ({ article }) => {
  return (
    // 整张卡片为可点击链接，跳转至文章详情
    <Link key={article.id} href={`/article/${article.id}`} className={`${Style.card} flex flex-col gap-6 rounded-xl p-6 hover:shadow-md sm:flex-row`}>
      {/* 文章封面图 */}
      <div className="shrink-0 sm:w-48">
        <img src={article.image} alt={article.title} className="h-32 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105 sm:h-full" />
      </div>
      {/* 文字内容区域 */}
      <div className="flex flex-1 flex-col">
        {/* 标签 + 阅读时长行 */}
        <div className="mb-3 flex items-center gap-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${article.tagClass}`}>{article.tag}</span>
          <span className="text-text-secondary text-xs">{article.readTime}</span>
        </div>
        {/* 文章标题（hover 时变色） */}
        <h3 className="text-text-primary group-hover:text-default mb-2 text-lg font-semibold transition-colors">{article.title}</h3>
        {/* 文章摘要，最多两行 */}
        <p className="text-text-secondary mb-4 line-clamp-2 text-sm">{article.excerpt}</p>
        {/* 底部元信息：日期 + 点赞 + 评论 */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-text-secondary text-xs">{article.date}</span>
          <div className="text-text-secondary flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {article.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {article.comments}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Article;
