import path from 'node:path';
import fs from 'node:fs/promises';

const BASE_URL = 'http://localhost:3001';
const DATA_DIR = path.resolve(import.meta.dirname, '../data');

async function cleanDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const entries = await fs.readdir(DATA_DIR).catch(() => []);
  await Promise.all(
    entries.map(async (name) => {
      const full = path.join(DATA_DIR, name);
      if (name.endsWith('.lock')) {
        await fs.unlink(full).catch(() => {});
        return;
      }
      if (!name.endsWith('.json')) return;
      const content =
        name === 'blog.json'
          ? JSON.stringify(
              {
                posts: [],
                categories: [],
                siteConfig: { blogName: '我的博客', author: '匿名' },
              },
              null,
              2,
            )
          : '[]';
      await fs.writeFile(full, content, 'utf-8').catch(() => {});
    }),
  );
}

interface ApiResult<T = unknown> {
  status: number;
  data: { code: number; data: T; message?: string } | null;
  cookies: string[];
  raw: string;
}

let cookieJar = '';

async function request<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResult<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieJar,
      ...(options.headers || {}),
    },
  });

  const raw = await res.text();
  let data: ApiResult<T>['data'] = null;
  try {
    data = JSON.parse(raw) as ApiResult<T>['data'];
  } catch {
    // 非 JSON 响应（如导出文件）
  }

  const setCookie = res.headers.getSetCookie?.() || [];
  if (setCookie.length > 0) {
    const parsed = setCookie.map((c) => c.split(';')[0]).join('; ');
    cookieJar = parsed;
  }

  return {
    status: res.status,
    data: data as ApiResult<T>['data'],
    cookies: setCookie,
    raw,
  };
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`❌ ${message}`);
  }
  console.log(`✅ ${message}`);
}

const TEST_ID = Date.now();
const TEST_EMAIL = `test${TEST_ID}@example.com`;
const TEST_USERNAME = `testuser${TEST_ID}`;

async function runTests(): Promise<void> {
  // 清理旧数据，确保测试环境独立
  await cleanDataDir();

  console.log('=== 测试开始 ===');
  console.log(`使用测试账号: ${TEST_EMAIL}\n`);

  // 1. 健康检查
  const health = await request('/api/health');
  assert(
    health.status === 200 && (health.data as unknown as { status: string })?.status === 'ok',
    '健康检查',
  );

  // 2. 公开读取接口（无数据时）
  let posts = await request('/api/posts');
  assert(posts.status === 200 && Array.isArray(posts.data?.data?.posts), 'GET /api/posts 空列表');

  const categories = await request('/api/categories');
  assert(
    categories.status === 200 && Array.isArray(categories.data?.data?.categories),
    'GET /api/categories 空列表',
  );

  const tags = await request('/api/tags');
  assert(tags.status === 200 && Array.isArray(tags.data?.data?.tags), 'GET /api/tags 空列表');

  const config = await request('/api/config');
  assert(
    config.status === 200 &&
      config.data?.data?.config?.blogName === '我的博客' &&
      config.data?.data?.config?.author === '匿名',
    'GET /api/config 默认值',
  );

  // 3. 未登录写操作应 401
  const unauthorized = await request('/api/posts', {
    method: 'POST',
    body: JSON.stringify({ title: 'test', content: 'content', category: 'cat', isDraft: false }),
  });
  assert(unauthorized.status === 401, '未登录创建文章返回 401');

  // 4. 注册
  const register = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: 'TestPass123!',
      firstName: 'Test',
      lastName: 'User',
      username: TEST_USERNAME,
    }),
  });
  assert(register.status === 201, '注册成功并设置 cookie');

  // 5. 检查 email 归一化：重复注册大小写不同应 409
  const dup = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: TEST_EMAIL.toLowerCase(),
      password: 'TestPass123!',
      firstName: 'Test',
      lastName: 'User',
      username: `${TEST_USERNAME}2`,
    }),
  });
  assert(dup.status === 409, 'email 归一化后重复注册返回 409');

  // 6. 获取当前用户
  const me = await request('/api/auth/me');
  assert(
    me.status === 200 && me.data?.data?.user?.email === TEST_EMAIL.toLowerCase(),
    'GET /api/auth/me',
  );

  // 7. 创建已发布文章
  const create = await request('/api/posts', {
    method: 'POST',
    body: JSON.stringify({
      title: '  我的第一篇博客  ',
      content: '# 标题\n\n这是正文内容，包含 **加粗** 和 [链接](https://example.com)。',
      category: '  前端  ',
      tags: ['React', 'Next.js', 'React'],
      isDraft: false,
      pinned: true,
    }),
  });
  assert(create.status === 201 && create.data?.data?.post?.isDraft === false, '创建已发布文章');
  const postId = create.data?.data?.post?.id as string;

  // 8. 列表与排序
  posts = await request('/api/posts');
  assert(
    posts.status === 200 &&
      posts.data?.data?.posts.length === 1 &&
      posts.data?.data?.posts[0].pinned === true,
    'GET /api/posts 包含发布文章并按置顶排序',
  );

  // 9. 分类/标签自动维护
  const cats = await request('/api/categories');
  assert(cats.data?.data?.categories.includes('前端'), '已发布文章分类自动维护');
  const tagRes = await request('/api/tags');
  assert(
    tagRes.data?.data?.tags.includes('React') && tagRes.data?.data?.tags.includes('Next.js'),
    '标签动态聚合且去重',
  );

  // 10. 搜索
  const search = await request('/api/posts?q=正文');
  assert(search.data?.data?.posts.length === 1, '搜索功能正常');
  const noResult = await request('/api/posts?q=不存在');
  assert(noResult.data?.data?.posts.length === 0, '搜索无结果返回空数组');

  // 11. 获取单篇文章
  const single = await request(`/api/posts/${postId}`);
  assert(single.status === 200 && single.data?.data?.post?.id === postId, 'GET /api/posts/:id');

  // 12. 摘要生成
  assert(
    single.data?.data?.post?.summary?.includes('标题') &&
      !single.data?.data?.post?.summary?.includes('**'),
    '摘要生成移除 Markdown 语法',
  );

  // 13. 创建草稿
  const draft = await request('/api/posts', {
    method: 'POST',
    body: JSON.stringify({
      title: '我的草稿',
      content: '草稿内容',
      category: '草稿分类',
      isDraft: true,
      pinned: true,
    }),
  });
  assert(
    draft.status === 201 &&
      draft.data?.data?.post?.isDraft === true &&
      draft.data?.data?.post?.pinned === false,
    '创建草稿并强制 pinned=false',
  );
  const draftId = draft.data?.data?.post?.id as string;

  // 草稿分类不应加入 categories
  const catsBeforePublish = await request('/api/categories');
  assert(
    !catsBeforePublish.data?.data?.categories.includes('草稿分类'),
    '草稿分类未加入 categories',
  );

  // 14. 访客访问草稿返回 404
  cookieJar = '';
  const guestDraft = await request(`/api/posts/${draftId}`);
  assert(guestDraft.status === 404, '访客访问草稿返回 404');

  // 15. 访客获取草稿列表返回空
  const guestDrafts = await request('/api/posts?draft=true');
  assert(
    guestDrafts.status === 200 && guestDrafts.data?.data?.posts.length === 0,
    '访客 draft=true 返回空数组',
  );

  // 重新登录
  cookieJar = '';
  const login = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: TEST_EMAIL.toUpperCase(), password: 'TestPass123!' }),
  });
  assert(login.status === 200, '大小写不同 email 登录成功');

  // 16. 登录后可见草稿
  const drafts = await request('/api/posts?draft=true');
  assert(drafts.data?.data?.posts.length === 1, '登录后 draft=true 返回草稿');

  // 17. 草稿转发布
  const publishDraft = await request(`/api/posts/${draftId}`, {
    method: 'PUT',
    body: JSON.stringify({ isDraft: false }),
  });
  assert(
    publishDraft.data?.data?.post?.isDraft === false && publishDraft.data?.data?.post?.publishedAt,
    '草稿转发布设置 publishedAt',
  );

  // 18. 分类维护：发布后草稿分类应加入 categories
  const cats2 = await request('/api/categories');
  assert(cats2.data?.data?.categories.includes('草稿分类'), '发布后草稿分类加入 categories');

  // 19. 更新站点配置
  const updateConfig = await request('/api/config', {
    method: 'PUT',
    body: JSON.stringify({ blogName: '  ', author: '测试作者' }),
  });
  assert(
    updateConfig.data?.data?.config?.blogName === '我的博客' &&
      updateConfig.data?.data?.config?.author === '测试作者',
    '更新站点配置并回退空值为默认',
  );

  // 20. 更新文章
  const update = await request(`/api/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify({ title: '更新标题', content: '更新后的内容更长了。' }),
  });
  assert(update.data?.data?.post?.title === '更新标题', '更新文章');

  // 21. 删除文章
  const del = await request(`/api/posts/${postId}`, { method: 'DELETE' });
  assert(del.status === 200, '删除文章');
  const afterDel = await request(`/api/posts/${postId}`);
  assert(afterDel.status === 404, '删除后获取文章返回 404');

  console.log('\n=== 全部测试通过 ===');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
