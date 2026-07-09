/**
 * @file PublishSettings.tsx
 * @description 写作页发布设置侧栏组件，提供发布/草稿、可见性、标签、定时、SEO 预览
 */

"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, CheckCircle2, Eye, FileText, Globe, Lock, Save, Send, Tag } from "lucide-react";
import { TAGS } from "@/constans";

/**
 * 写作页发布设置侧栏组件
 * 提供发布/保存草稿按钮、可见性切换、标签多选、定时发布、SEO 预览与字数统计
 */
const PublishSettings: FC = () => {
  const router = useRouter();
  /** 可见性：public 公开 / private 私有 */
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  /** 已选中的标签 ID 列表（最多 3 个） */
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  /** 是否正在发布（控制发布按钮 loading 态） */
  const [publishing, setPublishing] = useState(false);
  /** 是否正在保存草稿（控制草稿按钮 loading 态） */
  const [saving, setSaving] = useState(false);
  /** 是否已发布成功（控制顶部"Published!"横幅） */
  const [published, setPublished] = useState(false);
  /** 是否已保存草稿（控制草稿按钮文案与短暂提示） */
  const [draftSaved, setDraftSaved] = useState(false);

  /**
   * 切换标签选中：未选中则加入（最多 3 个），已选中则移除
   *
   * @param tagId 标签 ID
   */
  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((t) => t !== tagId) : prev.length < 3 ? [...prev, tagId] : prev));
  };

  /**
   * 发布处理：模拟 1500ms 发布耗时后展示"Published!"提示，
   * 1000ms 后跳转到"我的文章"页
   */
  const handlePublish = async () => {
    setPublishing(true);
    // 模拟接口请求耗时 1500ms
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setPublishing(false);
    setPublished(true);
    // 1000ms 后跳转到我的文章页
    setTimeout(() => router.push("/my-articles"), 1000);
  };

  /**
   * 保存草稿：模拟 1000ms 后展示"草稿已保存"提示 3000ms
   */
  const handleSaveDraft = async () => {
    setSaving(true);
    // 模拟接口请求耗时 1000ms
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setDraftSaved(true);
    // 3000ms 后自动隐藏"草稿已保存"提示
    setTimeout(() => setDraftSaved(false), 3000);
  };

  return (
    <div className="border-border bg-surface space-y-6 rounded-xl border p-5"> {/* 发布设置侧栏整体容器 */}
      {/* 发布 / 草稿操作按钮区 */}
      <div className="space-y-3">
        {/* 条件渲染：已发布时只展示成功横幅，未发布时展示按钮组 */}
        {published ? (
          <div className="bg-success/10 text-success flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium">
            {/* 成功对勾图标 */}
            <CheckCircle2 className="h-4 w-4" />
            Published!
          </div>
        ) : (
          <>
            {/* 发布按钮：点击后进入发布流程 */}
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="bg-accent hover:bg-accent-hover flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {/* 发布中显示 loading 旋转图标，否则显示发送图标 */}
              {publishing ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <Send className="h-4 w-4" />
              )}
              {/* 发布中显示 "Publishing..."，否则显示 "Publish" */}
              {publishing ? "Publishing..." : "Publish"}
            </button>
            {/* 保存草稿按钮：点击后进入保存草稿流程 */}
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="border-border text-text-secondary hover:bg-surface-secondary flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {/* 根据 saving / draftSaved 状态显示不同文案与图标 */}
              {saving ? "Saving..." : draftSaved ? "Draft Saved!" : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : draftSaved ? "" : "Save Draft"}
            </button>
          </>
        )}
      </div>

      {/* 可见性设置区 */}
      <div>
        <label className="text-text-primary mb-3 flex items-center gap-2 text-sm font-medium">
          {/* 眼睛图标 */}
          <Eye className="h-4 w-4" />
          Visibility
        </label>
        <div className="space-y-2">
          {/* 公开选项：点击切换为 public */}
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
              visibility === "public" ? "border-accent bg-accent/10" : "border-border hover:bg-surface-secondary"
            }`}
          >
            <input type="radio" name="visibility" value="public" checked={visibility === "public"} onChange={() => setVisibility("public")} className="sr-only" />
            {/* 地球图标 */}
            <Globe className="text-accent h-4 w-4" />
            <div>
              <p className="text-text-primary text-sm font-medium">Public</p>
              <p className="text-text-secondary text-xs">Visible to everyone</p>
            </div>
          </label>
          {/* 私有选项：点击切换为 private */}
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
              visibility === "private" ? "border-accent bg-accent/10" : "border-border hover:bg-surface-secondary"
            }`}
          >
            <input type="radio" name="visibility" value="private" checked={visibility === "private"} onChange={() => setVisibility("private")} className="sr-only" />
            {/* 锁图标 */}
            <Lock className="text-accent h-4 w-4" />
            <div>
              <p className="text-text-primary text-sm font-medium">Private</p>
              <p className="text-text-secondary text-xs">Only you can see</p>
            </div>
          </label>
        </div>
      </div>

      {/* 标签选择区（最多 3 个） */}
      <div>
        <label className="text-text-primary mb-3 flex items-center gap-2 text-sm font-medium">
          {/* 标签图标 */}
          <Tag className="h-4 w-4" />
          Tags (max 3)
        </label>
        <div className="flex flex-wrap gap-2">
          {/* 遍历渲染可选标签按钮 */}
          {TAGS.map((tag) => (
            /* 标签切换按钮：点击后切换该标签的选中状态 */
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedTags.includes(tag.id) ? tag.class : "bg-surface-secondary text-text-secondary hover:bg-surface-secondary/80"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* 定时发布时间区 */}
      <div>
        <label className="text-text-primary mb-3 flex items-center gap-2 text-sm font-medium">
          {/* 日历图标 */}
          <Calendar className="h-4 w-4" />
          Schedule
        </label>
        <input
          type="datetime-local"
          className="border-border bg-background text-text-primary focus:border-accent focus:ring-accent/20 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        />
        {/* 留空提示：空值表示立即发布 */}
        <p className="text-text-secondary mt-1 text-xs">Leave empty to publish immediately</p>
      </div>

      {/* SEO 预览区 */}
      <div>
        <label className="text-text-primary mb-3 flex items-center gap-2 text-sm font-medium">
          {/* 文档图标 */}
          <FileText className="h-4 w-4" />
          SEO Preview
        </label>
        <div className="bg-surface-secondary rounded-lg p-3">
          {/* 链接域名行 */}
          <p className="text-accent text-xs">yourblog.com/article/...</p>
          {/* 搜索结果标题 */}
          <p className="text-text-primary mt-1 text-sm font-medium">Article Title</p>
          {/* 搜索结果摘要，最多展示 2 行 */}
          <p className="text-text-secondary mt-0.5 line-clamp-2 text-xs">A brief description of your article that will appear in search results...</p>
        </div>
      </div>

      {/* 字数与阅读时长统计区 */}
      <div className="text-text-secondary border-border border-t pt-4 text-xs">
        <p>Words: 0 · Read time: 0 min</p>
      </div>
    </div>
  );
};

export default PublishSettings;
