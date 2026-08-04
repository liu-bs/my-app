/**
 * @file BackToTop.tsx
 * @description 返回顶部悬浮按钮，滚动超过 400px 时显示
 */
'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * BackToTop 返回顶部按钮
 */
export function BackToTop() {
  /** 是否可见 */
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="返回顶部"
      className="border-stroke bg-surface text-heading hover:bg-card-hover-bg fixed bottom-6 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border shadow-lg transition-all duration-200 hover:shadow-xl max-md:bottom-4 max-md:left-4 max-md:h-10 max-md:w-10"
    >
      <ArrowUp size={18} />
    </button>
  );
}
