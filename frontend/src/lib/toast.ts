/**
 * @file toast.ts
 * @description react-hot-toast 包装模块，补充 info() 方法以兼容原 sonner API
 */

import toast, { type DefaultToastOptions } from 'react-hot-toast';

/**
 * toast.info 兼容方法
 *
 * react-hot-toast 没有 info 类型，通过 toast() + 自定义 className + icon 实现。
 * 样式由 components.css 中的 .rht-info 选择器驱动。
 */
function info(msg: string, opts?: DefaultToastOptions) {
  return toast(msg, {
    className: 'rht-info',
    icon: 'ℹ',
    ...opts,
  });
}

// 运行时挂载 info 到 toast 函数上
(toast as unknown as { info: typeof info }).info = info;

/**
 * 带 info() 方法的 toast 类型
 * 在类型层面声明 info 存在，使 toast.info() 调用通过类型检查
 */
type ToastWithInfo = typeof toast & {
  info: typeof info;
};

export default toast as ToastWithInfo;
