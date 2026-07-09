/**
 * @file TopPerformingPosts.tsx
 * @description 仪表盘表现最佳的博客文章列表
 */

import { FC } from "react";
import Link from "next/link";
import { TOP_POSTS } from "@/constans";

/**
 * 表现最佳文章列表
 * 以表格形式展示文章标题、发布时间、阅读量与互动量
 * 点击标题可跳转到对应文章详情页
 */
const TopPerformingPosts: FC = () => {
  return (
    <div className="border-border bg-surface overflow-hidden rounded-xl border"> {/* 表格卡片容器 */}
      {/* 卡片标题区域 */}
      <div className="border-border border-b px-6 py-4">
        {/* 区块标题 */}
        <h2 className="text-text-primary text-lg font-semibold">Top Performing Posts</h2>
      </div>
      {/* 横向滚动容器：小屏下避免表格溢出 */}
      <div className="overflow-x-auto">
        {/* 文章数据表格 */}
        <table className="w-full">
          {/* 表头区域 */}
          <thead>
            {/* 表头行 */}
            <tr className="border-border bg-surface-secondary border-b">
              {/* 文章标题列 */}
              <th className="text-text-secondary px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">Post Title</th>
              {/* 发布时间列 */}
              <th className="text-text-secondary px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">Published</th>
              {/* 阅读量列 */}
              <th className="text-text-secondary px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">Views</th>
              {/* 互动量列 */}
              <th className="text-text-secondary px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">Engagement</th>
            </tr>
          </thead>
          {/* 表格主体区域 */}
          <tbody className="divide-border divide-y">
            {/* 遍历渲染每篇文章数据行 */}
            {TOP_POSTS.map((post) => (
              <tr key={post.id} className="hover:bg-surface-secondary/50 transition-colors"> {/* 单篇文章数据行 */}
                {/* 文章标题单元格 */}
                <td className="px-6 py-4">
                  {/* 文章标题链接，点击跳转至文章详情页 */}
                  <Link href={`/article/${post.id}`} className="text-accent hover:text-accent-hover cursor-pointer text-sm font-medium">
                    {post.title}
                  </Link>
                </td>
                {/* 发布时间单元格 */}
                <td className="px-6 py-4">
                  {/* 发布时间文本 */}
                  <p className="text-text-secondary text-sm">{post.published}</p>
                </td>
                {/* 阅读量单元格 */}
                <td className="px-6 py-4">
                  {/* 阅读量数值文本 */}
                  <p className="text-text-primary text-sm">{post.views}</p>
                </td>
                {/* 互动量单元格 */}
                <td className="px-6 py-4">
                  {/* 互动量徽标 */}
                  <span className="bg-success/10 text-success inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">{post.engagement}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopPerformingPosts;
