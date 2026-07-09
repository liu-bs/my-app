/**
 * @file AboutCta.tsx
 * @description 关于页底部行动召唤组件，引导用户前往注册页创建账号
 */
import { FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * 关于页 CTA 组件的 Props（当前未传任何参数，预留扩展位）
 */
interface AboutCtaProps {}

/**
 * 关于页底部行动召唤组件
 * 渲染居中的标题、引导文案和"创建账号"按钮，点击后跳转至注册页
 * @param [props] 当前未使用，保留以便后续扩展
 * @returns 渲染完成的 CTA 区 JSX
 */
const AboutCta: FC<AboutCtaProps> = (_props) => {
  return (
    <>{/* 关于页底部行动召唤区容器 */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          {/* CTA 标题文案：号召用户开始写作 */}
          <h2 className="text-text-primary mb-4 text-3xl font-bold sm:text-4xl">Ready to Start Writing?</h2>
          {/* CTA 引导文案：邀请加入写作社区 */}
          <p className="text-text-secondary mx-auto mb-8 max-w-2xl">Join our community of writers and share your knowledge with the world.</p>
          {/* 创建账号按钮：点击跳转注册页 */}
          <Link href="/register" className="bg-accent hover:bg-accent-hover inline-flex items-center gap-2 rounded-lg px-8 py-3 font-medium text-white transition-colors">
            Create Your Account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default AboutCta;
