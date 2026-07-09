/**
 * @file LearningPaths.tsx
 * @description 学习路径列表组件，分类详情页侧边栏展示各难度级别的学习路线
 */
import Link from "next/link";
import { BookOpen, CheckCircle2, ChevronRight, Clock } from "lucide-react";
import { CATEGORY_DETAILS_LEARNING_PATH } from "@/constans";

/**
 * 学习路径列表组件（纯展示）
 * @returns 渲染「Learning Paths」卡片，列表展示标题、步骤数、时长与难度标签
 */
const LearningPaths = () => {
  return (
    <section className="border-border bg-surface rounded-xl border p-6"> {/* 学习路径列表卡片容器：圆角带边框，背景色为 surface */}
      <div className="mb-6 flex items-center gap-2">
        {/* 学习路径区块标题图标 */}
        <BookOpen className="text-accent h-5 w-5" />
        {/* 区块标题 */}
        <h3 className="text-text-primary font-semibold">Learning Paths</h3>
      </div>
      {/* 学习路径列表：列表项纵向间距 12px（space-y-3） */}
      <div className="space-y-3">
        {/* 遍历渲染所有学习路径项 */}
        {CATEGORY_DETAILS_LEARNING_PATH.map((path) => (
          <Link
            key={path.title}
            href={`/tag/${path.title.toLowerCase().replace(/\s+/g, "-")}`}
            className="border-border bg-background hover:border-accent/50 group block cursor-pointer rounded-lg border p-4 transition-colors"
          >
            <div className="mb-2 flex items-start justify-between">
              {/* 学习路径名称标题 */}
              <h4 className="text-text-primary group-hover:text-accent font-medium transition-colors">{path.title}</h4>
              {/* 右侧右箭头：hover 时变为主题色 */}
              <ChevronRight className="text-text-secondary group-hover:text-accent h-4 w-4 transition-colors" />
            </div>
            {/* 学习路径描述 */}
            <p className="text-text-secondary mb-3 text-xs">{path.description}</p>
            {/* 学习路径元信息：步骤数、时长、难度等级 */}
            <div className="text-text-secondary flex items-center gap-3 text-xs">
              {/* 学习步骤数展示 */}
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {path.steps} steps
              </span>
              {/* 学习时长展示 */}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {path.duration}
              </span>
              {/* 难度等级标签三态：Beginner/Advanced/其它（默认 Intermediate） */}
              <span
                className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                  path.level === "Beginner" ? "bg-success-light text-success" : path.level === "Advanced" ? "bg-warning-light text-warning" : "bg-error-light text-error"
                }`}
              >
                {path.level}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LearningPaths;
