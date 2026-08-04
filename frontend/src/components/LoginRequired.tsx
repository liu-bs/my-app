/**
 * @file LoginRequired.tsx
 * @description 未登录引导组件，展示登录提示并引导跳转登录页
 */
import type { ReactNode } from 'react';
import { Container } from './ui/Container';
import { EmptyState } from './ui/EmptyState';
import { Button } from './ui/Button';

interface LoginRequiredProps {
  /** 登录后重定向路径 */
  redirect: string;
  /** 提示图标 */
  icon: ReactNode;
  /** 提示描述文案 */
  description: string;
}

/**
 * LoginRequired 未登录引导
 * @param props {@link LoginRequiredProps}
 */
export function LoginRequired({ redirect, icon, description }: LoginRequiredProps) {
  return (
    <Container className="page-section">
      <EmptyState
        icon={icon}
        title="请先登录"
        description={description}
        action={
          <Button href={`/login?redirect=${redirect}`} variant="ghost" size="sm">
            去登录
          </Button>
        }
      />
    </Container>
  );
}
