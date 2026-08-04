/**
 * @file GoodsCard.tsx
 * @description 商品卡片组件，展示商品基础信息、标签、操作按钮；支持选中态、禁用态、自定义底部操作区
 */
import type {
  FC,
  ReactNode,
  MouseEvent,
  ChangeEvent,
  KeyboardEvent,
  ReactElement,
} from 'react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

/**
 * 商品上下架状态枚举
 */
export enum GoodsStatusEnum {
  /** 未上架 */
  OFF_SHELF = 0,
  /** 已上架 */
  ON_SHELF = 1,
  /** 售罄 */
  SOLD_OUT = 2,
}

/**
 * 商品标签类型
 */
export type GoodsTag = {
  /** 标签文本 */
  label: string;
  /** 标签主题色 */
  color: string;
};

/**
 * 商品基础数据结构
 */
export interface GoodsItem {
  /** 商品唯一id */
  id: string;
  /** 商品名称 */
  name: string;
  /** 商品封面图地址 */
  cover?: string;
  /** 售价 */
  price: number;
  /** 商品状态 {@link GoodsStatusEnum} */
  status: GoodsStatusEnum;
  /** 商品标签列表 */
  tags?: GoodsTag[];
}

/**
 * GoodsCard 组件入参
 */
export interface GoodsCardProps {
  /** 商品数据 */
  data: GoodsItem;
  /** 是否选中 */
  selected?: boolean;
  /** 是否禁用操作 */
  disabled?: boolean;
  /** 卡片点击事件 */
  onClick?: (record: GoodsItem, e: MouseEvent<HTMLDivElement>) => void;
  /** 点击编辑按钮回调 */
  onEdit?: (record: GoodsItem) => void;
  /** 自定义底部插槽 */
  extraFooter?: ReactNode;
  /** 自定义子标题元素 */
  subTitleSlot?: ReactElement;
}

/** 默认图片兜底地址 */
const DEFAULT_GOODS_COVER = '/assets/images/goods-default.png';

/** 最多默认展示标签数量 */
const MAX_VISIBLE_TAG_COUNT = 3 as const;

/**
 * GoodsCard 商品卡片
 * @param props {@link GoodsCardProps}
 */
const GoodsCard: FC<GoodsCardProps> = (props) => {
  const {
    data,
    selected = false,
    disabled = false,
    onClick,
    onEdit,
    extraFooter,
    subTitleSlot,
  } = props;
  const { name, cover, price, status, tags = [] } = data;

  /** 图片加载异常标记 */
  const [imgError, setImgError] = useState<boolean>(false);
  /** 是否展开标签列表 */
  const [tagExpand, setTagExpand] = useState<boolean>(false);

  /**
   * 卡片DOM容器Ref，用于外部获取元素
   */
  const cardRef = useRef<HTMLDivElement>(null);
  /**
   * 持久化上一次商品ID，用于判断数据切换
   */
  const prevGoodsIdRef = useRef<string | null>(null);

  /**
   * 外部选中状态变更时重置内部展开标记
   */
  useEffect(() => {
    setTagExpand(false);
  }, [selected]);

  /**
   * 商品数据切换检测，执行内部重置逻辑
   */
  useEffect(() => {
    if (prevGoodsIdRef.current !== data.id) {
      setImgError(false);
      setTagExpand(false);
      prevGoodsIdRef.current = data.id;
    }
  }, [data.id]);

  /**
   * 获取状态对应的展示文字
   * @param s 商品状态枚举值 {@link GoodsStatusEnum}
   * @returns 状态文本
   */
  const getStatusText = useCallback((s: GoodsStatusEnum): string => {
    switch (s) {
      case GoodsStatusEnum.ON_SHELF:
        return '已上架';
      case GoodsStatusEnum.OFF_SHELF:
        return '未上架';
      case GoodsStatusEnum.SOLD_OUT:
        return '售罄';
      default:
        return '未知';
    }
  }, []);

  /**
   * 计算当前需要渲染的标签数组
   * 根据展开状态截断标签数量
   */
  const visibleTagList = useMemo(() => {
    return tagExpand ? tags : tags.slice(0, MAX_VISIBLE_TAG_COUNT);
  }, [tagExpand, tags]);

  /**
   * 判断是否存在多余标签，需要展示展开按钮
   */
  const hasOverflowTag = useMemo(() => tags.length > MAX_VISIBLE_TAG_COUNT, [tags]);

  /**
   * 卡片主体点击处理
   * @param e 原生鼠标事件
   */
  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(data, e);
  };

  /**
   * 编辑按钮点击
   * @param e 原生鼠标事件，阻止冒泡
   */
  const handleEditClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (disabled) return;
    onEdit?.(data);
  };

  /**
   * 图片加载失败回调，启用兜底图标识
   */
  const handleImgError = () => {
    setImgError(true);
  };

  /**
   * 切换标签展开/收起
   */
  const toggleTagExpand = () => {
    setTagExpand((prev) => !prev);
  };

  return (
    <>
      {/* 商品卡片外层容器，动态追加选中/禁用样式 */}
      <div
        ref={cardRef}
        className={`goods-card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleCardClick}
      >
        {/* 商品封面区域 */}
        <div className="goods-cover">
          {/* 商品封面图，加载异常或无地址时使用默认兜底图 */}
          <img
            src={imgError || !cover ? DEFAULT_GOODS_COVER : cover!}
            alt={name}
            onError={handleImgError}
          />
        </div>

        {/* 商品基础信息区域 */}
        <div className="goods-info">
          {/* 商品名称 */}
          <h3 className="goods-name">{name}</h3>
          {/* 自定义子标题插槽 */}
          {subTitleSlot}
          {/* 商品售价 */}
          <div className="goods-price">¥{price.toFixed(2)}</div>
          {/* 商品状态文本 */}
          <div className="goods-status">{getStatusText(status)}</div>

          {/* 渲染商品标签组，根据展开状态控制显示数量 */}
          <div className="goods-tags">
            {visibleTagList.map((tag) => (
              {/* 单个商品标签，使用标签文本作为key */}
              <span key={tag.label} style={{ color: tag.color }}>
                {tag.label}
              </span>
            ))}
            {hasOverflowTag && (
              <button type="button" onClick={toggleTagExpand}>
                {tagExpand ? '收起' : `+${tags.length - MAX_VISIBLE_TAG_COUNT}`}
              </button>
            )}
          </div>
        </div>

        {/* 卡片底部操作栏 */}
        <div className="goods-footer">
          {/* 编辑按钮 */}
          <button onClick={handleEditClick}>编辑</button>
          {/* 外部传入自定义扩展插槽 */}
          {extraFooter}
        </div>
      </div>
    </>
  );
};

export default GoodsCard;