/**
 * @file ArticleContent.tsx
 * @description 文章详情页正文组件，使用 prose 样式渲染文章 HTML 内容
 */
import { FC } from "react";
import { ArticleDetailItem } from "@/typeing";

/**
 * 文章正文组件的 Props
 */
interface ArticleContentProps {
  /** 文章详情数据，含 HTML 格式的正文 */
  article: ArticleDetailItem;
}

/**
 * 文章详情页正文组件
 * 通过 dangerouslySetInnerHTML 将文章 HTML 内容注入，并使用 Tailwind typography 的 prose 样式渲染排版
 * @param props 组件入参
 * @param props.article 文章详情数据
 * @returns 渲染完成的正文 JSX
 */
const ArticleContent: FC<ArticleContentProps> = ({ article }) => {
  return (
    <>{/* 文章正文容器，使用 prose 排版样式展示 HTML 内容 */}
      <div
        className="prose prose-lg prose-headings:text-text-primary prose-p:text-text-secondary prose-strong:text-text-primary prose-ul:text-text-secondary prose-li:marker:text-accent prose-a:text-accent hover:prose-a:text-accent-hover mb-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </>
  );
};

export default ArticleContent;
