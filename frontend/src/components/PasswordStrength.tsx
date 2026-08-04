/**
 * @file PasswordStrength.tsx
 * @description 密码强度指示器组件，根据密码复杂度计算分数并展示强度条和文字标签
 */

/**
 * 计算密码强度分数
 * @param pwd 密码字符串
 * @returns 强度分数：0-3
 */
function getStrength(pwd: string): number {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 6) score += 1;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
  if (/\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score += 1;
  return score;
}

/**
 * 密码强度颜色映射（语义层，Light/Dark 自动切换）：
 *  score ≤ 1 → 绯红（危险区）
 *  score = 2 → 烬橙（过渡区）
 *  score = 3 → 靛灰（安全区，替代禁用的绿色）
 * @param score 强度分数
 * @returns 对应的 CSS 变量颜色值
 */
function strengthColor(score: number): string {
  if (score <= 1) return 'var(--color-state-error)';
  if (score === 2) return 'var(--color-state-warning)';
  return 'var(--color-state-success)';
}

/** 密码强度文字标签数组，索引对应分数 */
const labels = ['', '密码强度：弱', '密码强度：中', '密码强度：强'];

import type { PasswordStrengthProps } from '@my-app/shared';

/**
 * PasswordStrength 密码强度指示器
 * @param props {@link PasswordStrengthProps}
 */
export function PasswordStrength({ password }: PasswordStrengthProps) {
  /** 当前密码的强度分数 */
  const score = getStrength(password);
  if (!password) return null;

  /** 当前分数对应的激活颜色 */
  const activeColor = strengthColor(score);

  return (
    <>
      {/* 强度进度条区域 */}
      <div className="mt-2 flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-[3px] flex-1 rounded-xs transition-colors duration-200"
            style={{
              background: i < score ? activeColor : 'var(--color-stroke)',
            }}
          />
        ))}
      </div>
      {/* 强度文字标签 */}
      <span className="mt-1 block text-(length:--type-2xs)" style={{ color: activeColor }}>
        {labels[score]}
      </span>
    </>
  );
}
