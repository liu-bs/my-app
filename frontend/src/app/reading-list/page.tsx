/**
 * @file page.tsx
 * @description 阅读列表页面：作为兼容性入口，将访问重定向到收藏页对应的阅读列表 Tab
 */
import { redirect } from "next/navigation";

/**
 * 阅读列表页面
 * 直接重定向到收藏页并切到 reading-list Tab
 * @returns 不渲染任何内容，触发服务端重定向
 */
export default function ReadingListPage() {
  redirect("/favorites?tab=reading-list");
}
