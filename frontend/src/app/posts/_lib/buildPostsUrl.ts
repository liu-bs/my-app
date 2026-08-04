/**
 * 根据当前搜索参数与变更项构建文章列表 URL
 * @param searchParams 当前 URL 搜索参数（URLSearchParams 或 Record）
 * @param changes 需要变更的键值对，值为 null/undefined/空字符串时删除该参数
 * @returns 构建完成的文章列表路径
 */
export function buildPostsUrl(
  searchParams: URLSearchParams | Record<string, string | undefined>,
  changes: Record<string, string | null | undefined>,
): string {
  const params =
    searchParams instanceof URLSearchParams
      ? new URLSearchParams(searchParams)
      : new URLSearchParams(
          Object.entries(searchParams).reduce<Record<string, string>>((acc, [k, v]) => {
            if (v) acc[k] = v;
            return acc;
          }, {}),
        );
  for (const [key, value] of Object.entries(changes)) {
    if (value === null || value === undefined || value === '') params.delete(key);
    else params.set(key, value);
  }
  if (!Object.keys(changes).some((k) => k === 'page')) params.delete('page');
  const qs = params.toString();
  return qs ? `/posts?${qs}` : '/posts';
}
