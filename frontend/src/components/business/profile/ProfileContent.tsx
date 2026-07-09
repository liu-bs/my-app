/**
 * @file ProfileContent.tsx
 * @description 个人资料页主内容区组件，根据当前激活标签渲染个人信息、安全、邮件通知三个表单
 */

"use client";
import { FC, useState } from "react";
import { Camera, Mail } from "lucide-react";

/**
 * 个人资料页主内容组件 Props
 */
interface ProfileContentProps {
  /** 当前激活的标签 id：personal / security / notifications */
  activeTab: string;
}

/** 模拟"保存中"延时，单位：ms */
const SAVING_DELAY_MS = 1000;
/** "保存成功"提示展示时长，单位：ms */
const SAVED_HINT_MS = 2000;

/** 个人资料标签 id */
const TAB_PERSONAL = "personal";
/** 账号安全标签 id */
const TAB_SECURITY = "security";
/** 邮件通知标签 id */
const TAB_NOTIFICATIONS = "notifications";

/**
 * 个人资料页主内容组件
 * @param props 组件属性
 * @param props.activeTab 当前激活的标签 id
 * @returns 根据 activeTab 渲染对应的表单内容
 */
const ProfileContent: FC<ProfileContentProps> = ({ activeTab }) => {
  // 表单数据本地状态
  const [formData, setFormData] = useState({
    /** 名 */
    firstName: "Alex",
    /** 姓 */
    lastName: "Morgan",
    /** 邮箱 */
    email: "alex.morgan@example.com",
    /** 个人简介 */
    bio: "Passionate software engineer and design enthusiast. Building tools for the modern web.",
  });
  // 是否处于保存中
  const [saving, setSaving] = useState(false);
  // 是否显示"已保存"提示
  const [saved, setSaved] = useState(false);

  /**
   * 模拟保存动作：延时后展示"已保存"提示，2 秒后自动隐藏
   */
  const handleSave = async () => {
    setSaving(true);
    // 模拟接口请求延时
    await new Promise((resolve) => setTimeout(resolve, SAVING_DELAY_MS));
    setSaving(false);
    setSaved(true);
    // 延时后自动隐藏"已保存"提示
    setTimeout(() => setSaved(false), SAVED_HINT_MS);
  };

  return (
    // 主内容区容器
    <div className="flex-1">
      {activeTab === TAB_PERSONAL && (
        // 条件渲染：个人信息表单卡片
        <div className="border-border bg-surface rounded-xl border p-6">
          {/* 表单标题 */}
          <h2 className="text-text-primary mb-6 text-lg font-semibold">Personal Information</h2>

          {/* 头像上传区：展示当前头像与上传/移除操作 */}
          <div className="mb-8 flex items-center gap-6">
            <div className="relative">
              {/* 默认头像占位（首字母 A） */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-purple-500 text-2xl font-medium text-white">A</div>
              {/* 点击触发更换头像操作 */}
              <button className="bg-accent hover:bg-accent-hover absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full text-white shadow-md transition-colors">
                {/* 相机图标 */}
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              {/* 头像区标题 */}
              <p className="text-text-primary mb-1 text-sm font-medium">Profile Picture</p>
              {/* 头像格式与大小限制说明 */}
              <p className="text-text-secondary mb-3 text-xs">PNG, JPG under 5MB</p>
              {/* 头像操作按钮组 */}
              <div className="flex items-center gap-3">
                {/* 点击上传新头像 */}
                <button className="bg-accent hover:bg-accent-hover rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors">Upload</button>
                {/* 点击移除当前头像 */}
                <button className="border-border text-text-secondary hover:bg-surface-secondary rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors">Remove</button>
              </div>
            </div>
          </div>

          {/* 表单字段区 */}
          <div className="space-y-6">
            {/* 名/姓 双列布局 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                {/* 名输入框标签 */}
                <label className="text-text-primary mb-2 block text-sm font-medium">First Name</label>
                {/* 名输入框：输入实时更新 firstName */}
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      firstName: e.target.value,
                    })
                  }
                  className="border-border bg-surface text-text-primary focus:border-accent focus:ring-accent/20 w-full rounded-lg border px-4 py-2.5 transition-all focus:ring-2 focus:outline-none"
                />
              </div>
              <div>
                {/* 姓输入框标签 */}
                <label className="text-text-primary mb-2 block text-sm font-medium">Last Name</label>
                {/* 姓输入框：输入实时更新 lastName */}
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="border-border bg-surface text-text-primary focus:border-accent focus:ring-accent/20 w-full rounded-lg border px-4 py-2.5 transition-all focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            {/* 邮箱输入区 */}
            <div>
              {/* 邮箱输入框标签 */}
              <label className="text-text-primary mb-2 block text-sm font-medium">Email Address</label>
              <div className="relative">
                {/* 邮箱输入框前置图标 */}
                <Mail className="text-text-secondary absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                {/* 邮箱输入框：输入实时更新 email */}
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-border bg-surface text-text-primary focus:border-accent focus:ring-accent/20 w-full rounded-lg border py-2.5 pr-4 pl-11 transition-all focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            {/* 个人简介区 */}
            <div>
              {/* 个人简介输入框标签 */}
              <label className="text-text-primary mb-2 block text-sm font-medium">Bio</label>
              {/* 个人简介多行输入框：输入实时更新 bio */}
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="border-border bg-surface text-text-primary focus:border-accent focus:ring-accent/20 w-full resize-none rounded-lg border px-4 py-2.5 transition-all focus:ring-2 focus:outline-none"
              />
            </div>

            {/* 表单底部操作栏：取消与保存 */}
            <div className="border-border flex items-center justify-end gap-3 border-t pt-4">
              <button
                onClick={() => {
                  // 取消编辑：重置表单为初始值
                  setFormData({
                    firstName: "Alex",
                    lastName: "Morgan",
                    email: "alex.morgan@example.com",
                    bio: "Passionate software engineer and design enthusiast. Building tools for the modern web.",
                  });
                }}
                className="border-border text-text-secondary hover:bg-surface-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              {/* 点击触发保存逻辑，保存中时禁用按钮 */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-accent hover:bg-accent-hover rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === TAB_SECURITY && (
        // 条件渲染：账号安全表单卡片
        <div className="border-border bg-surface rounded-xl border p-6">
          {/* 表单标题 */}
          <h2 className="text-text-primary mb-6 text-lg font-semibold">Account Security</h2>
          <div className="space-y-6">
            <div>
              {/* 当前密码标签 */}
              <label className="text-text-primary mb-2 block text-sm font-medium">Current Password</label>
              {/* 当前密码输入框 */}
              <input
                type="password"
                placeholder="Enter current password"
                className="border-border bg-surface text-text-primary placeholder:text-text-secondary focus:border-accent focus:ring-accent/20 w-full rounded-lg border px-4 py-2.5 transition-all focus:ring-2 focus:outline-none"
              />
            </div>
            <div>
              {/* 新密码标签 */}
              <label className="text-text-primary mb-2 block text-sm font-medium">New Password</label>
              {/* 新密码输入框 */}
              <input
                type="password"
                placeholder="Enter new password"
                className="border-border bg-surface text-text-primary placeholder:text-text-secondary focus:border-accent focus:ring-accent/20 w-full rounded-lg border px-4 py-2.5 transition-all focus:ring-2 focus:outline-none"
              />
            </div>
            <div>
              {/* 确认新密码标签 */}
              <label className="text-text-primary mb-2 block text-sm font-medium">Confirm New Password</label>
              {/* 确认新密码输入框 */}
              <input
                type="password"
                placeholder="Confirm new password"
                className="border-border bg-surface text-text-primary placeholder:text-text-secondary focus:border-accent focus:ring-accent/20 w-full rounded-lg border px-4 py-2.5 transition-all focus:ring-2 focus:outline-none"
              />
            </div>
            {/* 安全表单底部操作栏 */}
            <div className="border-border flex items-center justify-end gap-3 border-t pt-4">
              <button className="border-border text-text-secondary hover:bg-surface-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors">Cancel</button>
              {/* 点击触发保存逻辑，更新密码 */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-accent hover:bg-accent-hover rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saved ? "Updated!" : saving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === TAB_NOTIFICATIONS && (
        // 条件渲染：邮件通知偏好卡片
        <div className="border-border bg-surface rounded-xl border p-6">
          {/* 表单标题 */}
          <h2 className="text-text-primary mb-6 text-lg font-semibold">Email Notifications</h2>
          <div className="space-y-4">
            {/* 遍历渲染邮件通知偏好项 */}
            {[
              {
                /** 通知项 ID */
                id: "new-comments",
                /** 通知项文案 */
                label: "New comments on my posts",
                /** 默认勾选状态：true */
                defaultChecked: true,
              },
              {
                id: "new-followers",
                label: "New followers",
                defaultChecked: true,
              },
              {
                id: "post-likes",
                label: "Likes on my posts",
                /** 默认勾选状态：false */
                defaultChecked: false,
              },
              {
                id: "newsletter",
                label: "Weekly newsletter",
                defaultChecked: true,
              },
              {
                id: "product-updates",
                label: "Product updates and announcements",
                defaultChecked: true,
              },
            ].map((item) => (
              // 通知偏好行：标签 + 复选框
              <label key={item.id} className="border-border flex items-center justify-between border-b py-3 last:border-0">
                {/* 通知文案 */}
                <span className="text-text-primary text-sm">{item.label}</span>
                {/* 复选框：切换是否订阅该类通知 */}
                <input type="checkbox" defaultChecked={item.defaultChecked} className="border-border text-accent focus:ring-accent h-4 w-4 rounded" />
              </label>
            ))}
          </div>
          {/* 通知偏好底部操作栏 */}
          <div className="flex items-center justify-end gap-3 pt-6">
            <button className="border-border text-text-secondary hover:bg-surface-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors">Cancel</button>
            {/* 点击触发保存逻辑，保存通知偏好 */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-accent hover:bg-accent-hover rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saved ? "Saved!" : saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileContent;
