import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  site: process.env.SITE_URL || 'https://busog-demo.github.io',
  base: '/busog',
  output: 'static',
  trailingSlash: 'always',
  integrations: [svelte()],
});
