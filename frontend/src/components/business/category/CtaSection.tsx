/**
 * @file CtaSection.tsx
 * @description 分类页底部行动召唤区块组件，引导用户跳转搜索页寻找更多内容
 */
import { FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Styles from "@/styles/commonStyle";

/** 底部行动召唤区块组件入参：无外部参数 */
interface CtaSectionProps {}

/**
 * 底部行动召唤区块组件（纯展示）
 * @returns 渲染渐变背景的引导卡片，含标题、描述及跳转搜索页的按钮
 */
const CtaSection: FC<CtaSectionProps> = () => {
  return (
    <section className="from-bg to-fr/20 rounded-2xl border bg-linear-to-br p-8 text-center sm:p-12"> {/* CTA 引导卡片：渐变背景，移动端内边距 32px（p-8），桌面端 48px（sm:p-12） */}
      {/* CTA 卡片标题 */}
      <h2 className="text-text-primary mb-3 text-2xl font-bold">Can&apos;t find what you&apos;re looking for?</h2>
      {/* CTA 卡片描述：最大宽度 512px（max-w-lg） */}
      <p className="text-text-secondary mx-auto mb-6 max-w-lg">Try using our search feature to find specific topics, articles, or authors across the platform.</p>
      {/* 跳转搜索页按钮：点击跳转至 /search 搜索页 */}
      <Link href="/search" className={`${Styles.link} inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium`}>
        Search Articles
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
};

export default CtaSection;
