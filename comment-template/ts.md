/**
 * @file 文件简要名称
 * @description 当前文件能力、业务场景、使用限制
 */

/** 接口超时时间，单位ms */
export const API_TIMEOUT = 30 * 1000;

/**
 * 本地存储key常量集合
 */
export const StorageKey = {
  /** 登录token */
  TOKEN: 'access_token',
  /** 用户信息缓存 */
  USER_INFO: 'user_info',
} as const;

/**
 * 订单状态枚举
 */
export enum OrderStatus {
  /** 待支付 */
  PENDING = 0,
  /** 已完成 */
  FINISHED = 1,
  /** 已取消 */
  CANCEL = 2,
}

/**
 * 用户基础信息
 */
interface UserInfo {
  /** 用户唯一ID */
  id: string;
  /** 用户昵称 */
  nickname: string;
  /**
   * 账号状态
   * 0-正常 1-冻结 2-注销
   */
  status: number;
  /** 最后登录时间，时间戳，未登录为null */
  lastLoginTime: number | null;
}

/**
 * 分页通用请求参数
 */
type PageQuery = {
  /** 当前页码，从1开始 */
  pageNum: number;
  /** 每页条数 */
  pageSize: number;
};

/**
 * 格式化时间戳为 YYYY-MM-DD HH:mm:ss
 * @param timestamp 毫秒时间戳
 * @param format 自定义格式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化日期字符串
 * @example
 * formatDate(1712345678000)
 * @warning 传入秒级时间戳会解析错误，请统一使用毫秒
 */
export function formatDate(
  timestamp: number,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  return '';
}

/**
 * 获取用户详情
 * @param userId 用户ID
 * @returns 用户信息
 * @throws 请求404、权限不足时抛出Error
 */
async function getUserDetail(userId: string): Promise<UserInfo> {
  return {} as UserInfo;
}

/**
 * 用户列表查询Hook
 * @param initialPageSize 默认每页数量
 * @returns 列表数据、加载状态、查询方法
 */
export function useUserList(initialPageSize: number = 10) {
  const list: UserInfo[] = [];
  const loading = false;
  const refresh = () => {};
  return {
    list,
    loading,
    refresh,
  };
}

/**
 * 请求封装类
 * @description 统一处理请求拦截、错误重试、token刷新
 */
export class RequestClient {
  /**
   * 初始化请求实例
   * @param baseUrl 接口基础地址
   */
  constructor(baseUrl: string) {
    //
  }

  /**
   * GET 请求
   * @param url 请求路径
   * @param params 查询参数
   */
  get<T>(url: string, params?: Record<string, any>): Promise<T> {
    return {} as Promise<T>;
  }
}

/**
 * @deprecated v1.2.0 已废弃，请使用 formatDate
 */
function oldFormatDate() {}

const maxUploadSize = 10 * 1024 * 1024; // 最大上传文件：10MB