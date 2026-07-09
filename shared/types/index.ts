/**
 * 前后端公共类型定义
 * @description 包含用户、文章、分类、标签、评论、通知、收藏、设置等全量类型
 */

// --- 通用 ---

/**
 * 分页查询参数
 */
export interface PaginationParams {
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  limit: number;
}

/**
 * 分页元数据
 */
export interface PaginationMeta {
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  limit: number;
  /** 总记录数 */
  total: number;
  /** 总页数 */
  totalPages: number;
  /** 是否有下一页 */
  hasNext: boolean;
  /** 是否有上一页 */
  hasPrev: boolean;
}

// --- API 响应 ---

/**
 * 统一 API 响应结构
 */
export interface ApiResponse<T> {
  /** 响应数据 */
  data: T;
  /** 响应消息 */
  message: string;
  /** HTTP 状态码 */
  statusCode: number;
}

/**
 * API 错误响应
 */
export interface ApiError {
  /** 错误消息 */
  message: string;
  /** HTTP 状态码 */
  statusCode: number;
  /** 错误类型 */
  error: string;
}

/**
 * 分页响应结构
 */
export interface PaginatedResponse<T> {
  /** 数据列表 */
  items: T[];
  /** 分页元数据 */
  pagination: PaginationMeta;
}

// --- 用户 / 认证 ---

/**
 * 用户信息接口
 */
export interface User {
  /** 用户唯一 ID */
  id: string;
  /** 邮箱地址 */
  email: string;
  /** 名 */
  firstName: string;
  /** 姓 */
  lastName: string;
  /** 用户名 */
  username: string;
  /** 头像 URL */
  avatar: string;
  /** 封面图 URL */
  coverImage: string;
  /** 个人简介 */
  bio: string;
  /** 所在地 */
  location: string;
  /** 个人网站 */
  website: string;
  /** 加入时间 */
  joined: string;
  /** 角色 */
  role: string;
  /** 公司 */
  company: string;
  /** 是否已认证 */
  verified: boolean;
  /** 兴趣标签 */
  tags: string[];
  /** 社交账号信息 */
  social: UserSocial;
  /** 用户统计数据 */
  stats: UserStats;
  /** 密码（仅后端使用，API 响应中不返回） */
  password?: string;
  /** Token 版本号，登出/改密时 +1，使旧 Token 失效 */
  tokenVersion?: number;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/**
 * 用户社交账号信息
 */
export interface UserSocial {
  /** Twitter 账号 */
  twitter: string;
  /** GitHub 账号 */
  github: string;
  /** LinkedIn 账号 */
  linkedin: string;
}

/**
 * 用户统计数据
 */
export interface UserStats {
  /** 文章数 */
  articles: number;
  /** 粉丝数 */
  followers: string;
  /** 关注数 */
  following: number;
  /** 获赞数 */
  likes: string;
  /** 浏览量 */
  views: string;
}

/**
 * 注册请求参数
 */
export interface RegisterDto {
  /** 邮箱地址 */
  email: string;
  /** 密码 */
  password: string;
  /** 名 */
  firstName: string;
  /** 姓 */
  lastName: string;
  /** 用户名 */
  username: string;
}

/**
 * 登录请求参数
 */
export interface LoginDto {
  /** 邮箱地址 */
  email: string;
  /** 密码 */
  password: string;
}

/**
 * 认证响应数据
 * @description 仅用于 GET /auth/me 接口的 data 字段结构
 * login/register 通过 httpOnly Cookie 种 token，data 返回 null
 */
export interface AuthResponse {
  /** 用户信息（不含敏感字段） */
  user: Omit<User, 'password'>;
}

/**
 * 修改密码请求参数
 */
export interface ChangePasswordDto {
  /** 当前密码 */
  currentPassword: string;
  /** 新密码 */
  newPassword: string;
}

// --- 文章 ---

/**
 * 文章摘要信息
 */
export interface Article {
  /** 文章唯一 ID */
  id: string;
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  excerpt: string;
  /** 封面图 URL */
  image: string;
  /** 标签名称 */
  tag: string;
  /** 标签样式类名 */
  tagClass: string;
  /** 阅读时长 */
  readTime: string;
  /** 发布日期 */
  date: string;
  /** 点赞数 */
  likes: number;
  /** 评论数 */
  comments: number;
}

/**
 * 文章详情信息
 */
export interface ArticleDetailItem extends Article {
  /** 文章正文 HTML */
  content: string;
  /** 浏览量 */
  views: number;
  /** 文章状态 */
  status: 'published' | 'draft' | 'archived';
  /** 可见性 */
  visibility: 'public' | 'private';
  /** 是否精选 */
  featured: boolean;
  /** 所属分类 ID */
  categoryId: string;
  /** 标签列表 */
  tags: string[];
  /** 作者 ID */
  authorId: string;
  /** 作者信息 */
  author: ArticleDetailAuthor;
}

/**
 * 文章详情中的作者信息
 */
export interface ArticleDetailAuthor {
  /** 作者姓名 */
  name: string;
  /** 作者头像 URL */
  avatar: string;
  /** 作者简介 */
  bio: string;
}

/**
 * 创建文章请求参数
 */
export interface CreateArticleDto {
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  excerpt: string;
  /** 文章正文 */
  content: string;
  /** 封面图 URL */
  image?: string;
  /** 标签名称 */
  tag: string;
  /** 所属分类 ID */
  categoryId: string;
  /** 标签列表 */
  tags: string[];
  /** 文章状态 */
  status: 'published' | 'draft';
  /** 可见性 */
  visibility?: 'public' | 'private';
  /** 是否精选 */
  featured?: boolean;
}

/**
 * 更新文章请求参数
 */
export interface UpdateArticleDto extends Omit<Partial<CreateArticleDto>, 'status'> {
  /** 文章状态 */
  status?: 'published' | 'draft' | 'archived';
}

/**
 * 作者文章摘要信息
 */
export interface AuthorArticle {
  /** 文章唯一 ID */
  id: string;
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  excerpt: string;
  /** 封面图 URL */
  image: string;
  /** 标签名称 */
  tag: string;
  /** 标签样式类名 */
  tagClass: string;
  /** 阅读时长 */
  readTime: string;
  /** 发布日期 */
  date: string;
  /** 点赞数 */
  likes: number;
  /** 浏览量 */
  views: string;
}

// --- 分类 ---

/**
 * 分类基本信息
 */
export interface Category {
  /** 分类唯一 ID */
  id: string;
  /** 分类名称 */
  name: string;
  /** 分类描述 */
  description: string;
  /** 图标名称 */
  icon: string;
  /** 背景色样式类名 */
  color: string;
  /** 文字色样式类名 */
  textColor: string;
  /** 文章数量 */
  articleCount: number;
  /** 粉丝数 */
  followers: string;
}

/**
 * 分类详情信息
 */
export interface CategoryDetail extends Category {
  /** 详细描述 */
  longDescription: string;
  /** 背景渐变样式 */
  bgGradient: string;
  /** 热门指数 */
  trending: number;
  /** 周增长率 */
  weeklyGrowth: string;
  /** 热门标签列表 */
  topTags: string[];
}

/**
 * 分类下的文章信息
 */
export interface CategoryDetailArticle {
  /** 文章唯一 ID */
  id: string;
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  excerpt: string;
  /** 封面图 URL */
  image: string;
  /** 标签名称 */
  tag: string;
  /** 标签样式类名 */
  tagClass: string;
  /** 阅读时长 */
  readTime: string;
  /** 发布日期 */
  date: string;
  /** 点赞数 */
  likes: number;
  /** 评论数 */
  comments: number;
  /** 作者信息 */
  author: {
    /** 作者姓名 */
    name: string;
    /** 作者头像 URL */
    avatar: string;
  };
  /** 是否精选 */
  featured: boolean;
}

/**
 * 分类下的热门作者
 */
export interface CategoryDetailTopAuthor {
  /** 作者姓名 */
  name: string;
  /** 作者头像 URL */
  avatar: string;
  /** 作者角色 */
  role: string;
  /** 文章数量 */
  articles: number;
  /** 粉丝数 */
  followers: string;
  /** 是否已认证 */
  verified: boolean;
}

/**
 * 学习路径
 */
export interface LearningPath {
  /** 路径标题 */
  title: string;
  /** 路径描述 */
  description: string;
  /** 步骤数 */
  steps: number;
  /** 预计时长 */
  duration: string;
  /** 难度等级 */
  level: string;
}

// --- 标签 ---

/**
 * 标签基本信息
 */
export interface Tag {
  /** 标签唯一 ID */
  id: string;
  /** 标签名称 */
  label: string;
  /** 标签样式类名 */
  class: string;
}

/**
 * 标签详情信息
 */
export interface TagDetail {
  /** 标签名称 */
  name: string;
  /** 标签描述 */
  description: string;
  /** 关联文章数 */
  articles: number;
  /** 粉丝数 */
  followers: string;
  /** 是否热门 */
  trending: boolean;
  /** 周增长率 */
  weeklyGrowth: string;
  /** 相关标签 */
  related: string[];
}

/**
 * 热门标签
 */
export interface TrendingTag {
  /** 标签名称 */
  name: string;
  /** 文章数量 */
  count: string;
  /** 增长趋势 */
  trend: string;
}

// --- 仪表盘 ---

/**
 * 仪表盘统计项
 */
export interface Stat {
  /** 统计项唯一 ID */
  id: string;
  /** 统计项标题 */
  title: string;
  /** 统计值 */
  value: string;
  /** 变化幅度 */
  change: string;
  /** 趋势方向 */
  trend: string;
}

/**
 * 热门文章
 */
export interface TopPost {
  /** 文章唯一 ID */
  id: string;
  /** 文章标题 */
  title: string;
  /** 发布日期 */
  published: string;
  /** 浏览量 */
  views: string;
  /** 互动率 */
  engagement: string;
}

/**
 * 图表数据
 */
export interface ChartData {
  /** X 轴标签 */
  labels: string[];
  /** 数据集列表 */
  datasets: {
    /** 数据集标签 */
    label: string;
    /** 数据值 */
    data: number[];
    /** 边框颜色 */
    borderColor: string;
    /** 背景颜色 */
    backgroundColor: string;
  }[];
}

// --- 评论 ---

/**
 * 评论信息
 */
export interface Comment {
  /** 评论唯一 ID */
  id: string;
  /** 所属文章 ID */
  articleId: string;
  /** 评论者用户 ID */
  userId: string;
  /** 评论者用户名 */
  userName: string;
  /** 评论者头像 URL */
  userAvatar: string;
  /** 评论内容 */
  content: string;
  /** 创建时间 */
  createdAt: string;
  /** 点赞数 */
  likes: number;
  /** 父评论 ID */
  parentId?: string;
  /** 回复列表 */
  replies?: Comment[];
}

/**
 * 创建评论请求参数
 */
export interface CreateCommentDto {
  /** 所属文章 ID */
  articleId: string;
  /** 评论内容 */
  content: string;
  /** 父评论 ID */
  parentId?: string;
}

// --- 通知 ---

/**
 * 通知信息
 */
export interface Notification {
  /** 通知唯一 ID */
  id: string;
  /** 接收通知的用户 ID */
  userId: string;
  /** 通知类型 */
  type: 'like' | 'comment' | 'follow' | 'article' | 'mention';
  /** 通知标题 */
  title: string;
  /** 通知消息 */
  message: string;
  /** 关联链接 */
  link: string;
  /** 是否已读 */
  read: boolean;
  /** 创建时间 */
  createdAt: string;
  /** 触发通知的用户信息 */
  fromUser?: {
    /** 触发者姓名 */
    name: string;
    /** 触发者头像 URL */
    avatar: string;
  };
}

// --- 收藏 ---

/**
 * 收藏记录
 */
export interface Favorite {
  /** 收藏记录唯一 ID */
  id: string;
  /** 用户 ID */
  userId: string;
  /** 文章 ID */
  articleId: string;
  /** 收藏类型 */
  type: 'favorite' | 'reading-list';
  /** 创建时间 */
  createdAt: string;
}

/**
 * 添加收藏请求参数
 */
export interface AddFavoriteDto {
  /** 文章 ID */
  articleId: string;
  /** 收藏类型 */
  type: 'favorite' | 'reading-list';
}

// --- 关于 ---

/**
 * 关于页统计项
 */
export interface AboutStat {
  /** 统计值 */
  value: string;
  /** 统计标签 */
  label: string;
}

/**
 * 核心价值观
 */
export interface AboutValue {
  /** 价值观标题 */
  title: string;
  /** 价值观描述 */
  description: string;
}

/**
 * 团队成员
 */
export interface AboutTeamMember {
  /** 成员姓名 */
  name: string;
  /** 成员角色 */
  role: string;
  /** 成员简介 */
  bio: string;
  /** 成员头像 URL */
  avatar: string;
}

// --- 订阅 ---

/**
 * 邮件订阅记录
 */
export interface NewsletterSubscription {
  /** 订阅记录唯一 ID */
  id: string;
  /** 订阅邮箱 */
  email: string;
  /** 创建时间 */
  createdAt: string;
}

/**
 * 订阅请求参数
 */
export interface SubscribeDto {
  /** 订阅邮箱 */
  email: string;
}

// --- 设置 ---

/**
 * 设置标签页
 */
export interface SettingsTab {
  /** 标签页唯一 ID */
  id: string;
  /** 标签页名称 */
  label: string;
}

/**
 * 更新用户资料请求参数
 */
export interface UpdateProfileDto {
  /** 名 */
  firstName?: string;
  /** 姓 */
  lastName?: string;
  /** 用户名 */
  username?: string;
  /** 个人简介 */
  bio?: string;
  /** 头像 URL */
  avatar?: string;
  /** 封面图 URL */
  coverImage?: string;
  /** 所在地 */
  location?: string;
  /** 个人网站 */
  website?: string;
  /** 公司 */
  company?: string;
  /** 社交账号信息 */
  social?: Partial<UserSocial>;
}

/**
 * 更新通知设置请求参数
 */
export interface UpdateNotificationSettingsDto {
  /** 评论邮件通知 */
  emailComments: boolean;
  /** 点赞邮件通知 */
  emailLikes: boolean;
  /** 关注邮件通知 */
  emailFollows: boolean;
  /** 提及邮件通知 */
  emailMentions: boolean;
  /** 邮件订阅通知 */
  emailNewsletter: boolean;
}

// --- 搜索 ---

/**
 * 搜索结果
 */
export interface SearchResult {
  /** 搜索结果列表 */
  items: Article[];
  /** 总结果数 */
  total: number;
  /** 搜索建议 */
  suggestions: string[];
  /** 分页元数据 */
  pagination: PaginationMeta;
}

// --- 热门 ---

/**
 * 推荐作者
 */
export interface FeaturedAuthor {
  /** 作者姓名 */
  name: string;
  /** 作者头像 URL */
  avatar: string;
  /** 作者角色 */
  role: string;
  /** 文章数量 */
  articles: number;
  /** 粉丝数 */
  followers: string;
  /** 作者 slug */
  slug: string;
}

// --- 我的文章 ---

/**
 * 我的文章信息
 */
export interface MyArticle {
  /** 文章唯一 ID */
  id: string;
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  excerpt: string;
  /** 文章状态 */
  status: 'published' | 'draft' | 'archived';
  /** 标签名称 */
  tag: string;
  /** 标签样式类名 */
  tagClass: string;
  /** 发布日期 */
  date: string;
  /** 阅读时长 */
  readTime: string;
  /** 浏览量 */
  views: string;
  /** 点赞数 */
  likes: number;
  /** 评论数 */
  comments: number;
}
