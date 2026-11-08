// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { SITE_URL } from './src/data/business.ts';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    sitemap({
      filter: (url) => !/^\/(?:404|api)(?:\/|$)/.test(new URL(url).pathname),
      serialize: (item) => ({ ...item, url: item.url.replace(/\/$/, '') }),
    }),
    {
      name: 'canonical-sitemap-and-preview-robots',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          // Sitemap 3.7.2 strips the root slash in file-format builds after
          // serialize(). Keep the root entry identical to the homepage canonical.
          for (const name of await readdir(dir)) {
            if (!/^sitemap-\d+\.xml$/.test(name)) continue;
            const file = new URL(name, dir);
            const xml = await readFile(file, 'utf8');
            await writeFile(file, xml.replaceAll(`<loc>${SITE_URL}</loc>`, `<loc>${SITE_URL}/</loc>`));
          }
          if (process.env.VERCEL_ENV === 'preview' || process.env.SITE_PREVIEW === 'true') {
            await writeFile(new URL('robots.txt', dir), 'User-agent: *\nDisallow: /\n');
          }
        },
      },
    },
  ],
  devToolbar: { enabled: false },
});
