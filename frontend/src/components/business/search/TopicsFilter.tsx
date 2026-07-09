/**
 * @file TopicsFilter.tsx
 * @description 搜索页主题过滤组件，提供主题分类切换能力
 */

import { FC } from "react";
import { Filter } from "lucide-react";
import { TOPICS } from "@/constans/index";
import Style from "@/styles/commonStyle";

/** 主题过滤组件 Props */
interface TopicsFilterProps {
  /** 当前激活的主题 ID；未传时默认 "all" 表示全部主题 */
  activeTopic?: string;
  /** 主题切换回调，参数为新主题的 ID */
  onTopicChange?: (topicId: string) => void;
}

/**
 * 主题过滤组件
 * 渲染主题分类按钮列表，点击按钮切换当前激活主题
 *
 * @param props 组件入参
 * @param [props.activeTopic] 当前激活的主题 ID
 * @param [props.onTopicChange] 主题切换回调
 */
const TopicsFilter: FC<TopicsFilterProps> = ({ activeTopic = "all", onTopicChange }) => {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-3"> {/* 主题过滤外层容器，左侧标签 + 右侧主题按钮组 */}
      {/* 左侧"Topics"提示标签 */}
      <div className="text-text-secondary flex items-center gap-2">
        {/* 过滤图标 */}
        <Filter className="h-4 w-4" />
        {/* 提示文案 */}
        <span className="text-sm">Topics:</span>
      </div>
      {/* 主题按钮组容器 */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 遍历渲染主题分类按钮 */}
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onTopicChange?.(topic.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${activeTopic === topic.id ? Style.btnActive : Style.btn}`}
          >
            {topic.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicsFilter;
