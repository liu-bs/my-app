/**
 * @file page.tsx
 * @description 注册页，提供 5 字段注册表单、实时校验、密码强度与限频提示
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Clock, ArrowRight, User, UserPlus, Check, X } from 'lucide-react';
import { PasswordToggle } from '@/components/PasswordToggle';
import toast from '@/lib/toast';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { PasswordStrength } from '@/components/PasswordStrength';
import { useRegister } from '@/services/auth/hooks';
import { ApiRequestError } from '@/lib/api/request';
import type { FieldId, FieldState } from '@my-app/shared';

/** 表单字段初始状态 */
const initialField: FieldState = { value: '', touched: false, valid: null };

/**
 * 校验单个表单字段是否合法
 * @param id 字段标识
 * @param value 字段值
 * @returns 是否通过校验
 */
function validateField(id: FieldId, value: string): boolean {
  const v = value;
  switch (id) {
    case 'firstName':
    case 'lastName':
      return v.trim().length >= 1 && v.trim().length <= 50;
    case 'username':
      return /^[a-zA-Z0-9_]{3,30}$/.test(v.trim());
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    case 'password':
      return v.length >= 6 && v.length <= 128;
    default:
      return false;
  }
}

/** 各字段校验失败的错误提示文案 */
const errorMsgs: Record<FieldId, string> = {
  firstName: '1-50 个字符',
  lastName: '1-50 个字符',
  username: '仅允许字母、数字、下划线，3-30 字符',
  email: '请输入有效的邮箱地址',
  password: '密码至少 6 位',
};

/**
 * 注册页
 * @description 提供 5 字段注册表单，含实时校验、密码强度展示与限频提示
 */
export default function RegisterPage() {
  const router = useRouter();

  /** 各表单字段的状态集合 */
  const [fields, setFields] = useState<Record<FieldId, FieldState>>({
    firstName: { ...initialField },
    lastName: { ...initialField },
    username: { ...initialField },
    email: { ...initialField },
    password: { ...initialField },
  });
  /** 密码明文展示标记 */
  const [showPassword, setShowPassword] = useState(false);
  /** 注册 mutation 实例 */
  const registerMutation = useRegister();
  /** 注册请求加载中标记 */
  const loading = registerMutation.isPending;

  /**
   * 更新表单字段值并触发实时校验
   * @param id 字段标识
   * @param value 字段值
   */
  const updateField = (id: FieldId, value: string) => {
    setFields((prev) => {
      const next = { ...prev };
      if (value.length === 0) {
        next[id] = { value: '', touched: false, valid: null };
      } else {
        next[id] = { value, touched: true, valid: validateField(id, value) };
      }
      return next;
    });
  };

  /**
   * 表单提交处理，全量校验后调用注册接口
   * @param e 表单事件
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let allValid = true;
    const nextFields = { ...fields };
    (Object.keys(nextFields) as FieldId[]).forEach((id) => {
      const v = nextFields[id].value;
      if (v.length === 0) {
        nextFields[id] = { value: '', touched: true, valid: false };
        allValid = false;
      } else {
        const valid = validateField(id, v);
        nextFields[id] = { value: v, touched: true, valid };
        if (!valid) allValid = false;
      }
    });
    setFields(nextFields);

    if (!allValid) {
      toast.error('请检查并修正表单错误');
      return;
    }

    registerMutation.mutate(
      {
        firstName: fields.firstName.value.trim(),
        lastName: fields.lastName.value.trim(),
        username: fields.username.value.trim(),
        email: fields.email.value.trim(),
        password: fields.password.value,
      },
      {
        onSuccess: () => {
          toast.success('注册成功，请登录');
          router.push('/login');
        },
        onError: (err: Error) => {
          if (err instanceof ApiRequestError) {
            if (err.status === 409) toast.error('邮箱或用户名已被注册');
            else if (err.details?.length) toast.error(err.details.map((d) => d.message).join('；'));
            else toast.error(err.message);
          } else {
            toast.error(err.message || '注册失败，请重试');
          }
        },
      },
    );
  };

  /**
   * 渲染字段校验状态图标（通过/失败）
   * @param id 字段标识
   * @returns 状态图标 JSX 元素或 null
   */
  const renderStatusIcon = (id: FieldId) => {
    const f = fields[id];
    if (f.valid === null) return null;
    return f.valid ? (
      <Check size={16} className="text-state-success" strokeWidth={3} />
    ) : (
      <X size={16} className="text-state-error" strokeWidth={3} />
    );
  };

  return (
    <div className="auth-card">
      {/* 头部 */}
      <div className="mb-7">
        <h1 className="auth-title">创建账号</h1>
        <p className="auth-subtitle">注册后即可发布文章、评论与互动。</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="form-stack">
        {/* firstName + lastName */}
        <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          <FormField
            label="名"
            required
            error={fields.firstName.valid === false ? errorMsgs.firstName : undefined}
          >
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Alex"
              maxLength={50}
              autoComplete="given-name"
              value={fields.firstName.value}
              onChange={(e) => updateField('firstName', e.target.value)}
              leftIcon={<User size={18} />}
              rightElement={<span>{renderStatusIcon('firstName')}</span>}
              error={fields.firstName.valid === false}
              success={fields.firstName.valid === true}
            />
          </FormField>

          <FormField
            label="姓"
            required
            error={fields.lastName.valid === false ? errorMsgs.lastName : undefined}
          >
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Chen"
              maxLength={50}
              autoComplete="family-name"
              value={fields.lastName.value}
              onChange={(e) => updateField('lastName', e.target.value)}
              leftIcon={<User size={18} />}
              rightElement={<span>{renderStatusIcon('lastName')}</span>}
              error={fields.lastName.valid === false}
              success={fields.lastName.valid === true}
            />
          </FormField>
        </div>

        {/* username */}
        <FormField
          label="用户名"
          required
          hint="可用字母、数字、下划线，3-30 字符"
          error={fields.username.valid === false ? errorMsgs.username : undefined}
        >
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="alexchen"
            maxLength={30}
            autoComplete="username"
            value={fields.username.value}
            onChange={(e) => updateField('username', e.target.value)}
            leftIcon={<UserPlus size={18} />}
            rightElement={<span>{renderStatusIcon('username')}</span>}
            error={fields.username.valid === false}
            success={fields.username.valid === true}
          />
        </FormField>

        {/* email */}
        <FormField
          label="邮箱"
          required
          error={fields.email.valid === false ? errorMsgs.email : undefined}
        >
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="user@example.com"
            autoComplete="email"
            value={fields.email.value}
            onChange={(e) => updateField('email', e.target.value)}
            leftIcon={<Mail size={18} />}
            rightElement={<span>{renderStatusIcon('email')}</span>}
            error={fields.email.valid === false}
            success={fields.email.valid === true}
          />
        </FormField>

        {/* password */}
        <FormField
          label="密码"
          required
          error={fields.password.valid === false ? errorMsgs.password : undefined}
        >
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="至少 6 位"
            autoComplete="new-password"
            value={fields.password.value}
            onChange={(e) => updateField('password', e.target.value)}
            leftIcon={<Lock size={18} />}
            rightElement={<PasswordToggle show={showPassword} onToggle={setShowPassword} />}
            error={fields.password.valid === false}
            success={fields.password.valid === true}
          />
          <PasswordStrength password={fields.password.value} />
        </FormField>

        {/* 提交按钮 */}
        <Button type="submit" loading={loading} className="w-full">
          注册
        </Button>
      </form>

      {/* 限速提示 */}
      <div className="auth-rate-hint">
        <Clock size={13} />
        <span>5 分钟内最多 5 次尝试</span>
      </div>

      {/* 底部切换链接 */}
      <div className="auth-switch">
        已有账号？
        <Link href="/login" className="auth-switch-link">
          立即登录 →
          <ArrowRight size={14} className="ml-0.5 inline" />
        </Link>
      </div>
    </div>
  );
}
