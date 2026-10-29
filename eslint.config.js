import js from '@eslint/js';
import ts from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteConfig from './svelte.config.js';

export default ts.config(
  { ignores: ['dist/**', '.astro/**', '.research/**', 'node_modules/**', 'src/data/foods.json'] },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,
  ...svelte.configs['flat/recommended'],
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node, ...globals.serviceworker } },
    rules: { 'no-console': 'error', '@typescript-eslint/no-explicit-any': 'error' },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: { parserOptions: { parser: ts.parser, svelteConfig } },
    rules: { 'svelte/no-at-html-tags': 'error' },
  },
);
