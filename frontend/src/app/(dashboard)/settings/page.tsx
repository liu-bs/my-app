/**
 * @file page.tsx
 * @description 账号设置页，服务端入口组件，获取用户数据后委托给客户端表单
 */
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { getCurrentUser } from '@/services/auth/server';
import { SettingsForm } from './_components/SettingsForm';

/**
 * 账号设置页
 * @description 服务端获取用户数据，传给客户端表单组件渲染
 */
export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  return (
    <Container className="page-section">
      <PageHeader title="账号设置" subtitle="管理你的个人资料、密码与安全设置。" />
      <SettingsForm user={user} />
    </Container>
  );
}
