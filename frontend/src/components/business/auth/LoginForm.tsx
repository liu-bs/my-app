/**
 * @file LoginForm.tsx
 * @description 登录表单组件
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import AuthDivider from "@/components/business/auth/AuthDivider";
import AuthLogo from "@/components/business/auth/AuthLogo";
import SocialLoginButtons from "@/components/business/auth/SocialLoginButtons";
import { useLogin } from "@/services/auth/hooks";
import type { LoginFormState } from "@/services/auth/types";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormState>({
    email: "test@example.com",
    password: "password123",
  });

  const { mutate: login, isPending: isLoading, errorMsg, clearMessages } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    login({ email: formData.email, password: formData.password });
  };

  return (
    <>{/* 登录页整页容器，水平垂直居中显示表单 */}
      <div className="bg-background flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* 登录卡片容器，最大宽度 28rem */}
        <div className="w-full max-w-md">
          {/* 顶部品牌 Logo */}
          <AuthLogo />
          {/* 登录页主标题 */}
          <h1 className="text-text-primary text-center text-2xl font-bold">Welcome back</h1>
          {/* 登录页副标题提示文案 */}
          <p className="text-text-secondary mt-2 text-center text-sm">Sign in to your account to continue</p>

          {/* 社交登录按钮区 */}
          {/* <div className="mt-6">
            <SocialLoginButtons />
          </div> */}

          {/* 邮箱密码登录与社交登录之间的分隔线 */}
          <AuthDivider />

          {/* 登录表单区 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 邮箱输入字段 */}
            <div>
              <label htmlFor="email" className="text-text-primary mb-1.5 block text-sm font-medium">
                Email address
              </label>
              <div className="relative">
                {/* 邮箱图标装饰，左侧绝对定位 */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="text-text-secondary h-4 w-4" />
                </div>
                {/* 邮箱输入框：受控绑定 formData.email */}
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => { setFormData({ ...formData, email: e.target.value }); clearMessages(); }}
                  className="border-border bg-surface text-text-primary placeholder:text-text-secondary focus:ring-accent/20 focus:border-accent block w-full rounded-lg border py-2.5 pr-3 pl-10 transition-colors focus:ring-2 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* 密码输入字段 */}
            <div>
              <label htmlFor="password" className="text-text-primary mb-1.5 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                {/* 锁形图标装饰，左侧绝对定位 */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="text-text-secondary h-4 w-4" />
                </div>
                {/* 密码输入框：受控绑定 formData.password */}
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => { setFormData({ ...formData, password: e.target.value }); clearMessages(); }}
                  className="border-border bg-surface text-text-primary placeholder:text-text-secondary focus:ring-accent/20 focus:border-accent block w-full rounded-lg border py-2.5 pr-10 pl-10 transition-colors focus:ring-2 focus:outline-none"
                  placeholder="Enter your password"
                />
                {/* 密码显隐切换按钮：点击切换明文/密文 */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-secondary hover:text-text-primary absolute inset-y-0 right-0 flex items-center pr-3 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {/* 条件渲染：仅在登录失败时显示错误提示 */}
            {!!errorMsg && (
              <div className="bg-error/10 border-error/30 text-error flex items-center gap-2 rounded-lg border px-4 py-3 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* 登录提交按钮：登录中显示加载动画，否则显示文字与图标 */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-accent hover:bg-accent-hover focus:ring-accent flex w-full items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-2.5 font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* 跳转注册入口：未注册用户提示 */}
          <p className="text-text-secondary mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-accent hover:text-accent-hover font-medium transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
