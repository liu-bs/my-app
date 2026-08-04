/**
 * @file page.tsx
 * @description 登录页，提供邮箱密码登录、表单校验、限频提示与登录后跳转
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Clock } from 'lucide-react';
import { PasswordToggle } from '@/components/PasswordToggle';
import toast from '@/lib/toast';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { useLogin } from '@/services/auth/hooks';
import { ApiRequestError } from '@/lib/api/request';

/**
 * 登录页
 * @description 邮箱密码登录，含表单校验、错误提示、限频提示与安全重定向
 */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  /** 登录成功后的重定向路径（来自 URL 参数） */
  const redirect = searchParams.get('redirect') || '/';
  /** 安全重定向路径，仅允许相对路径并过滤 login/register 自身，防止开放重定向 */
  const safeRedirect =
    redirect.startsWith('/') &&
    !redirect.startsWith('//') &&
    !['/login', '/register'].includes(redirect)
      ? redirect
      : '/';
  /** 登录 mutation 实例 */
  const loginMutation = useLogin();

  /** 邮箱输入值 */
  const [email, setEmail] = useState('');
  /** 密码输入值 */
  const [password, setPassword] = useState('');
  /** 邮箱格式错误标记 */
  const [emailError, setEmailError] = useState(false);
  /** 密码为空错误标记 */
  const [pwdError, setPwdError] = useState(false);
  /** 密码明文展示标记 */
  const [showPassword, setShowPassword] = useState(false);

  /** 登录请求加载中标记 */
  const loading = loginMutation.isPending;

  /**
   * 表单提交处理，校验邮箱密码后调用登录接口
   * @param e 表单事件
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    const pwdOk = password.length > 0;
    setEmailError(!emailOk);
    setPwdError(!pwdOk);
    if (!emailOk || !pwdOk) {
      toast.error('请检查并修正表单错误');
      return;
    }

    loginMutation.mutate(
      { email: trimmedEmail, password },
      {
        onSuccess: () => {
          toast.success('登录成功');
          router.push(safeRedirect);
        },
        onError: (err: Error) => {
          if (err instanceof ApiRequestError) {
            if (err.isUnauthorized) toast.error('邮箱或密码错误');
            else if (err.isForbidden) toast.error('账号已被禁用');
            else toast.error(err.message);
          } else {
            toast.error(err.message || '登录失败，请重试');
          }
        },
      },
    );
  };

  return (
    <div className="auth-card">
      {/* 头部 */}
      <div className="mb-7">
        <h1 className="auth-title">欢迎回来</h1>
        <p className="auth-subtitle">登录你的账号以发布文章、评论与点赞。</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="form-stack">
        {/* 邮箱 */}
        <FormField label="邮箱" error={emailError ? '请输入有效的邮箱地址' : undefined}>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="user@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(false);
            }}
            leftIcon={<Mail size={18} />}
            error={emailError}
          />
        </FormField>

        {/* 密码 */}
        <FormField label="密码" error={pwdError ? '请输入密码' : undefined}>
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="输入密码"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPwdError(false);
            }}
            leftIcon={<Lock size={18} />}
            rightElement={<PasswordToggle show={showPassword} onToggle={setShowPassword} />}
            error={pwdError}
          />
        </FormField>

        {/* 忘记密码提示 */}
        <div className="-mt-1 flex justify-end">
          <span className="text-muted text-(length:--type-xs)">忘记密码？请联系管理员重置</span>
        </div>

        {/* 提交按钮 */}
        <Button type="submit" loading={loading} className="w-full">
          登录
        </Button>
      </form>

      {/* 限速提示 */}
      <div className="auth-rate-hint">
        <Clock size={13} />
        <span>5 分钟内最多 5 次尝试</span>
      </div>

      {/* 底部切换链接 */}
      <div className="auth-switch">
        还没有账号？
        <Link href="/register" className="auth-switch-link">
          立即注册 →
        </Link>
      </div>
    </div>
  );
}
