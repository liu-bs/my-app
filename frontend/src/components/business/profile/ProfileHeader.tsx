/**
 * @file ProfileHeader.tsx
 * @description 个人资料页头部组件，渲染页面主标题
 */

import { FC } from "react";

/** 个人资料页头部组件 Props（当前无入参，预留扩展） */
interface ProfileHeaderProps {}

/**
 * 个人资料页头部组件
 * @returns 渲染 "Profile Settings" 标题
 */
const ProfileHeader: FC<ProfileHeaderProps> = () => {
  // 页面主标题
  return <h1 className="text-text-primary mb-8 text-2xl font-bold">Profile Settings</h1>;
};

export default ProfileHeader;
