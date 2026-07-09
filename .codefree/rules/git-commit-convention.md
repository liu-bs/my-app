---
alwaysApply: true
---

# Git 提交信息规范

## 格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

## 类型 (type)

| 类型 | 说明 |
|------|------|
| feat | 新功能 (feature) |
| fix | 修复 bug |
| docs | 文档 (documentation) |
| style | 格式 (不影响代码运行的变动) |
| refactor | 重构 (既不是新增功能，也不是修改 bug) |
| perf | 性能优化 |
| test | 增加测试 |
| chore | 构建过程或辅助工具的变动 |
| ci | CI/CD 相关变动 |
| revert | 回滚 |

## 主题 (subject)

- 不超过 50 个字符
- 使用祈使句，现在时态
- 首字母小写
- 结尾不加句号

## 正文 (body)

- 可选，详细说明改动内容
- 每条以 "- " 开头

## 示例

```
feat(layout): 添加顶部导航栏组件

- 实现 Logo、菜单、用户信息区域
- 使用 Next.js + Tailwind CSS
- 支持菜单激活状态切换

fix(router): 修复登录权限验证逻辑

- 移除不必要的 token 检查
- 简化路由守卫代码

docs(readme): 更新项目启动说明
```
