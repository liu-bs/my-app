/**
 * @file ArticleTableOfContents.tsx
 * @description 文章详情页目录组件，解析正文中的 h2 标题生成锚点目录，并高亮当前滚动到的章节
 */
"use client";

import { FC, useEffect, useState } from "react";
import { List } from "lucide-react";

/**
 * 目录组件的 Props
 */
interface ArticleTableOfContentsProps {
  /** 文章正文的 HTML 字符串，用于解析 h2 标签生成目录 */
  content: string;
}

/**
 * 目录条目数据结构
 */
interface TocItem {
  /** 锚点 ID，格式为 section-<index> */
  id: string;
  /** 标题文本 */
  text: string;
  /** 标题层级，固定为 2（仅解析 h2） */
  level: number;
}

/**
 * 文章详情页目录组件
 * 解析传入的 HTML 字符串，提取 h2 标签生成目录；通过 IntersectionObserver 监听当前可见章节并高亮，点击目录项平滑滚动到对应位置；同时将 h2 注入 ID 并写入 DOM
 * @param props 组件入参
 * @param props.content 文章正文的 HTML 字符串
 * @returns 渲染完成的目录 JSX；若解析不到 h2 则返回 null
 */
const ArticleTableOfContents: FC<ArticleTableOfContentsProps> = ({ content }) => {
  /** 解析后的目录条目列表 */
  const [headings, setHeadings] = useState<TocItem[]>([]);
  /** 当前高亮的目录项 ID */
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // 解析 HTML 字符串并提取所有 h2 标签生成目录
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const h2Elements = doc.querySelectorAll("h2");
    const items: TocItem[] = [];

    h2Elements.forEach((h2, index) => {
      const id = `section-${index}`;
      items.push({
        id,
        text: h2.textContent || "",
        level: 2,
      });
    });

    setHeadings(items);
  }, [content]);

  useEffect(() => {
    // 监听各章节进入视口，更新高亮状态
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    // 为正文中的 h2 注入 ID，并替换到 data-article-content 容器内，确保锚点跳转与 IntersectionObserver 可定位
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const h2Elements = doc.querySelectorAll("h2");
    h2Elements.forEach((h2, index) => {
      h2.id = `section-${index}`;
    });

    const articleContent = document.querySelector("[data-article-content]");
    if (articleContent) {
      articleContent.innerHTML = doc.body.innerHTML;
    }
  }, [content]);

  // 解析不到 h2 时不渲染目录
  if (headings.length === 0) return null;

  /**
   * 点击目录项时，平滑滚动到对应章节
   * @param id 目标章节的 DOM 元素 ID
   */
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>{/* 文章目录容器，粘性定位以便阅读时始终可见 */}
      <div className="border-border bg-surface sticky top-24 rounded-xl border p-5">
        {/* 目录标题区：图标 + 标题 */}
        <div className="mb-4 flex items-center gap-2">
          <List className="text-accent h-4 w-4" />
          <h3 className="text-text-primary text-sm font-semibold">Table of Contents</h3>
        </div>
        {/* 目录列表区，遍历渲染所有 h2 目录项 */}
        <nav className="space-y-1">
          {/* 遍历渲染目录条目，点击跳转对应章节并高亮 */}
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => handleClick(heading.id)}
              className={`block w-full text-left text-sm transition-colors ${activeId === heading.id ? "text-accent font-medium" : "text-text-secondary hover:text-text-primary"}`}
            >
              <span className={`inline-block transition-all ${activeId === heading.id ? "border-accent w-4 border-l-2 pl-2" : "w-4 border-l-2 border-transparent pl-2"}`}>
                {heading.text}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default ArticleTableOfContents;
