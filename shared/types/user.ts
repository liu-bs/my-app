/**
 * @file user.ts
 * @description 用户与认证模块共享类型，定义用户实体、社交账号、统计数据、注册/登录/改密/资料更新 DTO、JWT 载荷及安全用户类型，供前后端共用
 */

/**
 * 用户信息
 */
export interface User {
  /** 用户唯一ID */
  id: string;
  /** 邮箱地址 */
  email: string;
  /** 名 */
  firstName: string;
  /** 姓 */
  lastName: string;
  /** 用户名 */
  username: string;
  /** 头像地址 */
  avatar: string;
  /** 个人主页封面图地址 */
  coverImage: string;
  /** 个人简介 */
  bio: string;
  /** 所在地 */
  location: string;
  /** 个人网站地址 */
  website: string;
  /** 注册时间 */
  joined: string;
  /** 用户角色 */
  role: string;
  /** 公司 */
  company: string;
  /** 是否已认证 */
  verified: boolean;
  /** 账号是否被禁用（仅后端使用） */
  disabled?: boolean;
  /** 用户标签列表 */
  tags: string[];
  /** 社交账号信息 */
  social: UserSocial;
  /** 用户统计数据 */
  stats: UserStats;
  /** 密码（仅后端使用，API 响应中不返回） */
  password?: string;
  /** Token 版本号，登出/改密时 +1 使旧 Token 失效 */
  tokenVersion?: number;
  /** 外观/主题设置 */
  appearance?: {
    /** 主题模式 */
    theme: 'light' | 'dark' | 'system';
    /** 字号大小 */
    fontSize: 'small' | 'medium' | 'large';
  };
  /** 当前用户已点赞的文章 ID 列表 */
  likedArticles?: string[];
  /** 当前用户已收藏的文章 ID 列表 */
  favoritedArticles?: string[];
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/**
 * 用户社交账号
 */
export interface UserSocial {
  /** Twitter 用户名 */
  twitter: string;
  /** GitHub 用户名 */
  github: string;
  /** LinkedIn 用户名 */
  linkedin: string;
}

/**
 * 用户统计数据
 */
export interface UserStats {
  /** 文章数 */
  articles: number;
  /** 获赞数 */
  likes: number;
  /** 浏览数 */
  views: number;
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
 * 修改密码请求参数
 */
export interface ChangePasswordDto {
  /** 当前密码 */
  currentPassword: string;
  /** 新密码 */
  newPassword: string;
}

/**
 * 更新个人资料请求参数
 */
export interface UpdateProfileDto {
  /** 名 */
  firstName?: string;
  /** 姓 */
  lastName?: string;
  /** 头像地址 */
  avatar?: string;
  /** 个人简介 */
  bio?: string;
  /** 所在地 */
  location?: string;
  /** 个人网站地址 */
  website?: string;
}

/**
 * /auth/me、/auth/register、/auth/profile 响应数据（data 部分）
 */
export interface AuthUserResponse {
  /** 用户信息 */
  user: User;
}

/**
 * JWT payload（前后端共享）
 */
export interface AuthPayload {
  /** 用户唯一ID */
  id: string;
  /** 邮箱地址 */
  email: string;
  /** Token 版本号 */
  tokenVersion: number;
}

/**
 * 安全用户类型 — 剥离敏感字段后可返回前端
 */
export type SafeUser = Omit<User, 'password' | 'tokenVersion' | 'disabled'>;
