// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFile, writeFile } from 'node:fs/promises';

const site = 'https://www.rohullahtiling.co.nz';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  build: {
    // Match no-slash canonicals; Vercel cleanUrls serves these without .html.
    format: 'file',
  },
  integrations: [sitemap(), {
    name: 'root-sitemap-canonical',
    hooks: {
      // @astrojs/sitemap 3.7.2 strips the root slash for file-format builds,
      // even after serialize(). Restore it to match the homepage canonical.
      'astro:build:done': async ({ dir }) => {
        const sitemapFile = new URL('sitemap-0.xml', dir);
        const xml = await readFile(sitemapFile, 'utf8');
        await writeFile(sitemapFile, xml.replace(`<loc>${site}</loc>`, `<loc>${site}/</loc>`));
      },
    },
  }],
  devToolbar: { enabled: false },
});
