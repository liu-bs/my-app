/**
 * @file AboutHero.tsx
 * @description 关于页头部主视觉组件，承载平台标语、简介文案与两个核心入口按钮（注册 / 浏览文章）
 */
import { FC } from "react";
import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";

/**
 * 关于页主视觉组件的 Props（当前未传任何参数，预留扩展位）
 */
interface AboutHeroProps {}

/**
 * 关于页主视觉组件
 * 渲染带渐变背景的标题区域，含品牌图标、主副标题、说明文案，以及"开始使用"和"浏览文章"两个跳转按钮
 * @param [props] 当前未使用，保留以便后续扩展
 * @returns 渲染完成的 Hero 区 JSX
 */
const AboutHero: FC<AboutHeroProps> = (_props) => {
  return (
    <>{/* 关于页主视觉区块容器，承载品牌信息与核心入口 */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* 区块背景渐变遮罩层，营造视觉氛围 */}
        <div className="from-accent/10 via-background to-background absolute inset-0 bg-linear-to-br" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          {/* 品牌图标容器，居中展示羽毛笔图标 */}
          <div className="bg-accent mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl text-white">
            <PenLine className="h-8 w-8" />
          </div>
          {/* 主标题文案：分享知识，构建社区 */}
          <h1 className="text-text-primary mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
            Sharing Knowledge,
            <br />
            <span className="text-accent">Building Community</span>
          </h1>
          {/* 副标题说明文案，介绍平台定位 */}
          <p className="text-text-secondary mx-auto mb-10 max-w-3xl text-lg sm:text-xl">
            Personal Blog is a platform where developers, designers, and tech enthusiasts come together to share insights and grow their careers.
          </p>
          {/* 核心入口按钮组：注册与浏览文章 */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* 立即开始按钮：点击跳转注册页 */}
            <Link href="/register" className="bg-accent hover:bg-accent-hover inline-flex items-center gap-2 rounded-lg px-8 py-3 font-medium text-white transition-colors">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            {/* 浏览文章按钮：点击跳转搜索页 */}
            <Link
              href="/search"
              className="border-border text-text-primary hover:bg-surface-secondary inline-flex items-center gap-2 rounded-lg border px-8 py-3 font-medium transition-colors"
            >
              Explore Articles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutHero;
