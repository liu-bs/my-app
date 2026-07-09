/**
 * @file Newsletter.tsx
 * @description 订阅 Newsletter 组件，支持 card / section / compact 三种视觉变体。
 */
"use client";

import { FC, useState } from "react";
import { CheckCircle, Mail } from "lucide-react";

/** Newsletter 组件 props */
interface NewsletterProps {
  /** 标题，默认 "Stay Updated" */
  title?: string;
  /** 描述文案，默认通用订阅说明 */
  description?: string;
  /** 视觉变体：card（默认）/ section（页面大块）/ compact（紧凑侧边栏） */
  variant?: "card" | "section" | "compact";
  /** 订阅者数量文案，如 "10,000+"，仅在传入时显示 */
  subscriberCount?: string;
}

/**
 * 订阅成功提示持续时长（毫秒）。
 */
const SUBMIT_RESET_DELAY_MS = 3000;

/**
 * Newsletter 订阅组件。
 * @param props.title 标题。
 * @param props.description 描述文案。
 * @param props.variant 视觉变体。
 * @param props.subscriberCount 订阅者数量文案。
 * @returns JSX.Element 三种变体之一的订阅 UI。
 */
const Newsletter: FC<NewsletterProps> = ({
  title = "Stay Updated",
  description = "Get the latest articles delivered straight to your inbox. No spam, unsubscribe anytime.",
  variant = "card",
  subscriberCount,
}) => {
  // 输入框邮箱
  const [email, setEmail] = useState("");
  // 是否已提交（控制成功提示与表单切换）
  const [submitted, setSubmitted] = useState(false);

  /**
   * 提交订阅（本地态，暂不调用后端）。
   * @param e 表单事件。
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 邮箱为空则不处理
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
    // 3000ms 后恢复订阅按钮
    setTimeout(() => setSubmitted(false), SUBMIT_RESET_DELAY_MS);
  };

  if (variant === "section") {
    return (
      // section 变体：页面级大块订阅
      <section className="border-border bg-surface mx-auto mb-16 max-w-2xl rounded-2xl border p-8 text-center sm:p-12">
        <div className="bg-accent/10 text-accent mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl">
          <Mail className="h-7 w-7" />
        </div>
        {/* 变体标题 */}
        <h2 className="text-text-primary mb-2 text-2xl font-bold">{title}</h2>
        {/* 变体描述 */}
        <p className="text-text-secondary mb-6">{description}</p>
        {/* 提交后切换为成功提示，否则显示订阅表单 */}
        {submitted ? (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="text-success h-5 w-5" />
            <span className="text-success font-medium">Thanks for subscribing! Check your inbox.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="border-border bg-bg text-text-primary placeholder:text-text-secondary focus:border-accent flex-1 rounded-lg border px-4 py-3 text-sm transition-colors outline-none"
            />
            {/* 提交订阅按钮 */}
            <button type="submit" className="bg-accent hover:bg-accent-hover shrink-0 rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors">
              Subscribe
            </button>
          </form>
        )}
        {/* 订阅者数量文案（可选展示） */}
        {subscriberCount && <p className="text-text-secondary mt-4 text-xs">Join {subscriberCount} readers. Free forever.</p>}
      </section>
    );
  }

  if (variant === "compact") {
    return (
      // compact 变体：侧边栏紧凑卡片
      <div className="border-border bg-surface rounded-xl border p-5">
        <div className="mb-3 flex items-center gap-2">
          <Mail className="text-accent h-5 w-5" />
          {/* 紧凑卡片标题 */}
          <h3 className="text-text-primary font-semibold">Newsletter</h3>
        </div>
        <p className="text-text-secondary mb-4 text-sm">{description}</p>
        {submitted ? (
          <div className="bg-success/10 text-success rounded-lg px-4 py-2.5 text-center text-sm font-medium">Subscribed!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border bg-background text-text-primary placeholder:text-text-secondary focus:border-accent focus:ring-accent/20 mb-3 w-full rounded-lg border px-4 py-2.5 text-sm focus:ring-2 focus:outline-none"
            />
            {/* 紧凑变体订阅按钮，邮箱为空时禁用 */}
            <button
              type="submit"
              disabled={!email.trim()}
              className="bg-accent hover:bg-accent-hover w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    );
  }

  // variant === "card"
  return (
    // card 变体（默认）：居中卡片样式
    <div className="bg-accent/5 border-accent/20 rounded-2xl border p-8 text-center">
      <div className="bg-accent/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
        <Mail className="text-accent h-6 w-6" />
      </div>
      {/* 卡片标题 */}
      <h3 className="text-text-primary mb-2 text-xl font-bold">{title}</h3>
      {/* 卡片描述 */}
      <p className="text-text-secondary mx-auto mb-6 max-w-md">{description}</p>
      {submitted ? (
        <div className="bg-success/10 text-success mx-auto max-w-sm rounded-lg px-4 py-2.5 text-sm font-medium">Successfully subscribed!</div>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-sm gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-border bg-surface text-text-primary placeholder:text-text-secondary focus:border-accent focus:ring-accent/20 flex-1 rounded-lg border px-4 py-2.5 text-sm focus:ring-2 focus:outline-none"
          />
          {/* 卡片变体订阅按钮，邮箱为空时禁用 */}
          <button
            type="submit"
            disabled={!email.trim()}
            className="bg-accent hover:bg-accent-hover rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
};

export default Newsletter;
