/**
 * @file page.tsx
 * @description 关于我们页面：依次渲染 Hero、统计数据、价值观、团队、行动召唤等模块
 */
import AboutCta from "@/components/business/about/AboutCta";
import AboutHero from "@/components/business/about/AboutHero";
import AboutStats from "@/components/business/about/AboutStats";
import AboutTeam from "@/components/business/about/AboutTeam";
import AboutValues from "@/components/business/about/AboutValues";

/**
 * 关于我们页面
 * @returns 关于页内容（Hero、Stats、Values、Team、CTA）
 */
export default function AboutPage() {
  return (
    <>
      {/* 关于页首屏主视觉区，介绍品牌与使命 */}
      <AboutHero />
      {/* 平台关键运营数据指标展示 */}
      <AboutStats />
      {/* 平台核心价值观说明区 */}
      <AboutValues />
      {/* 团队成员介绍列表 */}
      <AboutTeam />
      {/* 页底行动召唤区，引导用户进一步操作 */}
      <AboutCta />
    </>
  );
}
