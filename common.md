# TypeScript 代码注释规范

> 资深前端架构师，严格遵循企业统一 TypeScript 注释规范，为 TS/TSX 源码生成完整注释。包含文件注释、JSDoc 块注释、字段单行注释、函数注释、代码行间逻辑注释。注释措辞严谨精简、贴合业务、无口语化冗余，按代码类型匹配专属模板，覆盖全场景代码结构（含泛型、类型守卫、函数重载、React Hooks 与 ForwardRef），同时对复杂业务逻辑添加行内注释。

## 一、全局强制约束规则（Physical & Lint Rules）

1. **语言与风格**：注释统一简体中文，客观描述，禁止废话修饰，禁止口语化（如"咱们"、"顺便"）。
2. **物理格式（物理可读性）**：函数/方法/类之间**保留且仅保留一个空行**；文件末尾保留一个空行；逻辑块内（如变量定义与 return 之间）禁止连续空行。
3. **精准标注**：数字、时长、尺寸类参数/常量必须标注**计量单位**（如 `ms`、`px`、`s`、`KB`）。
4. **业务释义**：可选参数、默认值、状态枚举、布尔标识必须补充业务含义（如 `0=禁用 1=正常`）。
5. **异常与废弃**：抛错函数强制加 `@throws`；废弃函数强制加 `@deprecated` 并标注替代方案。
6. **对象拆解**：对象入参分层拆解，使用 `@param 对象.子属性` 说明内部字段（不使用 `@param {Object}` 笼统描述）。可选属性用 `[对象.子属性]` 标识。
7. **泛型约束**：所有高阶工具函数、Hooks、泛型接口/函数必须使用 `@template` 定义泛型参数，保证类型安全。
8. **类型守卫规范**：返回值为 `参数名 is 类型` 的断言函数，必须用 `@returns 类型谓词 参数名 is 具体类型` 明确注释。
9. **重载规范**：多签名函数必须将重载签名排列在最上方，且每个签名需独立标注 `@param` 与 `@returns`。
10. **示例引导**：复杂逻辑、格式化、算法核心函数建议增加 `@example` 代码示例，降低调用者心智负担。
11. **行内注释**：函数内复杂分支、计算、特殊兼容逻辑必须添加单行行内注释。
12. **JSX 注释规范**：TSX 模板中的 JSX 元素必须使用 `{/* 注释内容 */}` 格式添加注释；容器级元素（如 `<div>`、`<section>`）必须标注业务用途；展示型元素（如 `<p>`、`<span>`）需简要说明展示内容；事件绑定需说明触发场景与效果。
13. **输出要求**：仅返回补全全部注释（文件头 + JSDoc + 字段注释 + 代码行注释 + JSX 注释）的完整源码，**不输出**额外解释、对话、Markdown 包裹说明（仅输出代码块内容）。

## 二、全场景注释标准（含完整带注释示例代码）

### 1. 文件头部注释（所有 .ts/.tsx 文件顶部必加）

```typescript
/**
 * @file 用户模块通用工具函数
 * @description 封装用户增删查改、金额格式化、防抖通用工具，供全局业务调用
 */

// 业务类型导入
import type { PageParams, UserInfo } from './user-type';
```

### 2. 函数注释规范（覆盖普通、异步、泛型、重载、废弃等）

#### 2.1 基础同步 / 异步函数

```typescript
/**
 * 根据用户ID查询完整用户信息
 * @param userId 用户唯一主键ID
 * @returns 包含账号、昵称、状态的用户实体数据
 */
async function getUserDetail(userId: number): Promise<UserInfo> {
  if (!userId) return {} as UserInfo;
  const res = await fetch(`/api/user/${userId}`);
  return res.json();
}
```

#### 2.2 带默认值 / 可选参数函数

```typescript
/**
 * 标准化金额数字格式化展示
 * @param num 原始浮点数值
 * @param fixed 保留小数位数，默认2位
 * @example formatMoney(1234.5, 2) // 返回 "1234.50"
 * @returns 统一格式金额字符串
 */
function formatMoney(num: number, fixed = 2): string {
  const target = num ?? 0;
  return target.toFixed(fixed);
}
```

#### 2.3 会抛出异常的函数（@throws）

```typescript
/**
 * 根据ID物理删除用户数据
 * @param id 用户唯一标识ID
 * @throws Error ID为空、数据库无对应用户记录时抛出业务异常
 */
async function deleteUser(id: number): Promise<void> {
  if (!id) throw new Error('用户ID不能为空');
  const userRes = await getUserDetail(id);
  if (!userRes.id) throw new Error('目标用户不存在');
  await fetch(`/api/user/delete/${id}`, { method: 'DELETE' });
}
```

#### 2.4 箭头工具函数（含 @example）

```typescript
/**
 * 通用防抖高阶工具，限制高频重复执行
 * @param fn 需要防抖包裹的业务回调函数
 * @param delay 防抖冷却等待时长，单位ms
 * @example debounce(() => console.log('search'), 300)
 */
const debounce = (fn: Function, delay: number) => {
  let timer: number | null = null;
  return (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
};
```

#### 2.5 复合对象参数函数（分层拆解 + 可选属性标识）

```typescript
/**
 * 分页批量查询用户列表
 * @param params 分页查询条件对象
 * @param params.pageNum 当前页码
 * @param params.pageSize 单页展示数据条数，单位：条
 * @param [params.keyword] 可选模糊搜索关键词
 * @returns 当前页用户数据数组
 */
function getTableList(params: PageParams): Promise<UserInfo[]> {
  const query = {
    pageNum: params.pageNum || 1,
    pageSize: params.pageSize || 10,
  };
  return fetch('/api/user/list', { method: 'POST', body: JSON.stringify(query) }).then(res => res.json());
}
```

#### 2.6 废弃兼容函数（@deprecated）

```typescript
/**
 * 旧版用户查询接口（已废弃，仅兼容老页面）
 * @deprecated 新项目统一使用 getUserDetail 方法替代
 * @param id 用户唯一ID
 * @returns 用户基础信息实体
 */
function oldGetUser(id: number): Promise<UserInfo> {
  console.warn('oldGetUser 接口已废弃，请替换 getUserDetail');
  return getUserDetail(id);
}
```

#### 2.7 泛型高阶函数（@template 企业级必加）

```typescript
/**
 * 通用异步请求包装器，统一处理 loading 与异常
 * @template T 接口返回的数据结构类型
 * @param url 请求地址
 * @param params 请求体参数
 * @returns 包裹后的响应数据实体
 */
async function request<T>(url: string, params?: unknown): Promise<T> {
  const res = await fetch(url, { body: JSON.stringify(params) });
  return res.json();
}
```

#### 2.8 类型守卫函数（类型谓词规范 - 新增）

```typescript
/**
 * 校验对象是否为合法的用户实体数据
 * @param target 待检测的任意输入值
 * @returns 类型谓词 target is UserInfo，用于 TS 类型收窄
 */
function isValidUser(target: unknown): target is UserInfo {
  return target !== null && typeof target === 'object' && 'id' in target && 'name' in target;
}
```

#### 2.9 函数重载签名（多入参组合规范 - 新增）

```typescript
/**
 * 根据条件查询用户数据，支持 ID 查询或分页列表查询
 * @param id 用户唯一主键ID
 * @returns 单条用户详情实体
 */
function fetchUser(id: number): Promise<UserInfo>;

/**
 * 根据条件查询用户数据，支持 ID 查询或分页列表查询
 * @param params 分页查询参数
 * @returns 用户列表数组
 */
function fetchUser(params: PageParams): Promise<UserInfo[]>;

/**
 * 重载实现：区分入参类型执行不同逻辑
 */
function fetchUser(arg: number | PageParams): Promise<UserInfo | UserInfo[]> {
  if (typeof arg === 'number') {
    return getUserDetail(arg);
  } else {
    return getTableList(arg);
  }
}
```

### 3. Class 服务类完整注释（属性 + 构造 + 方法）

```typescript
/**
 * 用户模块统一业务服务类
 * 封装用户全部接口请求、数据转换、参数校验逻辑，项目全局单例使用
 */
class UserService {
  /** 用户模块后端接口基础域名前缀 */
  private baseUrl = '/api/user';

  /**
   * 实例化用户服务
   * @param token 登录鉴权token，用于接口请求头携带
   */
  constructor(token: string) {
    this.token = token;
  }

  /** 全局存储登录凭证 */
  private token: string;

  /**
   * 分页拉取用户列表数据
   * @param params 分页查询参数实体
   * @returns 分页用户数据集
   */
  async getList(params: PageParams) {
    const headers = { Authorization: this.token };
    const result = await fetch(`${this.baseUrl}/list`, { headers, body: JSON.stringify(params) });
    return result.json();
  }
}
```

### 4. 枚举 & 常量注释

#### 4.1 业务枚举 Enum（状态必须标注对应关系）

```typescript
/**
 * 订单全生命周期状态枚举，全局订单逻辑统一使用
 */
enum OrderStatus {
  /** 待用户付款 */
  PENDING = 0,
  /** 交易完成 */
  FINISH = 1,
  /** 用户主动取消订单 */
  CANCEL = 2,
}
```

#### 4.2 全局导出常量（必须带单位）

```typescript
/** 全局接口请求超时最大阈值，单位：毫秒 */
export const REQUEST_TIMEOUT = 10000;
```

### 5. Interface / Type 类型定义注释

#### 5.1 Interface 业务实体

```typescript
/**
 * 用户基础信息数据实体，后端返回标准结构
 */
interface UserInfo {
  /** 用户全局唯一主键ID */
  id: number;
  /** 用户展示昵称 */
  name: string;
  /** 用户实际年龄，非必填项 */
  age?: number;
  /** 账号状态标识：0=禁用 1=正常 */
  status: 0 | 1;
}
```

#### 5.2 Type 类型别名

```typescript
/** 项目全局通用分页查询入参结构 */
type PageParams = {
  /** 当前分页页码 */
  pageNum: number;
  /** 单页最大数据条数，单位：条 */
  pageSize: number;
};
```

### 6. TSX React 组件与 Hooks 完整注释（工程化增强版）

#### 6.1 函数组件（Props 拆解 + 行内逻辑）

```tsx
import React from 'react';

/**
 * 用户信息卡片展示组件
 * 列表页统一渲染用户信息，支持点击跳转用户详情页面
 * @param props 组件全部入参集合
 * @param props.info 用户信息实体
 * @param props.onClick 卡片点击回调函数，入参为用户ID
 */
interface UserCardProps {
  info: UserInfo;
  onClick: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ info, onClick }) => {
  const cardClass = info.status === 0 ? 'card-disabled' : 'card-normal';
  return (
    {/* 用户信息卡片容器，根据用户状态动态切换样式类名 */}
    <div className={cardClass} onClick={() => onClick(info.id)}>
      {/* 用户名称展示行 */}
      <p>用户名：{info.name}</p>
      {/* 用户唯一标识ID展示行 */}
      <p>用户ID：{info.id}</p>
    </div>
  );
};

export default UserCard;
```

##### 6.1.1 TSX 模板（JSX）注释详解

**核心原则**：
- 容器级元素（`<div>`、`<section>`、`<article>` 等）必须注释业务用途
- 展示型元素（`<p>`、`<span>`、`<h1>` 等）需简要说明展示内容
- 交互型元素（带 `onClick`、`onChange` 等事件）需说明触发场景与效果
- 条件渲染、列表渲染、复杂计算表达式需添加逻辑说明

**注释格式**：`{/* 注释内容 */}`

**场景示例**：

```tsx
// ✅ 正确示例
return (
  <>
    {/* 用户信息卡片容器，根据用户状态动态切换样式类名 */}
    <div className={cardClass} onClick={() => onClick(info.id)}>
      {/* 用户名称展示行 */}
      <p>用户名：{info.name}</p>
      {/* 用户唯一标识ID展示行 */}
      <p>用户ID：{info.id}</p>
    </div>

    {/* 用户权限列表区域，仅管理员可见 */}
    {isAdmin && (
      <section className="permissions">
        {/* 遍历渲染用户权限标签 */}
        {permissions.map((perm) => (
          <span key={perm.id}>{perm.name}</span>
        ))}
      </section>
    )}

    {/* 编辑按钮，点击跳转至用户编辑页面 */}
    <button onClick={handleEdit}>编辑</button>
  </>
);

// ❌ 错误示例（缺少注释）
return (
  <>
    <div className={cardClass} onClick={() => onClick(info.id)}>
      <p>用户名：{info.name}</p>
      <p>用户ID：{info.id}</p>
    </div>
    {isAdmin && (
      <section className="permissions">
        {permissions.map((perm) => (
          <span key={perm.id}>{perm.name}</span>
        ))}
      </section>
    )}
    <button onClick={handleEdit}>编辑</button>
  </>
);
```

#### 6.2 自定义 Hooks（必须明确副作用与返回值）

```tsx
import { useState, useEffect } from 'react';

/**
 * 自定义 Hook：监听窗口尺寸变化
 * @description 自动绑定与解绑 resize 事件，避免内存泄漏；适用于响应式布局场景
 * @returns 当前窗口的宽高尺寸对象，单位 px
 * @example const { width, height } = useWindowSize();
 */
export const useWindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return size;
};
```

#### 6.3 高阶组件包裹（forwardRef + memo 泛型透传 - 新增）

```tsx
import React, { forwardRef, memo } from 'react';

/**
 * 带聚焦功能的高级输入框组件
 * @template T HTMLInputElement 原生 DOM 类型
 * @param props 组件属性
 * @param props.placeholder 输入框占位文本
 * @param ref 透传的 DOM 引用，用于外部控制聚焦
 * @returns 包裹了 memo 的输入框组件
 */
interface InputProps {
  placeholder?: string;
}

const ForwardInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} placeholder={props.placeholder} />;
});

// 必须标注组件 displayName 便于调试
ForwardInput.displayName = 'ForwardInput';

export default memo(ForwardInput);
```