/**
 * @file AuthLogo.tsx
 * @description 鉴权页面 Logo 组件，渲染品牌图标 + 名称 "Personal Blog"，点击后跳转回首页
 */
import Link from "next/link";

/**
 * 鉴权页面 Logo 组件（纯展示）
 * 渲染居中的品牌 Logo（图标方块 + 品牌名 "Personal Blog"），点击后通过 Next.js Link 跳转至首页
 * @returns 渲染完成的 Logo JSX
 */
const AuthLogo: React.FC = () => {
  return (
    <>
      {/* Logo 容器，居中显示 */}
      <div className="mb-8 text-center">
        {/* 品牌链接：点击跳转首页 */}
        <Link href="/" className="inline-flex items-center gap-2">
          {/* 品牌图标方块容器 */}
          <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-xl text-white">
            {/* 羽毛笔图标，象征博客创作 */}
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
          {/* 品牌名称展示 */}
          <span className="text-text-primary text-xl font-bold">Personal Blog</span>
        </Link>
      </div>
    </>
  );
};

export default AuthLogo;
