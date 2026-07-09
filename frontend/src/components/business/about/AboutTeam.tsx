/**
 * @file AboutTeam.tsx
 * @description 关于页团队成员展示组件，以网格形式展示团队成员头像、姓名、职位和简介
 */
import { FC } from "react";
import { ABOUT_TEAM } from "@/constans";

/**
 * 关于页团队组件的 Props（当前未传任何参数，预留扩展位）
 */
interface AboutTeamProps {}

/**
 * 关于页团队展示组件
 * 遍历 ABOUT_TEAM 常量数组，渲染每位成员的头像、姓名、职位和个人简介，移动端 1 列、平板 2 列、桌面 4 列
 * @param [props] 当前未使用，保留以便后续扩展
 * @returns 渲染完成的团队区 JSX
 */
const AboutTeam: FC<AboutTeamProps> = (_props) => {
  return (
    <>{/* 关于页团队展示区容器，浅色背景区分 */}
      <section className="bg-surface-secondary py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 区域标题区，居中展示主副标题 */}
          <div className="mb-16 text-center">
            <h2 className="text-text-primary mb-4 text-3xl font-bold sm:text-4xl">Meet the Team</h2>
            <p className="text-text-secondary mx-auto max-w-2xl">The people behind Personal Blog</p>
          </div>
          {/* 团队成员网格容器，移动端 1 列，平板 2 列，桌面 4 列 */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* 遍历渲染团队成员卡片 */}
            {ABOUT_TEAM.map((member) => (
              <div key={member.name} className="text-center">
                {/* 成员头像展示 */}
                <img src={member.avatar} alt={member.name} className="mx-auto mb-4 h-24 w-24 rounded-full object-cover" />
                {/* 成员姓名展示 */}
                <h3 className="text-text-primary font-semibold">{member.name}</h3>
                {/* 成员职位展示 */}
                <p className="text-accent mb-2 text-sm">{member.role}</p>
                {/* 成员个人简介文案 */}
                <p className="text-text-secondary text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutTeam;
