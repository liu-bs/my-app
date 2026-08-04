/**
 * @file store.ts
 * @description 数据存储基础设施类型，定义写入队列任务和日志级别，用于文件存储层的并发写入控制与日志记录
 */

/**
 * 写入队列任务
 * @template T 写入数据的类型
 */
export interface WriteTask<T> {
  /** 待写入的数据 */
  data: T;
  /** 写入成功时调用的回调 */
  resolve: () => void;
  /** 写入失败时调用的回调 */
  reject: (err: unknown) => void;
}

/** 日志级别：debug 调试 / info 信息 / warn 警告 / error 错误 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
