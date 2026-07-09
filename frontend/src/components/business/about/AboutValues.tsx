/**
 * @file AboutValues.tsx
 * @description 关于页核心价值观展示组件，以卡片网格形式展示平台秉持的核心理念
 */
import { FC } from "react";
import { ABOUT_VALUES } from "@/constans";

/**
 * 关于页价值观组件的 Props（当前未传任何参数，预留扩展位）
 */
interface AboutValuesProps {}

/**
 * 关于页价值观展示组件
 * 遍历 ABOUT_VALUES 常量数组，每条数据包含图标、标题和描述，渲染为带边框的卡片
 * @param [props] 当前未使用，保留以便后续扩展
 * @returns 渲染完成的价值观区 JSX
 */
const AboutValues: FC<AboutValuesProps> = (_props) => {
  return (
    <>{/* 关于页价值观展示区容器 */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 区域标题区，居中展示主副标题 */}
          <div className="mb-16 text-center">
            <h2 className="text-text-primary mb-4 text-3xl font-bold sm:text-4xl">Our Values</h2>
            <p className="text-text-secondary mx-auto max-w-2xl">The principles that guide everything we do</p>
          </div>
          {/* 价值观卡片网格容器，移动端 1 列，平板 2 列，桌面 4 列 */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* 遍历渲染价值观卡片 */}
            {ABOUT_VALUES.map((value) => {
              // 从 value 中取出图标组件以便在 JSX 中渲染
              const Icon = value.icon;
              return (
                <div key={value.title} className="border-border bg-surface rounded-xl border p-6 text-center">
                  {/* 价值图标容器，浅色背景高亮 */}
                  <div className="bg-accent/10 text-accent mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                    <Icon className="h-6 w-6" />
                  </div>
                  {/* 价值标题展示 */}
                  <h3 className="text-text-primary mb-2 font-semibold">{value.title}</h3>
                  {/* 价值描述文案 */}
                  <p className="text-text-secondary text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutValues;
