/**
 * @file MobileNavBar.tsx
 * @description 移动端底部 Tab 导航栏（与 Navbar.tsx 中的顶部弹出式菜单不同）。
 */
import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_BAR_ITEMS } from "@/constans";

/** MobileNavBar 组件 props（当前无入参，预留扩展） */
interface MobileNavBarProps {}

/** 导航项定义，来源于 @/constans 中的 NAV_BAR_ITEMS */
type NavItem = (typeof NAV_BAR_ITEMS)[number];

/**
 * 判断当前路径是否匹配导航项。
 * @param pathname 当前路由路径。
 * @param item 导航项。
 * @returns boolean 是否处于该导航项的激活态（精确匹配或子路径匹配）。
 */
function isItemActive(pathname: string, item: NavItem): boolean {
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/**
 * 移动端底部 Tab 导航栏组件。
 * @returns JSX.Element 移动端底部水平滚动导航。
 */
const MobileNavBar: FC<MobileNavBarProps> = () => {
  const pathname = usePathname();

  return (
    // 移动端底部 Tab 容器
    <nav className="border-border flex items-center justify-around overflow-x-auto border-t px-2 py-2 md:hidden">
      {NAV_BAR_ITEMS.map((item) => {
        const Icon = item.icon;
        // 计算当前项是否激活态
        const isActive = isItemActive(pathname, item);
        return (
          // 底部单个 Tab 链接，激活态切换样式
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-w-15 flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              isActive ? "bg-bg-secondary text-text-primary" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
            } `}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNavBar;
