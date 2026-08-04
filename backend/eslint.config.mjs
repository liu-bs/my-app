import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // 全局忽略
  {
    ignores: ['dist/**', 'node_modules/**', 'data/**', 'scripts/**'],
  },

  // 基础 JS 推荐规则
  js.configs.recommended,

  // TypeScript 推荐规则
  ...tseslint.configs.recommended,

  // Prettier 配置（关闭与 Prettier 冲突的 ESLint 规则）
  prettierConfig,

  // 项目自定义规则
  {
    files: ['src/**/*.ts'],
    rules: {
      // TypeScript 规则调整
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],

      // 通用规则调整
      'no-console': 'off',
      'no-case-declarations': 'off',
    },
  },
);
