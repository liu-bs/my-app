import type { MetadataRoute } from 'next';
import { blogApi } from '@/services/blog/api';
import { SITE_URL } from '@/config/site';

/** Sitemap 每小时重新生成一次 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  // 并行获取文章、分类、标签数据
  const [postsData, categoriesData, tagsData] = await Promise.all([
    blogApi.listPosts({ page: 1, limit: 1000 }).catch(() => null),
    blogApi.listCategories().catch(() => ({ categories: [] })),
    blogApi.listTags().catch(() => ({ tags: [] })),
  ]);

  // 动态文章页面
  const postPages: MetadataRoute.Sitemap = (postsData?.posts ?? []).map((post) => ({
    url: `${baseUrl}/posts/${post.id}`,
    lastModified: new Date(post.updatedAt || post.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 分类页面
  const categoryPages: MetadataRoute.Sitemap = (categoriesData.categories ?? []).map((c) => ({
    url: `${baseUrl}/posts?category=${encodeURIComponent(c)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // 标签页面
  const tagPages: MetadataRoute.Sitemap = (tagsData.tags ?? []).map((t) => ({
    url: `${baseUrl}/posts?tag=${encodeURIComponent(t.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...postPages, ...categoryPages, ...tagPages];
}
