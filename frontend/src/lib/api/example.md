<!-- API 模块使用示例 -->

# API 模块使用示例

## 架构总览

```
@/lib/api/
├── request.ts    # 核心同构请求函数（request）+ HTTP 快捷方法（http）+ ApiRequestError
├── index.ts      # 统一导出
└── example.md    # 本文件
```

两种场景：

1. **服务端组件** → `request` + `config.token`（从 cookies() 读取）
2. **客户端** → `http` 快捷方法（自动带 Cookie，401 自动跳登录页）

---

## 1. 服务端组件 — RSC 首屏数据

服务端需显式传入 token，支持 Next.js fetch 扩展（cache/next）。

```tsx
// app/(dashboard)/user/page.tsx（无 "use client"）
import { cookies } from "next/headers";
import { request } from "@/lib/api";

export default async function UserPage() {
  const token = (await cookies()).get("token")?.value;
  const res = await request<UserItem[]>("/user/list", {
    token,
    params: { page: 1 },
    next: { revalidate: 60, tags: ["user"] },
  });

  return <UserTable data={res.data} />;
}
```

---

## 2. 客户端 — http 快捷方法

`http` 直接返回业务数据（无需 `.data`），自动带 Cookie，401 自动跳登录页。

```tsx
"use client";
import { http } from "@/lib/api";

// 读取当前用户（skipAuthRedirect 避免未登录时跳走）
const user = await http.get<AuthResponse>("/auth/me", { skipAuthRedirect: true });

// 登录
await http.post("/auth/login", { username, password });

// 删除
await http.del(`/posts/${postId}`);
```

---

## 3. Server Action — 增删改

```tsx
// app/actions/user.action.ts
"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { request } from "@/lib/api";

export async function createUser(data: { name: string }) {
  const token = (await cookies()).get("token")?.value;
  await request("/user/create", { token, method: "POST", body: data });
  revalidateTag("user");
}
```

---

## 4. 错误处理

非 2xx 响应抛出 `ApiRequestError`，可按 `statusCode` 区分处理：

```tsx
import { ApiRequestError } from "@/lib/api";

try {
  await http.post("/user/create", { name: "test" });
} catch (err) {
  if (err instanceof ApiRequestError) {
    if (err.statusCode === 409) {
      // 名称重复
    }
    console.error(err.message, err.error);
  }
}
```
