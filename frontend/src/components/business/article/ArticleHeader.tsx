/**
 * @file ArticleHeader.tsx
 * @description 文章详情页头部组件，展示分类标签、发布日期、阅读时长与文章主标题
 */
import { FC } from "react";
import { Calendar, Clock } from "lucide-react";
import { ArticleDetailItem } from "@/typeing";

/**
 * 文章头部组件的 Props
 */
interface ArticleHeaderProps {
  /** 文章详情数据，含标签、日期、阅读时长、标题等字段 */
  article: ArticleDetailItem;
}

/**
 * 文章详情页头部组件
 * 渲染顶部的一行元信息（分类标签、发布日期、阅读时长），以及文章主标题
 * @param props 组件入参
 * @param props.article 文章详情数据，用于驱动头部展示
 * @returns 渲染完成的头部 JSX
 */
const ArticleHeader: FC<ArticleHeaderProps> = ({ article }) => {
  return (
    <>{/* 文章详情页头部容器 */}
      <header className="mb-8">
        {/* 元信息行：分类标签 + 发布日期 + 阅读时长 */}
        <div className="mb-4 flex items-center gap-3">
          {/* 文章分类标签，按 tagClass 动态着色 */}
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${article.tagClass}`}>{article.tag}</span>
          {/* 发布日期展示，含日历图标 */}
          <span className="text-text-secondary flex items-center gap-1 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            {article.date}
          </span>
          {/* 阅读时长展示，含时钟图标 */}
          <span className="text-text-secondary flex items-center gap-1 text-xs">
            <Clock className="h-3.5 w-3.5" />
            {article.readTime}
          </span>
        </div>
        {/* 文章主标题展示 */}
        <h1 className="text-text-primary mb-4 text-3xl font-bold sm:text-4xl">{article.title}</h1>
      </header>
    </>
  );
};

export default ArticleHeader;
