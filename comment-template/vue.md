<!--
@file GoodsCard.vue
@description 商品卡片组件，展示商品基础信息、标签、操作按钮；支持选中态、禁用态、自定义底部操作区
-->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

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
 * 组件入参类型
 */
export interface GoodsCardProps {
  /** 商品数据 */
  data: GoodsItem;
  /** 是否选中 */
  selected?: boolean;
  /** 是否禁用操作 */
  disabled?: boolean;
  /** 自定义子标题插槽 */
  subTitleSlot?: unknown;
}

/**
 * 组件触发事件类型
 */
export interface GoodsCardEmits {
  /** 卡片点击 */
  (e: 'click', record: GoodsItem): void;
  /** 编辑按钮点击 */
  (e: 'edit', record: GoodsItem): void;
}

/** 默认图片兜底地址 */
const DEFAULT_GOODS_COVER = '/assets/images/goods-default.png';
/** 最多默认展示标签数量 */
const MAX_VISIBLE_TAG_COUNT = 3 as const;

const props = defineProps<GoodsCardProps>();
const emit = defineEmits<GoodsCardEmits>();

/** 图片加载异常标记 */
const imgError = ref<boolean>(false);
/** 是否展开标签列表 */
const tagExpand = ref<boolean>(false);

/** 缓存上一次商品ID，用于数据切换判断 */
const prevGoodsId = ref<string | null>(null);

/**
 * 根据状态获取展示文本
 * @param s 商品状态枚举 {@link GoodsStatusEnum}
 * @returns 状态文本
 */
const getStatusText = (s: GoodsStatusEnum): string => {
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
};

/**
 * 计算需要渲染的标签数组，根据展开状态截断数量
 */
const visibleTagList = computed(() => {
  const tags = props.data.tags ?? [];
  return tagExpand.value ? tags : tags.slice(0, MAX_VISIBLE_TAG_COUNT);
});

/**
 * 判断标签是否超出默认展示数量，控制展开按钮显示
 */
const hasOverflowTag = computed(() => {
  const tags = props.data.tags ?? [];
  return tags.length > MAX_VISIBLE_TAG_COUNT;
});

/**
 * 外部选中状态变更，重置标签展开状态
 */
watch(
  () => props.selected,
  () => {
    tagExpand.value = false;
  }
);

/**
 * 监听商品数据切换，重置内部状态
 */
watch(
  () => props.data.id,
  (newId) => {
    if (prevGoodsId.value !== newId) {
      imgError.value = false;
      tagExpand.value = false;
      prevGoodsId.value = newId;
    }
  }
);

/**
 * 卡片主体点击
 */
const handleCardClick = () => {
  if (props.disabled) return;
  emit('click', props.data);
};

/**
 * 编辑按钮点击，阻止冒泡
 */
const handleEditClick = (e: Event) => {
  e.stopPropagation();
  if (props.disabled) return;
  emit('edit', props.data);
};

/**
 * 图片加载失败，启用兜底图
 */
const handleImgError = () => {
  imgError.value = true;
};

/**
 * 切换标签展开/收起
 */
const toggleTagExpand = () => {
  tagExpand.value = !tagExpand.value;
};
</script>

<template>
  <!-- 商品卡片外层容器，动态追加选中/禁用样式 -->
  <div
    class="goods-card"
    :class="{ selected: props.selected, disabled: props.disabled }"
    @click="handleCardClick"
  >
    <!-- 商品封面区域 -->
    <div class="goods-cover">
      <!-- 商品封面图，加载异常或无地址使用兜底图 -->
      <img
        :src="imgError || !props.data.cover ? DEFAULT_GOODS_COVER : props.data.cover!"
        :alt="props.data.name"
        @error="handleImgError"
      />
    </div>

    <!-- 商品基础信息区域 -->
    <div class="goods-info">
      <!-- 商品名称 -->
      <h3 class="goods-name">{{ props.data.name }}</h3>
      <!-- 自定义子标题插槽 -->
      <slot name="subTitle"></slot>
      <!-- 商品售价 -->
      <div class="goods-price">¥{{ props.data.price.toFixed(2) }}</div>
      <!-- 商品状态文本 -->
      <div class="goods-status">{{ getStatusText(props.data.status) }}</div>

      <!-- 渲染商品标签组，根据展开状态控制数量 -->
      <div class="goods-tags">
        <span
          v-for="tag in visibleTagList"
          :key="tag.label"
          :style="{ color: tag.color }"
        >
          {{ tag.label }}
        </span>
        <button
          v-if="hasOverflowTag"
          type="button"
          @click="toggleTagExpand"
        >
          {{ tagExpand ? '收起' : `+${(props.data.tags?.length ?? 0) - MAX_VISIBLE_TAG_COUNT}` }}
        </button>
      </div>
    </div>

    <!-- 卡片底部操作栏 -->
    <div class="goods-footer">
      <!-- 编辑按钮 -->
      <button @click.stop="handleEditClick">编辑</button>
      <!-- 自定义底部扩展插槽 -->
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.goods-card {
  border: 1px solid #eee;
  padding: 12px;
}
.goods-card.selected {
  border-color: #409eff;
}
.goods-card.disabled {
  opacity: 0.6;
  pointer-events: none;
}
</style>