/**
 * @file SocialLoginButtons.tsx
 * @description 第三方登录按钮组件，目前为占位实现：点击后展示 1s 加载动画再提示"该登录方式尚未配置"
 */
"use client";

import { useState } from "react";

/**
 * 第三方登录按钮组件
 * 渲染 GitHub / X 两个社交登录按钮，当前未对接真实第三方登录，触发后展示加载动画并提示用户改用邮箱密码
 * @returns 渲染完成的第三方登录按钮 JSX
 */
const SocialLoginButtons: React.FC = () => {
  // 当前正在加载的第三方提供方（"GitHub" | "X" | null），用于控制按钮的 loading 态
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  // 错误提示文本；为 null 时不展示
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /**
   * 触发第三方登录的占位处理：1s 后清除 loading 并展示"该登录方式尚未配置"的提示，提示 4s 后自动消失
   * @param provider 第三方登录提供方名称
   */
  const handleSocialLogin = (provider: string) => {
    setLoadingProvider(provider);
    setErrorMsg(null);
    // 1s 后清除加载态并展示提示文案
    setTimeout(() => {
      setLoadingProvider(null);
      setErrorMsg(`${provider} login is not configured yet. Please use email/password.`);
      // 4s 后自动清除错误提示
      setTimeout(() => setErrorMsg(null), 4000);
    }, 1000);
  };

  return (
    <>{/* 第三方登录按钮容器，两列网格布局 */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        {/* GitHub 登录按钮：点击触发占位登录逻辑，loading 时显示加载动画 */}
        <button
          type="button"
          onClick={() => handleSocialLogin("GitHub")}
          disabled={loadingProvider !== null}
          className="border-border bg-surface text-text-primary hover:bg-surface-secondary flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingProvider === "GitHub" ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          )}
          {/* GitHub 按钮文字标签 */}
          <span className="text-sm font-medium">GitHub</span>
        </button>
        {/* X 登录按钮：点击触发占位登录逻辑，loading 时显示加载动画 */}
        <button
          type="button"
          onClick={() => handleSocialLogin("X")}
          disabled={loadingProvider !== null}
          className="border-border bg-surface text-text-primary hover:bg-surface-secondary flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingProvider === "X" ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          )}
          {/* X 按钮文字标签 */}
          <span className="text-sm font-medium">X</span>
        </button>
        {/* 条件渲染：仅在错误提示存在时显示 */}
        {errorMsg && <div className="bg-warning/10 text-warning col-span-2 rounded-lg px-3 py-2 text-center text-xs">{errorMsg}</div>}
      </div>
    </>
  );
};

export default SocialLoginButtons;
