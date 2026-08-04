/**
 * @file WriteEditor.tsx
 * @description 写文章/编辑文章客户端组件，支持标题、分类、标签、正文编辑与草稿/发布双模式
 */
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Save, Eye, ArrowLeft, ChevronDown, X, Check, Columns2, Pencil } from 'lucide-react';
import toast from '@/lib/toast';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { PageHeader } from '@/components/layout/PageHeader';
import { Tag, tagVariantFor } from '@/components/ui/Tag';
import { Modal } from '@/components/ui/Modal';
import { MarkdownToolbar } from '@/components/MarkdownToolbar';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useCreatePost, useUpdatePost, usePost } from '@/services/blog/hooks';
import { ApiRequestError } from '@/lib/api/request';
import { estimateReadingTime } from '@/lib/markdown';
import { sanitizeArticleContent } from '@/lib/sanitize';
import type { WritePageSaveStatus, PostData } from '@my-app/shared';

/**
 * 动态加载 marked + highlight.js，避免 ~100KB 阻塞初始加载
 * 仅在首次需要预览渲染时加载，之后缓存复用
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

/**
 * 写文章/编辑文章页
 * @description 支持标题、分类、标签、正文编辑，草稿保存与发布双模式，编辑模式预填表单
 */
export function WriteEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  /** 编辑模式下的文章 ID */
  const editId = searchParams.get('id');

  /** 是否为编辑模式 */
  const isEditMode = !!editId;
  const { data: postData, isLoading: isLoadingPost, isError: isPostError } = usePost(editId || '');
  /** 正在编辑的文章数据 */
  const editingPost = postData?.post;

  /** 创建文章 mutation */
  const createPostMutation = useCreatePost();
  /** 更新文章 mutation */
  const updatePostMutation = useUpdatePost();
  /** 当前使用的 mutation（根据模式自动切换） */
  const mutation = isEditMode ? updatePostMutation : createPostMutation;

  /** 文章标题 */
  const [title, setTitle] = useState('');
  /** 文章分类 */
  const [category, setCategory] = useState('技术');
  /** 标签列表 */
  const [tags, setTags] = useState<string[]>([]);
  /** 标签输入框值 */
  const [tagInput, setTagInput] = useState('');
  /** 文章正文内容 */
  const [content, setContent] = useState('');
  /** 封面图 URL */
  const [coverImage, setCoverImage] = useState('');
  /** 文章摘要（留空则后端自动生成） */
  const [summary, setSummary] = useState('');
  /** 保存状态（idle/saved） */
  const [saveStatus, setSaveStatus] = useState<WritePageSaveStatus>('idle');
  /** 视图模式：split=分栏(桌面默认), edit=仅编辑, preview=仅预览 */
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>(() => {
    if (typeof window === 'undefined') return 'split';
    return window.innerWidth < 1024 ? 'edit' : 'split';
  });
  /** 下架确认弹窗（编辑已发布文章点保存草稿时弹出） */
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);
  /** 待执行的提交动作（确认下架后执行） */
  const pendingSaveRef = useRef<{ isDraft: boolean } | null>(null);

  /** 保存请求加载中标记 */
  const saving = mutation.isPending;
  /**
   * 保存状态自动重置的定时器引用
   */
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /**
   * 表单是否已预填标记，防止编辑模式下重复填充
   */
  const hasPrefilled = useRef(false);

  // localStorage 兜底 key（按编辑id或new区分）
  const draftKey = `write-draft-${editId || 'new'}`;

  // 离开拦截：有内容时阻止关闭/刷新 + 路由级守卫
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (title.trim() || content.trim()) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [title, content]);

  // localStorage 实时暂存（debounce 1s），编辑模式预填完成后才写
  useEffect(() => {
    if (isEditMode && !hasPrefilled.current) return;
    if (!title.trim() && !content.trim()) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          draftKey,
          JSON.stringify({ title, content, category, tags, coverImage, summary, ts: Date.now() }),
        );
      } catch {
        // 忽略 quota 错误
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [title, content, category, tags, coverImage, summary, draftKey, isEditMode]);

  /**
   * 编辑模式：文章数据到达后预填表单字段
   */
  // 编辑模式：文章数据到达后预填表单
  useEffect(() => {
    if (isEditMode && editingPost && !hasPrefilled.current) {
      setTitle(editingPost.title);
      setCategory(editingPost.category);
      setTags(editingPost.tags || []);
      // 优先用 contentRaw（原始 Markdown），回退到 content（兼容旧数据）
      setContent(editingPost.contentRaw ?? editingPost.content);
      setCoverImage(editingPost.coverImage || '');
      setSummary(editingPost.summary || '');
      hasPrefilled.current = true;

      // localStorage 恢复兜底：若本地有暂存，让用户选择是否恢复
      try {
        const local = localStorage.getItem(draftKey);
        if (local) {
          const data = JSON.parse(local);
          // 仅当本地暂存存在且内容非空时提示恢复
          if (data && (data.title?.trim() || data.content?.trim())) {
            const shouldRestore = window.confirm(
              '检测到本地有未保存的编辑内容，是否恢复？\n点击"取消"将使用服务端最新版本。',
            );
            if (shouldRestore) {
              setTitle(data.title || '');
              setContent(data.content || '');
              setCategory(data.category || '技术');
              setTags(data.tags || []);
              setCoverImage(data.coverImage || '');
              setSummary(data.summary || '');
              toast.info('已从本地恢复未保存的内容');
            } else {
              localStorage.removeItem(draftKey);
            }
          }
        }
      } catch {
        // 忽略
      }
    }
  }, [isEditMode, editingPost, draftKey]);

  /**
   * 组件卸载时清除保存状态定时器，避免内存泄漏
   */
  useEffect(() => {
    return () => {
      if (statusTimer.current) clearTimeout(statusTimer.current);
    };
  }, []);

  /**
   * 设置已保存状态并安排 3s 后自动重置为 idle
   */
  const resetSaveStatus = useCallback(() => {
    setSaveStatus('saved');
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setSaveStatus('idle'), 3000);
  }, []);

  /**
   * 草稿自动保存：标题或内容变化时，debounce 3s 自动保存草稿
   * 仅在已有标题+内容、且非发布模式下触发
   */
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    // 编辑模式预填完成前不触发自动保存
    if (isEditMode && !hasPrefilled.current) return;
    // 标题和内容都为空时不自动保存
    if (!title.trim() && !content.trim()) return;
    // 已发布的文章不自动保存（仅草稿模式）
    // 如果当前正在保存中，不重复触发
    if (saving) return;

    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      // 仅在标题非空时才自动保存
      if (!title.trim()) return;
      setSaveStatus('idle');
      const dto = {
        title: title.trim(),
        content,
        category,
        tags,
        isDraft: true as const,
        coverImage: coverImage.trim() || undefined,
      };
      if (isEditMode && editId) {
        updatePostMutation.mutate(
          { id: editId, dto },
          {
            onSuccess: () => {
              resetSaveStatus();
            },
          },
        );
      } else {
        createPostMutation.mutate(dto, {
          onSuccess: (data: PostData) => {
            resetSaveStatus();
            // 首次自动保存后切换为编辑模式，避免重复创建
            if (data?.post?.id) {
              router.replace(`/write?id=${data.post.id}`);
            }
          },
        });
      }
    }, 3000);

    return () => {
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, category, tags, coverImage]);

  // 预览 HTML（从 Markdown 实时渲染，含 hljs 代码高亮，与后端渲染对齐）
  // marked + hljs 动态加载，首屏不阻塞
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

  // Markdown 工具栏插入回调：在 textarea 当前光标位置插入语法
  const contentRef = useRef<HTMLTextAreaElement>(null);
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
      // 设置光标位置到插入内容之后
      requestAnimationFrame(() => {
        textarea.focus();
        const cursorPos = start + before.length + insertText.length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      });
    },
    [content],
  );

  // 编辑模式下等待数据加载（必须在所有 hooks 之后，避免 hooks 顺序不一致）
  if (isEditMode && isLoadingPost) {
    return (
      <Container className="page-section">
        <LoadingSkeleton />
      </Container>
    );
  }

  // 编辑模式下文章加载失败
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

  /**
   * 添加标签，去重且最多 5 个
   */
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags((prev) => [...prev, t]);
      setTagInput('');
    }
  };

  /**
   * 移除指定标签
   * @param t 要移除的标签
   */
  const removeTag = (t: string) => {
    setTags((prev) => prev.filter((x) => x !== t));
  };

  /**
   * 标签输入框键盘事件处理，回车或逗号时添加标签
   * @param e 键盘事件
   */
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  /**
   * 标签输入框失焦时提交当前输入
   */
  const handleTagBlur = () => {
    if (tagInput.trim()) addTag();
  };

  /**
   * 表单提交处理，通过 submitter 区分保存草稿与发布文章
   * @param e 表单事件
   */
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 通过 submitter 区分「保存草稿」(value=draft) /「发布文章」(value=publish)
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
    const isDraft = submitter?.getAttribute('value') === 'draft';

    if (!title.trim()) {
      toast.error('请输入文章标题');
      return;
    }
    if (!content.trim()) {
      toast.error('请输入文章内容');
      return;
    }

    // 编辑已发布文章点"保存草稿"=下架，需二次确认
    if (isDraft && isEditMode && editingPost && !editingPost.isDraft) {
      pendingSaveRef.current = { isDraft: true };
      setShowUnpublishConfirm(true);
      return;
    }

    doSave(isDraft);
  };

  /**
   * 实际执行保存/发布
   * @param isDraft 是否保存为草稿
   */
  const doSave = (isDraft: boolean) => {
    setSaveStatus('idle');

    /**
     * 保存/发布成功回调，草稿模式显示已保存状态，发布模式跳转文章详情
     * @param data 接口返回数据
     */
    const onSuccess = (data: PostData) => {
      clearLocalDraft();
      if (isDraft) {
        resetSaveStatus();
        toast.success(isEditMode ? '草稿已更新' : '草稿已保存');
      } else {
        toast.success(isEditMode ? '文章已更新' : '文章已发布');
        router.push(data?.post?.id ? `/posts/${data.post.id}` : '/posts');
      }
    };

    /**
     * 保存/发布失败回调，设置错误状态并展示错误提示
     * @param err 错误对象
     */
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
      updatePostMutation.mutate(
        {
          id: editId,
          dto: {
            title: title.trim(),
            content,
            summary: summary.trim() || undefined,
            category,
            tags,
            isDraft,
            coverImage: coverImage.trim() || undefined,
          },
        },
        { onSuccess, onError },
      );
    } else {
      createPostMutation.mutate(
        {
          title: title.trim(),
          content,
          summary: summary.trim() || undefined,
          category,
          tags,
          isDraft,
          coverImage: coverImage.trim() || undefined,
        },
        { onSuccess, onError },
      );
    }
  };

  /** 确认下架（转草稿）后执行保存 */
  const confirmUnpublish = () => {
    setShowUnpublishConfirm(false);
    if (pendingSaveRef.current) {
      const { isDraft } = pendingSaveRef.current;
      pendingSaveRef.current = null;
      doSave(isDraft);
    }
  };

  /** 保存/发布成功后清除 localStorage 暂存 */
  const clearLocalDraft = () => {
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // 忽略
    }
  };

  /** 返回我的文章，有未保存内容时二次确认 */
  const handleBack = () => {
    if (
      (title.trim() || content.trim()) &&
      !window.confirm('有未保存的内容，离开将丢失。确认离开吗？')
    )
      return;
    router.push('/profile');
  };

  return (
    <Container className="page-section max-w-350">
      <PageHeader
        title={
          <div className="row-md">
            <h1 className="page-title max-md:page-title-mobile">
              {isEditMode ? '编辑文章' : '写文章'}
            </h1>
            {saveStatus === 'saved' && (
              <span className="chip">
                <Check size={12} />
                已保存
              </span>
            )}
          </div>
        }
        actions={
          <div className="row-sm">
            {/* 视图模式切换：移动端显示编辑/预览，桌面端显示分栏切换 */}
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
            <Button
              type="submit"
              form="write-form"
              name="intent"
              value="draft"
              loading={saving}
              disabled={saving}
              size="sm"
            >
              <Save size={14} />
              保存草稿
            </Button>
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
              {/* 封面图实时预览 */}
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

          {/* summary 摘要 */}
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
            {/* 桌面端分栏布局 */}
            <div className="hidden grid-cols-2 gap-4 lg:grid">
              {/* 左侧：编辑面板 */}
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
              {/* 右侧：预览面板 */}
              <div className="border-stroke-strong bg-page min-h-[60vh] overflow-y-auto rounded-lg border p-5">
                <div
                  className="article-content text-(length:--type-md) leading-loose"
                  dangerouslySetInnerHTML={{
                    __html: previewHtml || "<span class='text-faint'>暂无内容</span>",
                  }}
                />
              </div>
            </div>

            {/* 移动端单列切换布局 */}
            <div className="lg:hidden">
              {viewMode === 'preview' ? (
                // 移动端预览模式
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
                : '开始写作，草稿会自动保存'}
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
                loading={saving}
                disabled={saving}
              >
                <Save size={14} />
                {isEditMode ? '更新文章' : '发布文章'}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* 下架确认弹窗：编辑已发布文章点保存草稿时 */}
      <Modal
        open={showUnpublishConfirm}
        onClose={() => {
          setShowUnpublishConfirm(false);
          pendingSaveRef.current = null;
        }}
        title="确认下架"
      >
        <p className="text-body text-(length:--type-base) leading-normal">
          此操作将把已发布的文章转为草稿，读者将无法访问。确认下架吗？
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setShowUnpublishConfirm(false);
              pendingSaveRef.current = null;
            }}
          >
            取消
          </Button>
          <Button variant="danger" onClick={confirmUnpublish} loading={saving}>
            确认下架
          </Button>
        </div>
      </Modal>
    </Container>
  );
}
