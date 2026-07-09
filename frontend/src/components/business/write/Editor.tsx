/**
 * @file Editor.tsx
 * @description 写作页编辑器组件，包含标题输入、Markdown 工具栏、内容区与封面图上传
 */

"use client";

import { FC, useRef, useState } from "react";
import { Bold, ImageIcon, Italic, Link, List, ListOrdered, Quote } from "lucide-react";

/**
 * 写作页编辑器组件
 * 提供标题输入、Markdown 快捷插入工具栏、内容编辑区与封面图上传/移除能力
 */
const Editor: FC = () => {
  /** 文章标题 */
  const [title, setTitle] = useState("");
  /** 文章正文（Markdown 文本） */
  const [content, setContent] = useState("");
  /** 封面图 DataURL 预览，null 表示未上传 */
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  /** 隐藏的文件输入 ref，用于点击上传区域时触发文件选择 */
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 在编辑器中插入 Markdown 片段
   * 包裹当前选区，无选区时仅插入前缀
   *
   * @param prefix 前缀字符串（如 "**" 表示加粗起始）
   * @param [suffix] 后缀字符串；可选，缺省时只插入前缀
   */
  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.querySelector('textarea[placeholder="Start writing your article..."]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    const newContent = beforeText + prefix + selectedText + suffix + afterText;
    setContent(newContent);

    // 恢复光标位置：有选区则覆盖选区，否则停留在前缀末尾
    requestAnimationFrame(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
      textarea.setSelectionRange(selectedText ? newCursorPos : start + prefix.length, selectedText ? newCursorPos : start + prefix.length);
    });
  };

  /**
   * 触发隐藏的文件选择器
   */
  const handleCoverUpload = () => {
    fileInputRef.current?.click();
  };

  /**
   * 文件选择回调：读取第一张图片为 DataURL 并写入预览
   *
   * @param e 文件输入 change 事件
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * 移除已上传的封面图预览，并清空文件输入 value
   */
  const handleRemoveCover = () => {
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6"> {/* 编辑器整体容器：标题 / 工具栏 / 内容区 / 封面，垂直排列 */}
      {/* 文章标题输入框 */}
      <input
        type="text"
        placeholder="Enter article title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border-border text-text-primary placeholder:text-text-secondary focus:border-accent w-full border-0 border-b bg-transparent pb-4 text-3xl font-bold transition-colors focus:outline-none"
      />

      {/* Markdown 快捷工具栏 */}
      <div className="border-border bg-surface-secondary flex items-center gap-1 rounded-lg border p-2">
        {/* 加粗按钮：点击在光标处插入 **...** */}
        <button onClick={() => insertMarkdown("**", "**")} className="hover:bg-surface text-text-secondary hover:text-text-primary rounded p-2 transition-colors" title="Bold">
          <Bold className="h-4 w-4" />
        </button>
        {/* 斜体按钮：点击在光标处插入 *...* */}
        <button onClick={() => insertMarkdown("*", "*")} className="hover:bg-surface text-text-secondary hover:text-text-primary rounded p-2 transition-colors" title="Italic">
          <Italic className="h-4 w-4" />
        </button>
        {/* 分组分割线 */}
        <div className="bg-border mx-1 h-6 w-px" />
        {/* 无序列表按钮 */}
        <button onClick={() => insertMarkdown("- ")} className="hover:bg-surface text-text-secondary hover:text-text-primary rounded p-2 transition-colors" title="Unordered List">
          <List className="h-4 w-4" />
        </button>
        {/* 有序列表按钮 */}
        <button onClick={() => insertMarkdown("1. ")} className="hover:bg-surface text-text-secondary hover:text-text-primary rounded p-2 transition-colors" title="Ordered List">
          <ListOrdered className="h-4 w-4" />
        </button>
        {/* 引用块按钮 */}
        <button onClick={() => insertMarkdown("> ")} className="hover:bg-surface text-text-secondary hover:text-text-primary rounded p-2 transition-colors" title="Blockquote">
          <Quote className="h-4 w-4" />
        </button>
        {/* 分组分割线 */}
        <div className="bg-border mx-1 h-6 w-px" />
        {/* 插入链接按钮：插入 [text](url) 模板 */}
        <button
          onClick={() => insertMarkdown("[", "](url)")}
          className="hover:bg-surface text-text-secondary hover:text-text-primary rounded p-2 transition-colors"
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </button>
        {/* 插入图片按钮：插入 ![alt](image-url) 模板 */}
        <button
          onClick={() => insertMarkdown("![alt]", "(image-url)")}
          className="hover:bg-surface text-text-secondary hover:text-text-primary rounded p-2 transition-colors"
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
      </div>

      {/* 文章正文编辑区 */}
      <textarea
        placeholder="Start writing your article..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={20}
        className="border-border bg-surface text-text-primary placeholder:text-text-secondary focus:border-accent focus:ring-accent/20 min-h-[400px] w-full resize-none rounded-xl border p-6 transition-all focus:ring-2 focus:outline-none"
      />

      {/* 封面图区域 */}
      <div>
        <label className="text-text-primary mb-3 block text-sm font-medium">Cover Image</label>
        {/* 隐藏的文件输入，由按钮或虚框区域触发 */}
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" onChange={handleFileChange} className="hidden" />
        {/* 条件渲染：已上传时显示封面图预览 + 移除按钮 */}
        {coverPreview ? (
          <div className="relative">
            {/* 封面图，最大高度 300px，超出按 object-cover 裁剪 */}
            <img src={coverPreview} alt="Cover preview" className="w-full rounded-xl object-cover" style={{ maxHeight: 300 }} />
            {/* 移除封面按钮 */}
            <button
              onClick={handleRemoveCover}
              className="bg-error hover:bg-error/80 absolute top-3 right-3 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors"
            >
              Remove
            </button>
          </div>
        ) : (
          /* 未上传时显示上传提示虚框：点击触发文件选择器 */
          <div onClick={handleCoverUpload} className="border-border hover:border-accent/50 cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors">
            {/* 上传图标 */}
            <ImageIcon className="text-text-secondary mx-auto mb-3 h-8 w-8" />
            {/* 上传提示主文案 */}
            <p className="text-text-secondary mb-1 text-sm">Click to upload or drag and drop</p>
            {/* 允许的文件类型与大小（PNG、JPG，最大 5MB） */}
            <p className="text-text-secondary text-xs">PNG, JPG up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
