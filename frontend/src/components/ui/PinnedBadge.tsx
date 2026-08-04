/**
 * @file PinnedBadge.tsx
 * @description 置顶徽章组件，用于文章卡片展示置顶标记
 */
import { Pin } from 'lucide-react';

/** 置顶徽章 */
export function PinnedBadge() {
  return (
    <span className="chip-sm">
      <Pin size={10} />
      置顶
    </span>
  );
}
