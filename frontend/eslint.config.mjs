import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import queryPlugin from '@tanstack/eslint-plugin-query';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // 关闭与 Prettier 冲突的 ESLint 规则
  prettierConfig,

  // React Query 最佳实践规则
  {
    plugins: {
      '@tanstack/query': queryPlugin,
    },
    rules: {
      ...queryPlugin.configs.recommended.rules,
    },
  },

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      // React 19's set-state-in-effect rule flags legitimate patterns
      // (form sync from server data, theme detection on mount).
      // These are safe as long as effects have proper dependencies.
      'react-hooks/set-state-in-effect': 'off',
    },
  },

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
