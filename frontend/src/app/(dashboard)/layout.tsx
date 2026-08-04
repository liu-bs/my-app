/**
 * @file layout.tsx
 * @description dashboard 路由组共享布局，统一服务端鉴权守卫
 *              profile/settings/write 三个页面均需登录，未登录时渲染 LoginRequired
 */
import { UserCircle } from 'lucide-react';
import { LoginRequired } from '@/components/LoginRequired';
import { getCurrentUser } from '@/services/auth/server';
import { headers } from 'next/headers';

/**
 * dashboard 路由组布局
 * @description 服务端鉴权，未登录渲染引导组件，已登录直接渲染子页面
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    /** 当前请求路径，用于登录后重定向 — 从 referer 提取路径部分 */
    const headerList = await headers();
    const referer = headerList.get('referer') || '';
    let redirectPath = '/profile';
    if (referer) {
      try {
        const url = new URL(referer);
        redirectPath = url.pathname;
      } catch {
        // referer 不是有效 URL，使用默认值
      }
    }

    return (
      <LoginRequired
        redirect={redirectPath}
        icon={<UserCircle size={20} />}
        description="登录后即可访问你的个人中心、写文章和账号设置"
      />
    );
  }

  return <>{children}</>;
}
