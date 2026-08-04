/**
 * @file markdown.service.ts
 * @description Markdown 渲染服务，将 Markdown 文本转为安全的 HTML，防止 XSS 攻击。
 *              使用 marked + marked-highlight + highlight.js 实现代码语法高亮。
 */

import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import sanitizeHtml from 'sanitize-html';

/**
 * 创建带代码高亮能力的 Marked 实例
 * - markedHighlight 拦截 code block，调用 hljs.highlightAuto 进行语法高亮
 * - 未知语言时 hljs.highlightAuto 会尝试自动检测，失败则原样返回
 */
const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = lang && hljs.getLanguage(lang) ? lang : '';
      if (language) {
        try {
          return hljs.highlight(code, { language }).value;
        } catch {
          // fallthrough to auto
        }
      }
      try {
        return hljs.highlightAuto(code).value;
      } catch {
        return code;
      }
    },
  }),
);

marked.setOptions({
  gfm: true,
  breaks: true,
});

// sanitize-html 允许的标签和属性白名单
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'br',
    'hr',
    'blockquote',
    'strong',
    'em',
    'del',
    's',
    'ul',
    'ol',
    'li',
    'a',
    'img',
    'pre',
    'code',
    'span',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'div',
    'figure',
    'figcaption',
    'input', // checkbox 列表
  ],
  allowedAttributes: {
    '*': ['class', 'id'],
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    code: ['class', 'data-language'],
    pre: ['class', 'data-language'],
    span: ['class'],
    input: ['type', 'checked', 'disabled'],
    th: ['align'],
    td: ['align'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {
    img: ['http', 'https', 'data'],
  },
  transformTags: {
    // 给外链添加安全属性
    a: (tagName, attribs) => {
      if (attribs.href && !attribs.href.startsWith('#')) {
        return {
          tagName,
          attribs: {
            ...attribs,
            target: '_blank',
            rel: 'noopener noreferrer nofollow',
          },
        };
      }
      return { tagName, attribs };
    },
  },
  disallowedTagsMode: 'escape',
};

/**
 * 将 Markdown 文本渲染为安全的 HTML（含代码语法高亮）
 * @param markdown 原始 Markdown 文本
 * @returns 经过 sanitize 的 HTML 字符串，可直接用于 dangerouslySetInnerHTML
 */
export function renderMarkdown(markdown: string): string {
  if (!markdown) return '';
  // 1. marked 将 Markdown 转为 HTML（含 hljs 代码高亮）
  const rawHtml = marked.parse(markdown, { async: false }) as string;
  // 2. sanitize-html 过滤危险标签和属性（如 <script>, onerror 等）
  return sanitizeHtml(rawHtml, SANITIZE_OPTIONS);
}
