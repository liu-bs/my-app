# Frontend — 多作者中文技术写作平台

基于 Next.js 16 (App Router) + React 19 + TailwindCSS v4 + React Query 5 构建的前端应用。

## 快速开始

### 环境要求

- Node.js >= 20
- pnpm >= 10

### 环境变量

在 `frontend/` 目录下创建 `.env.local`：

```bash
# 站点基础 URL（用于 SEO metadata、sitemap、robots）
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 后端服务地址（SSR 时服务端组件直接请求后端）
BACKEND_URL=http://localhost:3001
```

### 启动开发

```bash
# 在项目根目录
pnpm dev:frontend      # 仅启动前端
pnpm dev:all           # 同时启动前后端
```

前端默认运行在 `http://localhost:3000`。

### 构建与检查

```bash
pnpm build             # 生产构建
pnpm typecheck         # TypeScript 类型检查
pnpm lint              # ESLint 检查
pnpm lint:fix          # ESLint 自动修复
pnpm format            # Prettier 格式化
pnpm format:check      # Prettier 格式化检查
```

## 技术栈

| 技术                  | 版本      | 用途                               |
| --------------------- | --------- | ---------------------------------- |
| Next.js               | 16        | App Router、SSR、Proxy 中间件      |
| React                 | 19        | Server Components + Client Islands |
| TailwindCSS           | 4         | 原子化 CSS，@theme 令牌系统        |
| React Query           | 5         | 服务端状态管理（SSR 安全单例）     |
| next-themes           | 0.4       | 明暗主题切换                       |
| react-hot-toast       | 2         | 全局消息提示                       |
| lucide-react          | 1         | 图标库                             |
| marked + highlight.js | -         | Markdown 渲染 + 代码高亮           |
| @my-app/shared        | workspace | 前后端共享类型                     |

## 目录结构

```
frontend/src/
  app/                    # Next.js App Router
    (auth)/               # 认证路由组（登录/注册）
    (dashboard)/          # 仪表盘路由组（需登录）
    posts/                # 文章列表与详情
    layout.tsx            # 根布局
  components/
    ui/                   # 通用 UI 组件库（Button/Input/Modal 等）
    layout/               # 布局组件（Navbar/Footer）
    providers.tsx         # Provider 聚合层
  config/                 # 站点配置
  hooks/                  # 通用 Hooks
  lib/
    api/request.ts        # 同构请求层（Cookie 鉴权/401 刷新）
    format.ts             # 格式化工具
    markdown.ts           # Markdown/HTML 处理工具
    query-client.ts       # QueryClient 工厂
    toast.ts              # Toast 封装
  services/               # 业务模块层
    auth/                 # 认证（api/hooks/server）
    blog/                 # 博客（api/hooks）
    comment/              # 评论（api/hooks）
  proxy.ts                # Next.js 16 Proxy（API 代理 + 路由守卫）
  app/styles/             # 样式分层
    tokens.css            # 设计令牌（原始色阶 → 语义令牌）
    base.css              # 基础重置
    typography.css        # 排版
    components.css        # 组件样式
    animations.css        # 动画
    hljs-theme.css        # 代码高亮主题
```

## 架构要点

### Server Component + Client Island

页面级使用 Server Component（SSR 数据获取），交互部分提取为 `'use client'` 组件。例如文章详情页：

- `page.tsx` (Server) → 获取文章数据、用户信息
- `PostActions` / `CommentsSection` / `PostToc` (Client) → 交互孤岛

### 鉴权架构

三层鉴权：

1. **Edge Proxy** (`proxy.ts`) — 路由守卫 + API 同源代理
2. **Server Component** (`services/auth/server.ts`) — 服务端获取当前用户
3. **Client Hook** (`services/auth/hooks.ts`) — 客户端鉴权状态

### 请求层

`lib/api/request.ts` 提供同构请求：

- 客户端用相对 `/api`（由 Proxy 转发）
- 服务端用绝对 `BACKEND_URL`
- HttpOnly Cookie 鉴权 + 401 自动刷新

### 类型安全

`@my-app/shared` 包导出前后端共享的类型定义：

- API 契约类型（Post / User / Comment 等）
- UI 组件 Props 类型（ButtonProps / TagProps 等）
- 后端服务接口（BlogService / AuthService 等）

## 设计系统

详见 [DESIGN.md](./DESIGN.md)。

核心原则：

- 中性灰阶为主，四色点缀仅作信号
- 双声部字体：sans 正文+标题 / mono 代码
- 明暗双主题独立校准对比度（WCAG AA）
- 4px 间距网格，12 档字号尺度
