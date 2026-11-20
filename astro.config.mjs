import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import { SITE_URL } from './scripts/site-url.mjs';

export default defineConfig({
  site: new URL(SITE_URL).origin,
  base: '/busog',
  output: 'static',
  trailingSlash: 'always',
  integrations: [svelte()],
});
