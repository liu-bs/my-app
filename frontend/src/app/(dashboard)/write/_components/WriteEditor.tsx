/**
 * @file WriteEditor.tsx
 * @description 写文章/编辑文章客户端组件，支持标题、分类、标签、正文编辑与发布
 */
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Eye, ArrowLeft, ChevronDown, X, Columns2, Pencil } from 'lucide-react';
import toast from '@/lib/toast';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { PageHeader } from '@/components/layout/PageHeader';
import { Tag, tagVariantFor } from '@/components/ui/Tag';
import { MarkdownToolbar } from '@/components/MarkdownToolbar';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useCreatePost, useUpdatePost, usePost } from '@/services/blog/hooks';
import { ApiRequestError } from '@/lib/api/request';
import { estimateReadingTime } from '@/lib/markdown';
import { sanitizeArticleContent } from '@/lib/sanitize';
import type { PostData } from '@my-app/shared';

/**
 * 动态加载 marked + highlight.js，避免 ~100KB 阻塞初始加载
 */
let markdownRendererPromise: Promise<(content: string) => string> | null = null;

function getMarkdownRenderer(): Promise<(content: string) => string> {
  if (markdownRendererPromise) return markdownRendererPromise;
  markdownRendererPromise = (async () => {
    const [
      { marked },
      { default: hljs },
      { default: javascript },
      { default: typescript },
      { default: xml },
      { default: css },
      { default: json },
      { default: bash },
      { default: python },
      { default: sql },
    ] = await Promise.all([
      import('marked'),
      import('highlight.js/lib/core'),
      import('highlight.js/lib/languages/javascript'),
      import('highlight.js/lib/languages/typescript'),
      import('highlight.js/lib/languages/xml'),
      import('highlight.js/lib/languages/css'),
      import('highlight.js/lib/languages/json'),
      import('highlight.js/lib/languages/bash'),
      import('highlight.js/lib/languages/python'),
      import('highlight.js/lib/languages/sql'),
    ]);

    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('js', javascript);
    hljs.registerLanguage('typescript', typescript);
    hljs.registerLanguage('ts', typescript);
    hljs.registerLanguage('xml', xml);
    hljs.registerLanguage('html', xml);
    hljs.registerLanguage('css', css);
    hljs.registerLanguage('json', json);
    hljs.registerLanguage('bash', bash);
    hljs.registerLanguage('sh', bash);
    hljs.registerLanguage('python', python);
    hljs.registerLanguage('py', python);
    hljs.registerLanguage('sql', sql);

    const renderer = new marked.Renderer();
    renderer.code = ({ text, lang }) => {
      const code = text.replace(/\n$/, '');
      try {
        const language = lang && hljs.getLanguage(lang) ? lang : '';
        const highlighted = language
          ? hljs.highlight(code, { language }).value
          : hljs.highlightAuto(code).value;
        return `<pre><code class="hljs language-${lang || 'plaintext'}">${highlighted}</code></pre>`;
      } catch {
        return `<pre><code class="hljs">${code}</code></pre>`;
      }
    };

    marked.setOptions({ gfm: true, breaks: true });

    return (content: string) => {
      const raw = marked.parse(content, { async: false }) as string;
      return sanitizeArticleContent(raw);
    };
  })();
  return markdownRendererPromise;
}

export function WriteEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const isEditMode = !!editId;
  const { data: postData, isLoading: isLoadingPost, isError: isPostError } = usePost(editId || '');
  const editingPost = postData?.post;

  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const mutation = isEditMode ? updatePostMutation : createPostMutation;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('技术');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [summary, setSummary] = useState('');
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>(() => {
    if (typeof window === 'undefined') return 'split';
    return window.innerWidth < 1024 ? 'edit' : 'split';
  });

  const hasPrefilled = useRef(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // 编辑模式：预填表单
  useEffect(() => {
    if (isEditMode && editingPost && !hasPrefilled.current) {
      setTitle(editingPost.title);
      setCategory(editingPost.category);
      setTags(editingPost.tags || []);
      setContent(editingPost.contentRaw ?? editingPost.content);
      setCoverImage(editingPost.coverImage || '');
      setSummary(editingPost.summary || '');
      hasPrefilled.current = true;
    }
  }, [isEditMode, editingPost]);

  // 预览渲染
  const [previewHtml, setPreviewHtml] = useState('');
  useEffect(() => {
    if (!content) {
      setPreviewHtml('');
      return;
    }
    let cancelled = false;
    getMarkdownRenderer()
      .then((render) => {
        if (!cancelled) setPreviewHtml(render(content));
      })
      .catch(() => {
        if (!cancelled) setPreviewHtml(content);
      });
    return () => {
      cancelled = true;
    };
  }, [content]);

  const insertMarkdown = useCallback(
    (before: string, after?: string, placeholder?: string) => {
      const textarea = contentRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const insertText = selectedText || placeholder || '';
      const newText =
        content.substring(0, start) + before + insertText + (after || '') + content.substring(end);
      setContent(newText);
      requestAnimationFrame(() => {
        textarea.focus();
        const cursorPos = start + before.length + insertText.length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      });
    },
    [content],
  );

  if (isEditMode && isLoadingPost) {
    return (
      <Container className="page-section">
        <LoadingSkeleton />
      </Container>
    );
  }

  if (isEditMode && isPostError) {
    return (
      <Container className="page-section">
        <EmptyState
          icon={<Pencil size={20} />}
          title="文章加载失败"
          description="网络异常或文章不存在，请返回重试"
          action={
            <Button href="/profile" variant="ghost" size="sm">
              返回我的文章
            </Button>
          }
        />
      </Container>
    );
  }

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags((prev) => [...prev, t]);
      setTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setTags((prev) => prev.filter((x) => x !== t));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const handleTagBlur = () => {
    if (tagInput.trim()) addTag();
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('请输入文章标题');
      return;
    }
    if (!content.trim()) {
      toast.error('请输入文章内容');
      return;
    }

    const dto = {
      title: title.trim(),
      content,
      summary: summary.trim() || undefined,
      category,
      tags,
      isDraft: false as const,
      coverImage: coverImage.trim() || undefined,
    };

    const onSuccess = (data: PostData) => {
      toast.success(isEditMode ? '文章已更新' : '文章已发布');
      router.push(data?.post?.id ? `/posts/${data.post.id}` : '/posts');
    };

    const onError = (err: Error) => {
      if (err instanceof ApiRequestError) {
        if (err.details?.length) toast.error(err.details.map((d) => d.message).join('；'));
        else if (err.isUnauthorized) toast.error('请先登录后再操作');
        else toast.error(err.message || '保存失败');
      } else {
        toast.error(err.message || '保存失败，请重试');
      }
    };

    if (isEditMode && editId) {
      updatePostMutation.mutate({ id: editId, dto }, { onSuccess, onError });
    } else {
      createPostMutation.mutate(dto, { onSuccess, onError });
    }
  };

  const handleBack = () => {
    router.push('/profile');
  };

  return (
    <Container className="page-section max-w-350">
      <PageHeader
        title={
          <h1 className="page-title max-md:page-title-mobile">
            {isEditMode ? '编辑文章' : '写文章'}
          </h1>
        }
        actions={
          <div className="row-sm">
            <div className="segmented">
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={`segmented-item lg:hidden ${viewMode === 'edit' ? 'segmented-item-on' : ''}`}
                aria-label="仅编辑"
              >
                <Pencil size={12} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`segmented-item ${viewMode === 'split' ? 'segmented-item-on' : ''}`}
                aria-label="分栏"
              >
                <Columns2 size={12} />
                <span className="hidden sm:inline">分栏</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`segmented-item lg:hidden ${viewMode === 'preview' ? 'segmented-item-on' : ''}`}
                aria-label="仅预览"
              >
                <Eye size={12} />
              </button>
            </div>
          </div>
        }
      />

      <form id="write-form" onSubmit={handleSave}>
        <div className="form-stack">
          {/* title */}
          <div className="anim-fade-up stagger-2">
            <input
              id="title"
              type="text"
              placeholder="输入文章标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className={`input-field input-focus text-heading py-3 text-(length:--type-3xl) leading-tight font-bold max-md:py-2 max-md:text-(length:--type-xl)`}
            />
          </div>

          {/* category + tags */}
          <div className="anim-fade-up stagger-3 grid grid-cols-1 gap-4 sm:grid-cols-[180px_1fr]">
            <FormField label="分类">
              <div className="relative">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`input-field input-focus appearance-none pr-8`}
                >
                  {['技术', '设计', '生活', '产品', '创业', '其他'].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`text-faint pointer-events-none absolute top-1/2 right-3 -translate-y-1/2`}
                />
              </div>
            </FormField>

            <FormField label="标签" hint="按回车添加标签（最多 5 个）">
              <div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <Tag
                      key={t}
                      variant={tagVariantFor(t)}
                      size="md"
                      className="inline-flex items-center gap-1"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className={`inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm text-current/70 transition-colors duration-150 hover:text-current`}
                        aria-label="删除标签"
                      >
                        <X size={12} />
                      </button>
                    </Tag>
                  ))}
                  {tags.length < 5 && (
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      onBlur={handleTagBlur}
                      placeholder="添加标签"
                      className={`border-stroke bg-page text-body placeholder:text-faint input-focus h-7 w-32 rounded-sm border px-2.5 text-(length:--type-xs) leading-normal`}
                    />
                  )}
                </div>
              </div>
            </FormField>
          </div>

          {/* cover image */}
          <div className="anim-fade-up stagger-4">
            <FormField label="封面图链接" hint="可选，输入图片 URL">
              <input
                type="url"
                placeholder="https://example.com/cover.jpg"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="input-field input-focus"
              />
              {coverImage.trim() && (
                <div className="border-stroke mt-3 overflow-hidden rounded-lg border">
                  <Image
                    src={coverImage.trim()}
                    alt="封面预览"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}
            </FormField>
          </div>

          {/* summary */}
          <div className="anim-fade-up stagger-4">
            <FormField label="摘要" hint="可选，留空则自动从正文截取（最多 500 字）">
              <textarea
                placeholder="输入文章摘要，用于列表与分享展示..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                maxLength={500}
                rows={2}
                className="textarea-field input-focus text-(length:--type-sm)"
              />
            </FormField>
          </div>

          {/* content — 分栏编辑器 */}
          <div className="anim-fade-up stagger-5">
            {/* 桌面端分栏 */}
            <div className="hidden grid-cols-2 gap-4 lg:grid">
              <div className="border-stroke-strong bg-page flex flex-col rounded-lg border">
                <div className="border-stroke border-b px-3 py-2">
                  <MarkdownToolbar onInsert={insertMarkdown} />
                </div>
                <textarea
                  ref={contentRef}
                  id="content"
                  placeholder="开始写作..."
                  onKeyDown={(e) => {
                    if (e.metaKey || e.ctrlKey) {
                      if (e.key === 'b') {
                        e.preventDefault();
                        insertMarkdown('**', '**', '加粗文字');
                      } else if (e.key === 'i') {
                        e.preventDefault();
                        insertMarkdown('*', '*', '斜体文字');
                      } else if (e.key === 'k') {
                        e.preventDefault();
                        insertMarkdown('[', '](https://)', '链接文字');
                      }
                    }
                  }}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`text-body placeholder:text-faint min-h-[60vh] w-full flex-1 resize-none rounded-b-lg border-0 bg-transparent px-3.5 py-3 font-mono text-(length:--type-sm) leading-loose focus:outline-none`}
                />
              </div>
              <div className="border-stroke-strong bg-page min-h-[60vh] overflow-y-auto rounded-lg border p-5">
                <div
                  className="article-content text-(length:--type-md) leading-loose"
                  dangerouslySetInnerHTML={{
                    __html: previewHtml || "<span class='text-faint'>暂无内容</span>",
                  }}
                />
              </div>
            </div>

            {/* 移动端单列 */}
            <div className="lg:hidden">
              {viewMode === 'preview' ? (
                <div
                  className="article-content border-stroke-strong bg-page min-h-[60vh] rounded-lg border p-5 text-(length:--type-md) leading-loose"
                  dangerouslySetInnerHTML={{
                    __html: previewHtml || "<span class='text-faint'>暂无内容</span>",
                  }}
                />
              ) : (
                <>
                  <MarkdownToolbar onInsert={insertMarkdown} />
                  <textarea
                    ref={contentRef}
                    id="content"
                    placeholder="开始写作..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={20}
                    className={`textarea-field input-focus min-h-100 font-mono text-(length:--type-sm) leading-loose`}
                  />
                </>
              )}
            </div>
          </div>

          {/* bottom actions */}
          <div
            className={`row-md border-stroke anim-fade-up stagger-6 justify-between border-t pt-5`}
          >
            <span className={`text-muted text-(length:--type-sm) leading-normal`}>
              {content.length > 0
                ? `已输入 ${content.length} 字符 · 约 ${estimateReadingTime(content)} 分钟阅读`
                : '开始写作...'}
            </span>
            <div className="row-sm">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft size={14} />
                返回
              </Button>
              <Button
                type="submit"
                name="intent"
                value="publish"
                loading={mutation.isPending}
                disabled={mutation.isPending}
              >
                {isEditMode ? '更新文章' : '发布文章'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Container>
  );
}
