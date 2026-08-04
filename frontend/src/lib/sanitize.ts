/**
 * @file sanitize.ts
 * @description HTML 消毒工具，使用 isomorphic-dompurify 同构支持 SSR 和客户端
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * HTML 消毒 — 使用 DOMPurify，同构支持 SSR 和客户端
 * 移除 script/事件处理器/javascript: 协议等危险内容
 * @param html 可能含恶意脚本的 HTML 字符串
 * @returns 消毒后的安全 HTML
 */
/**
 * 使用 isomorphic-dompurify，同构支持服务端和客户端
 * @param html 可能含恶意脚本的 HTML 字符串
 * @returns 消毒后的安全 HTML
 */
export function sanitizeArticleContent(html: string): string {
  if (!html) return '';
  try {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'hr',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'strong',
        'b',
        'em',
        'i',
        'u',
        's',
        'del',
        'mark',
        'sub',
        'sup',
        'a',
        'img',
        'blockquote',
        'q',
        'cite',
        'ul',
        'ol',
        'li',
        'dl',
        'dt',
        'dd',
        'code',
        'pre',
        'kbd',
        'samp',
        'var',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'caption',
        'colgroup',
        'col',
        'div',
        'span',
        'figure',
        'figcaption',
        'details',
        'summary',
        'abbr',
        'address',
        'time',
        'small',
      ],
      ALLOWED_ATTR: [
        'href',
        'src',
        'alt',
        'title',
        'class',
        'id',
        'width',
        'height',
        'colspan',
        'rowspan',
        'target',
        'rel',
        'download',
        'datetime',
        'cite',
        'start',
        'type',
        'value',
        'open',
        'data-language',
      ],
      ALLOW_DATA_ATTR: true,
    });
  } catch {
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
      .replace(/<object[\s\S]*?<\/object>/gi, '')
      .replace(/<embed[\s\S]*?<\/embed>/gi, '')
      .replace(/<form[\s\S]*?<\/form>/gi, '')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
      .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)\s*=["']\s*(?:javascript|vbscript):[^"']*["']/gi, '');
  }
}
