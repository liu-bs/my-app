/**
 * @file layout.tsx
 * @description 认证路由组（登录/注册）共享布局，提供氛围光晕与主区域容器
 */

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 顶部氛围光晕 */}
      <div className="auth-halo" aria-hidden="true" />
      {/* 主区域 */}
      <main className="auth-main">{children}</main>
    </>
  );
}
