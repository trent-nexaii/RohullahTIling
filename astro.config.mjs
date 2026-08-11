// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.rohullahtiling.co.nz',
  output: 'static',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      // Confirmation screen, not a landing page.
      filter: (page) => !page.includes('/contact/thank-you'),
    }),
  ],
  devToolbar: { enabled: false },
});
