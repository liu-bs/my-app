/** @file not-found.tsx
 * @description 404 页面，展示页面不存在提示并提供返回首页入口
 */
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <Container className="page-section">
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="display-serif text-heading mb-4 text-(length:--type-6xl) leading-tight font-bold">
          404
        </h1>
        <p className="text-muted mb-8 text-(length:--type-lg) leading-normal">
          你访问的页面不存在、已被移动，或网络异常导致加载失败。
        </p>
        <Button href="/">返回首页</Button>
      </div>
    </Container>
  );
}
