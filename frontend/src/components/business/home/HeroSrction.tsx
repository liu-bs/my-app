/**
 * @file HeroSrction.tsx
 * @description 首页 Hero 横幅，展示主标题、副标题与两个行动按钮
 */

import { FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Style from "@/styles/commonStyle";

/**
 * 首页 Hero 横幅
 * 渲染站点主标题、副标题以及"开始阅读"、"关于我"两个跳转入口
 */
const HeroSrction: FC = () => {
  return (
    <section className="mb-16 text-center">{/* Hero 横幅容器：居中布局 */}
      {/* 主标题：分两行展示，加粗主标 + 灰色副标 */}
      <h1 className="text-text-primary mb-4 text-4xl font-bold sm:text-5xl">
        Exploring Ideas,
        <br />
        {/* 主标题灰色副文案 */}
        <span className="text-text-secondary">One Post at a Time.</span>
      </h1>
      {/* 页面描述文本 */}
      <p className="text-text-secondary mx-auto mb-8 max-w-2xl text-lg">Thoughts on software engineering, product design, and the journey of building digital experiences.</p>
      {/* 行动按钮组 */}
      <div className="flex items-center justify-center gap-4">
        {/* "开始阅读"主按钮，点击跳转至搜索页 */}
        <Link href="/search" className={`${Style.btnActive} inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium`}>
          Start Reading
        </Link>
        {/* "关于我"次按钮，点击跳转至关于页 */}
        <Link href="/about" className={`${Style.btn} inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium`}>
          About Me
          {/* 右侧箭头图标 */}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default HeroSrction;
