# Personal Blog API 接口文档

> Base URL: `http://localhost:3001/api`
>
> 认证方式：`Authorization: Bearer <token>`
>
> 统一响应格式：
> ```json
> {
>   "data": T,
>   "message": "操作成功",
>   "statusCode": 200
> }
> ```

---

## 目录

- [1. 认证模块 (Auth)](#1-认证模块-auth)
- [2. 文章模块 (Articles)](#2-文章模块-articles)
- [3. 分类模块 (Categories)](#3-分类模块-categories)
- [4. 标签模块 (Tags)](#4-标签模块-tags)
- [5. 仪表盘模块 (Dashboard)](#5-仪表盘模块-dashboard)
- [6. 评论模块 (Comments)](#6-评论模块-comments)
- [7. 通知模块 (Notifications)](#7-通知模块-notifications)
- [8. 搜索模块 (Search)](#8-搜索模块-search)
- [9. 热门模块 (Trending)](#9-热门模块-trending)
- [10. 收藏模块 (Favorites)](#10-收藏模块-favorites)
- [11. 关于模块 (About)](#11-关于模块-about)
- [12. 订阅模块 (Newsletter)](#12-订阅模块-newsletter)
- [13. 上传模块 (Upload)](#13-上传模块-upload)
- [14. 用户模块 (Users)](#14-用户模块-users)
- [15. 个人资料模块 (Profile)](#15-个人资料模块-profile)
- [16. 设置模块 (Settings)](#16-设置模块-settings)
- [17. 我的文章模块 (My Articles)](#17-我的文章模块-my-articles)

---

## 1. 认证模块 (Auth)

### POST /api/auth/register
注册新用户。

**请求体：**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | ✅ | 邮箱 |
| password | string | ✅ | 密码 |
| firstName | string | ✅ | 名 |
| lastName | string | ✅ | 姓 |
| username | string | ✅ | 用户名 |

**响应：** 状态码 201。注册成功后通过 httpOnly Cookie 种入 JWT，`data` 返回 `null`。
```json
{
  "data": null,
  "message": "注册成功",
  "statusCode": 201
}
```

**错误码：**
- 400 - 所有字段都是必填的
- 409 - 该邮箱已被注册 / 该用户名已被使用

### POST /api/auth/login
登录。

**请求体：**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | ✅ | 邮箱 |
| password | string | ✅ | 密码 |

**响应：** 状态码 200。登录成功后通过 httpOnly Cookie 种入 JWT，`data` 返回 `null`。
```json
{
  "data": null,
  "message": "登录成功",
  "statusCode": 200
}
```

**错误码：**
- 400 - 邮箱和密码不能为空
- 401 - 邮箱或密码错误

### GET /api/auth/me
获取当前登录用户信息。🔒 需要认证

**响应：** 与 login/register 结构一致，`data` 内含 `user` 字段。
```json
{
  "data": {
    "user": { "id", "email", "firstName", "lastName", "username", "avatar", "bio", ... }
  },
  "message": "获取成功",
  "statusCode": 200
}
```

### POST /api/auth/change-password
修改密码。🔒 需要认证

**请求体：**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| currentPassword | string | ✅ | 当前密码 |
| newPassword | string | ✅ | 新密码 |

**响应：** `{ "data": null, "message": "密码修改成功" }`

**错误码：**
- 400 - 当前密码和新密码不能为空 / 当前密码错误

### POST /api/auth/logout
用户登出，清除认证 Cookie。🔒 需要认证

**请求体：** 无

**响应：**
```json
{
  "data": null,
  "message": "登出成功",
  "statusCode": 200
}
```

---

## 2. 文章模块 (Articles)

### GET /api/articles
获取文章列表（默认只返回已发布文章）。

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | ❌ | 页码，默认 1 |
| limit | number | ❌ | 每页数量，默认 20 |
| categoryId | string | ❌ | 按分类筛选 |
| tag | string | ❌ | 按标签筛选 |
| status | string | ❌ | 按状态筛选：published/draft/archived |
| featured | string | ❌ | 是否精选："true" |

**响应：**
```json
{
  "data": {
    "items": [ArticleDetailItem, ...],
    "pagination": { "page", "limit", "total", "totalPages", "hasNext", "hasPrev" }
  }
}
```

### GET /api/articles/:id
获取文章详情。支持可选认证（optionalAuth），草稿或私密文章需要认证且为作者本人才能访问。

**路径参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | ✅ | 文章ID |

**响应：** 返回 ArticleDetailItem 对象。

**特殊行为：**
- 已发布且公开的文章无需认证即可访问
- 草稿（status=draft）或私密（visibility=private）文章需要认证，未认证返回 401

### POST /api/articles
创建文章。🔒 需要认证

**请求体：**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | ✅ | 标题 |
| content | string | ✅ | 内容（HTML） |
| excerpt | string | ❌ | 摘要，默认截取内容前120字 |
| image | string | ❌ | 封面图，默认空字符串 |
| tag | string | ❌ | 主标签，默认 "Engineering" |
| categoryId | string | ❌ | 分类ID，默认空字符串 |
| tags | string[] | ❌ | 标签列表，默认空数组 |
| status | string | ❌ | published/draft，默认 draft |
| visibility | string | ❌ | public/private，默认 public |
| featured | boolean | ❌ | 是否精选，默认 false |

**响应：** 返回创建的 ArticleDetailItem 对象，状态码 201。自动计算 readTime（按 200 词/分钟），自动生成 tagClass。

**错误码：**
- 400 - 标题和内容不能为空

### PUT /api/articles/:id
更新文章。🔒 需要认证

**请求体：** 同创建，所有字段可选。更新时会自动设置 `updatedAt` 字段。

**响应：** 返回更新后的 ArticleDetailItem 对象。

**错误码：**
- 404 - 文章不存在

### DELETE /api/articles/:id
删除文章。🔒 需要认证

**响应：** `{ "data": null, "message": "文章已删除" }`

**错误码：**
- 404 - 文章不存在

### POST /api/articles/:id/like
点赞文章。🔒 需要认证

**响应：** 返回更新后的 ArticleDetailItem 对象（likes +1）。

**错误码：**
- 404 - 文章不存在

---

## 3. 分类模块 (Categories)

### GET /api/categories
获取分类列表。

### GET /api/categories/:id
获取分类详情（含 longDescription、topTags、weeklyGrowth、bgGradient、trending 等扩展字段）。

**错误码：**
- 404 - 分类不存在

### GET /api/categories/:id/articles
获取分类下的文章。

**查询参数：** `page`, `limit`

### GET /api/categories/:id/top-authors
获取分类下的热门作者。

### GET /api/categories/:id/learning-paths
获取学习路径。

---

## 4. 标签模块 (Tags)

### GET /api/tags
获取标签列表。

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| search | string | ❌ | 搜索关键词 |
| trending | string | ❌ | 是否热门："true" |

### GET /api/tags/popular
获取热门标签。

**查询参数：** `limit`（默认 12）

### GET /api/tags/:name
获取标签详情（按名称）。

### GET /api/tags/:name/articles
获取标签下的文章。

**查询参数：** `page`, `limit`

### GET /api/tags/:name/stats
获取标签周维度统计数据。

**响应：**
```json
{
  "data": {
    "name": "React",
    "weeklyData": [{ "week", "articles", "views" }, ...],
    "totalArticles": 156,
    "weeklyGrowth": "+23%"
  }
}
```

### GET /api/tags/:name/contributors
获取标签 Top 贡献者。

---

## 5. 仪表盘模块 (Dashboard)

> 所有接口均需要认证 🔒

### GET /api/dashboard/stats
获取统计数据（总浏览、总点赞、评论数、已发布文章数）。

**响应：**
```json
{
  "data": [
    { "id", "title", "value", "change", "trend" },
    ...
  ]
}
```

### GET /api/dashboard/chart
获取图表数据。

**查询参数：** `period`（week/month，默认 week）

**响应：**
```json
{
  "data": {
    "labels": ["Mon", "Tue", ...],
    "datasets": [
      { "label": "Views", "data": [...], "borderColor", "backgroundColor" },
      { "label": "Engagement", "data": [...], "borderColor", "backgroundColor" }
    ]
  }
}
```

### GET /api/dashboard/top-posts
获取热门文章排行（Top 5）。

### GET /api/dashboard/recent-comments
获取最近评论（Top 10）。

---

## 6. 评论模块 (Comments)

### GET /api/comments/:articleId
获取文章评论（树形结构，含回复）。

**响应：**
```json
{
  "data": [
    {
      "id", "articleId", "userId", "userName", "userAvatar",
      "content", "createdAt", "likes",
      "replies": [Comment, ...]
    }
  ]
}
```

### POST /api/comments
创建评论。🔒 需要认证

**请求体：**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| articleId | string | ✅ | 文章ID |
| content | string | ✅ | 评论内容 |
| parentId | string | ❌ | 父评论ID（回复时传入） |

**响应：** 返回创建的 Comment 对象，状态码 201。创建评论后会自动更新对应文章的评论数（comments +1）。

**错误码：**
- 400 - 文章ID和评论内容不能为空

### DELETE /api/comments/:id
删除评论。🔒 需要认证（仅评论作者可删）

**响应：** `{ "data": null, "message": "评论已删除" }`

**错误码：**
- 404 - 评论不存在
- 403 - 无权删除此评论（非评论作者）

### POST /api/comments/:id/like
点赞评论。🔒 需要认证

**响应：** 返回更新后的 Comment 对象（likes +1）。

**错误码：**
- 404 - 评论不存在

---

## 7. 通知模块 (Notifications)

> 所有接口均需要认证 🔒

### GET /api/notifications
获取通知列表。

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| tab | string | ❌ | all/unread/mentions |
| filter | string | ❌ | 按类型筛选：like/comment/follow/article/mention |

### PATCH /api/notifications/:id/read
标记单条通知已读。仅可操作自己的通知。

**错误码：**
- 404 - 通知不存在
- 403 - 无权操作（非本人通知）

### POST /api/notifications/read-all
全部标记已读。将当前用户所有未读通知标记为已读。

**响应：** `{ "data": null, "message": "全部标记已读" }`

### DELETE /api/notifications/:id
删除通知。仅可删除自己的通知。

**错误码：**
- 404 - 通知不存在
- 403 - 无权操作（非本人通知）

---

## 8. 搜索模块 (Search)

### GET /api/search
搜索文章。仅搜索已发布（status=published）的文章。

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| q | string | ❌ | 搜索关键词（匹配标题、摘要、主标签、标签列表） |
| category | string | ❌ | 分类ID筛选 |
| tag | string | ❌ | 标签筛选 |
| page | number | ❌ | 页码 |
| limit | number | ❌ | 每页数量 |

**响应：**
```json
{
  "data": {
    "items": [Article, ...],
    "total": 5,
    "suggestions": ["React", "Next.js", "..."],
    "pagination": { ... }
  }
}
```

### GET /api/search/suggestions
获取搜索建议。

**查询参数：** `q`（搜索关键词）

**响应：** 返回匹配的标签名和文章标题列表（最多 8 个标签 + 3 个标题）。

---

## 9. 热门模块 (Trending)

### GET /api/trending/articles
获取热门文章。

**查询参数：** `page`, `limit`

**响应：**
```json
{
  "data": {
    "items": [Article, ...],
    "pagination": { "page", "limit", "total", "totalPages", "hasNext", "hasPrev" }
  }
}
```

### GET /api/trending/tags
获取热门标签。

**响应：**
```json
{
  "data": [
    { "name": "AI & ML", "count": "2.4k articles", "trend": "+34%" },
    ...
  ]
}
```

### GET /api/trending/authors
获取推荐作者。

**响应：** 返回 FeaturedAuthor 对象列表。

---

## 10. 收藏模块 (Favorites)

> 所有接口均需要认证 🔒

### GET /api/favorites
获取收藏列表。

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | ❌ | favorite/reading-list |
| topic | string | ❌ | 按主题筛选 |

**响应：** 返回收藏记录 + 关联的文章详情。

### POST /api/favorites
添加收藏。

**请求体：**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| articleId | string | ✅ | 文章ID |
| type | string | ✅ | favorite/reading-list |

**响应：** 返回创建的 Favorite 对象，状态码 201。

**错误码：**
- 400 - 文章ID和类型不能为空
- 409 - 已收藏该文章

### DELETE /api/favorites
取消收藏。

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| articleId | string | ✅ | 文章ID |
| type | string | ❌ | 类型（不传则删除匹配的第一条记录） |

**响应：** `{ "data": null, "message": "已取消收藏" }`

**错误码：**
- 400 - 文章ID不能为空
- 404 - 收藏记录不存在

---

## 11. 关于模块 (About)

### GET /api/about/stats
获取关于页统计数据。

**响应：**
```json
{
  "data": [
    { "value": "50K+", "label": "Active Readers" },
    ...
  ]
}
```

### GET /api/about/values
获取核心价值观。返回 AboutValue 对象列表。

### GET /api/about/team
获取团队成员。返回 AboutTeamMember 对象列表。

---

## 12. 订阅模块 (Newsletter)

### POST /api/newsletter/subscribe
订阅邮件。

**请求体：**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | ✅ | 邮箱 |

**响应：** 返回创建的 NewsletterSubscription 对象，状态码 201。

**错误码：**
- 400 - 邮箱不能为空
- 409 - 该邮箱已订阅

### POST /api/newsletter/unsubscribe
取消订阅。

**请求体：**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | ✅ | 邮箱 |

**响应：** `{ "data": null, "message": "已取消订阅" }`

**错误码：**
- 400 - 邮箱不能为空
- 404 - 订阅记录不存在

---

## 13. 上传模块 (Upload)

### POST /api/upload/image
上传单张图片。

**请求：** `multipart/form-data`，字段名 `file`

**限制：** 最大 5MB，支持 JPG/PNG/GIF/WebP

**响应：** 状态码 201
```json
{
  "data": { "url": "/uploads/xxx.jpg", "filename": "xxx.jpg" },
  "message": "上传成功",
  "statusCode": 201
}
```

**错误码：**
- 400 - 请选择要上传的文件

### POST /api/upload/images
批量上传图片（最多5张）。

**请求：** `multipart/form-data`，字段名 `files`

**响应：** 状态码 201
```json
{
  "data": [
    { "url": "/uploads/xxx.jpg", "filename": "xxx.jpg" },
    ...
  ],
  "message": "上传成功",
  "statusCode": 201
}
```

**错误码：**
- 400 - 请选择要上传的文件

---

## 14. 用户模块 (Users)

### GET /api/users/:id
获取用户公开信息。支持可选认证（optionalAuth）。

**响应：** 返回用户信息（不含 password 等敏感字段）。

**错误码：**
- 404 - 用户不存在

### GET /api/users/:id/articles
获取用户的文章（按 authorId 过滤）。

**查询参数：** `page`, `limit`

**响应：**
```json
{
  "data": {
    "items": [ArticleDetailItem, ...],
    "pagination": { "page", "limit", "total", "totalPages", "hasNext", "hasPrev" }
  }
}
```

**错误码：**
- 404 - 用户不存在

---

## 15. 个人资料模块 (Profile)

> 所有接口均需要认证 🔒

### GET /api/profile
获取当前用户完整资料。

**响应：** 返回用户信息（不含 password 等敏感字段）。

**错误码：**
- 404 - 用户不存在

### PATCH /api/profile
更新用户资料。仅允许更新白名单字段，自动设置 `updatedAt`。

**请求体（所有字段可选）：**
| 字段 | 类型 | 说明 |
|------|------|------|
| firstName | string | 名 |
| lastName | string | 姓 |
| username | string | 用户名 |
| bio | string | 简介 |
| avatar | string | 头像URL |
| coverImage | string | 封面图URL |
| location | string | 位置 |
| website | string | 网站 |
| company | string | 公司 |
| social | object | 社交链接 { twitter, github, linkedin } |
| tags | string[] | 兴趣标签 |

**响应：** 返回更新后的用户信息（不含敏感字段）。

**错误码：**
- 404 - 用户不存在

---

## 16. 设置模块 (Settings)

> 所有接口均需要认证 🔒

### GET /api/settings
获取用户设置（含 profile、notifications、appearance）。

**响应：**
```json
{
  "data": {
    "profile": { "firstName", "lastName", "username", "email", "bio", "avatar", "coverImage", "location", "website", "company", "social" },
    "notifications": { "emailComments", "emailLikes", "emailFollows", "emailMentions", "emailNewsletter" },
    "appearance": { "theme", "fontSize" }
  }
}
```

> 注：notifications 和 appearance 设置当前为模拟数据，固定返回默认值。

### PATCH /api/settings/profile
更新个人资料设置。仅允许更新白名单字段，自动设置 `updatedAt`。

**请求体：** 同 Profile 模块（不含 tags 字段）。

| 字段 | 类型 | 说明 |
|------|------|------|
| firstName | string | 名 |
| lastName | string | 姓 |
| username | string | 用户名 |
| bio | string | 简介 |
| avatar | string | 头像URL |
| coverImage | string | 封面图URL |
| location | string | 位置 |
| website | string | 网站 |
| company | string | 公司 |
| social | object | 社交链接 { twitter, github, linkedin } |

**响应：** 返回更新后的用户信息（不含敏感字段）。

**错误码：**
- 404 - 用户不存在

### PATCH /api/settings/notifications
更新通知设置。简化实现，直接返回请求体。

**请求体：**
| 字段 | 类型 | 说明 |
|------|------|------|
| emailComments | boolean | 评论邮件通知 |
| emailLikes | boolean | 点赞邮件通知 |
| emailFollows | boolean | 关注邮件通知 |
| emailMentions | boolean | 提及邮件通知 |
| emailNewsletter | boolean | 订阅邮件通知 |

**响应：** `{ "data": <请求体>, "message": "通知设置更新成功" }`

### PATCH /api/settings/appearance
更新外观设置。简化实现，直接返回请求体。

**请求体：**
| 字段 | 类型 | 说明 |
|------|------|------|
| theme | string | 主题：light/dark/system |
| fontSize | string | 字号：small/medium/large |

**响应：** `{ "data": <请求体>, "message": "外观设置更新成功" }`

---

## 17. 我的文章模块 (My Articles)

> 所有接口均需要认证 🔒

### GET /api/my-articles
获取当前用户的文章（按 authorId 过滤）。

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | ❌ | all/published/draft/archived，默认 all |
| page | number | ❌ | 页码 |
| limit | number | ❌ | 每页数量 |

**错误码：**
- 404 - 用户不存在

**响应：**
```json
{
  "data": {
    "items": [MyArticle, ...],
    "counts": {
      "all": 6,
      "published": 3,
      "draft": 2,
      "archived": 1
    },
    "pagination": { ... }
  }
}
```

---

## 错误码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（未登录或 Token 无效） |
| 403 | 无权操作 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如邮箱已注册、已收藏） |
| 500 | 服务器内部错误 |

**错误响应格式：**
```json
{
  "message": "错误描述",
  "statusCode": 400,
  "error": "BadRequest"
}
```

---

## 数据模型

### User
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 用户ID |
| email | string | 邮箱 |
| firstName | string | 名 |
| lastName | string | 姓 |
| username | string | 用户名 |
| avatar | string | 头像 |
| coverImage | string | 封面图 |
| bio | string | 简介 |
| location | string | 位置 |
| website | string | 网站 |
| joined | string | 加入时间 |
| role | string | 角色 |
| company | string | 公司 |
| verified | boolean | 是否认证 |
| tags | string[] | 兴趣标签 |
| social | UserSocial | 社交链接 |
| stats | UserStats | 用户统计 |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

> 注：password 为内部字段，API 响应中不返回。

### ArticleDetailItem
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 文章ID |
| title | string | 标题 |
| excerpt | string | 摘要 |
| content | string | HTML 内容 |
| image | string | 封面图 |
| tag | string | 主标签 |
| tagClass | string | 标签样式类 |
| readTime | string | 阅读时间 |
| date | string | 发布日期 |
| likes | number | 点赞数 |
| comments | number | 评论数 |
| views | number | 浏览数 |
| status | string | published/draft/archived |
| visibility | string | public/private |
| featured | boolean | 是否精选 |
| categoryId | string | 分类ID |
| tags | string[] | 标签列表 |
| authorId | string | 作者用户ID |
| author | ArticleDetailAuthor | 作者信息 |

### Category / CategoryDetail
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 分类ID |
| name | string | 分类名 |
| description | string | 简短描述 |
| icon | string | 图标名 |
| color | string | 背景色样式类名 |
| textColor | string | 文字色样式类名 |
| articleCount | number | 文章数 |
| followers | string | 关注数 |
| longDescription | string | 详细描述（CategoryDetail） |
| bgGradient | string | 背景渐变样式（CategoryDetail） |
| trending | number | 热门指数（CategoryDetail） |
| topTags | string[] | 热门标签（CategoryDetail） |
| weeklyGrowth | string | 周增长（CategoryDetail） |

### TagDetail
| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 标签名 |
| description | string | 描述 |
| articles | number | 文章数 |
| followers | string | 关注数 |
| trending | boolean | 是否热门 |
| weeklyGrowth | string | 周增长 |
| related | string[] | 相关标签 |

### Notification
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 通知ID |
| userId | string | 接收通知的用户ID |
| type | string | like/comment/follow/article/mention |
| title | string | 标题 |
| message | string | 内容 |
| link | string | 跳转链接 |
| read | boolean | 是否已读 |
| createdAt | string | 创建时间 |
| fromUser | object | 触发用户信息 |

### Comment
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 评论ID |
| articleId | string | 文章ID |
| userId | string | 用户ID |
| userName | string | 用户名 |
| userAvatar | string | 用户头像 |
| content | string | 评论内容 |
| createdAt | string | 创建时间 |
| likes | number | 点赞数 |
| parentId | string | 父评论ID（可选，回复时存在） |
| replies | Comment[] | 回复列表（可选） |

### Favorite
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 收藏记录ID |
| userId | string | 用户ID |
| articleId | string | 文章ID |
| type | string | 收藏类型：favorite/reading-list |
| createdAt | string | 创建时间 |

### MyArticle
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 文章ID |
| title | string | 标题 |
| excerpt | string | 摘要 |
| status | string | published/draft/archived |
| tag | string | 主标签 |
| tagClass | string | 标签样式类 |
| date | string | 发布日期 |
| readTime | string | 阅读时间 |
| views | string | 浏览量（格式化字符串） |
| likes | number | 点赞数 |
| comments | number | 评论数 |

### NewsletterSubscription
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 订阅记录ID |
| email | string | 邮箱 |
| createdAt | string | 创建时间 |

---

## 启动方式

```bash
# 安装依赖
pnpm install

# 开发模式
cd backend && pnpm dev

# 服务器将在 http://localhost:3001 启动
```

## 前端对接

前端 API 客户端已配置 Base URL 为 `http://localhost:3001/api`（见 `frontend/src/lib/api/client.ts`），无需额外配置即可对接。
