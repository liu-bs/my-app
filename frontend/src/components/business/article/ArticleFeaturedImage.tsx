/**
 * @file ArticleFeaturedImage.tsx
 * @description 文章详情页封面图组件，渲染带圆角的文章主图，移动端高度 256px、桌面端 320px
 */
import { FC } from "react";
import { ArticleDetailItem } from "@/typeing";

/**
 * 文章封面图组件的 Props
 */
interface ArticleFeaturedImageProps {
  /** 文章详情数据，含图片地址与标题（用作 alt 文本） */
  article: ArticleDetailItem;
}

/**
 * 文章详情页封面图组件
 * 以圆角容器展示文章主图，图片宽度铺满，高度响应式变化
 * @param props 组件入参
 * @param props.article 文章详情数据
 * @returns 渲染完成的封面图 JSX
 */
const ArticleFeaturedImage: FC<ArticleFeaturedImageProps> = ({ article }) => {
  return (
    <>{/* 文章封面图容器 */}
      <div className="mb-8">
        {/* 文章主图展示，宽度 100%，移动端高 256px、桌面端高 320px */}
        <img src={article.image} alt={article.title} className="h-64 w-full rounded-2xl object-cover sm:h-80" />
      </div>
    </>
  );
};

export default ArticleFeaturedImage;
