/**
 * @file DashboardHeader.tsx
 * @description 仪表盘顶部标题栏组件，展示页面标题、副标题及下载报告入口
 */

"use client";

import { FC } from "react";
import { Download } from "lucide-react";

/**
 * 仪表盘顶部标题栏
 * 渲染欢迎语与"下载报告"按钮，点击后导出当前仪表盘数据为 JSON 文件
 */
const DashboardHeader: FC = () => {
  /**
   * 触发浏览器下载，将仪表盘数据序列化为 JSON 文件
   * 文件名包含导出日期，便于按时间归档
   */
  const handleDownload = () => {
    // 组装导出数据：导出时间 + 报表占位内容
    const data = {
      exportDate: new Date().toISOString(),
      stats: "Dashboard report data",
    };
    // 创建 JSON 类型的 Blob 对象，第二个参数控制缩进格式（2 个空格）
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    // 生成 Blob 临时 URL，用于触发下载
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // 截取 ISO 时间前 10 位（YYYY-MM-DD）作为文件日期后缀
    a.download = `dashboard-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    // 释放临时 URL，避免内存泄漏
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> {/* 标题栏容器：左标题 + 右侧操作按钮的响应式布局 */}
      {/* 标题与副标题文本块 */}
      <div>
        {/* 页面主标题 */}
        <h1 className="text-text-primary mb-1 text-2xl font-bold">Overview Dashboard</h1>
        {/* 页面副标题说明 */}
        <p className="text-text-secondary">Monitor your blog&apos;s performance and engagement.</p>
      </div>
      {/* 下载报告按钮，点击触发 handleDownload 将仪表盘数据导出为 JSON 文件 */}
      <button
        onClick={handleDownload}
        className="bg-accent hover:bg-accent-hover inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
      >
        {/* 下载图标 */}
        <Download className="h-4 w-4" />
        Download Report
      </button>
    </div>
  );
};

export default DashboardHeader;
