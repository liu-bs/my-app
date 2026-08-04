/**
 * @file query-client.ts
 * @description React Query 客户端实例管理。服务端每次请求新建实例防止跨用户缓存污染，
 *              浏览器端单例复用以保留跨导航缓存。
 */
import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';

/**
 * 创建 QueryClient 实例
 * @description 配置默认选项：staleTime 60s 避免 SSR 后客户端立即 refetch，
 *              gcTime 5min，retry 1 次，关闭 windowFocus refetch；
 *              dehydrate 配置支持挂起中的 Promise 参与 hydrate（流式预取）
 * @returns 新的 QueryClient 实例
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR 后避免客户端立即 refetch
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        // 挂起中的 Promise 也参与 hydrate，支持流式预取
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

/** 浏览器端 QueryClient 单例缓存 */
let browserQueryClient: QueryClient | undefined;

/**
 * 获取 QueryClient 实例
 * @description 服务端每次调用返回新实例（防跨用户缓存污染），浏览器端复用单例
 * @returns QueryClient 实例
 */
export function getQueryClient(): QueryClient {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
