/**
 * @file page.tsx
 * @description 写文章页面：左侧为富文本编辑器，右侧为发布设置面板
 */
"use client";

import Editor from "@/components/business/write/Editor";
import PublishSettings from "@/components/business/write/PublishSettings";
import WriteHeader from "@/components/business/write/WriteHeader";

/**
 * 写文章页面
 * @returns 写作页视图（头部 + 编辑器 + 发布设置）
 */
export default function WritePage() {
  return (
    <>
      {/* 写作页头部 */}
      <WriteHeader />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* 左侧：富文本编辑器 */}
        <div className="lg:col-span-3">
          <Editor />
        </div>
        {/* 右侧：发布设置面板 */}
        <div className="lg:col-span-1">
          <PublishSettings />
        </div>
      </div>
    </>
  );
}
