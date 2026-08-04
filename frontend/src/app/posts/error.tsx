'use client';

import { Search } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

/**
 * 文章列表页错误边界
 * @description 列表数据获取失败时展示
 */
export default function PostsError() {
  return (
    <Container className="page-section">
      <EmptyState
        icon={<Search size={20} />}
        title="文章加载失败"
        description="网络异常或服务暂时不可用，请稍后刷新页面重试"
        action={
          <Button href="/posts" variant="ghost" size="sm">
            刷新页面
          </Button>
        }
      />
    </Container>
  );
}
