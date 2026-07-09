/** @type {import('prettier').Config} */
module.exports = {
  // 基础格式化配置
  semi: true, // 使用分号
  singleQuote: false, // 使用双引号
  tabWidth: 2, // 缩进宽度
  trailingComma: "es5", // 尾随逗号（ES5 兼容）
  printWidth: 180,
  // 插件配置（注意：排序插件必须在 tailwind 插件之前）
  plugins: [
    "@trivago/prettier-plugin-sort-imports", // 导入排序插件
    "prettier-plugin-tailwindcss", // Tailwind CSS 排序插件
  ],

  // 导入排序规则（按优先级从高到低）
  importOrder: [
    "^react$", // 1. React 核心库
    "^next(/.*)?$", // 2. Next.js 相关
    "<THIRD_PARTY_MODULES>", // 3. 其他第三方库
    "^@/(.*)$", // 4. 项目别名导入（如 @/components）
    "^[./]", // 5. 相对路径导入
  ],

  // 导入排序排除列表（这些文件不会进行导入排序，但仍会被 Prettier 格式化）
  importOrderExclude: [
    "**/node_modules/**", // 排除依赖目录
    "**/dist/**", // 排除构建输出目录
    "**/build/**", // 排除构建输出目录
    "**/app/layout.tsx", // 排除 app/layout.tsx 的导入排序
  ],

  // 导入排序附加选项
  importOrderSeparation: false, // 不同组之间不添加空行
  importOrderSortSpecifiers: true, // 排序具名导入（如 import { a, b } 按字母排序）
};
