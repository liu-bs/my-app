/**
 * @file page.tsx
 * @description 作者主页：根据动态路由 id 加载作者信息并展示封面、个人信息、统计、徽章、作者文章等
 */
import { notFound } from "next/navigation";
import AuthorBadges from "@/components/business/author/AuthorBadges";
import AuthorCoverImage from "@/components/business/author/AuthorCoverImage";
import AuthorMainContentArticles from "@/components/business/author/AuthorMainContentArticles";
import AuthorProfileHeader from "@/components/business/author/AuthorProfileHeader";
import AuthorStats from "@/components/business/author/AuthorStats";
import { AUTHORS } from "@/constans";

/**
 * 生成静态路由参数：为每位作者预渲染主页
 * @returns 作者 id 列表
 */
export function generateStaticParams() {
  return Object.keys(AUTHORS).map((id) => ({ id }));
}

/** 作者主页 props 类型 */
interface AuthorPageProps {
  /** 动态路由参数 */
  params: Promise<{ id: string }>;
}

/**
 * 作者主页
 * @param props 页面 props
 * @param props.params.id 作者唯一标识
 * @returns 作者主页视图，未找到时触发 404
 */
export default async function AuthorPage({ params }: AuthorPageProps) {
  const { id } = await params;
  // 通过 id 在作者字典中查找作者
  const author = AUTHORS[id as keyof typeof AUTHORS];

  // 未找到则进入 404
  if (!author) {
    notFound();
  }

  return (
    <>
      <AuthorCoverImage author={author} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AuthorProfileHeader author={author} />
        <AuthorStats author={author} />
        <div className="mb-8">
          <AuthorBadges author={author} />
        </div>
        <AuthorMainContentArticles author={author} />
      </div>
    </>
  );
}
