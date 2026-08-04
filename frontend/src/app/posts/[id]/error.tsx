/**
 * @file error.tsx
 * @description 文章详情页错误边界，提供精准的错误提示与返回操作
 */
'use client';

import { AlertCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export default function PostDetailError() {
  return (
    <Container className="page-section">
      <EmptyState
        icon={<AlertCircle size={20} />}
        title="文章加载失败"
        description="网络异常或文章不存在，请返回列表页重试"
        action={
          <Button href="/posts" variant="ghost" size="sm">
            返回文章列表
          </Button>
        }
      />
    </Container>
  );
}
