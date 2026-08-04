/**
 * @file page.tsx
 * @description 组件库展示页，展示通用 UI 组件效果及项目路由清单，供开发参照
 */
import {
  AlertCircle,
  CheckCircle2,
  Info,
  ShieldAlert,
  Search,
  Mail,
  Lock,
  User,
  PenLine,
  ChevronRight,
  Home,
  BookOpen,
  FileText as FileTextIcon,
  User as UserIcon,
  Layers,
  LogIn,
  UserPlus,
  Pencil,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Avatar } from '@/components/ui/Avatar';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { FormField } from '@/components/ui/FormField';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatsGrid } from '@/components/ui/StatsGrid';
import { PasswordDemo } from './_PasswordDemo';
import type { DemoSectionProps, DemoRowProps } from '@my-app/shared';

/**
 * DemoSection 演示区块
 * @param props {@link DemoSectionProps}
 */
function DemoSection({ title, children }: DemoSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="filter-heading mb-4">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

/**
 * DemoRow 演示行
 * @param props {@link DemoRowProps}
 */
function DemoRow({ label, children }: DemoRowProps) {
  return (
    <div className="card card-hover p-4">
      <p className="filter-heading mb-2">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

/** 项目路由清单元数据 */
const ROUTES = [
  {
    path: '/',
    title: '首页',
    description: 'Hero 宣传区 · 品牌故事 · CTA 入口',
    type: 'page' as const,
    auth: false,
    dynamic: false,
    icon: <Home size={14} />,
  },
  {
    path: '/posts',
    title: '文章列表',
    description: '分类/标签筛选 · 搜索 · 分页 · 草稿切换',
    type: 'page' as const,
    auth: false,
    dynamic: false,
    icon: <BookOpen size={14} />,
  },
  {
    path: '/posts/[id]',
    title: '文章详情',
    description: '正文排版 · TOC 目录 · 点赞 · 评论区',
    type: 'page' as const,
    auth: false,
    dynamic: true,
    icon: <FileTextIcon size={14} />,
  },
  {
    path: '/profile',
    title: '个人中心',
    description: '资料卡 · 文章管理（草稿/已发布） · 收藏列表',
    type: 'page' as const,
    auth: true,
    dynamic: false,
    icon: <UserIcon size={14} />,
  },
  {
    path: '/components',
    title: '组件库',
    description: '通用 UI 组件展示 · 路由清单 · 全局设计参照',
    type: 'page' as const,
    auth: false,
    dynamic: false,
    icon: <Layers size={14} />,
  },
  {
    path: '/login',
    title: '登录',
    description: '邮箱 + 密码登录 · 错误校验 · 5 分钟限频提示',
    type: 'form' as const,
    auth: false,
    dynamic: false,
    icon: <LogIn size={14} />,
  },
  {
    path: '/register',
    title: '注册',
    description: '5 字段注册表单 · 密码强度 · 实时状态反馈',
    type: 'form' as const,
    auth: false,
    dynamic: false,
    icon: <UserPlus size={14} />,
  },
  {
    path: '/write',
    title: '写文章',
    description: '标题 / 分类 / 标签 / 正文 · 编辑预览双模式',
    type: 'form' as const,
    auth: true,
    dynamic: false,
    icon: <Pencil size={14} />,
  },
  {
    path: '/settings',
    title: '账号设置',
    description: '个人资料 Tab · 修改密码 Tab · 实时校验',
    type: 'form' as const,
    auth: true,
    dynamic: false,
    icon: <SettingsIcon size={14} />,
  },
];

/**
 * 组件库展示页
 * @description 展示所有通用 UI 组件效果及项目路由清单
 */
export default function ComponentsPage() {
  return (
    <Container className="page-section">
      <PageHeader
        title="组件库"
        subtitle="所有通用组件展示，确保全局 UI 一致性。"
        className="anim-fade-up stagger-1"
      />

      {/* Buttons */}
      <DemoSection title="Buttons">
        <DemoRow label="Primary">
          <Button>主要按钮</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </DemoRow>
        <DemoRow label="Ghost">
          <Button variant="ghost">Ghost</Button>
          <Button variant="ghost" size="sm">
            Small
          </Button>
        </DemoRow>
        <DemoRow label="Outline">
          <Button variant="outline">Outline</Button>
          <Button variant="outline" size="sm">
            Small
          </Button>
        </DemoRow>
        <DemoRow label="Danger">
          <Button variant="danger">Danger</Button>
          <Button variant="danger" size="sm">
            Small
          </Button>
        </DemoRow>
      </DemoSection>

      {/* Avatar */}
      <DemoSection title="Avatar">
        <DemoRow label="Sizes">
          <Avatar initials="AC" size="xs" />
          <Avatar initials="AC" size="sm" />
          <Avatar initials="AC" size="md" />
          <Avatar initials="AC" size="lg" />
          <Avatar initials="AC" size="xl" />
        </DemoRow>
      </DemoSection>

      {/* Spinner */}
      <DemoSection title="Spinner">
        <DemoRow label="Spinner">
          <Spinner size="sm" />
          <Spinner size="md" />
        </DemoRow>
      </DemoSection>

      {/* Tag */}
      <DemoSection title="Tag">
        <DemoRow label="Variants">
          <Tag variant="ink">Ink</Tag>
          <Tag variant="ember">Ember</Tag>
          <Tag variant="crimson">Crimson</Tag>
          <Tag variant="slate">Slate</Tag>
        </DemoRow>
        <DemoRow label="Sizes">
          <Tag variant="ink" size="sm">
            Small
          </Tag>
          <Tag variant="ink" size="md">
            Medium
          </Tag>
        </DemoRow>
      </DemoSection>

      {/* Alert */}
      <DemoSection title="Alert">
        <div className="flex w-full flex-col gap-3">
          <Alert variant="info" icon={<Info size={16} />} visible>
            这是一条普通信息提示。
          </Alert>
          <Alert variant="success" icon={<CheckCircle2 size={16} />} visible>
            操作已成功完成。
          </Alert>
          <Alert variant="warning" icon={<ShieldAlert size={16} />} visible>
            请注意，此操作有一定风险。
          </Alert>
          <Alert variant="error" icon={<AlertCircle size={16} />} visible>
            发生错误，请稍后重试。
          </Alert>
        </div>
      </DemoSection>

      {/* PasswordStrength */}
      <DemoSection title="PasswordStrength">
        <DemoRow label="Demo">
          <PasswordDemo />
        </DemoRow>
      </DemoSection>

      {/* FormField */}
      <DemoSection title="FormField">
        <div className="flex w-full max-w-100 flex-col gap-4">
          <FormField label="邮箱" required>
            <Input leftIcon={<Mail size={18} />} placeholder="user@example.com" />
          </FormField>
          <FormField label="密码" hint="至少 6 位" required>
            <Input type="password" leftIcon={<Lock size={18} />} placeholder="输入密码" />
          </FormField>
          <FormField label="用户名" error="用户名已被占用">
            <Input leftIcon={<User size={18} />} placeholder="输入用户名" error />
          </FormField>
        </div>
      </DemoSection>

      {/* EmptyState */}
      <DemoSection title="EmptyState">
        <div className="w-full max-w-125">
          <EmptyState
            icon={<Search size={20} />}
            title="暂无数据"
            description="当前没有符合条件的记录"
            action={<Button size="sm">刷新</Button>}
          />
        </div>
      </DemoSection>

      {/* PageHeader */}
      <DemoSection title="PageHeader">
        <div className="flex w-full flex-col gap-4">
          <DemoRow label="Default">
            <PageHeader title="页面标题" subtitle="页面副标题说明文字" />
          </DemoRow>
          <DemoRow label="With actions">
            <PageHeader
              title="我的文章"
              subtitle="管理你的文章草稿与已发布内容。"
              actions={
                <Button size="sm">
                  <PenLine size={14} />
                  写文章
                </Button>
              }
            />
          </DemoRow>
        </div>
      </DemoSection>

      {/* StatsGrid */}
      <DemoSection title="StatsGrid">
        <DemoRow label="Demo">
          <StatsGrid
            items={[
              { label: '文章', value: '128' },
              { label: '获赞', value: '1.2k' },
              { label: '阅读', value: '8.5k' },
            ]}
          />
        </DemoRow>
      </DemoSection>

      {/* Routes Manifest */}
      <DemoSection title="Routes Manifest">
        <div className="w-full">
          <details className="route-manifest card transition-shadow duration-200 ease-out open:shadow-md [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 select-none">
              <div className="flex items-center gap-3">
                <div className="bg-surface text-heading inline-flex h-9 w-9 items-center justify-center rounded-lg">
                  <Layers size={16} />
                </div>
                <div className="text-left">
                  <p className="text-heading m-0 text-(length:--type-base) font-semibold">
                    项目路由清单
                  </p>
                  <p className="text-muted m-0 mt-0.5 text-(length:--type-xs)">
                    共 {ROUTES.length} 条路由 · 点击展开查看详情
                  </p>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-faint transition-transform duration-300 ease-out"
                aria-hidden
              />
            </summary>
            <div className="route-manifest-content border-stroke animate-fade-in border-t">
              {/* 统计概览 */}
              <div className="divide-stroke border-stroke grid grid-cols-3 divide-x border-b max-sm:grid-cols-1 max-sm:divide-x-0 max-sm:divide-y">
                <div className="flex flex-col items-center gap-1 px-4 py-3">
                  <span className="text-heading text-(length:--type-2xl) font-bold">
                    {ROUTES.length}
                  </span>
                  <span className="text-muted text-(length:--type-xs)">总路由</span>
                </div>
                <div className="flex flex-col items-center gap-1 px-4 py-3">
                  <span className="text-heading text-(length:--type-2xl) font-bold">
                    {ROUTES.filter((r) => r.type === 'page').length}
                  </span>
                  <span className="text-muted text-(length:--type-xs)">页面路由</span>
                </div>
                <div className="flex flex-col items-center gap-1 px-4 py-3">
                  <span className="text-heading text-(length:--type-2xl) font-bold">
                    {ROUTES.filter((r) => r.auth).length}
                  </span>
                  <span className="text-muted text-(length:--type-xs)">需登录</span>
                </div>
              </div>

              {/* 路由列表 */}
              <ul className="m-0 list-none p-2">
                {ROUTES.map((r) => (
                  <li
                    key={r.path}
                    className="route-item hover:bg-surface flex flex-wrap items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150"
                  >
                    <span
                      className="bg-page text-faint inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      aria-hidden
                    >
                      {r.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <code className="text-heading border-stroke bg-surface truncate rounded-md border px-2 py-0.5 font-mono text-(length:--type-sm) font-medium">
                          {r.path}
                        </code>
                        <span className="text-heading text-(length:--type-base) font-medium">
                          {r.title}
                        </span>
                        {r.auth && (
                          <Tag variant="crimson" size="sm">
                            需登录
                          </Tag>
                        )}
                        {r.dynamic && (
                          <Tag variant="ember" size="sm">
                            动态
                          </Tag>
                        )}
                      </div>
                      <p className="text-muted m-0 mt-1 text-(length:--type-xs)">{r.description}</p>
                    </div>
                    <span className="border-stroke bg-page text-muted shrink-0 rounded-md border px-2 py-0.5 text-(length:--type-2xs) font-medium">
                      {r.type === 'page' ? '页面' : '表单'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      </DemoSection>
    </Container>
  );
}
