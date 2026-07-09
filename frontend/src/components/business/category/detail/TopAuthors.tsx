/**
 * @file TopAuthors.tsx
 * @description 分类详情页头部作者组件，侧边栏展示该分类下的头部贡献者列表
 */
import Link from "next/link";
import { Award, CheckCircle2 } from "lucide-react";
import { CATEGORY_DETAILS_TOP_AUTHORS } from "@/constans";

/**
 * 分类头部贡献者列表组件（纯展示）
 * @returns 渲染「Top Contributors」卡片，含头像、姓名、角色及文章数
 */
const TopAuthors = () => {
  return (
    <section className="border-border bg-surface rounded-xl border p-6"> {/* 头部贡献者列表卡片容器：圆角带边框，背景色为 surface */}
      <div className="mb-6 flex items-center gap-2">
        {/* 区块标题图标 */}
        <Award className="text-accent h-5 w-5" />
        {/* 区块标题 */}
        <h3 className="text-text-primary font-semibold">Top Contributors</h3>
      </div>
      {/* 贡献者列表：列表项纵向间距 16px（space-y-4） */}
      <div className="space-y-4">
        {/* 遍历渲染所有头部贡献者项 */}
        {CATEGORY_DETAILS_TOP_AUTHORS.map((author) => (
          <div key={author.name} className="flex items-center gap-3"> {/* 单个贡献者项：含头像、姓名、角色、文章数 */}
            <div className="relative">
              {/* 贡献者头像：宽高 40px（h-10 w-10）圆形 */}
              <img src={author.avatar} alt={author.name} className="h-10 w-10 rounded-full object-cover" />
              {/* 已认证作者右下角显示对勾徽标 */}
              {author.verified && <CheckCircle2 className="text-success bg-surface absolute -right-0.5 -bottom-0.5 h-4 w-4 rounded-full" />}
            </div>
            <div className="min-w-0 flex-1">
              {/* 贡献者姓名 */}
              <p className="text-text-primary truncate font-medium">{author.name}</p>
              {/* 贡献者角色 */}
              <p className="text-text-secondary text-xs">{author.role}</p>
            </div>
            {/* 贡献者文章数展示 */}
            <div className="text-text-secondary text-right text-xs">
              {/* 文章数量数值 */}
              <p className="text-text-secondary font-medium">{author.articles}</p>
              {/* 「articles」单位说明 */}
              <p>articles</p>
            </div>
          </div>
        ))}
      </div>
      {/* 查看全部作者链接：点击跳转至搜索页 */}
      <Link href="/search" className="text-accent hover:bg-accent/10 mt-6 block w-full rounded-lg py-2 text-center text-sm font-medium transition-colors">
        View all authors
      </Link>
    </section>
  );
};

export default TopAuthors;
