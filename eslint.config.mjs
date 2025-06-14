// @ts-check
import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['node_modules', '**/node_modules/**', '**/*.js', '**/*.mjs', '**/*.cjs', '**/*.d.ts'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type', 'unknown'],
          pathGroups: [{ pattern: 'react', group: 'builtin', position: 'before' }],
          // 'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroupsExcludedImportTypes: []
        },
      ],
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      sourceType: 'module',
      parserOptions: {
        project: ['tsconfig.json'],
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      curly: ['error', 'all'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      // '@typescript-eslint/no-unsafe-call': 'off',
      // '@typescript-eslint/no-unsafe-member-access': 'off',
      // '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      // '@typescript-eslint/no-unused-expressions': 'off',
      // '@typescript-eslint/no-require-imports': 'off',
      // '@typescript-eslint/no-unused-vars': 'off',
      // '@typescript-eslint/no-misused-promises': [
      //   'error',
      //   {
      //     checksVoidReturn: false,
      //     checksConditionals: false,
      //   },
      // ],
      // '@typescript-eslint/require-await': 'off',
      // '@typescript-eslint/prefer-promise-reject-errors': 'off',
      // '@typescript-eslint/no-base-to-string': 'off',
      // '@typescript-eslint/unbound-method': 'off',
      // '@typescript-eslint/only-throw-error': 'off',
    },
  },
);
