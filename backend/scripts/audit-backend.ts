import path from 'node:path';
import fs from 'node:fs/promises';

const BASE_URL = 'http://localhost:3001';
const DATA_DIR = path.resolve(import.meta.dirname, '../data');
const BLOG_JSON_PATH = path.join(DATA_DIR, 'blog.json');
const BLOG_LOCK_PATH = `${BLOG_JSON_PATH}.lock`;

async function cleanBlogData(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const emptyBlog = JSON.stringify(
    {
      posts: [],
      categories: [],
      siteConfig: { blogName: '我的博客', author: '匿名' },
    },
    null,
    2,
  );
  await fs.writeFile(BLOG_JSON_PATH, emptyBlog, 'utf-8').catch(() => {});
  await fs.unlink(BLOG_LOCK_PATH).catch(() => {});
}

interface ApiResult<T = unknown> {
  status: number;
  data: { code: number; data: T; message?: string } | null;
  cookies: string[];
  raw: string;
}

let cookieJar = '';
let lastUsedEmail = '';

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
    // non-JSON response
  }

  const setCookie = res.headers.getSetCookie?.() || [];
  if (setCookie.length > 0) {
    cookieJar = setCookie.map((c) => c.split(';')[0]).join('; ');
  }

  return { status: res.status, data: data as ApiResult<T>['data'], cookies: setCookie, raw };
}

async function rawRequest(path: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Cookie: cookieJar,
      ...(options.headers || {}),
    },
  });
}

function resetCookies(): void {
  cookieJar = '';
}

interface Issue {
  level: 'error' | 'warning' | 'info';
  module: string;
  test: string;
  expected: string;
  actual: string;
  suggestion?: string;
}

const issues: Issue[] = [];
let passed = 0;
let failed = 0;

function assert(
  condition: boolean,
  message: string,
  issue?: Omit<Issue, 'level' | 'test' | 'actual'> & { actual?: string },
): void {
  if (condition) {
    passed++;
    console.log(`  ✅ ${message}`);
  } else {
    failed++;
    console.log(`  ❌ ${message}`);
    if (issue) {
      issues.push({
        level: issue.level || 'error',
        module: issue.module,
        test: message,
        expected: issue.expected,
        actual: issue.actual || '未记录',
        suggestion: issue.suggestion,
      });
    }
  }
}

function recordIssue(issue: Omit<Issue, 'level'> & { level?: Issue['level'] }): void {
  issues.push({
    level: issue.level || 'warning',
    module: issue.module,
    test: issue.test,
    expected: issue.expected,
    actual: issue.actual,
    suggestion: issue.suggestion,
  });
}

const TEST_ID = Date.now();
const TEST_EMAIL = `audit${TEST_ID}@example.com`;
const TEST_USERNAME = `audituser${TEST_ID}`;

async function runAuthAudit(): Promise<void> {
  console.log('\n🔐 Auth 模块审计');

  // 1. 注册字段校验
  const emptyRegister = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({}),
  });
  assert(emptyRegister.status === 400, '空注册体返回 400', {
    module: 'auth',
    expected: 'HTTP 400',
    suggestion: '检查 Zod 校验是否生效',
  });

  // 2. 非法邮箱
  const invalidEmail = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: 'not-an-email',
      password: 'TestPass123!',
      firstName: 'Test',
      lastName: 'User',
      username: TEST_USERNAME,
    }),
  });
  assert(invalidEmail.status === 400, '非法邮箱返回 400', {
    module: 'auth',
    expected: 'HTTP 400',
    suggestion: 'Zod email schema 需生效',
  });

  // 3. 密码太短
  const shortPassword = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: '123',
      firstName: 'Test',
      lastName: 'User',
      username: TEST_USERNAME,
    }),
  });
  assert(shortPassword.status === 400, '密码太短返回 400', {
    module: 'auth',
    expected: 'HTTP 400',
    suggestion: '密码长度校验需生效',
  });

  // 4. 用户名非法字符
  const badUsername = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: 'TestPass123!',
      firstName: 'Test',
      lastName: 'User',
      username: 'bad-user!',
    }),
  });
  assert(badUsername.status === 400, '非法用户名返回 400', {
    module: 'auth',
    expected: 'HTTP 400',
    suggestion: '用户名正则校验需生效',
  });

  // 5. 正常注册
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
  assert(register.status === 201, '正常注册返回 201', {
    module: 'auth',
    expected: 'HTTP 201',
    actual: String(register.status),
  });
  assert(
    register.cookies.some((c) => c.includes('auth_token')),
    '注册设置 auth_token cookie',
    {
      module: 'auth',
      expected: 'Set-Cookie 包含 auth_token',
      actual: JSON.stringify(register.cookies),
    },
  );
  assert(
    register.cookies.some((c) => c.includes('auth_status')),
    '注册设置 auth_status cookie',
    {
      module: 'auth',
      expected: 'Set-Cookie 包含 auth_status',
      actual: JSON.stringify(register.cookies),
    },
  );

  // 6. email 归一化重复注册
  const dupEmail = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: TEST_EMAIL.toUpperCase(),
      password: 'TestPass123!',
      firstName: 'Test',
      lastName: 'User',
      username: `${TEST_USERNAME}2`,
    }),
  });
  assert(dupEmail.status === 409, '大小写不同重复邮箱返回 409', {
    module: 'auth',
    expected: 'HTTP 409',
    actual: String(dupEmail.status),
  });

  // 7. 用户名重复
  const dupUsername = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: `other${TEST_ID}@example.com`,
      password: 'TestPass123!',
      firstName: 'Test',
      lastName: 'User',
      username: TEST_USERNAME,
    }),
  });
  assert(dupUsername.status === 409, '重复用户名返回 409', {
    module: 'auth',
    expected: 'HTTP 409',
    actual: String(dupUsername.status),
  });

  // 8. me 接口
  const me = await request('/api/auth/me');
  assert(me.status === 200, 'GET /api/auth/me 返回 200', {
    module: 'auth',
    expected: 'HTTP 200',
    actual: String(me.status),
  });
  assert(
    !('password' in (me.data?.data?.user ?? {})) &&
      !('tokenVersion' in (me.data?.data?.user ?? {})),
    '/me 响应剥离 password 和 tokenVersion',
    {
      module: 'auth',
      expected: '响应不含 password/tokenVersion',
      actual: JSON.stringify(me.data?.data?.user),
    },
  );
  assert(
    me.data?.data?.user?.email === TEST_EMAIL.toLowerCase(),
    '/me 返回的 email 已归一化为小写',
    {
      module: 'auth',
      expected: TEST_EMAIL.toLowerCase(),
      actual: me.data?.data?.user?.email,
    },
  );

  // 9. 未登录访问 me
  resetCookies();
  const meGuest = await request('/api/auth/me');
  assert(meGuest.status === 401, '未登录 /me 返回 401', {
    module: 'auth',
    expected: 'HTTP 401',
    actual: String(meGuest.status),
  });

  // 10. 错误密码登录
  const badLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: TEST_EMAIL, password: 'WrongPass123!' }),
  });
  assert(badLogin.status === 401, '错误密码登录返回 401', {
    module: 'auth',
    expected: 'HTTP 401',
    actual: String(badLogin.status),
  });

  // 11. 大小写不同登录
  const login = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: TEST_EMAIL.toUpperCase(), password: 'TestPass123!' }),
  });
  assert(login.status === 200, '大小写不同 email 登录成功', {
    module: 'auth',
    expected: 'HTTP 200',
    actual: String(login.status),
  });

  // 12. 改密需要 currentPassword
  const changeNoCurrent = await request('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ newPassword: 'NewPass123!' }),
  });
  assert(changeNoCurrent.status === 400, '改密缺少 currentPassword 返回 400', {
    module: 'auth',
    expected: 'HTTP 400',
    actual: String(changeNoCurrent.status),
  });

  // 13. 改密成功并清除 cookie
  const tokenBeforeChange = cookieJar;
  const changePwd = await request('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword: 'TestPass123!', newPassword: 'NewPass123!' }),
  });
  assert(changePwd.status === 200, '改密成功返回 200', {
    module: 'auth',
    expected: 'HTTP 200',
    actual: String(changePwd.status),
  });
  assert(
    changePwd.cookies.some(
      (c) =>
        c.includes('auth_token') &&
        (c.includes('Max-Age=0') || c.includes('Expires=Thu, 01 Jan 1970')),
    ),
    '改密后清除 auth_token cookie',
    {
      module: 'auth',
      expected: 'Set-Cookie 清除 auth_token',
      actual: JSON.stringify(changePwd.cookies),
    },
  );

  // 14. 旧密码失效
  const oldPwdLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: TEST_EMAIL, password: 'TestPass123!' }),
  });
  assert(oldPwdLogin.status === 401, '改密后旧密码登录返回 401', {
    module: 'auth',
    expected: 'HTTP 401',
    actual: String(oldPwdLogin.status),
  });

  // 15. 新密码登录
  const newPwdLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: TEST_EMAIL, password: 'NewPass123!' }),
  });
  assert(newPwdLogin.status === 200, '新密码登录成功', {
    module: 'auth',
    expected: 'HTTP 200',
    actual: String(newPwdLogin.status),
  });

  // 16. 改密后旧 token 应失效
  resetCookies();
  cookieJar = tokenBeforeChange;
  const meAfterChange = await request('/api/auth/me');
  assert(meAfterChange.status === 401, '改密后旧 token 访问 /me 返回 401', {
    module: 'auth',
    expected: 'HTTP 401（tokenVersion 不匹配）',
    actual: String(meAfterChange.status),
  });

  // 17. 登出
  resetCookies();
  const relogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: TEST_EMAIL, password: 'NewPass123!' }),
  });
  assert(relogin.status === 200, '重新登录成功', {
    module: 'auth',
    expected: 'HTTP 200',
    actual: String(relogin.status),
  });

  const logout = await request('/api/auth/logout', { method: 'POST' });
  assert(logout.status === 200, '登出成功', {
    module: 'auth',
    expected: 'HTTP 200',
    actual: String(logout.status),
  });
  const meAfterLogout = await request('/api/auth/me');
  assert(meAfterLogout.status === 401, '登出后 /me 返回 401', {
    module: 'auth',
    expected: 'HTTP 401',
    actual: String(meAfterLogout.status),
  });

  // 重新登录供后续测试使用
  resetCookies();
  const finalLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: TEST_EMAIL, password: 'NewPass123!' }),
  });
  assert(finalLogin.status === 200, '审计账号最终登录成功', {
    module: 'auth',
    expected: 'HTTP 200',
    actual: String(finalLogin.status),
  });
  lastUsedEmail = TEST_EMAIL;
}

async function runBlogAudit(): Promise<void> {
  console.log('\n📝 Blog 模块审计');

  // 清理旧 blog 数据，确保 blog 审计从空状态开始；保留 auth 阶段创建的用户与 cookie
  await cleanBlogData();

  // 1. 默认值
  const config = await request('/api/config');
  assert(
    config.status === 200 &&
      config.data?.data?.config?.blogName === '我的博客' &&
      config.data?.data?.config?.author === '匿名',
    '无数据时 /config 返回默认值',
    {
      module: 'blog',
      expected: 'blogName=我的博客, author=匿名',
      actual: JSON.stringify(config.data?.data?.config),
    },
  );

  const posts = await request('/api/posts');
  assert(
    posts.status === 200 && posts.data?.data?.posts.length === 0,
    '无数据时 /posts 返回空数组',
    {
      module: 'blog',
      expected: 'HTTP 200, posts=[]',
      actual: JSON.stringify(posts.data?.data),
    },
  );

  // 2. 未登录写操作
  resetCookies();
  const unauthorized = await request('/api/posts', {
    method: 'POST',
    body: JSON.stringify({ title: 'test', content: 'content', category: 'cat', isDraft: false }),
  });
  assert(unauthorized.status === 401, '未登录创建文章返回 401', {
    module: 'blog',
    expected: 'HTTP 401',
    actual: String(unauthorized.status),
  });

  // 登录
  const login = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: lastUsedEmail, password: 'NewPass123!' }),
  });
  assert(login.status === 200, '审计账号登录成功（blog 测试）', {
    module: 'blog',
    expected: 'HTTP 200',
    actual: String(login.status),
  });

  // 3. 创建已发布文章
  const create = await request('/api/posts', {
    method: 'POST',
    body: JSON.stringify({
      title: '  我的第一篇博客  ',
      content: '# 标题\n\n这是正文。',
      category: '  前端  ',
      tags: ['React', 'Next.js', 'React'],
      isDraft: false,
      pinned: true,
    }),
  });
  assert(create.status === 201, '创建已发布文章返回 201', {
    module: 'blog',
    expected: 'HTTP 201',
    actual: String(create.status),
  });
  const post = create.data?.data?.post as Record<string, unknown> | undefined;
  assert(post?.isDraft === false, '已发布文章 isDraft=false', {
    module: 'blog',
    expected: 'false',
    actual: String(post?.isDraft),
  });
  assert(post?.pinned === true, '已发布文章 pinned=true', {
    module: 'blog',
    expected: 'true',
    actual: String(post?.pinned),
  });
  assert(
    typeof post?.publishedAt === 'string' && (post?.publishedAt as string).length > 0,
    '已发布文章有 publishedAt',
    {
      module: 'blog',
      expected: 'publishedAt 为非空字符串',
      actual: String(post?.publishedAt),
    },
  );
  assert(post?.title === '我的第一篇博客', '标题已 trim', {
    module: 'blog',
    expected: '我的第一篇博客',
    actual: String(post?.title),
  });
  assert(post?.category === '前端', '分类已 trim', {
    module: 'blog',
    expected: '前端',
    actual: String(post?.category),
  });
  const postId = post?.id as string;

  // 4. 列表排序
  const list = await request('/api/posts');
  assert(
    list.status === 200 &&
      list.data?.data?.posts.length === 1 &&
      list.data?.data?.posts[0].pinned === true,
    'GET /posts 包含发布文章并按置顶排序',
    {
      module: 'blog',
      expected: '1 条, pinned=true',
      actual: JSON.stringify(list.data?.data?.posts),
    },
  );

  // 5. 分类/标签维护
  const cats = await request('/api/categories');
  assert(cats.data?.data?.categories.includes('前端'), '已发布文章分类自动维护', {
    module: 'blog',
    expected: 'categories 包含 前端',
    actual: JSON.stringify(cats.data?.data?.categories),
  });
  const tags = await request('/api/tags');
  assert(
    tags.data?.data?.tags.includes('React') && tags.data?.data?.tags.includes('Next.js'),
    '标签动态聚合且去重',
    {
      module: 'blog',
      expected: 'tags 包含 React 和 Next.js',
      actual: JSON.stringify(tags.data?.data?.tags),
    },
  );

  // 6. 搜索
  const search = await request('/api/posts?q=正文');
  assert(search.data?.data?.posts.length === 1, '搜索命中', {
    module: 'blog',
    expected: '1 条',
    actual: String(search.data?.data?.posts.length),
  });

  // 7. 单篇文章
  const single = await request(`/api/posts/${postId}`);
  assert(
    single.status === 200 && single.data?.data?.post?.id === postId,
    'GET /posts/:id 返回文章',
    {
      module: 'blog',
      expected: 'HTTP 200 且 id 匹配',
      actual: String(single.status),
    },
  );

  // 8. 摘要
  const summary = single.data?.data?.post?.summary as string;
  assert(
    summary && !summary.includes('#') && !summary.includes('**') && !summary.includes('['),
    '摘要移除 Markdown 语法',
    {
      module: 'blog',
      expected: 'summary 不含 Markdown 标记',
      actual: summary,
    },
  );

  // 9. 创建草稿
  const draftRes = await request('/api/posts', {
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
    draftRes.status === 201 &&
      draftRes.data?.data?.post?.isDraft === true &&
      draftRes.data?.data?.post?.pinned === false,
    '创建草稿并强制 pinned=false',
    {
      module: 'blog',
      expected: 'isDraft=true, pinned=false',
      actual: JSON.stringify(draftRes.data?.data?.post),
    },
  );
  const draftId = draftRes.data?.data?.post?.id as string;

  // 10. 草稿分类不参与维护
  const catsAfterDraft = await request('/api/categories');
  assert(!catsAfterDraft.data?.data?.categories.includes('草稿分类'), '草稿分类未加入 categories', {
    module: 'blog',
    expected: 'categories 不含 草稿分类',
    actual: JSON.stringify(catsAfterDraft.data?.data?.categories),
  });

  // 11. 访客访问草稿
  resetCookies();
  const guestDraft = await request(`/api/posts/${draftId}`);
  assert(guestDraft.status === 404, '访客访问草稿详情返回 404', {
    module: 'blog',
    expected: 'HTTP 404',
    actual: String(guestDraft.status),
  });

  // 12. 访客草稿列表
  const guestDrafts = await request('/api/posts?draft=true');
  assert(
    guestDrafts.status === 200 && guestDrafts.data?.data?.posts.length === 0,
    '访客 draft=true 返回空数组',
    {
      module: 'blog',
      expected: 'HTTP 200, posts=[]',
      actual: JSON.stringify(guestDrafts.data?.data),
    },
  );

  // 13. 登录后可见草稿
  const relogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: lastUsedEmail, password: 'NewPass123!' }),
  });
  assert(relogin.status === 200, '重新登录成功', {
    module: 'blog',
    expected: 'HTTP 200',
    actual: String(relogin.status),
  });

  const drafts = await request('/api/posts?draft=true');
  assert(drafts.data?.data?.posts.length === 1, '登录后 draft=true 返回草稿', {
    module: 'blog',
    expected: '1 条草稿',
    actual: String(drafts.data?.data?.posts.length),
  });

  // 14. 草稿转发布
  const publishDraft = await request(`/api/posts/${draftId}`, {
    method: 'PUT',
    body: JSON.stringify({ isDraft: false }),
  });
  assert(
    publishDraft.data?.data?.post?.isDraft === false &&
      typeof publishDraft.data?.data?.post?.publishedAt === 'string',
    '草稿转发布设置 publishedAt',
    {
      module: 'blog',
      expected: 'isDraft=false, publishedAt 存在',
      actual: JSON.stringify(publishDraft.data?.data?.post),
    },
  );

  // 15. 发布后草稿分类应加入 categories
  const catsAfterPublish = await request('/api/categories');
  assert(
    catsAfterPublish.data?.data?.categories.includes('草稿分类'),
    '发布后草稿分类加入 categories',
    {
      module: 'blog',
      expected: 'categories 包含 草稿分类',
      actual: JSON.stringify(catsAfterPublish.data?.data?.categories),
    },
  );

  // 16. 更新站点配置
  const updateConfig = await request('/api/config', {
    method: 'PUT',
    body: JSON.stringify({ blogName: '  ', author: '测试作者' }),
  });
  assert(
    updateConfig.data?.data?.config?.blogName === '我的博客' &&
      updateConfig.data?.data?.config?.author === '测试作者',
    '更新站点配置并回退空值为默认',
    {
      module: 'blog',
      expected: 'blogName=我的博客, author=测试作者',
      actual: JSON.stringify(updateConfig.data?.data?.config),
    },
  );

  // 17. 更新文章
  const update = await request(`/api/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify({ title: '更新标题', content: '更新后的内容更长了。' }),
  });
  assert(update.data?.data?.post?.title === '更新标题', '更新文章标题', {
    module: 'blog',
    expected: '更新标题',
    actual: String(update.data?.data?.post?.title),
  });

  // 18. 发布转草稿
  const toDraft = await request(`/api/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify({ isDraft: true }),
  });
  assert(
    toDraft.data?.data?.post?.isDraft === true &&
      toDraft.data?.data?.post?.publishedAt === undefined,
    '发布转草稿清空 publishedAt',
    {
      module: 'blog',
      expected: 'isDraft=true, publishedAt=undefined',
      actual: JSON.stringify(toDraft.data?.data?.post),
    },
  );

  // 19. 转草稿后分类清理
  const catsAfterToDraft = await request('/api/categories');
  assert(!catsAfterToDraft.data?.data?.categories.includes('前端'), '发布转草稿后原分类被清理', {
    module: 'blog',
    expected: 'categories 不含 前端',
    actual: JSON.stringify(catsAfterToDraft.data?.data?.categories),
  });

  // 20. 删除文章
  const del = await request(`/api/posts/${postId}`, { method: 'DELETE' });
  assert(del.status === 200, '删除文章返回 200', {
    module: 'blog',
    expected: 'HTTP 200',
    actual: String(del.status),
  });
  const afterDel = await request(`/api/posts/${postId}`);
  assert(afterDel.status === 404, '删除后获取文章返回 404', {
    module: 'blog',
    expected: 'HTTP 404',
    actual: String(afterDel.status),
  });
}

async function runEdgeCaseAudit(): Promise<void> {
  console.log('\n🔍 边界与异常审计');

  // 登录
  resetCookies();
  const login = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: lastUsedEmail, password: 'NewPass123!' }),
  });
  assert(login.status === 200, '边界测试登录成功', {
    module: 'edge',
    expected: 'HTTP 200',
    actual: String(login.status),
  });

  // 空标题
  const emptyTitle = await request('/api/posts', {
    method: 'POST',
    body: JSON.stringify({ title: '   ', content: 'content', category: 'cat', isDraft: false }),
  });
  assert(emptyTitle.status === 400 || emptyTitle.status === 422, '空标题返回 400/422', {
    module: 'edge',
    expected: 'HTTP 400 或 422',
    actual: String(emptyTitle.status),
  });

  // 空分类
  const emptyCategory = await request('/api/posts', {
    method: 'POST',
    body: JSON.stringify({ title: 'title', content: 'content', category: '   ', isDraft: false }),
  });
  assert(emptyCategory.status === 400 || emptyCategory.status === 422, '空分类返回 400/422', {
    module: 'edge',
    expected: 'HTTP 400 或 422',
    actual: String(emptyCategory.status),
  });

  // 非法 coverImage
  const badCover = await request('/api/posts', {
    method: 'POST',
    body: JSON.stringify({
      title: 'title',
      content: 'content',
      category: 'cat',
      isDraft: false,
      coverImage: 'ftp://example.com/image.png',
    }),
  });
  assert(badCover.status === 400 || badCover.status === 422, '非法 coverImage 返回 400/422', {
    module: 'edge',
    expected: 'HTTP 400 或 422',
    actual: String(badCover.status),
  });

  // 不存在文章
  const notFound = await request('/api/posts/non-existent-id');
  assert(notFound.status === 404, '不存在文章返回 404', {
    module: 'edge',
    expected: 'HTTP 404',
    actual: String(notFound.status),
  });

  // 更新不存在文章
  const updateNotFound = await request('/api/posts/non-existent-id', {
    method: 'PUT',
    body: JSON.stringify({ title: 'new' }),
  });
  assert(updateNotFound.status === 404, '更新不存在文章返回 404', {
    module: 'edge',
    expected: 'HTTP 404',
    actual: String(updateNotFound.status),
  });
}

async function runCodeReview(): Promise<void> {
  console.log('\n📋 代码实现 vs 设计文档审查');

  // 检查 blog.repository.ts 是否复用通用对象存储
  const repoContent = await fs.readFile(
    path.resolve(import.meta.dirname, '../src/modules/blog/repository/blog.repository.ts'),
    'utf8',
  );
  const storeContent = await fs.readFile(
    path.resolve(import.meta.dirname, '../src/infrastructure/JsonDocumentStore.ts'),
    'utf8',
  );
  assert(repoContent.includes('JsonDocumentStore'), 'BlogJsonRepository 复用 JsonDocumentStore', {
    module: 'code-review',
    expected: '使用 JsonDocumentStore',
    actual: '未检测到',
    suggestion: '将缓存/锁逻辑下沉到通用 store',
  });
  assert(
    storeContent.includes('cacheMtimeMs') && storeContent.includes('fs.stat'),
    'JsonDocumentStore 实现 mtime 缓存失效',
    {
      module: 'code-review',
      expected: '包含 cacheMtimeMs 与 fs.stat',
      actual: '未检测到',
      suggestion: '添加基于文件修改时间的缓存失效',
    },
  );
  assert(
    storeContent.includes('proper-lockfile') && storeContent.includes('tempPath'),
    'JsonDocumentStore 使用文件锁 + 临时文件写入',
    {
      module: 'code-review',
      expected: '使用 proper-lockfile 与 tempPath',
      actual: '未检测到',
    },
  );

  // 检查 optionalAuthGuard
  const guardContent = await fs.readFile(
    path.resolve(import.meta.dirname, '../src/modules/auth/services/auth.guard.ts'),
    'utf8',
  );
  assert(
    guardContent.includes('createOptionalAuthGuard'),
    'auth.guard 提供 createOptionalAuthGuard',
    {
      module: 'code-review',
      expected: '存在 createOptionalAuthGuard',
      actual: '未检测到',
      suggestion: '为公开读接口提供可选认证',
    },
  );

  // 检查 blog.routes 使用 optionalAuthGuard
  const routesContent = await fs.readFile(
    path.resolve(import.meta.dirname, '../src/modules/blog/routes/blog.routes.ts'),
    'utf8',
  );
  assert(
    routesContent.includes('optionalAuthGuard') &&
      routesContent.match(/router\.get\(\s*'\/posts'/g)?.length === 1,
    'blog.routes 对 GET /posts 使用 optionalAuthGuard',
    {
      module: 'code-review',
      expected: 'GET /posts 应用 optionalAuthGuard',
      actual: '未检测到',
    },
  );

  // 检查摘要服务
  const summaryContent = await fs.readFile(
    path.resolve(import.meta.dirname, '../src/modules/blog/services/summary.service.ts'),
    'utf8',
  );
  assert(
    summaryContent.includes('removeMarkdown') || summaryContent.includes('replace'),
    'summary.service 实现 Markdown 清理',
    {
      module: 'code-review',
      expected: '包含 Markdown 清理逻辑',
      actual: '未检测到',
    },
  );

  // 检查错误类
  const errorsContent = await fs.readFile(
    path.resolve(import.meta.dirname, '../src/errors/AppError.ts'),
    'utf8',
  );
  assert(
    errorsContent.includes('PayloadTooLargeError') &&
      errorsContent.includes('UnprocessableEntityError') &&
      errorsContent.includes('ServiceUnavailableError'),
    'AppError 包含 413/422/503 子类',
    {
      module: 'code-review',
      expected: '包含 PayloadTooLargeError、UnprocessableEntityError、ServiceUnavailableError',
      actual: '未全部检测到',
    },
  );

  // 检查 package.json 依赖
  const pkg = JSON.parse(
    await fs.readFile(path.resolve(import.meta.dirname, '../package.json'), 'utf8'),
  ) as { dependencies: Record<string, string>; devDependencies: Record<string, string> };
  assert(pkg.dependencies['proper-lockfile'], 'package.json 包含 proper-lockfile', {
    module: 'code-review',
    expected: 'proper-lockfile 在 dependencies 中',
    actual: JSON.stringify(pkg.dependencies),
  });
  assert(pkg.devDependencies['@types/proper-lockfile'], 'package.json 包含类型声明', {
    module: 'code-review',
    expected: '@types/proper-lockfile 在 devDependencies 中',
    actual: JSON.stringify(pkg.devDependencies),
  });
}

async function main(): Promise<void> {
  console.log('=== 后端全链路审计开始 ===');
  console.log(`测试账号: ${TEST_EMAIL}`);

  await cleanBlogData();

  try {
    await runAuthAudit();
    await runBlogAudit();
    await runEdgeCaseAudit();
    await runCodeReview();
  } catch (err) {
    console.error('审计过程异常:', err);
  }

  console.log('\n=== 审计结果 ===');
  console.log(`通过: ${passed}`);
  console.log(`失败: ${failed}`);

  if (issues.length > 0) {
    console.log('\n📌 问题清单:');
    for (const issue of issues) {
      const icon = issue.level === 'error' ? '🔴' : issue.level === 'warning' ? '🟡' : '🟢';
      console.log(`\n${icon} [${issue.module}] ${issue.test}`);
      console.log(`   预期: ${issue.expected}`);
      console.log(`   实际: ${issue.actual}`);
      if (issue.suggestion) {
        console.log(`   建议: ${issue.suggestion}`);
      }
    }
  } else {
    console.log('\n🎉 未发现明显问题');
  }

  process.exit(failed > 0 ? 1 : 0);
}

main();
