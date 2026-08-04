/**
 * @file auth.seed.data.ts
 * @description auth 模块种子用户数据定义，用于开发环境初始化内置演示账号
 */

import type { User } from '@my-app/shared';
import { env } from '@/config';
import type { PasswordService } from '../services/password.service.ts';

/**
 * 获取 auth 模块种子用户数据
 * @param passwordService 密码服务实例
 * @returns 种子用户数组
 */
export async function getSeedUsers(passwordService: PasswordService): Promise<User[]> {
  // 使用环境变量中的种子密码进行哈希
  const passwordHash = await passwordService.hash(env.SEED_PASSWORD);

  return [
    {
      id: 'user-alex-chen',
      email: 'alex.chen@example.com',
      password: passwordHash,
      firstName: 'Alex',
      lastName: 'Chen',
      username: 'alexchen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      coverImage:
        'https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?w=1200&h=400&fit=crop',
      bio: 'Senior Frontend Engineer passionate about React and modern web development. Sharing my learnings and experiences in the tech industry.',
      location: 'San Francisco, CA',
      website: 'https://alexchen.dev',
      joined: 'March 2021',
      role: 'Senior Frontend Engineer',
      company: 'TechCorp',
      verified: true,
      disabled: false,
      tags: ['React', 'TypeScript', 'Next.js', 'Frontend', 'Engineering'],
      social: { twitter: '@alexchen', github: 'alexchen', linkedin: 'alexchen' },
      stats: { articles: 48, likes: 45200, views: 1200000 },
      createdAt: '2021-03-15T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      tokenVersion: 0,
      appearance: { theme: 'system', fontSize: 'medium' },
      likedArticles: [],
      favoritedArticles: [],
    },
    {
      id: 'user-sarah-miller',
      email: 'sarah.miller@example.com',
      password: passwordHash,
      firstName: 'Sarah',
      lastName: 'Miller',
      username: 'sarahmiller',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=400&fit=crop',
      bio: 'Product Designer with a background in psychology and visual arts. Creating meaningful digital experiences.',
      location: 'New York, NY',
      website: 'https://sarahmiller.design',
      joined: 'June 2020',
      role: 'Product Designer',
      company: 'DesignStudio',
      verified: true,
      disabled: false,
      tags: ['Design', 'UI/UX', 'Figma', 'Product Design'],
      social: { twitter: '@sarahmiller', github: 'sarahmiller', linkedin: 'sarahmiller' },
      stats: { articles: 32, likes: 28400, views: 890000 },
      createdAt: '2020-06-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      tokenVersion: 0,
      appearance: { theme: 'system', fontSize: 'medium' },
      likedArticles: [],
      favoritedArticles: [],
    },
  ];
}
