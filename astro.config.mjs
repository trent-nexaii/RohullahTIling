// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFile, writeFile } from 'node:fs/promises';

// Use the existing no-trailing-slash canonicals everywhere, including sitemaps.
// Directory-format Astro output is retained to avoid changing page assets/routes.
const SITE = 'https://www.rohullahtiling.co.nz';
function canonicalUrl(value) {
  const url = new URL(value);
  if (url.origin !== SITE) return value;
  if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '');
  return url.href;
}

// @astrojs/sitemap v3.7.x can serialize the homepage as a bare origin.
// This final build hook normalises the generated <loc> values to the precise
// canonicals already used by the pages (root stays with a trailing slash).
function normaliseGeneratedSitemap() {
  return {
    name: 'roh-sitemap-canonicals',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const path = new URL('sitemap-0.xml', dir);
        const xml = await readFile(path, 'utf8');
        const corrected = xml.replace(/<loc>([^<]+)<\/loc>/g, (match, loc) => {
          return `<loc>${canonicalUrl(loc)}</loc>`;
        });
        await writeFile(path, corrected, 'utf8');
      },
    },
  };
}

export default defineConfig({
  site: SITE,
  output: 'static',
  // Retain directory output, but declare the already-established canonical style.
  trailingSlash: 'never',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      serialize(item) {
        const url = new URL(item.url);
        // Keep normal public pages; exclude explicit error/receipt URLs.
        if (/^\/(?:404|thank-you)\/?$/.test(url.pathname)) return undefined;
        return { ...item, url: canonicalUrl(item.url) };
      },
    }),
    normaliseGeneratedSitemap(),
  ],
  devToolbar: { enabled: false },
});
