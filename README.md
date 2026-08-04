# My App — 多作者中文技术写作平台

基于 Next.js 16 App Router 的全栈博客平台，支持多作者注册、Markdown 写作、点赞收藏、评论互动，采用 pnpm monorepo 结构。

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Next.js 16 + React 19 | App Router，Server Components + Client Islands |
| 语言 | TypeScript 5 (strict) | 全栈类型安全 |
| 样式 | Tailwind CSS v4 | @theme token 系统，自定义组件库 |
| 状态管理 | TanStack React Query 5 | SSR 安全单例，服务端状态缓存 |
| 主题 | next-themes | 明/暗主题切换 |
| Markdown | marked + highlight.js + sanitize-html | 渲染 + 代码高亮 + XSS 防护 |
| 认证 | JWT (httpOnly Cookie) + bcryptjs | tokenVersion 机制支持登出/改密使旧 Token 失效 |
| 校验 | Zod 4 | 请求参数验证 |
| 数据存储 | KV 抽象层 | 开发环境内存 Mock，生产环境 Upstash Redis |
| 包管理 | pnpm workspace | monorepo（frontend + shared） |
| 部署 | Netlify | @netlify/plugin-nextjs |
| Lint/Format | ESLint 9 + Prettier 3 | 统一代码风格 |

## Monorepo 结构

```
my-app/
├── frontend/               # Next.js 全栈应用
│   ├── src/
│   │   ├── app/            # App Router 页面 + API 路由
│   │   ├── components/      # UI 组件 + 布局组件 + 功能组件
│   │   ├── services/        # 前端服务层（api.ts + hooks.ts）
│   │   ├── lib/             # 工具函数（request, format, markdown, sanitize）
│   │   ├── config/          # 站点配置、Query 缓存配置
│   │   ├── server/          # 后端模块（DI 容器、Service、Repository、KV）
│   │   └── proxy.ts         # Edge 中间件（路由守卫）
│   ├── next.config.ts
│   └── .env.example
├── shared/                 # 前后端共享类型包 (@my-app/shared)
│   └── types/
│       ├── common.ts       # ApiResponse<T>
│       ├── user.ts         # User, SafeUser, RegisterDto, LoginDto, ...
│       ├── blog.ts         # Post, CreatePostDto, PostListParams, ...
│       ├── comment.ts      # Comment, CreateCommentDto, ...
│       ├── ui.ts           # 组件 Props 类型
│       ├── backend/        # 服务接口定义
│       └── frontend/       # 前端专用类型
├── scripts/dev.sh          # 开发启动脚本
├── netlify.toml            # Netlify 部署配置
└── pnpm-workspace.yaml
```

## 快速开始

### 环境要求

- Node.js >= 20
- pnpm >= 9

### 安装与运行

```bash
# 安装依赖
pnpm install

# 复制环境变量模板
cp frontend/.env.example frontend/.env.local

# 启动开发服务器（默认 http://localhost:3000）
pnpm dev
```

### 环境变量

| 变量 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `JWT_SECRET` | 生产环境 | 随机生成 | JWT 签名密钥（>= 32 字符） |
| `NEXT_PUBLIC_BASE_URL` | 是 | — | 站点 URL（SEO 用） |
| `KV_URL` 或 `UPSTASH_REDIS_REST_URL` | 生产环境 | — | Upstash Redis 连接地址 |
| `KV_REST_API_TOKEN` 或 `UPSTASH_REDIS_REST_TOKEN` | 生产环境 | — | Upstash Redis Token |
| `JWT_EXPIRES_IN` | 否 | `7d` | JWT 过期时间 |
| `BCRYPT_SALT_ROUNDS` | 否 | `10` | bcrypt 加盐轮数 |
| `COOKIE_MAX_AGE_MS` | 否 | `604800000` (7天) | Cookie 最大存活时间 |

> 开发环境下不配置 Redis 变量时，自动使用内存 Mock 存储，零配置即可启动。

## 常用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm start` | 启动生产服务器 |
| `pnpm lint` | 代码检查 |
| `pnpm lint:fix` | 自动修复 lint 问题 |
| `pnpm format` | Prettier 格式化 |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm check` | lint + typecheck 一起跑 |
| `pnpm clean` | 清理构建产物 |

## 页面路由

| 路由 | 渲染方式 | 鉴权 | 说明 |
|------|---------|------|------|
| `/` | SSR | 公开 | 首页 Hero + 最新文章 |
| `/posts` | SSR (revalidate 60s) | 公开 | 文章列表，支持分页/搜索/分类/标签筛选 |
| `/posts/[id]` | SSR (force-dynamic) | 公开 | 文章详情，含 TOC、点赞/收藏、评论区、上下篇导航 |
| `/login` | Client | 公开 | 登录页 |
| `/register` | Client | 公开 | 注册页 |
| `/profile` | SSR | 需登录 | 个人中心（我的文章 + 我的收藏） |
| `/settings` | SSR | 需登录 | 账号设置（资料编辑 + 修改密码） |
| `/write` | SSR -> Client | 需登录 | Markdown 编辑器（写文章/编辑文章） |
| `/components` | SSR | 公开 | 组件库展示页 |

## 架构要点

### 三层认证机制

1. **Edge Proxy 中间件** (`proxy.ts`) — 拦截浏览器请求，检查 `auth_token` cookie，受保护路由未登录时 302 重定向至 `/login`
2. **Server Component 鉴权** (`services/auth/server.ts`) — `getCurrentUser()` 通过 React `cache()` 实现请求内去重
3. **API 路由守卫** (`server/modules/auth/auth.guard.ts`) — `requireAuth()` 强制认证 / `tryAuth()` 可选认证

### Token 机制

- JWT payload: `{ id, email, tokenVersion }`
- 两个 Cookie：`auth_token`（httpOnly，真实 JWT）+ `auth_status`（前端可读，值为 `'1'`）
- 登出/修改密码时 `tokenVersion++`，使所有已签发 Token 失效
- 客户端请求层遇 401 时自动刷新 Token 并重试

### 服务端分层架构

```
API Route Handler
    ↓
Service (业务逻辑)
    ↓
Repository (数据访问)
    ↓
KV Store (KVDocumentStore / KVRepository)
    ↓
KV Adapter (MockKV 内存 | UpstashKVAdapter Redis)
```

- 依赖注入容器挂载于 `globalThis`，在 Serverless 冷启动后保持状态
- 博客数据为单一 `blog:db` JSON 文档，带 3 次重试的读取-修改-写入
- 用户和评论使用 Redis Hash 存储

### 统一 API 响应格式

```typescript
// 成功
{ "code": 0, "data": T, "message": "操作成功" }

// 错误
{ "code": 401, "data": null, "message": "未授权，请先登录", "details"?: [...] }
```

### 安全特性

- **XSS 防护**：sanitize-html 白名单 + isomorphic-dompurify 双重消毒
- **SSRF 防护**：封面图片 URL 校验
- **CSP / 安全 Headers**：next.config.ts 配置 Content-Security-Policy、HSTS、X-Frame-Options 等
- **密码安全**：bcryptjs 哈希存储
- **限流**：登录/注册接口 5 次/5 分钟（按 IP）
- **httpOnly Cookie**：前端 JS 不可读 Token

### 设计系统

- 采用 CSS 设计令牌系统（`styles/tokens.css`），定义颜色/圆角/阴影/字体/动画变量
- 字体：Inter（拉丁）+ Noto Sans SC（中文），通过 next/font 加载
- 代码高亮：highlight.js 自定义主题（明/暗适配）
- WCAG AA 无障碍性：对比度校准、键盘导航、焦点可见

## 部署

### Netlify 部署

项目内置 `netlify.toml` 配置：

```toml
[build]
  command = "pnpm install --frozen-lockfile && pnpm --filter ./frontend build"
  publish = "frontend/.next"
```

部署前需在 Netlify 环境变量中配置：
- `JWT_SECRET`（>= 32 字符）
- `NEXT_PUBLIC_BASE_URL`
- Upstash Redis 凭据（`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`）

## 相关文档

- [前端架构文档](frontend/README.md)
- [设计系统规范](frontend/DESIGN.md)
- [产品规格](frontend/PRODUCT.md)
- [API 接口文档](API.md)
- [AI 代理指令](AGENTS.md)

## License

Private
