/**
 * @file _PasswordDemo.tsx
 * @description 密码强度演示的客户端组件，包含输入框与实时强度反馈
 *              从组件库展示页抽出，以使主页面保持为服务器组件
 */
'use client';

import { useState } from 'react';
import { PasswordStrength } from '@/components/PasswordStrength';
import { Input } from '@/components/ui/Input';

/**
 * 密码强度演示组件
 * @description 受控输入密码并实时展示 PasswordStrength 强度反馈
 */
export function PasswordDemo() {
  /** 密码强度演示输入值 */
  const [pwd, setPwd] = useState('');

  return (
    <div className="w-full max-w-75">
      <Input
        type="text"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
        placeholder="输入密码测试强度"
      />
      <PasswordStrength password={pwd} />
    </div>
  );
}
