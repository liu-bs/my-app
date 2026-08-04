# 后端 API 接口文档

> 基于 Express 5 + TypeScript，Cookie 鉴权，JSON 通信。

## 目录

- [基础约定](#基础约定)
- [系统](#系统)
- [认证模块 Auth](#认证模块-auth)
- [博客模块 Blog](#博客模块-blog)
- [评论模块 Comment](#评论模块-comment)

---

## 基础约定

### Base URL

```
http://localhost:3001/api
```

### 鉴权方式

采用 **HttpOnly Cookie** 鉴权，登录成功后服务端下发两个 Cookie：

| Cookie        | 说明                                          | 可读性                 |
| ------------- | --------------------------------------------- | ---------------------- |
| `auth_token`  | JWT 凭证（含 user id / email / tokenVersion） | HttpOnly，前端不可读   |
| `auth_status` | 登录态标志（值为 `1`）                        | 前端可读，用于 UI 判断 |

- 所有需要鉴权的接口要求请求携带 `auth_token` Cookie，否则返回 `401`。
- 登出 / 修改密码会清除 Cookie 并使旧 Token 失效（tokenVersion +1）。
- 前端调用需配置 `credentials: 'include'`。

### 统一响应格式

**成功响应**（HTTP 2xx）：

```json
{
  "code": 0,
  "data": <T | null>,
  "message": "操作成功"
}
```

**错误响应**（HTTP 4xx / 5xx）：

```json
{
  "code": 400,
  "message": "错误描述",
  "details": [{ "path": "email", "message": "邮箱格式不正确" }]
}
```

> `details` 仅在参数校验失败（400）时附带，列出每个字段的校验错误。

### 错误码

| HTTP 状态码 | 含义         | 触发场景                                 |
| ----------- | ------------ | ---------------------------------------- |
| 400         | 参数校验失败 | 请求体不符合 zod schema                  |
| 401         | 未授权       | 未登录 / Token 失效                      |
| 403         | 禁止操作     | 无权操作他人资源（如非作者删文章）       |
| 404         | 资源不存在   | 文章 / 评论 / 用户不存在                 |
| 409         | 冲突         | 邮箱或用户名已注册                       |
| 413         | 请求体过大   | 请求体超出大小限制                       |
| 422         | 实体无法处理 | coverImage 非 http(s) URL 或指向内网地址 |
| 429         | 请求过于频繁 | 触发限流                                 |
| 500         | 服务器错误   | 内部异常                                 |
| 503         | 服务不可用   | 文件锁竞争失败                           |

### 限流

| 接口                                                   | 窗口    | 上限                       |
| ------------------------------------------------------ | ------- | -------------------------- |
| 全局                                                   | 15 分钟 | 10000（开发）/ 100（生产） |
| 认证类（register / login / change-password / refresh） | 5 分钟  | 1000（开发）/ 5（生产）    |

---

## 系统

### GET /api/health

健康检查。

**鉴权**：无

**响应**：

```json
{
  "status": "ok",
  "timestamp": "2026-08-03T15:30:59.512Z"
}
```

---

## 认证模块 Auth

前缀：`/api/auth`

### POST /api/auth/register

注册新用户。仅创建用户记录，不下发登录态（需显式调用 `/login`）。

**鉴权**：无（限流）

**请求体**：

| 字段      | 类型   | 必填 | 约束                        |
| --------- | ------ | ---- | --------------------------- |
| email     | string | 是   | 合法邮箱格式                |
| password  | string | 是   | 6–128 位                    |
| firstName | string | 是   | 1–50 位                     |
| lastName  | string | 是   | 1–50 位                     |
| username  | string | 是   | 3–30 位，仅字母/数字/下划线 |

**响应**（201）：

```json
{
  "code": 0,
  "data": { "user": { "id": "...", "username": "...", "email": "..." } },
  "message": "注册成功，请登录"
}
```

> 返回的 `user` 为 SafeUser（已剥离 password / tokenVersion / disabled）。

### POST /api/auth/login

登录，下发鉴权 Cookie。

**鉴权**：无（限流）

**请求体**：

| 字段     | 类型   | 必填 |
| -------- | ------ | ---- |
| email    | string | 是   |
| password | string | 是   |

**响应**（200）：

```json
{
  "code": 0,
  "data": null,
  "message": "登录成功"
}
```

**错误**：401 邮箱或密码错误；403 账号已被禁用。

### GET /api/auth/me

获取当前登录用户信息。

**鉴权**：authGuard

**响应**：

```json
{
  "code": 0,
  "data": {
    "user": { "id": "...", "email": "...", "stats": { "articles": 0, "likes": 0, "views": 0 } }
  },
  "message": "获取成功"
}
```

### POST /api/auth/logout

登出，清除 Cookie 并使 Token 失效。

**鉴权**：authGuard

**响应**：

```json
{ "code": 0, "data": null, "message": "登出成功" }
```

### POST /api/auth/change-password

修改密码。成功后清除登录态，需重新登录。

**鉴权**：authGuard（限流）

**请求体**：

| 字段            | 类型   | 必填 | 约束                           |
| --------------- | ------ | ---- | ------------------------------ |
| currentPassword | string | 是   | 非空                           |
| newPassword     | string | 是   | 6–128 位，且不能与当前密码相同 |

**响应**：

```json
{ "code": 0, "data": null, "message": "密码修改成功，请重新登录" }
```

**错误**：401 当前密码错误。

### PUT /api/auth/profile

更新个人资料。会同步更新评论中的 userName/userAvatar 和文章中的 authorName。

**鉴权**：authGuard

**请求体**（全部可选）：

| 字段      | 类型   | 约束    | 说明         |
| --------- | ------ | ------- | ------------ |
| firstName | string | ≤50 位  | 名           |
| lastName  | string | ≤50 位  | 姓           |
| avatar    | string | ≤500 位 | 头像 URL     |
| bio       | string | ≤280 位 | 简介         |
| location  | string | ≤100 位 | 所在地       |
| website   | string | ≤200 位 | 个人网站地址 |

**响应**：

```json
{
  "code": 0,
  "data": { "user": { "id": "...", "firstName": "...", "avatar": "..." } },
  "message": "资料更新成功"
}
```

### POST /api/auth/refresh

刷新 Token。验证签名（接受过期但签名有效的 Token）后下发新 Cookie。

**鉴权**：无（限流），但需携带 `auth_token` Cookie

**响应**（200）：

```json
{
  "code": 0,
  "data": { "user": { "id": "...", "email": "..." } },
  "message": "Token 已刷新"
}
```

**错误**：401 无 Token / Token 无效 / Token 无法解析 / Token 已失效（tokenVersion 不匹配）；403 账号已被禁用。

---

## 博客模块 Blog

前缀：`/api`

### GET /api/posts

获取文章列表（分页）。

**鉴权**：optional（登录后可查看自己的草稿）

**Query 参数**：

| 字段     | 类型     | 说明                           |
| -------- | -------- | ------------------------------ |
| draft    | `'true'` | 草稿模式（仅返回当前用户草稿） |
| category | string   | 按分类筛选                     |
| tag      | string   | 按标签筛选                     |
| q        | string   | 关键词搜索（标题 + 正文）      |
| page     | number   | 页码，默认 1                   |
| limit    | number   | 每页数量，默认 10，最大 100    |

**响应**：

```json
{
  "code": 0,
  "data": {
    "posts": [Post],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "message": "获取成功"
}
```

### GET /api/posts/:id

获取文章详情。已发布文章所有人可见；草稿仅作者可见（他人访问返回 404）。访问已发布文章会递增阅读量并更新作者浏览统计。

**鉴权**：optional

**响应**：

```json
{
  "code": 0,
  "data": { "post": Post },
  "message": "获取成功"
}
```

### POST /api/posts

创建文章。会同步更新作者 stats.articles（仅已发布文章计数）。

**鉴权**：authGuard

**请求体**：

| 字段       | 类型               | 必填 | 约束                                |
| ---------- | ------------------ | ---- | ----------------------------------- |
| title      | string             | 是   | 1–200 位                            |
| summary    | string             | 否   | ≤500 位（留空自动生成）             |
| content    | string             | 是   | 非空                                |
| category   | string             | 是   | 1–50 位                             |
| tags       | string \| string[] | 否   | 自动 trim / 小写 / 去重，最多 20 个 |
| isDraft    | boolean            | 是   | 是否草稿                            |
| pinned     | boolean            | 否   | 是否置顶（草稿强制 false）          |
| coverImage | string             | 否   | 必须 http(s) URL                    |

**响应**（201）：

```json
{
  "code": 0,
  "data": { "post": Post },
  "message": "创建成功"
}
```

### PUT /api/posts/:id

更新文章。仅作者可操作。草稿↔发布状态切换会调整作者 stats.articles。

**鉴权**：authGuard

**请求体**：同创建文章，全部字段可选（Partial）。

**响应**：

```json
{ "code": 0, "data": { "post": Post }, "message": "更新成功" }
```

**错误**：403 无权操作该文章。

### DELETE /api/posts/:id

删除文章。仅作者可操作。会级联删除该文章的所有评论，并清理所有用户的 likedArticles / favoritedArticles 中的该文章 ID。

**鉴权**：authGuard

**响应**：

```json
{ "code": 0, "data": null, "message": "删除成功" }
```

### POST /api/posts/:id/like

切换点赞状态（toggle）。草稿不可点赞。会同步更新文章作者的 stats.likes。

**鉴权**：authGuard

**响应**：

```json
{
  "code": 0,
  "data": { "liked": true, "likes": 1 },
  "message": "操作成功"
}
```

> 再次调用取消点赞，返回 `{ "liked": false, "likes": 0 }`。

### POST /api/posts/:id/favorite

切换收藏状态（toggle）。草稿不可收藏。

**鉴权**：authGuard

**响应**：

```json
{
  "code": 0,
  "data": { "favorited": true, "favorites": 1 },
  "message": "操作成功"
}
```

> 再次调用取消收藏，返回 `{ "favorited": false, "favorites": 0 }`。

### GET /api/favorites

获取当前用户收藏的文章列表（按收藏顺序，仅含已发布文章）。

**鉴权**：authGuard

**响应**：

```json
{
  "code": 0,
  "data": { "posts": [Post] },
  "message": "获取成功"
}
```

### GET /api/categories

获取分类列表（从已发布文章中聚合，删除文章时自动清理孤立分类）。

**鉴权**：无

**响应**：

```json
{
  "code": 0,
  "data": { "categories": ["前端", "后端", "测试"] },
  "message": "获取成功"
}
```

### GET /api/tags

获取标签列表（从已发布文章中聚合，自动小写去重排序，含每个标签的文章数量）。

**鉴权**：无

**响应**：

```json
{
  "code": 0,
  "data": {
    "tags": [
      { "name": "react", "count": 3 },
      { "name": "typescript", "count": 2 }
    ]
  },
  "message": "获取成功"
}
```

### GET /api/config

获取站点配置。

**鉴权**：无

**响应**：

```json
{
  "code": 0,
  "data": { "config": { "blogName": "我的博客", "author": "匿名" } },
  "message": "获取成功"
}
```

### PUT /api/config

更新站点配置。

**鉴权**：authGuard

**请求体**（全部可选）：

| 字段     | 类型   | 约束                            |
| -------- | ------ | ------------------------------- |
| blogName | string | ≤100 位，留空回退为「我的博客」 |
| author   | string | ≤100 位，留空回退为「匿名」     |

**响应**：

```json
{
  "code": 0,
  "data": { "config": { "blogName": "我的博客", "author": "Alex Chen" } },
  "message": "更新成功"
}
```

---

## 评论模块 Comment

前缀：`/api`

### GET /api/posts/:postId/comments

获取指定文章的评论列表。

**鉴权**：optional

**路径参数**：

| 字段   | 类型   | 说明    |
| ------ | ------ | ------- |
| postId | string | 文章 ID |

**响应**：

```json
{
  "code": 0,
  "data": { "comments": [Comment] },
  "message": "获取成功"
}
```

### POST /api/posts/:postId/comments

发表评论。会递增文章的 commentsCount。

**鉴权**：authGuard

**请求体**：

| 字段    | 类型   | 必填 | 约束      |
| ------- | ------ | ---- | --------- |
| content | string | 是   | 1–2000 位 |

**响应**（201）：

```json
{
  "code": 0,
  "data": { "comment": Comment },
  "message": "发表评论成功"
}
```

### PUT /api/comments/:id

编辑评论。仅评论作者可操作。

**鉴权**：authGuard

**请求体**：

| 字段    | 类型   | 必填 | 约束      |
| ------- | ------ | ---- | --------- |
| content | string | 是   | 1–2000 位 |

**响应**：

```json
{ "code": 0, "data": { "comment": Comment }, "message": "编辑成功" }
```

**错误**：403 非评论作者。

### DELETE /api/comments/:id

删除评论。仅评论作者可操作。会递减文章的 commentsCount。

**鉴权**：authGuard

**响应**：

```json
{ "code": 0, "data": null, "message": "删除成功" }
```

**错误**：403 非评论作者。

---

## 数据模型

### Post

```ts
{
  id: string;
  title: string;
  summary: string;
  content: string;          // 已渲染为 HTML
  contentRaw?: string;      // 原始 Markdown（仅详情接口返回，供编辑器预填）
  category: string;
  tags: string[];
  createdAt: string;        // ISO 时间
  updatedAt: string;
  publishedAt?: string;     // 发布时间（草稿无）
  isDraft: boolean;
  pinned?: boolean;
  coverImage?: string;
  authorId?: string;
  authorName?: string;      // 冗余字段，避免展示时反复查用户
  views: number;
  likes: number;
  favorites?: number;       // 收藏数
  commentsCount: number;
}
```

### SafeUser（/auth/me、/auth/register 等返回）

```ts
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  joined: string;
  role: string;
  company: string;
  verified: boolean;
  tags: string[];
  social: { twitter: string; github: string; linkedin: string };
  stats: { articles: number; likes: number; views: number };
  likedArticles?: string[];       // 已点赞文章 ID
  favoritedArticles?: string[];   // 已收藏文章 ID
  appearance?: { theme: "light" | "dark" | "system"; fontSize: "small" | "medium" | "large" };
  createdAt: string;
  updatedAt: string;
}
// 已剥离：password / tokenVersion / disabled
```

### Comment

```ts
{
  id: string;
  postId: string;
  userId: string;
  content: string;
  userName: string;      // 冗余字段，资料更新时同步
  userAvatar?: string;   // 冗余字段，资料更新时同步
  createdAt: string;
  updatedAt: string;
}
```
