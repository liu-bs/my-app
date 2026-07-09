/**
 * @file myArticlesData.ts
 * @description 我的文章数据类型定义与前端静态模拟数据
 */

/**
 * 我的文章信息接口
 */
export interface MyArticle {
  /** 文章唯一 ID */
  id: string;
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  excerpt: string;
  /** 文章状态：published 已发布 / draft 草稿 / archived 已归档 */
  status: "published" | "draft" | "archived";
  /** 标签名称 */
  tag: string;
  /** 标签样式类名 */
  tagClass: string;
  /** 发布日期（草稿可为空字符串） */
  date: string;
  /** 阅读时长文案，如 "8 min read" */
  readTime: string;
  /** 浏览量（已发布文章展示数字字符串，草稿为 "-"） */
  views: string;
  /** 点赞数 */
  likes: number;
  /** 评论数 */
  comments: number;
}

/** 我的文章静态模拟数据 */
export const MY_ARTICLES: MyArticle[] = [
  {
    id: "1",
    title: "Mastering React Server Components in 2024",
    excerpt: "A deep dive into how Server Components change the paradigm of building React applications...",
    status: "published",
    tag: "Engineering",
    tagClass: "tag-engineering",
    date: "Nov 12, 2023",
    readTime: "8 min read",
    views: "45.2K",
    likes: 342,
    comments: 56,
  },
  {
    id: "4",
    title: "TypeScript 5.0: What's New and Exciting",
    excerpt: "Exploring the latest features in TypeScript 5.0 including decorators and performance improvements...",
    status: "published",
    tag: "Engineering",
    tagClass: "tag-engineering",
    date: "Oct 25, 2023",
    readTime: "7 min read",
    views: "8.2K",
    likes: 156,
    comments: 23,
  },
  {
    id: "5",
    title: "CSS Grid vs Flexbox: When to Use Which",
    excerpt: "A comprehensive comparison of CSS Grid and Flexbox with practical examples...",
    status: "published",
    tag: "Frontend",
    tagClass: "tag-frontend",
    date: "Oct 20, 2023",
    readTime: "5 min read",
    views: "18.9K",
    likes: 423,
    comments: 67,
  },
  {
    id: "6",
    title: "Building a Design System from Scratch",
    excerpt: "Lessons learned from creating a scalable design system for enterprise applications...",
    status: "draft",
    tag: "Design",
    tagClass: "tag-design",
    date: "",
    readTime: "6 min read",
    views: "-",
    likes: 0,
    comments: 0,
  },
  {
    id: "7",
    title: "Understanding Web Workers in JavaScript",
    excerpt: "How to leverage Web Workers for heavy computation without blocking the main thread...",
    status: "draft",
    tag: "Engineering",
    tagClass: "tag-engineering",
    date: "",
    readTime: "10 min read",
    views: "-",
    likes: 0,
    comments: 0,
  },
  {
    id: "8",
    title: "The Rise of Edge Computing",
    excerpt: "Why edge computing matters and how it changes application architecture...",
    status: "archived",
    tag: "Architecture",
    tagClass: "tag-architecture",
    date: "Sep 15, 2023",
    readTime: "8 min read",
    views: "3.1K",
    likes: 89,
    comments: 12,
  },
];
