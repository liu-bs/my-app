/**
 * @file AuthorCoverImage.tsx
 * @description 作者主页顶部封面图组件，展示作者自定义封面并叠加底部渐变以衔接下方内容
 */
import { FC } from "react";
import { UserInfo } from "@/typeing";

interface AuthorCoverImageProps {
  /** 作者完整信息（用于读取 coverImage 字段） */
  author: UserInfo;
}

/**
 * 作者封面图组件
 * @param props 组件入参
 * @param props.author 作者信息（包含 coverImage 封面图地址）
 * @returns 渲染作者主页顶部封面横幅
 */
const AuthorCoverImage: FC<AuthorCoverImageProps> = ({ author }) => {
  return (
    <div className="relative h-48 w-full sm:h-64"> {/* 封面图容器：移动端高度 192px（h-48），桌面端高度 256px（h-64），全宽 */}
      {/* 作者封面图：object-cover 填充整个容器 */}
      <img src={author.coverImage} alt="Cover" className="h-full w-full object-cover" />
      {/* 底部线性渐变蒙版：用于与下方内容自然过渡 */}
      <div className="from-background absolute inset-0 bg-linear-to-t to-transparent" />
    </div>
  );
};

export default AuthorCoverImage;
