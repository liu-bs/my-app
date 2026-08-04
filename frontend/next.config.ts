import type { NextConfig } from 'next';

/** 可选加载 @next/bundle-analyzer（需先安装：pnpm add -D @next/bundle-analyzer） */
const withBundleAnalyzer = (config: NextConfig): NextConfig => {
  if (process.env.ANALYZE !== 'true') return config;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const analyzer = require('@next/bundle-analyzer');
    return analyzer({ enabled: true })(config);
  } catch {
    console.warn('[next.config] @next/bundle-analyzer 未安装，跳过 bundle 分析。安装：pnpm add -D @next/bundle-analyzer');
    return config;
  }
};

const nextConfig: NextConfig = {
  transpilePackages: ['@my-app/shared'],
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
