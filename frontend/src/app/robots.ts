import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login', '/register', '/write', '/settings', '/profile', '/components', '/api'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
