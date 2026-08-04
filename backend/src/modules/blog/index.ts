/**
 * @file index.ts
 * @description blog 模块对外统一出口，re-export 工厂函数与模块类型供外部消费
 */

export { createBlogModule } from '@/modules/blog/blog.module.ts';
