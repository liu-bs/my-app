/**
 * @file constans/index.ts
 * @description 全站静态 mock 数据集中管理，覆盖导航、文章、分类、用户等场景。
 * 当前以本地常量形式提供，后续接入真实接口时可作为类型契约与初始数据参考。
 */
import {
  Bell,
  Eye,
  FileText,
  Grid3X3,
  Heart,
  Home,
  Info,
  LayoutDashboard,
  Lock,
  Mail,
  MessageSquare,
  Palette,
  PenLine,
  Search,
  Shield,
  Target,
  ThumbsUp,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react";
import Style from "@/styles/commonStyle";
import {
  AboutStat,
  AboutTeamMember,
  AboutValue,
  Article,
  ArticleDetailItem,
  AuthorArticle,
  Category,
  CategoryDetailArticle,
  CategoryDetailTopAuthor,
  FeaturedAuthor,
  LearningPath,
  NavItem,
  SettingsTab,
  SidebarItem,
  Stat,
  Tag,
  TopPost,
  TrendingTag,
  UserRecord,
} from "@/typeing";

/** 顶部导航栏菜单项 */
export const NAV_BAR_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/category", label: "Category", icon: Grid3X3 },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/write", label: "Write", icon: PenLine },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/about", label: "About", icon: Info },
];

/** 首页/最新文章 mock 数据 */
export const ARTICLES: Article[] = [
  {
    id: "1",
    title: "Mastering React Server Components in 2024",
    excerpt: "A deep dive into how Server Components change the paradigm of building React applications, improving performance and developer experience.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    tag: "Engineering",
    tagClass: Style.tagBlue,
    readTime: "8 min read",
    date: "Nov 12, 2023",
    likes: 342,
    comments: 56,
  },
  {
    id: "2",
    title: "The Psychology of Colors in Digital Products",
    excerpt: "Understanding how different hues impact user behavior, emotional response, and brand perception in modern interface design.",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=250&fit=crop",
    tag: "Design",
    tagClass: Style.tagIndigo,
    readTime: "6 min read",
    date: "Nov 08, 2023",
    likes: 218,
    comments: 24,
  },
  {
    id: "3",
    title: "Building Resilient APIs with GraphQL",
    excerpt: "Best practices for designing, implementing, and securing GraphQL endpoints for scalable frontend applications.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
    tag: "Architecture",
    tagClass: Style.tagIndigo,
    readTime: "10 min read",
    date: "Oct 30, 2023",
    likes: 189,
    comments: 42,
  },
];

/** 全站文章分类 mock 数据 */
export const CATEGORYS: Category[] = [
  {
    id: "engineering",
    name: "Engineering",
    description: "Deep dives into software engineering, architecture patterns, and best practices.",
    icon: "Code",
    color: "tag-engineering",
    textColor: "tag-engineering-text",
    articleCount: 24,
    followers: "1.2k",
  },
  {
    id: "design",
    name: "Design",
    description: "Exploring UI/UX principles, design systems, and creative workflows.",
    icon: "Palette",
    color: "tag-design",
    textColor: "tag-design-text",
    articleCount: 18,
    followers: "890",
  },
  {
    id: "architecture",
    name: "Architecture",
    description: "System design, microservices, and scalable infrastructure patterns.",
    icon: "Layers",
    color: "tag-architecture",
    textColor: "tag-architecture-text",
    articleCount: 15,
    followers: "650",
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    description: "Work-life balance, productivity tips, and personal growth stories.",
    icon: "Coffee",
    color: "tag-lifestyle",
    textColor: "tag-lifestyle-text",
    articleCount: 12,
    followers: "420",
  },
  {
    id: "tutorials",
    name: "Tutorials",
    description: "Step-by-step guides and hands-on learning resources.",
    icon: "BookOpen",
    color: "tag-tutorials",
    textColor: "tag-tutorials-text",
    articleCount: 32,
    followers: "2.1k",
  },
  {
    id: "frontend",
    name: "Frontend",
    description: "React, Vue, CSS, and modern frontend development techniques.",
    icon: "Zap",
    color: "tag-frontend",
    textColor: "tag-frontend-text",
    articleCount: 28,
    followers: "1.8k",
  },
];

/** 热门标签文案列表（字符串数组） */
export const POPULAR_TAGS: string[] = ["React", "TypeScript", "Next.js", "GraphQL", "CSS", "Node.js", "Docker", "AWS", "Git", "Testing", "Performance", "Security"];

/** 文章筛选主题列表（含 "all" 全部分类） */
export const TOPICS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "design", label: "Design" },
  { id: "engineering", label: "Engineering" },
  { id: "architecture", label: "Architecture" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "tutorials", label: "Tutorials" },
];

/** 推荐文章 mock 数据 */
export const SUGGESTED_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Understanding Advanced TypeScript Patterns",
    excerpt: "Exploring how whitespace, typography, and subtle interactions create memorable user experiences in contemporary web applications.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop",
    tag: "Engineering",
    tagClass: Style.tagBlue,
    readTime: "5 min read",
    date: "Oct 24, 2023",
    likes: 124,
    comments: 18,
  },
  {
    id: "2",
    title: "Minimalism in 2024: Less is Still More",
    excerpt: "Exploring how whitespace, typography, and subtle interactions create memorable user experiences in contemporary web applications.",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&h=250&fit=crop",
    tag: "Design",
    tagClass: Style.tagIndigo,
    readTime: "5 min read",
    date: "Oct 24, 2023",
    likes: 124,
    comments: 18,
  },
];

/** 仪表盘统计指标 mock 数据 */
export const STATS: Stat[] = [
  {
    id: "1",
    title: "Total Views",
    value: "124.5K",
    change: "+12.5%",
    trend: "up",
    icon: Eye,
    iconBg: "bg-accent/10 text-accent",
  },
  {
    id: "2",
    title: "Total Likes",
    value: "8,234",
    change: "+5.2%",
    trend: "up",
    icon: ThumbsUp,
    iconBg: "bg-success/10 text-success",
  },
  {
    id: "3",
    title: "Comments",
    value: "1,042",
    change: "-2.1%",
    trend: "down",
    icon: MessageSquare,
    iconBg: "bg-warning/10 text-warning",
  },
  {
    id: "4",
    title: "Published Posts",
    value: "48",
    change: "+2",
    trend: "up",
    icon: FileText,
    iconBg: "bg-accent/10 text-accent",
  },
];

/** 热门文章 mock 数据 */
export const TOP_POSTS: TopPost[] = [
  {
    id: "1",
    title: "Mastering React Server Components in 2024",
    published: "Nov 12, 2023",
    views: "45.2K",
    engagement: "98%",
  },
  {
    id: "2",
    title: "The Psychology of Colors in Digital Products",
    published: "Nov 08, 2023",
    views: "32.1K",
    engagement: "92%",
  },
  {
    id: "3",
    title: "Building Resilient APIs with GraphQL",
    published: "Oct 30, 2023",
    views: "28.5K",
    engagement: "85%",
  },
];

/** 标签 chip mock 数据（用于筛选条） */
export const TAGS: Tag[] = [
  { id: "engineering", label: "Engineering", class: "tag-engineering" },
  { id: "design", label: "Design", class: "tag-design" },
  { id: "architecture", label: "Architecture", class: "tag-architecture" },
  { id: "lifestyle", label: "Lifestyle", class: "tag-lifestyle" },
  { id: "tutorials", label: "Tutorials", class: "tag-tutorials" },
];

/** 收藏文章 mock 数据 */
export const FAVORITE_ARTICLES: Article[] = [
  {
    id: "1",
    title: "The Future of CSS: New Features to Learn",
    excerpt: "Exploring how whitespace, typography, and subtle interactions create memorable user experiences in contemporary web applications.",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=250&fit=crop",
    tag: "Frontend",
    tagClass: "tag-frontend",
    readTime: "4 min read",
    date: "Dec 01, 2023",
    likes: 124,
    comments: 18,
  },
  {
    id: "2",
    title: "A Guide to Mindful Productivity",
    excerpt: "Exploring how whitespace, typography, and subtle interactions create memorable user experiences in contemporary web applications.",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop",
    tag: "Lifestyle",
    tagClass: "tag-lifestyle",
    readTime: "7 min read",
    date: "Nov 20, 2023",
    likes: 124,
    comments: 18,
  },
];

/** 设置页侧边栏项 */
export const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "security", label: "Account Security", icon: Shield },
  { id: "notifications", label: "Email Notifications", icon: Mail },
];

/** 关于页关键指标 */
export const ABOUT_STATS: AboutStat[] = [
  { value: "50K+", label: "Active Readers" },
  { value: "2,000+", label: "Published Articles" },
  { value: "500+", label: "Expert Writers" },
  { value: "100+", label: "Countries Reached" },
];

/** 关于页核心价值观 */
export const ABOUT_VALUES: AboutValue[] = [
  {
    icon: Target,
    title: "Quality First",
    description: "We believe in publishing well-researched, in-depth content that provides real value.",
  },
  {
    icon: Heart,
    title: "Community Driven",
    description: "Our platform thrives on diverse perspectives from our global community.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We stay ahead of the curve, covering emerging technologies and trends.",
  },
  {
    icon: Users,
    title: "Inclusivity",
    description: "We welcome voices from all backgrounds and make tech knowledge accessible.",
  },
];

/** 关于页团队成员 */
export const ABOUT_TEAM: AboutTeamMember[] = [
  {
    name: "Alex Chen",
    role: "Founder & CEO",
    bio: "Former Google engineer with a passion for knowledge sharing",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
  },
  {
    name: "Sarah Miller",
    role: "Head of Content",
    bio: "Award-winning writer with 10+ years in tech journalism",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  },
  {
    name: "David Park",
    role: "Lead Developer",
    bio: "Full-stack developer and open-source enthusiast",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
  {
    name: "Emily Watson",
    role: "Community Manager",
    bio: "Building bridges between writers and readers worldwide",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
  },
];

/** 设置页 Tab 配置 */
export const SETTINGS_TABS: SettingsTab[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
];

/** 文章详情页 mock 数据 */
export const ARTICLES_DETAIL_ITEMS: ArticleDetailItem[] = [
  {
    id: "1",
    title: "Mastering React Server Components in 2024",
    content: `
      <p>React Server Components represent a paradigm shift in how we build React applications. By allowing components to render exclusively on the server, we can reduce the amount of JavaScript sent to the client while maintaining the interactive experience users expect.</p>

      <h2>What Are Server Components?</h2>
      <p>Server Components are React components that execute only on the server. They can access server-side resources directly, like databases or file systems, without needing to create API endpoints. The rendered output is sent to the client as HTML, significantly reducing the JavaScript bundle size.</p>

      <h2>Benefits of Server Components</h2>
      <ul>
        <li><strong>Zero Bundle Size:</strong> Server Components don't contribute to your client-side JavaScript bundle.</li>
        <li><strong>Direct Backend Access:</strong> Access databases, filesystem, and other server resources directly.</li>
        <li><strong>Improved Performance:</strong> Less JavaScript to download, parse, and execute on the client.</li>
        <li><strong>Better Security:</strong> Sensitive data and logic stay on the server.</li>
      </ul>

      <h2>When to Use Server Components</h2>
      <p>Server Components are ideal for:</p>
      <ul>
        <li>Static content that doesn't need interactivity</li>
        <li>Data fetching that doesn't require client-side state</li>
        <li>Large dependencies that would bloat the client bundle</li>
        <li>Accessing server-side resources directly</li>
      </ul>

      <h2>Conclusion</h2>
      <p>React Server Components are a powerful addition to the React ecosystem. By thoughtfully combining Server and Client Components, you can build applications that are both performant and interactive.</p>
    `,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop",
    tag: "Engineering",
    tagClass: "tag-engineering",
    readTime: "8 min read",
    date: "Nov 12, 2023",
    likes: 342,
    comments: 56,
    views: 45200,
    status: "published",
    visibility: "public",
    featured: true,
    categoryId: "engineering",
    tags: ["engineering", "react"],
    author: {
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      bio: "Senior Frontend Engineer passionate about React and modern web development.",
    },
  },
  {
    id: "2",
    title: "The Psychology of Colors in Digital Products",
    content: `
      <p>Color is more than just a visual element—it's a powerful communication tool that can influence user behavior, evoke emotions, and shape brand perception. Understanding color psychology is essential for creating effective digital products.</p>

      <h2>How Colors Affect User Behavior</h2>
      <p>Different colors trigger different psychological responses. Blue conveys trust and stability, making it popular for financial and healthcare applications. Red creates urgency and excitement, often used for call-to-action buttons. Green represents growth and harmony, commonly seen in sustainability and wellness apps.</p>

      <h2>Color in Brand Identity</h2>
      <p>Your color choices become synonymous with your brand. Think of McDonald's golden arches or Facebook's distinctive blue. Consistent color usage across all touchpoints helps build brand recognition and trust.</p>

      <h2>Accessibility Considerations</h2>
      <p>While aesthetics are important, accessibility should never be compromised. Ensure sufficient color contrast for text readability and don't rely solely on color to convey information. Consider users with color vision deficiencies by using patterns, labels, or icons alongside color coding.</p>

      <h2>Conclusion</h2>
      <p>Thoughtful color choices can significantly impact user experience and business outcomes. By understanding color psychology and applying it strategically, you can create digital products that resonate with your target audience.</p>
    `,
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&h=600&fit=crop",
    tag: "Design",
    tagClass: "tag-design",
    readTime: "6 min read",
    date: "Nov 08, 2023",
    likes: 218,
    comments: 24,
    views: 32100,
    status: "published",
    visibility: "public",
    featured: false,
    categoryId: "design",
    tags: ["design", "psychology"],
    author: {
      name: "Sarah Miller",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      bio: "Product Designer with a background in psychology and visual arts.",
    },
  },
  {
    id: "3",
    title: "Building Resilient APIs with GraphQL",
    content: `
      <p>GraphQL has revolutionized how we think about API design. Unlike REST, GraphQL allows clients to request exactly the data they need, reducing over-fetching and under-fetching. But with great power comes great responsibility—here's how to build resilient GraphQL APIs.</p>

      <h2>Schema Design Best Practices</h2>
      <p>A well-designed schema is the foundation of a good GraphQL API. Use descriptive names, embrace nullability, and design for the client, not the database. Consider how your schema will evolve over time and plan for backward compatibility.</p>

      <h2>Error Handling</h2>
      <p>GraphQL's error handling differs from REST. While the HTTP status code is typically 200 OK even when errors occur, detailed error information is included in the response. Implement a consistent error format and consider using union types for operations that can fail in different ways.</p>

      <h2>Performance Optimization</h2>
      <p>N+1 queries are a common pitfall in GraphQL. Use DataLoader to batch and cache database requests, implement query complexity analysis to prevent expensive queries, and consider persisted queries for production applications.</p>

      <h2>Security Considerations</h2>
      <p>Protect your API against malicious queries by implementing depth limiting, complexity analysis, and rate limiting. Use authentication and authorization at the resolver level to ensure users can only access data they're permitted to see.</p>

      <h2>Conclusion</h2>
      <p>Building resilient GraphQL APIs requires careful consideration of schema design, error handling, performance, and security. By following these best practices, you can create APIs that are both powerful and reliable.</p>
    `,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop",
    tag: "Architecture",
    tagClass: "tag-architecture",
    readTime: "10 min read",
    date: "Oct 30, 2023",
    likes: 189,
    comments: 42,
    views: 28500,
    status: "published",
    visibility: "public",
    featured: true,
    categoryId: "architecture",
    tags: ["architecture", "graphql"],
    author: {
      name: "David Park",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      bio: "Backend Engineer specializing in API design and distributed systems.",
    },
  },
];

/** 作者信息字典（键为作者 slug） */
export const AUTHORS: UserRecord = {
  "alex-chen": {
    id: "alex-chen",
    name: "Alex Chen",
    username: "alexchen",
    bio: "Senior Frontend Engineer passionate about React and modern web development. Sharing my learnings and experiences in the tech industry.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?w=1200&h=400&fit=crop",
    location: "San Francisco, CA",
    website: "https://alexchen.dev",
    joined: "March 2021",
    role: "Senior Frontend Engineer",
    company: "TechCorp",
    verified: true,
    stats: {
      articles: 48,
      followers: "12.5k",
      following: 234,
      likes: "45.2k",
      views: "1.2M",
    },
    social: {
      twitter: "@alexchen",
      github: "alexchen",
      linkedin: "alexchen",
    },
    tags: ["React", "TypeScript", "Next.js", "Frontend", "Engineering"],
  },
  "sarah-miller": {
    id: "sarah-miller",
    name: "Sarah Miller",
    username: "sarahmiller",
    bio: "Product Designer with a background in psychology and visual arts. Creating meaningful digital experiences.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=400&fit=crop",
    location: "New York, NY",
    website: "https://sarahmiller.design",
    joined: "June 2020",
    role: "Product Designer",
    company: "DesignStudio",
    verified: true,
    stats: {
      articles: 32,
      followers: "8.9k",
      following: 156,
      likes: "28.4k",
      views: "890k",
    },
    social: {
      twitter: "@sarahmiller",
      github: "sarahmiller",
      linkedin: "sarahmiller",
    },
    tags: ["Design", "UI/UX", "Figma", "Product Design"],
  },
};

/** 作者主页文章列表 mock */
export const AUTHORS_ARTICLES: AuthorArticle[] = [
  {
    id: "1",
    title: "Mastering React Server Components in 2024",
    excerpt: "A deep dive into how Server Components change the paradigm of building React applications...",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    tag: "Engineering",
    tagClass: "tag-engineering",
    readTime: "8 min read",
    date: "Nov 12, 2023",
    likes: 342,
    views: "12.5k",
  },
  {
    id: "4",
    title: "TypeScript 5.0: What's New and Exciting",
    excerpt: "Exploring the latest features in TypeScript 5.0 including decorators and performance improvements...",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop",
    tag: "Engineering",
    tagClass: "tag-engineering",
    readTime: "7 min read",
    date: "Oct 25, 2023",
    likes: 156,
    views: "8.2k",
  },
  {
    id: "5",
    title: "CSS Grid vs Flexbox: When to Use Which",
    excerpt: "A comprehensive comparison of CSS Grid and Flexbox with practical examples...",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=250&fit=crop",
    tag: "Frontend",
    tagClass: "tag-frontend",
    readTime: "5 min read",
    date: "Oct 20, 2023",
    likes: 423,
    views: "18.9k",
  },
];

/** 分类详情页头部数据（按分类 ID 组织） */
export const CATEGORY_DETAILS_DATA = {
  engineering: {
    id: "engineering",
    name: "Engineering",
    description: "Deep dives into software engineering, architecture patterns, and best practices.",
    longDescription:
      "Explore the world of software engineering with in-depth articles covering system design, coding patterns, algorithms, and industry best practices. Whether you're a beginner or experienced developer, find content to level up your skills.",
    icon: "Code",
    color: "tag-engineering",
    textColor: "tag-engineering-text",
    bgGradient: "from-blue-500/10 to-blue-600/5",
    articleCount: 24,
    followers: "1.2k",
    trending: 8,
    weeklyGrowth: "+12%",
    topTags: ["React", "TypeScript", "Node.js", "System Design", "Algorithms", "Testing"],
  },
  design: {
    id: "design",
    name: "Design",
    description: "Exploring UI/UX principles, design systems, and creative workflows.",
    longDescription:
      "Dive into the art and science of digital design. From user experience research to visual design principles, learn how to create beautiful, functional, and user-centered products.",
    icon: "Palette",
    color: "tag-design",
    textColor: "tag-design-text",
    bgGradient: "from-pink-500/10 to-pink-600/5",
    articleCount: 18,
    followers: "890",
    trending: 5,
    weeklyGrowth: "+8%",
    topTags: ["UI/UX", "Figma", "Design Systems", "Color Theory", "Typography", "Prototyping"],
  },
  architecture: {
    id: "architecture",
    name: "Architecture",
    description: "System design, microservices, and scalable infrastructure patterns.",
    longDescription:
      "Master the principles of building scalable, reliable, and maintainable systems. Learn about microservices, cloud architecture, distributed systems, and infrastructure as code.",
    icon: "Layers",
    color: "tag-architecture",
    textColor: "tag-architecture-text",
    bgGradient: "from-amber-500/10 to-amber-600/5",
    articleCount: 15,
    followers: "650",
    trending: 6,
    weeklyGrowth: "+15%",
    topTags: ["Microservices", "Cloud", "Kubernetes", "AWS", "Docker", "CI/CD"],
  },
  lifestyle: {
    id: "lifestyle",
    name: "Lifestyle",
    description: "Work-life balance, productivity tips, and personal growth stories.",
    longDescription:
      "Discover insights on maintaining a healthy work-life balance, boosting productivity, and fostering personal growth. Stories and tips from professionals in the tech industry.",
    icon: "Coffee",
    color: "tag-lifestyle",
    textColor: "tag-lifestyle-text",
    bgGradient: "from-emerald-500/10 to-emerald-600/5",
    articleCount: 12,
    followers: "420",
    trending: 3,
    weeklyGrowth: "+5%",
    topTags: ["Productivity", "Remote Work", "Mental Health", "Career Growth", "Books", "Habits"],
  },
  tutorials: {
    id: "tutorials",
    name: "Tutorials",
    description: "Step-by-step guides and hands-on learning resources.",
    longDescription: "Hands-on tutorials and step-by-step guides to help you learn new technologies and techniques. From beginner basics to advanced topics, start learning today.",
    icon: "BookOpen",
    color: "tag-tutorials",
    textColor: "tag-tutorials-text",
    bgGradient: "from-indigo-500/10 to-indigo-600/5",
    articleCount: 32,
    followers: "2.1k",
    trending: 12,
    weeklyGrowth: "+20%",
    topTags: ["Getting Started", "Projects", "Tips & Tricks", "Best Practices", "Code Along", "Challenges"],
  },
  frontend: {
    id: "frontend",
    name: "Frontend",
    description: "React, Vue, CSS, and modern frontend development techniques.",
    longDescription: "Stay up-to-date with the latest in frontend development. Deep dives into React, Vue, CSS, performance optimization, and modern build tools.",
    icon: "Zap",
    color: "tag-frontend",
    textColor: "tag-frontend-text",
    bgGradient: "from-violet-500/10 to-violet-600/5",
    articleCount: 28,
    followers: "1.8k",
    trending: 10,
    weeklyGrowth: "+18%",
    topTags: ["React", "Vue", "CSS", "Performance", "Accessibility", "Build Tools"],
  },
};

/** 分类详情页文章列表 */
export const CATEGORY_DETAILS_ARTICLE: CategoryDetailArticle[] = [
  {
    id: "1",
    title: "Mastering React Server Components in 2024",
    excerpt: "A deep dive into how Server Components change the paradigm of building React applications, improving performance and developer experience.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    tag: "Engineering",
    tagClass: "tag-engineering",
    readTime: "8 min read",
    date: "Nov 12, 2023",
    likes: 342,
    comments: 56,
    author: {
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    featured: true,
  },
  {
    id: "2",
    title: "The Psychology of Colors in Digital Products",
    excerpt: "Understanding how different hues impact user behavior, emotional response, and brand perception in modern interface design.",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=250&fit=crop",
    tag: "Design",
    tagClass: "tag-design",
    readTime: "6 min read",
    date: "Nov 08, 2023",
    likes: 218,
    comments: 24,
    author: {
      name: "Sarah Miller",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    featured: false,
  },
  {
    id: "3",
    title: "Building Resilient APIs with GraphQL",
    excerpt: "Best practices for designing, implementing, and securing GraphQL endpoints for scalable frontend applications.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
    tag: "Architecture",
    tagClass: "tag-architecture",
    readTime: "10 min read",
    date: "Oct 30, 2023",
    likes: 189,
    comments: 42,
    author: {
      name: "David Park",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    featured: false,
  },
  {
    id: "4",
    title: "TypeScript 5.0: What's New and Exciting",
    excerpt: "Exploring the latest features in TypeScript 5.0 including decorators, const type parameters, and performance improvements.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop",
    tag: "Engineering",
    tagClass: "tag-engineering",
    readTime: "7 min read",
    date: "Oct 25, 2023",
    likes: 156,
    comments: 31,
    author: {
      name: "Emily Watson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    featured: false,
  },
  {
    id: "5",
    title: "CSS Grid vs Flexbox: When to Use Which",
    excerpt: "A comprehensive comparison of CSS Grid and Flexbox with practical examples and decision guidelines.",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=250&fit=crop",
    tag: "Frontend",
    tagClass: "tag-frontend",
    readTime: "5 min read",
    date: "Oct 20, 2023",
    likes: 423,
    comments: 67,
    author: {
      name: "Michael Brown",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
    featured: true,
  },
  {
    id: "6",
    title: "Microservices Communication Patterns",
    excerpt: "Understanding synchronous vs asynchronous communication, message queues, and service discovery in distributed systems.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop",
    tag: "Architecture",
    tagClass: "tag-architecture",
    readTime: "12 min read",
    date: "Oct 15, 2023",
    likes: 278,
    comments: 45,
    author: {
      name: "Lisa Zhang",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    },
    featured: false,
  },
];

/** 分类详情页头部推荐作者 */
export const CATEGORY_DETAILS_TOP_AUTHORS: CategoryDetailTopAuthor[] = [
  {
    name: "Alex Chen",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    role: "Senior Engineer",
    articles: 12,
    followers: "3.2k",
    verified: true,
  },
  {
    name: "Sarah Miller",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    role: "Product Designer",
    articles: 8,
    followers: "2.1k",
    verified: true,
  },
  {
    name: "David Park",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    role: "Architect",
    articles: 6,
    followers: "1.8k",
    verified: false,
  },
  {
    name: "Emily Watson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    role: "Full Stack Dev",
    articles: 15,
    followers: "4.5k",
    verified: true,
  },
];

/** 分类详情页学习路径 */
export const CATEGORY_DETAILS_LEARNING_PATH: LearningPath[] = [
  {
    title: "Getting Started",
    description: "Perfect for beginners",
    steps: 5,
    duration: "2 weeks",
    level: "Beginner",
  },
  {
    title: "Advanced Techniques",
    description: "Level up your skills",
    steps: 8,
    duration: "1 month",
    level: "Advanced",
  },
  {
    title: "Expert Mastery",
    description: "Become an expert",
    steps: 12,
    duration: "2 months",
    level: "Expert",
  },
];

/** 阅读列表文章 */
export const READING_LIST_ARTICLES: Article[] = [
  {
    id: "101",
    title: "Understanding WebSockets for Real-Time Apps",
    excerpt: "A practical guide to implementing WebSockets in modern web applications for real-time communication.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop",
    tag: "Engineering",
    tagClass: Style.tagBlue,
    readTime: "9 min read",
    date: "Dec 05, 2023",
    likes: 198,
    comments: 31,
  },
  {
    id: "102",
    title: "Design Systems That Scale",
    excerpt: "How to build and maintain design systems that grow with your organization and team.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    tag: "Design",
    tagClass: Style.tagIndigo,
    readTime: "7 min read",
    date: "Dec 01, 2023",
    likes: 267,
    comments: 45,
  },
  {
    id: "103",
    title: "The Art of Code Review",
    excerpt: "Best practices for giving and receiving code reviews that improve code quality and team culture.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
    tag: "Engineering",
    tagClass: Style.tagBlue,
    readTime: "6 min read",
    date: "Nov 28, 2023",
    likes: 312,
    comments: 58,
  },
  {
    id: "104",
    title: "Mindful Coding: Avoiding Burnout",
    excerpt: "Strategies for maintaining mental health and productivity as a software developer.",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop",
    tag: "Lifestyle",
    tagClass: "tag-lifestyle",
    readTime: "5 min read",
    date: "Nov 25, 2023",
    likes: 421,
    comments: 67,
  },
];

/** 趋势页文章列表 */
export const TRENDING_ARTICLES: Article[] = [
  {
    id: "201",
    title: "AI-Powered Development: The Next Frontier",
    excerpt: "How AI assistants are transforming the way we write, review, and deploy code in 2024.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
    tag: "Engineering",
    tagClass: Style.tagBlue,
    readTime: "12 min read",
    date: "Dec 10, 2023",
    likes: 1024,
    comments: 156,
  },
  {
    id: "202",
    title: "Rust for Web Developers: A Gentle Introduction",
    excerpt: "Why Rust is gaining popularity among web developers and how to get started.",
    image: "https://images.unsplash.com/photo-1623479322729-28b25c16b011?w=400&h=250&fit=crop",
    tag: "Tutorials",
    tagClass: "tag-tutorials",
    readTime: "15 min read",
    date: "Dec 08, 2023",
    likes: 876,
    comments: 98,
  },
  {
    id: "203",
    title: "The Rise of Edge Computing",
    excerpt: "Understanding how edge computing is reshaping application architecture and user experience.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop",
    tag: "Architecture",
    tagClass: "tag-architecture",
    readTime: "10 min read",
    date: "Dec 06, 2023",
    likes: 654,
    comments: 72,
  },
  {
    id: "204",
    title: "Accessibility-First Design Patterns",
    excerpt: "Building inclusive digital experiences with practical accessibility patterns and techniques.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    tag: "Design",
    tagClass: Style.tagIndigo,
    readTime: "8 min read",
    date: "Dec 04, 2023",
    likes: 543,
    comments: 61,
  },
  {
    id: "205",
    title: "Micro-Frontends in Production",
    excerpt: "Real-world lessons learned from implementing micro-frontend architectures at scale.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
    tag: "Frontend",
    tagClass: "tag-frontend",
    readTime: "11 min read",
    date: "Dec 02, 2023",
    likes: 432,
    comments: 54,
  },
];

/** 趋势标签列表（含文章数与增长百分比） */
export const TRENDING_TAGS: TrendingTag[] = [
  { name: "AI & ML", count: "2.4k articles", trend: "+34%" },
  { name: "Rust", count: "1.8k articles", trend: "+28%" },
  { name: "Edge Computing", count: "1.2k articles", trend: "+22%" },
  { name: "WebAssembly", count: "980 articles", trend: "+18%" },
  { name: "Accessibility", count: "870 articles", trend: "+15%" },
  { name: "TypeScript 5.0", count: "760 articles", trend: "+12%" },
  { name: "Serverless", count: "650 articles", trend: "+10%" },
  { name: "Design Systems", count: "540 articles", trend: "+8%" },
];

/** 首页精选作者 */
export const FEATURED_AUTHORS: FeaturedAuthor[] = [
  {
    name: "Alex Chen",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    role: "Senior Frontend Engineer",
    articles: 48,
    followers: "12.5k",
    slug: "alex-chen",
  },
  {
    name: "Sarah Miller",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    role: "Product Designer",
    articles: 32,
    followers: "8.9k",
    slug: "sarah-miller",
  },
  {
    name: "David Park",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    role: "Lead Developer",
    articles: 27,
    followers: "6.3k",
    slug: "david-park",
  },
];
