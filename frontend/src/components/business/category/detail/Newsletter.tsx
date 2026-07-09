/**
 * @file Newsletter.tsx
 * @description 分类详情页邮件订阅组件，封装通用 Newsletter 并预设分类场景的标题与描述
 */
import Newsletter from "@/components/common/Newsletter";

/**
 * 分类场景邮件订阅组件
 * @returns 渲染分类详情页底部订阅卡片，预设 variant="card" 样式
 */
const CategoryNewsletter = () => {
  // 复用通用 Newsletter 组件，预设分类订阅场景的标题、描述与卡片变体
  return <Newsletter title="Stay Updated" description="Get the latest articles in this category delivered straight to your inbox. No spam, unsubscribe anytime." variant="card" />;
};

export default CategoryNewsletter;
