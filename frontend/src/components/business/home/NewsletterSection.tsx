/**
 * @file NewsletterSection.tsx
 * @description 首页"订阅邮件"区块，包装通用 Newsletter 组件呈现
 */

"use client";

import Newsletter from "@/components/common/Newsletter";

/**
 * 邮件订阅区块
 * 使用通用 Newsletter 组件的 "section" 变体作为首页底部订阅入口
 * @returns {JSX.Element} 邮件订阅视图
 */
export default function NewsletterSection() {
  return (
    // 通用订阅组件，section 变体用于首页底部展示
    <Newsletter
      // 订阅区主标题
      title="Stay in the Loop"
      // 订阅区副标题说明
      description="Get the latest articles, insights, and resources delivered straight to your inbox. No spam, unsubscribe anytime."
      // 渲染变体：区块级（区别于侧边栏等紧凑样式）
      variant="section"
      // 展示当前订阅者数量（"5,000+" 形式）
      subscriberCount="5,000+"
    />
  );
}
