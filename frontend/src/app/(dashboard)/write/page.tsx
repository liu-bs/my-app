/**
 * @file page.tsx
 * @description 写文章页服务端入口，鉴权后渲染客户端编辑器
 */
import { getCurrentUser } from '@/services/auth/server';
import { WriteEditor } from './_components/WriteEditor';

/**
 * 写文章/编辑文章页
 * @description 服务端鉴权，已登录渲染 WriteEditor 客户端组件
 */
export default async function WritePage() {
  const user = await getCurrentUser();

  if (!user) return null;

  return <WriteEditor />;
}
