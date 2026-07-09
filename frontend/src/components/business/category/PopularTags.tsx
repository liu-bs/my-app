/**
 * @file PopularTags.tsx
 * @description 热门标签区块组件，将常用标签渲染为可点击的胶囊形链接
 */
import { FC } from "react";
import Link from "next/link";
import { POPULAR_TAGS } from "@/constans";
import Styles from "@/styles/commonStyle";

/** 热门标签组件入参：无外部参数 */
interface PopularTagsProps {}

/**
 * 热门标签组件（纯展示）
 * @returns 渲染「Popular Tags」标题及一行标签胶囊
 */
const PopularTags: FC<PopularTagsProps> = () => {
  return (
    <section className="mb-16"> {/* 热门标签区块容器：底部外边距 64px（mb-16） */}
      {/* 区块标题 */}
      <h2 className="text-text-primary mb-6 text-xl font-semibold">Popular Tags</h2>
      {/* 标签胶囊容器：flex 布局横向排列，子元素间距 8px（gap-2） */}
      <div className="flex flex-wrap gap-2">
        {/* 遍历渲染所有热门标签胶囊链接 */}
        {POPULAR_TAGS.map((tag) => (
          <Link key={tag} href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`} className={`${Styles.btn} rounded-full border bg-transparent px-4 py-2 text-sm font-medium`}> {/* 标签胶囊链接：点击跳转至对应标签详情页 */}
            #{tag}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularTags;
