// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.rohullahtiling.co.nz',
  output: 'static',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
  devToolbar: { enabled: false },
});
