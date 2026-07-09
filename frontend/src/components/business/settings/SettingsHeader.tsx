/**
 * @file SettingsHeader.tsx
 * @description 设置页头部组件，展示页面主标题与副标题
 */

"use client";

import { FC } from "react";

/**
 * 设置页头部组件
 * 渲染页面主标题 "Settings" 与副标题提示文案
 */
const SettingsHeader: FC = () => {
  return (
    <div className="mb-8"> {/* 设置页头部容器，控制与下方内容的间距 */}
      {/* 页面主标题 */}
      <h1 className="text-text-primary text-2xl font-bold">Settings</h1>
      {/* 页面副标题，提示设置用途 */}
      <p className="text-text-secondary mt-1">Manage your account settings and preferences</p>
    </div>
  );
};

export default SettingsHeader;
