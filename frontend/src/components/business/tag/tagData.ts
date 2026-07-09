/**
 * @file tagData.ts
 * @description 标签页相关静态数据（标签字典、文章列表、贡献者排行）
 */

/** 标签详情数据结构 */
interface TagDetail {
  /** 标签名称（显示用） */
  name: string;
  /** 标签描述 */
  description: string;
  /** 标签下文章数量 */
  articles: number;
  /** 关注者数量（已格式化的字符串，如 "45.2k"） */
  followers: string;
  /** 是否处于热门趋势 */
  trending: boolean;
  /** 周增长率（已格式化的字符串，如 "+23%"） */
  weeklyGrowth: string;
  /** 相关标签名列表 */
  related: string[];
}

/**
 * 标签字典：键为标签 slug（如 "react"、"next-js"），
 * 值为 {@link TagDetail} 详情
 */
export const TAGS_DATA: Record<string, TagDetail> = {
  react: {
    /** 标签名 */
    name: "React",
    /** 标签描述 */
    description: "A JavaScript library for building user interfaces",
    /** 标签下文章数 */
    articles: 156,
    /** 已格式化的关注者数 */
    followers: "45.2k",
    /** 是否趋势 */
    trending: true,
    /** 已格式化的周增长率 */
    weeklyGrowth: "+23%",
    /** 相关标签名列表 */
    related: ["Next.js", "TypeScript", "JavaScript", "Frontend", "Hooks"],
  },
  typescript: {
    /** 标签名 */
    name: "TypeScript",
    /** 标签描述 */
    description: "TypeScript is a typed superset of JavaScript",
    /** 标签下文章数 */
    articles: 89,
    /** 已格式化的关注者数 */
    followers: "32.1k",
    /** 是否趋势 */
    trending: true,
    /** 已格式化的周增长率 */
    weeklyGrowth: "+18%",
    /** 相关标签名列表 */
    related: ["JavaScript", "React", "Node.js", "Frontend", "Backend"],
  },
  "next-js": {
    /** 标签名 */
    name: "Next.js",
    /** 标签描述 */
    description: "The React Framework for the Web",
    /** 标签下文章数 */
    articles: 124,
    /** 已格式化的关注者数 */
    followers: "38.9k",
    /** 是否趋势 */
    trending: true,
    /** 已格式化的周增长率 */
    weeklyGrowth: "+31%",
    /** 相关标签名列表 */
    related: ["React", "TypeScript", "Vercel", "SSR", "Frontend"],
  },
  design: {
    /** 标签名 */
    name: "Design",
    /** 标签描述 */
    description: "UI/UX design principles and best practices",
    /** 标签下文章数 */
    articles: 203,
    /** 已格式化的关注者数 */
    followers: "52.4k",
    /** 是否趋势 */
    trending: false,
    /** 已格式化的周增长率 */
    weeklyGrowth: "+8%",
    /** 相关标签名列表 */
    related: ["Figma", "UI/UX", "CSS", "Typography", "Color Theory"],
  },
};

/** 标签页展示用的文章条目 */
export const TAG_ARTICLES = [
  {
    /** 文章唯一 ID */
    id: "1",
    /** 文章标题 */
    title: "Mastering React Server Components in 2024",
    /** 文章摘要 */
    excerpt: "A deep dive into how Server Components change the paradigm of building React applications...",
    /** 封面图 URL */
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    /** 作者信息 */
    author: {
      /** 作者名称 */
      name: "Alex Chen",
      /** 作者头像 URL */
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    /** 预计阅读时长（已格式化） */
    readTime: "8 min read",
    /** 发布日期（已格式化） */
    date: "Nov 12, 2023",
    /** 点赞数 */
    likes: 342,
    /** 评论数 */
    comments: 56,
  },
  {
    /** 文章唯一 ID */
    id: "4",
    /** 文章标题 */
    title: "TypeScript 5.0: What's New and Exciting",
    /** 文章摘要 */
    excerpt: "Exploring the latest features in TypeScript 5.0 including decorators and performance improvements...",
    /** 封面图 URL */
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop",
    /** 作者信息 */
    author: {
      /** 作者名称 */
      name: "Emily Watson",
      /** 作者头像 URL */
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    /** 预计阅读时长（已格式化） */
    readTime: "7 min read",
    /** 发布日期（已格式化） */
    date: "Oct 25, 2023",
    /** 点赞数 */
    likes: 156,
    /** 评论数 */
    comments: 31,
  },
  {
    /** 文章唯一 ID */
    id: "5",
    /** 文章标题 */
    title: "Building Scalable Apps with Next.js 14",
    /** 文章摘要 */
    excerpt: "Learn how to leverage the latest features in Next.js 14 to build production-ready applications...",
    /** 封面图 URL */
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
    /** 作者信息 */
    author: {
      /** 作者名称 */
      name: "David Park",
      /** 作者头像 URL */
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    /** 预计阅读时长（已格式化） */
    readTime: "12 min read",
    /** 发布日期（已格式化） */
    date: "Oct 20, 2023",
    /** 点赞数 */
    likes: 423,
    /** 评论数 */
    comments: 67,
  },
];

/** 标签页贡献者排行 */
export const TOP_CONTRIBUTORS = [
  {
    /** 贡献者名称 */
    name: "Alex Chen",
    /** 该贡献者发布的文章数 */
    articles: 12,
    /** 头像 URL */
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
  {
    /** 贡献者名称 */
    name: "Sarah Miller",
    /** 该贡献者发布的文章数 */
    articles: 8,
    /** 头像 URL */
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    /** 贡献者名称 */
    name: "David Park",
    /** 该贡献者发布的文章数 */
    articles: 6,
    /** 头像 URL */
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    /** 贡献者名称 */
    name: "Emily Watson",
    /** 该贡献者发布的文章数 */
    articles: 15,
    /** 头像 URL */
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
];
