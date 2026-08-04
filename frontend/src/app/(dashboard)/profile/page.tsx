/**
 * @file page.tsx
 * @description 个人中心页，聚合个人资料、我的文章、我的收藏三个模块
 */
import { MapPin, Globe, Calendar, Users, Check, PenLine } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { StatsGrid } from '@/components/ui/StatsGrid';

import { getCurrentUser } from '@/services/auth/server';
import { blogApi } from '@/services/blog/api';
import { formatCount, getInitials } from '@/lib/format';
import type { Post } from '@my-app/shared';
import { ProfileTabs } from './_components/ProfileTabs';

/** Twitter 社交图标 */
function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/** GitHub 社交图标 */
function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16">
      <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.4-1.27.73-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.53 11.53 0 0 0 23.5 12C23.5 5.74 18.27.5 12 .5z" />
    </svg>
  );
}

/** LinkedIn 社交图标 */
function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

/** 元信息图标通用样式类名 */
const META_ICON = 'size-[13px] text-faint';

/**
 * 个人中心页
 * @description 聚合个人资料、我的文章、我的收藏，未登录时引导登录
 */
export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) return null;

  /** 并行获取草稿、已发布文章、收藏列表 */
  const [draftsData, publishedData, favoritesData] = await Promise.all([
    blogApi.listPosts({ draft: 'true' }).catch(() => ({ posts: [] as Post[] })),
    blogApi.listPosts({}).catch(() => ({ posts: [] as Post[] })),
    blogApi.listFavorites().catch(() => ({ posts: [] as Post[] })),
  ]);

  const drafts = draftsData.posts ?? [];
  const published = (publishedData.posts ?? []).filter((p) => !p.isDraft);
  const favorites = favoritesData.posts ?? [];

  /** 用户头像首字母缩写 */
  const userInitials = getInitials(user.firstName, user.lastName);
  /** 用户统计 */
  const stats = [
    { label: '篇文章', value: formatCount(user.stats?.articles ?? 0) },
    { label: '获赞', value: formatCount(user.stats?.likes ?? 0) },
    { label: '阅读量', value: formatCount(user.stats?.views ?? 0) },
  ];
  /** 社交链接（补充协议前缀） */
  const buildSocialUrl = (value: string | undefined, prefix: string): string | undefined => {
    if (!value) return undefined;
    return value.startsWith('http') ? value : `${prefix}${value.replace('@', '')}`;
  };
  const socialTwitter = buildSocialUrl(user.social?.twitter, 'https://twitter.com/');
  const socialGithub = buildSocialUrl(user.social?.github, 'https://github.com/');
  const socialLinkedin = buildSocialUrl(user.social?.linkedin, 'https://linkedin.com/in/');
  const hasSocial = !!(socialTwitter || socialGithub || socialLinkedin);

  return (
    <Container className="page-section">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
        {/* 左侧：资料卡（sticky） */}
        <aside className="anim-fade-up stagger-1">
          <div className="sticky top-20">
            <section className="card overflow-hidden rounded-2xl shadow-sm">
              {/* 顶部渐变 banner */}
              <div
                className="h-16 w-full"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-surface), var(--color-stroke-strong))',
                }}
              />
              <div className="px-5 pb-5">
                {/* 头像：半悬浮在 banner 上 */}
                <div className="-mt-8">
                  <Avatar
                    initials={userInitials}
                    src={user.avatar || undefined}
                    size="lg"
                    className="border-card-bg border-[3px]"
                  />
                </div>

                {/* 姓名 + 认证 + 用户名 */}
                <div className="mt-3">
                  <div className="row-sm flex-wrap">
                    <h1 className="text-heading m-0 text-(length:--type-lg) leading-tight font-bold tracking-[-0.02em]">
                      {user.firstName} {user.lastName}
                    </h1>
                    {user.verified && (
                      <span
                        className="bg-accent text-page inline-flex h-4 w-4 items-center justify-center rounded-full"
                        title="已认证"
                      >
                        <Check size={10} />
                      </span>
                    )}
                  </div>
                  <p className="text-faint m-0 mt-0.5 text-(length:--type-xs) leading-normal">
                    @{user.username}
                  </p>
                </div>

                {/* 简介 */}
                <p className="text-body mt-3 text-(length:--type-sm) leading-relaxed">
                  {user.bio || '暂无简介'}
                </p>

                {/* 技能标签 */}
                {user.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {user.tags.map((t) => (
                      <span key={t} className="chip-outline">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* 元信息：位置/网站/日期/角色，竖排紧凑 */}
                <div className="text-body mt-4 space-y-1 text-(length:--type-xs) leading-normal">
                  {user.location && (
                    <span className="row-sm">
                      <MapPin className={META_ICON} />
                      {user.location}
                    </span>
                  )}
                  {user.website && (
                    <span className="row-sm">
                      <Globe className={META_ICON} />
                      {user.website}
                    </span>
                  )}
                  {user.joined && (
                    <span className="row-sm">
                      <Calendar className={META_ICON} />
                      {user.joined}
                    </span>
                  )}
                  <span className="row-sm">
                    <Users className={META_ICON} />
                    {user.role}
                    {user.company ? ` · ${user.company}` : ''}
                  </span>
                </div>

                {/* 社交链接 */}
                {hasSocial && (
                  <div className="row-sm mt-4">
                    {socialTwitter && (
                      <a
                        href={socialTwitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                        className="icon-btn"
                      >
                        <TwitterIcon />
                      </a>
                    )}
                    {socialGithub && (
                      <a
                        href={socialGithub}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="icon-btn"
                      >
                        <GithubIcon />
                      </a>
                    )}
                    {socialLinkedin && (
                      <a
                        href={socialLinkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="icon-btn"
                      >
                        <LinkedinIcon />
                      </a>
                    )}
                  </div>
                )}

                {/* 统计栏 */}
                <div className="mt-4">
                  <StatsGrid items={stats} />
                </div>

                {/* 操作按钮：横排 */}
                <div className="row-sm mt-4">
                  <Button href="/settings" size="sm" className="flex-1">
                    编辑资料
                  </Button>
                  <Button href="/write" variant="ghost" size="sm" className="flex-1">
                    <PenLine size={14} />
                    写文章
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </aside>

        {/* 右侧：Tab 内容 */}
        <ProfileTabs drafts={drafts} published={published} favorites={favorites} />
      </div>
    </Container>
  );
}
