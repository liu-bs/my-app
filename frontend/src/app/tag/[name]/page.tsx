/**
 * @file page.tsx
 * @description 标签详情页面：根据动态路由 name 加载标签信息并展示头部、文章列表与侧边栏
 */
import { notFound } from "next/navigation";
import TagArticles from "@/components/business/tag/TagArticles";
import TagHeader from "@/components/business/tag/TagHeader";
import TagSidebar from "@/components/business/tag/TagSidebar";
import TagStats from "@/components/business/tag/TagStats";
import { TAGS_DATA, TAG_ARTICLES } from "@/components/business/tag/tagData";

/**
 * 生成静态路由参数：为每个标签预渲染详情页
 * @returns 标签 name 列表
 */
export function generateStaticParams() {
  return Object.keys(TAGS_DATA).map((name) => ({ name }));
}

/** 标签详情页 props 类型 */
interface TagPageProps {
  /** 动态路由参数 */
  params: Promise<{ name: string }>;
}

/**
 * 标签详情页面
 * @param props 页面 props
 * @param props.params.name 标签名称
 * @returns 标签详情视图，未找到时触发 404
 */
export default async function TagPage({ params }: TagPageProps) {
  const { name } = await params;
  // 在标签字典中查找当前标签
  const tag = TAGS_DATA[name];

  // 未找到则进入 404
  if (!tag) {
    notFound();
  }

  return (
    // 页面根容器
    <div className="bg-background min-h-screen">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 标签详情头部 */}
        <TagHeader tag={tag} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 标签下文章列表 */}
          <TagArticles articles={TAG_ARTICLES} />
          {/* 右侧侧边栏：统计 + 标签信息 */}
          <div className="space-y-8">
            <TagStats />
            <TagSidebar tagName={tag.name} articleCount={TAG_ARTICLES.length} followerCount={1284} />
          </div>
        </div>
      </main>
    </div>
  );
}
