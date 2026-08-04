/**
 * @file PasswordToggle.tsx
 * @description 密码可见性切换按钮，封装 Eye/EyeOff 图标和 pwd-toggle 样式
 */
import { Eye, EyeOff } from 'lucide-react';

interface PasswordToggleProps {
  show: boolean;
  onToggle: (show: boolean) => void;
}

export function PasswordToggle({ show, onToggle }: PasswordToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!show)}
      aria-label={show ? '隐藏密码' : '显示密码'}
      className="pwd-toggle"
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}
