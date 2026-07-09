/**
 * @file AuthDivider.tsx
 * @description 鉴权页面分隔线组件，用于在社交登录与邮箱密码登录之间展示 "Or continue with" 分隔文案
 */

/**
 * 鉴权页面分隔线组件（纯展示）
 * 渲染一条带中间文字 "Or continue with" 的横向分割线，常用于登录/注册页中两种登录方式之间
 * @returns 渲染完成的分隔线 JSX
 */
type AuthDividerProps = {
  text?: string;
};
const AuthDivider: React.FC<AuthDividerProps> = ({ text }) => {
  return (
    <>
      {/* 分隔线容器，使用相对定位承载横线与中间文字 */}
      <div className="relative my-6">
        {/* 横线绝对定位层，撑满父容器宽度 */}
        <div className="absolute inset-0 flex items-center">
          {/* 顶部 1px 边框线，分隔上下区域 */}
          <div className="border-border w-full border-t"></div>
        </div>
        {/* 中间文字层，背景色覆盖横线实现"中断"效果 */}
        <div className="relative flex justify-center text-sm">
          {/* 分隔提示文案：或继续使用 */}
          <span className="bg-background text-text-secondary px-2">{text || "Sign In"}</span>
        </div>
      </div>
    </>
  );
};

export default AuthDivider;
