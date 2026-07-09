/**
 * @file page.tsx
 * @description 首页（/）页面，由多个业务区块组件组合而成。
 */

import FeaturedAuthorsSection from "@/components/business/home/FeaturedAuthorsSection";
import HeroSrction from "@/components/business/home/HeroSrction";
import NewsletterSection from "@/components/business/home/NewsletterSection";
import WritingSection from "@/components/business/home/WritingSection";

/**
 * 首页组件
 *
 * 自上而下组合四个业务区块：
 * 1. HeroSection — 首屏主视觉
 * 2. WritingSection — 最新写作内容
 * 3. FeaturedAuthorsSection — 精选作者展示
 * 4. NewsletterSection — 邮件订阅
 *
 * @returns 首页结构
 */
export default function HomePage() {
  return (
    <>
      {/* 首页首屏主视觉区块，呈现品牌口号与核心入口 */}
      <HeroSrction />
      {/* 最新写作内容区块，展示平台近期发布的文章 */}
      <WritingSection />
      {/* 精选作者展示区块，推荐优质创作者 */}
      <FeaturedAuthorsSection />
      {/* 邮件订阅区块，引导用户订阅 Newsletter */}
      <NewsletterSection />
    </>
  );
}
