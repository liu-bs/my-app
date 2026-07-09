/**
 * @file RegisterForm.tsx
 * @description 注册表单组件，包含名/姓、用户名、邮箱、密码、确认密码与条款同意，校验通过后调用注册接口并跳转至登录页
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, AtSign, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import AuthDivider from "@/components/business/auth/AuthDivider";
import AuthLogo from "@/components/business/auth/AuthLogo";
import SocialLoginButtons from "@/components/business/auth/SocialLoginButtons";
import { useRegister } from "@/services/auth/hooks";
import type { RegisterFormState } from "@/services/auth/types";

/**
 * 注册表单组件
 * 渲染注册所需的全部字段及校验；提交时校验"同意条款"与"两次密码一致"，通过后调用注册接口并跳转至 /login
 * 注册不种 Cookie，用户需自行登录。
 * @returns 渲染完成的注册表单 JSX
 */
const RegisterForm: React.FC = () => {
  const router = useRouter();
  // 是否明文显示密码，false=密文 true=明文
  const [showPassword, setShowPassword] = useState(false);
  // 是否明文显示确认密码，false=密文 true=明文
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // 表单实时数据
  const [formData, setFormData] = useState<RegisterFormState>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const { mutate: register, isPending: isLoading, errorMsg, successMsg, clearMessages } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) return;
    if (formData.password !== formData.confirmPassword) return;
    clearMessages();
    register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });
  };

  // 注册成功后延迟跳转，让用户看到成功提示
  useEffect(() => {
    if (!successMsg) return;
    const timer = setTimeout(() => router.push("/login"), 1500);
    return () => clearTimeout(timer);
  }, [successMsg, router]);

  return (
    <>
      {/* 注册页整页容器，水平垂直居中显示表单 */}
      <div className="bg-background flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* 注册卡片容器，最大宽度 28rem */}
        <div className="w-full max-w-md">
          {/* 顶部品牌 Logo */}
          <AuthLogo />
          {/* 注册页主标题 */}
          <h1 className="text-text-primary text-center text-2xl font-bold">Create your account</h1>
          {/* 注册页副标题提示文案 */}
          <p className="text-text-secondary mt-2 text-center text-sm">Join our community of writers and readers</p>

          {/* 邮箱密码注册与社交注册之间的分隔线 */}
          <AuthDivider text="Register" />

          {/* 注册表单区 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 名字与姓氏两列布局区 */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* 名字输入字段 */}
              <div>
                <label htmlFor="firstName" className="text-text-primary mb-1.5 block text-sm font-medium">
                  First name
                </label>
                <div className="relative">
                  {/* 用户图标装饰，左侧绝对定位 */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="text-text-secondary h-4 w-4" />
                  </div>
                  {/* 名字输入框：受控绑定 formData.firstName */}
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="border-border bg-surface text-text-primary placeholder:text-text-secondary focus:ring-accent/20 focus:border-accent block w-full rounded-lg border py-2.5 pr-3 pl-10 transition-colors focus:ring-2 focus:outline-none"
                    placeholder="First name"
                  />
                </div>
              </div>
              {/* 姓氏输入字段 */}
              <div>
                <label htmlFor="lastName" className="text-text-primary mb-1.5 block text-sm font-medium">
                  Last name
                </label>
                <div className="relative">
                  {/* 用户图标装饰，左侧绝对定位 */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="text-text-secondary h-4 w-4" />
                  </div>
                  {/* 姓氏输入框：受控绑定 formData.lastName */}
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="border-border bg-surface text-text-primary placeholder:text-text-secondary focus:ring-accent/20 focus:border-accent block w-full rounded-lg border py-2.5 pr-3 pl-10 transition-colors focus:ring-2 focus:outline-none"
                    placeholder="Last name"
                  />
                </div>
              </div>
            </div>

            {/* 用户名输入字段 */}
            <div>
              <label htmlFor="username" className="text-text-primary mb-1.5 block text-sm font-medium">
                Username
              </label>
              <div className="relative">
                {/* @ 图标装饰，左侧绝对定位 */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <AtSign className="text-text-secondary h-4 w-4" />
                </div>
                {/* 用户名输入框：受控绑定 formData.username */}
                <input
                  id="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="border-border bg-surface text-text-primary placeholder:text-text-secondary focus:ring-accent/20 focus:border-accent block w-full rounded-lg border py-2.5 pr-3 pl-10 transition-colors focus:ring-2 focus:outline-none"
                  placeholder="Choose a username"
                />
              </div>
            </div>

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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="border-border bg-surface text-text-primary placeholder:text-text-secondary focus:ring-accent/20 focus:border-accent block w-full rounded-lg border py-2.5 pr-10 pl-10 transition-colors focus:ring-2 focus:outline-none"
                  placeholder="Create a password"
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
              {/* 密码强度提示文案：至少 8 位且包含字母与数字 */}
              <p className="text-text-secondary mt-1.5 text-xs">Must be at least 8 characters with letters and numbers</p>
            </div>

            {/* 确认密码输入字段 */}
            <div>
              <label htmlFor="confirm-password" className="text-text-primary mb-1.5 block text-sm font-medium">
                Confirm password
              </label>
              <div className="relative">
                {/* 锁形图标装饰，左侧绝对定位 */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="text-text-secondary h-4 w-4" />
                </div>
                {/* 确认密码输入框：受控绑定 formData.confirmPassword */}
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="border-border bg-surface text-text-primary placeholder:text-text-secondary focus:ring-accent/20 focus:border-accent block w-full rounded-lg border py-2.5 pr-10 pl-10 transition-colors focus:ring-2 focus:outline-none"
                  placeholder="Confirm your password"
                />
                {/* 确认密码显隐切换按钮：点击切换明文/密文 */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-text-secondary hover:text-text-primary absolute inset-y-0 right-0 flex items-center pr-3 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* 条款同意选项区 */}
            <div className="flex items-start">
              {/* 同意条款复选框：受控绑定 formData.agreeTerms，未勾选时阻止提交 */}
              <input
                id="terms"
                type="checkbox"
                required
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="border-border text-accent focus:ring-accent mt-0.5 h-4 w-4 rounded"
              />
              <label htmlFor="terms" className="text-text-secondary ml-2 text-sm">
                I agree to the{" "}
                <span onClick={(e) => e.preventDefault()} className="text-accent hover:text-accent-hover cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span onClick={(e) => e.preventDefault()} className="text-accent hover:text-accent-hover cursor-pointer">
                  Privacy Policy
                </span>
              </label>
            </div>

            {/* 条件渲染：注册成功/失败提示 */}
            {successMsg ? (
              <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {successMsg}
              </div>
            ) : !!errorMsg ? (
              <div className="bg-error/10 border-error/30 text-error flex items-center gap-2 rounded-lg border px-4 py-3 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMsg}
              </div>
            ) : null}

            {/* 注册提交按钮：加载中显示动画，未同意条款时禁用 */}
            <button
              type="submit"
              disabled={isLoading || !formData.agreeTerms}
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
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* 跳转登录入口：已有账号用户提示 */}
          <p className="text-text-secondary mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:text-accent-hover font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
