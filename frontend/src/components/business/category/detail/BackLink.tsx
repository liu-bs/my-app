/**
 * @file BackLink.tsx
 * @description 分类详情页返回链接组件，提供返回分类列表页的快捷入口
 */
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * 分类详情页返回链接组件（纯展示）
 * @returns 渲染一个带左箭头的「Back to categories」链接
 */
const BackLink = () => {
  return (
    <Link href="/category" className="text-text-secondary hover:text-text-primary mb-6 inline-flex items-center gap-2 text-sm transition-colors"> {/* 返回分类列表链接：点击跳转至 /category 分类列表页 */}
      {/* 左侧返回箭头图标 */}
      <ArrowLeft className="h-4 w-4" />
      Back to categories
    </Link>
  );
};

export default BackLink;
