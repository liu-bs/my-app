/**
 * @file SettingsTabContent.tsx
 * @description 设置页右侧内容区组件，根据当前激活 Tab 渲染对应表单
 */

"use client";

import { FC, useState } from "react";
import { AlertTriangle, Camera, Eye, EyeOff, Laptop, Mail, Moon, Sun, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/services/auth/context";
import { useChangePassword } from "@/services/auth/hooks";

/** 设置 Tab 内容组件 Props */
interface SettingsTabContentProps {
  /** 当前激活的 Tab ID，用于决定渲染哪一块表单 */
  activeTab: string;
  /** 是否显示密码明文；true 显示明文，false 隐藏 */
  showPassword: boolean;
  /** 切换密码显隐状态的回调，参数为新的显示状态 */
  setShowPassword: (show: boolean) => void;
}

/**
 * 设置页右侧内容区组件
 * 包含 profile / account / notifications / appearance 四个 Tab 的具体表单，
 * 并维护保存、删除账户等本地交互状态
 *
 * @param props 组件入参
 * @param props.activeTab 当前激活的 Tab ID
 * @param props.showPassword 是否显示密码明文
 * @param props.setShowPassword 切换密码显隐状态的回调
 */
const SettingsTabContent: FC<SettingsTabContentProps> = ({ activeTab, showPassword, setShowPassword }) => {
  /** 是否正在保存中（控制按钮 loading 态） */
  const [saving, setSaving] = useState(false);
  /** 是否已保存成功（控制按钮文案与短暂提示） */
  const [saved, setSaved] = useState(false);
  /** 是否进入"二次确认删除"状态 */
  const [confirmDelete, setConfirmDelete] = useState(false);
  /** 删除相关提示文案，null 时不展示 */
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null);
  /** 从 next-themes 读取当前主题与主题切换函数 */
  const { theme, setTheme } = useTheme();
  /** 用户在主题设置中选中的主题（pending 状态，尚未应用） */
  const [selectedTheme, setSelectedTheme] = useState<string>(theme || "system");

  /** 修改密码表单状态 */
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  /** 修改密码 Hook — 成功后走 logout 清本地状态 + 跳登录页 */
  const { logout } = useAuth();
  const { mutate: changePassword, isPending: isChangingPassword, errorMsg: changePasswordError, successMsg: changePasswordSuccess, clearMessages: clearPasswordMessages } = useChangePassword();

  /**
   * 通用保存处理：模拟 1000ms 保存耗时后展示"已保存"提示 2000ms
   */
  const handleSave = async () => {
    setSaving(true);
    // 模拟接口请求耗时 1000ms
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    // 2000ms 后自动隐藏"已保存"提示
    setTimeout(() => setSaved(false), 2000);
  };

  /**
   * 修改密码提交：校验新密码与确认密码一致后调用改密接口，成功后跳转登录页
   */
  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return;
    clearPasswordMessages();
    changePassword(
      { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword },
      { onSuccess: () => logout() },
    );
  };

  /**
   * 账户删除处理：首次点击进入二次确认，5s 内未再次点击则取消；
   * 二次点击时给出"演示模式不可用"提示并持续 4000ms
   */
  const handleDeleteAccount = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      // 5000ms 内未再次点击则自动取消二次确认
      setTimeout(() => setConfirmDelete(false), 5000);
      return;
    }
    setDeleteMsg("Account deletion is not available in demo mode.");
    setConfirmDelete(false);
    // 4000ms 后自动清除提示文案
    setTimeout(() => setDeleteMsg(null), 4000);
  };

  return (
    <>
      {/* 条件渲染：profile 标签下展示个人资料表单 */}
      {activeTab === "profile" && (
        <>
          {/* 个人信息表单卡片 */}
          <section className="border-border bg-surface rounded-xl border p-6">
            <h2 className="text-text-primary mb-6 text-lg font-semibold">Profile Information</h2>
            {/* 头像与基本信息展示行 */}
            <div className="mb-6 flex items-center gap-6">
              {/* 头像与编辑图标容器 */}
              <div className="relative">
                {/* 头像渐变方块占位（取首字母 A） */}
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-2xl font-bold text-white">A</div>
                {/* 头像编辑按钮：点击触发隐藏的文件选择器 */}
                <button
                  onClick={() => document.getElementById("avatar-upload")?.click()}
                  className="bg-accent hover:bg-accent-hover absolute -right-1 -bottom-1 rounded-full p-2 text-white shadow-md transition-colors"
                >
                  {/* 相机图标 */}
                  <Camera className="h-4 w-4" />
                </button>
                {/* 隐藏的头像文件上传输入 */}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    // 限制头像文件大小不超过 2MB
                    if (file && file.size > 2 * 1024 * 1024) {
                      alert("File size must be less than 2MB");
                      return;
                    }
                    // TODO: upload to API
                  }}
                />
              </div>
              {/* 头像操作说明与按钮区域 */}
              <div>
                <h3 className="text-text-primary font-medium">Profile Picture</h3>
                <p className="text-text-secondary mb-3 text-sm">JPG, GIF or PNG. Max size 2MB</p>
                <div className="flex gap-3">
                  {/* 上传新头像按钮：点击触发隐藏的文件选择器 */}
                  <button
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                    className="bg-accent hover:bg-accent-hover rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                  >
                    Upload New
                  </button>
                  {/* 移除头像按钮 */}
                  <button className="border-border text-text-secondary hover:bg-surface-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors">Remove</button>
                </div>
              </div>
            </div>

            {/* 资料字段输入区 */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* 展示名称输入项 */}
              <div>
                <label className="text-text-primary mb-2 block text-sm font-medium">Display Name</label>
                <input
                  type="text"
                  defaultValue="Alex Chen"
                  className="border-border bg-background text-text-primary focus:ring-accent/20 focus:border-accent w-full rounded-lg border px-4 py-2.5 transition-colors focus:ring-2 focus:outline-none"
                />
              </div>
              {/* 用户名输入项 */}
              <div>
                <label className="text-text-primary mb-2 block text-sm font-medium">Username</label>
                <div className="relative">
                  {/* 用户名前置 @ 符号 */}
                  <span className="text-text-secondary absolute top-1/2 left-4 -translate-y-1/2">@</span>
                  <input
                    type="text"
                    defaultValue="alexchen"
                    className="border-border bg-background text-text-primary focus:ring-accent/20 focus:border-accent w-full rounded-lg border py-2.5 pr-4 pl-8 transition-colors focus:ring-2 focus:outline-none"
                  />
                </div>
              </div>
              {/* 个人简介输入项，跨双列 */}
              <div className="sm:col-span-2">
                <label className="text-text-primary mb-2 block text-sm font-medium">Bio</label>
                <textarea
                  rows={4}
                  defaultValue="Senior Frontend Engineer passionate about React and modern web development."
                  className="border-border bg-background text-text-primary focus:ring-accent/20 focus:border-accent w-full resize-none rounded-lg border px-4 py-2.5 transition-colors focus:ring-2 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* 社交链接卡片 */}
          <section className="border-border bg-surface rounded-xl border p-6">
            <h2 className="text-text-primary mb-6 text-lg font-semibold">Social Links</h2>
            <div className="space-y-4">
              {/* 遍历渲染 GitHub / Twitter / LinkedIn 链接输入项 */}
              {["GitHub", "Twitter", "LinkedIn"].map((platform) => (
                <div key={platform} className="flex items-center gap-4">
                  {/* 平台名称标签 */}
                  <span className="text-text-primary w-24 text-sm font-medium">{platform}</span>
                  {/* 平台链接输入框 */}
                  <input
                    type="url"
                    placeholder={`https://${platform.toLowerCase()}.com/username`}
                    className="border-border bg-background text-text-primary focus:ring-accent/20 focus:border-accent flex-1 rounded-lg border px-4 py-2.5 transition-colors focus:ring-2 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 保存按钮行：点击触发通用保存处理 */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-accent hover:bg-accent-hover rounded-lg px-6 py-2.5 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </>
      )}

      {/* 条件渲染：account 标签下展示账户安全表单 */}
      {activeTab === "account" && (
        <>
          {/* 邮箱地址修改卡片 */}
          <section className="border-border bg-surface rounded-xl border p-6">
            <h2 className="text-text-primary mb-6 text-lg font-semibold">Email Address</h2>
            <div className="flex items-center gap-4">
              {/* 邮箱输入容器，flex-1 占满剩余空间 */}
              <div className="relative flex-1">
                {/* 邮箱图标 */}
                <Mail className="text-text-secondary absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                <input
                  type="email"
                  defaultValue="alex.chen@example.com"
                  className="border-border bg-background text-text-primary focus:ring-accent/20 focus:border-accent w-full rounded-lg border py-2.5 pr-4 pl-10 transition-colors focus:ring-2 focus:outline-none"
                />
              </div>
              {/* 邮箱更新按钮：点击触发通用保存处理 */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-accent hover:bg-accent-hover rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saved ? "Updated!" : saving ? "Updating..." : "Update Email"}
              </button>
            </div>
          </section>

          {/* 修改密码卡片 */}
          <section className="border-border bg-surface rounded-xl border p-6">
            <h2 className="text-text-primary mb-6 text-lg font-semibold">Change Password</h2>
            <div className="space-y-4">
              {/* 当前密码输入项，带显隐切换 */}
              <div>
                <label className="text-text-primary mb-2 block text-sm font-medium">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    className="border-border bg-background text-text-primary focus:ring-accent/20 focus:border-accent w-full rounded-lg border px-4 py-2.5 transition-colors focus:ring-2 focus:outline-none"
                  />
                  {/* 密码显隐切换按钮：点击切换 showPassword 状态 */}
                  <button onClick={() => setShowPassword(!showPassword)} className="text-text-secondary hover:text-text-primary absolute top-1/2 right-4 -translate-y-1/2">
                    {/* 根据 showPassword 状态显示眼睛开/关图标 */}
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {/* 新密码输入项 */}
              <div>
                <label className="text-text-primary mb-2 block text-sm font-medium">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                  className="border-border bg-background text-text-primary focus:ring-accent/20 focus:border-accent w-full rounded-lg border px-4 py-2.5 transition-colors focus:ring-2 focus:outline-none"
                />
              </div>
              {/* 确认新密码输入项 */}
              <div>
                <label className="text-text-primary mb-2 block text-sm font-medium">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className="border-border bg-background text-text-primary focus:ring-accent/20 focus:border-accent w-full rounded-lg border px-4 py-2.5 transition-colors focus:ring-2 focus:outline-none"
                />
                {/* 新密码与确认密码不一致提示 */}
                {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                  <p className="text-error mt-1 text-xs">Passwords do not match</p>
                )}
              </div>
            </div>
            {/* 改密成功/错误提示 */}
            {changePasswordSuccess && (
              <p className="mt-3 text-sm text-green-600">{changePasswordSuccess}</p>
            )}
            {changePasswordError && (
              <p className="text-error mt-3 text-sm">{changePasswordError}</p>
            )}
            <div className="mt-6">
              {/* 密码更新按钮：点击调用改密接口，成功后跳登录页 */}
              <button
                onClick={handleChangePassword}
                disabled={isChangingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                className="bg-accent hover:bg-accent-hover rounded-lg px-6 py-2.5 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isChangingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </section>

          {/* 危险操作（删除账户）卡片 */}
          <section className="border-error/20 bg-error-light rounded-xl border p-6">
            <div className="flex items-start gap-4">
              {/* 警告三角图标 */}
              <AlertTriangle className="text-error mt-0.5 h-5 w-5 shrink-0" />
              <div className="flex-1">
                <h3 className="text-error mb-1 font-medium">Danger Zone</h3>
                <p className="text-text-secondary mb-4 text-sm">Once you delete your account, there is no going back. Please be certain.</p>
                {/* 删除账户按钮：首次点击进入二次确认，再次点击执行提示 */}
                <button
                  onClick={handleDeleteAccount}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
                    confirmDelete ? "bg-error border-error text-white" : "border-error text-error hover:bg-error hover:text-white"
                  }`}
                >
                  {/* 垃圾桶图标 */}
                  <Trash2 className="h-4 w-4" />
                  {/* 根据 confirmDelete 状态显示不同文案 */}
                  {confirmDelete ? "Confirm Delete?" : "Delete Account"}
                </button>
                {/* 删除相关提示文案展示行 */}
                {deleteMsg && <p className="text-warning mt-2 text-xs">{deleteMsg}</p>}
              </div>
            </div>
          </section>
        </>
      )}

      {/* 条件渲染：notifications 标签下展示通知偏好开关列表 */}
      {activeTab === "notifications" && (
        <section className="border-border bg-surface rounded-xl border p-6">
          <h2 className="text-text-primary mb-6 text-lg font-semibold">Notification Preferences</h2>
          <div className="space-y-6">
            {/* 遍历渲染通知偏好开关项 */}
            {[
              {
                id: "email",
                label: "Email Notifications",
                desc: "Receive notifications via email",
                checked: true,
              },
              {
                id: "comments",
                label: "Comments",
                desc: "When someone comments on your article",
                checked: true,
              },
              {
                id: "likes",
                label: "Likes",
                desc: "When someone likes your article",
                checked: false,
              },
              {
                id: "follows",
                label: "New Followers",
                desc: "When someone follows you",
                checked: true,
              },
              {
                id: "mentions",
                label: "Mentions",
                desc: "When someone mentions you in a comment",
                checked: true,
              },
              {
                id: "newsletter",
                label: "Newsletter",
                desc: "Weekly digest of popular articles",
                checked: true,
              },
            ].map((item) => (
              /* 单个通知偏好行：左侧文案、右侧开关 */
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <h3 className="text-text-primary font-medium">{item.label}</h3>
                  <p className="text-text-secondary text-sm">{item.desc}</p>
                </div>
                {/* 开关容器，点击切换 checked 状态 */}
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" defaultChecked={item.checked} className="peer sr-only" />
                  {/* 自定义 toggle 样式轨道 */}
                  <div className="bg-surface-secondary peer-focus:ring-accent/20 peer after:border-border peer-checked:bg-accent h-6 w-11 rounded-full peer-focus:ring-4 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                </label>
              </div>
            ))}
          </div>
          <div className="border-border mt-8 border-t pt-6">
            {/* 保存偏好按钮：点击触发通用保存处理 */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-accent hover:bg-accent-hover rounded-lg px-6 py-2.5 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saved ? "Saved!" : saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </section>
      )}

      {/* 条件渲染：appearance 标签下展示主题设置卡片 */}
      {activeTab === "appearance" && (
        <section className="border-border bg-surface rounded-xl border p-6">
          <h2 className="text-text-primary mb-6 text-lg font-semibold">Theme Settings</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* 遍历渲染 light / dark / system 主题选项卡 */}
            {[
              {
                id: "light",
                label: "Light",
                icon: Sun,
                desc: "Always use light theme",
              },
              {
                id: "dark",
                label: "Dark",
                icon: Moon,
                desc: "Always use dark theme",
              },
              {
                id: "system",
                label: "System",
                icon: Laptop,
                desc: "Follow system preference",
              },
            ].map((t) => {
              const Icon = t.icon;
              return (
                /* 主题选项卡：点击切换 selectedTheme */
                <label key={t.id} className="cursor-pointer">
                  <input type="radio" name="theme" value={t.id} checked={selectedTheme === t.id} onChange={() => setSelectedTheme(t.id)} className="peer sr-only" />
                  {/* 主题选项展示卡片，选中态高亮 */}
                  <div className="border-border bg-background peer-checked:border-accent peer-checked:bg-accent/10 rounded-xl border-2 p-4 transition-all">
                    <Icon className="text-text-primary mb-3 h-8 w-8" />
                    <h3 className="text-text-primary font-medium">{t.label}</h3>
                    <p className="text-text-secondary mt-1 text-xs">{t.desc}</p>
                  </div>
                </label>
              );
            })}
          </div>
          <div className="border-border mt-8 border-t pt-6">
            {/* 应用主题按钮：点击后调用 setTheme 并展示 Applied 提示 */}
            <button
              onClick={() => {
                setTheme(selectedTheme);
                setSaving(true);
                // 模拟 500ms 主题切换延时后展示已应用提示 2000ms
                setTimeout(() => {
                  setSaving(false);
                  setSaved(true);
                  setTimeout(() => setSaved(false), 2000);
                }, 500);
              }}
              disabled={saving}
              className="bg-accent hover:bg-accent-hover rounded-lg px-6 py-2.5 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saved ? "Applied!" : saving ? "Applying..." : "Apply Theme"}
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default SettingsTabContent;
