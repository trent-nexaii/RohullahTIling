// Run after `astro build`: node scripts/verify-technical-seo.mjs
// No network requests; verifies build output and avoids assuming URL indexing.
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = process.env.BUILD_DIR || 'dist';
const origin = 'https://www.rohullahtiling.co.nz';
const read = (path) => readFileSync(join(dist, path), 'utf8');
const sitemap = read('sitemap-0.xml');
const index = read('sitemap-index.xml');
const robots = read('robots.txt');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]);
assert.match(index, /<loc>https:\/\/www\.rohullahtiling\.co\.nz\/sitemap-0\.xml<\/loc>/);
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap-index.xml`));
assert.ok(locs.length >= 13, 'Expected the established public routes');
assert.equal(new Set(locs).size, locs.length, 'Duplicate sitemap URLs');
assert.ok(locs.includes(`${origin}/`), 'Missing canonical homepage URL');

const expected = [
  '/', '/about', '/contact', '/portfolio', '/privacy', '/service-areas',
  '/services', '/services/bathroom-tiling', '/services/floor-tiling',
  '/services/kitchen-tiling', '/services/tile-repairs',
  '/services/underfloor-heating', '/services/waterproofing', '/terms',
];
assert.deepEqual(locs.sort(), expected.map((p) => origin + p).sort());
for (const url of locs) {
  assert.ok(!url.endsWith('/') || url === `${origin}/`, `Trailing slash: ${url}`);
  const path = new URL(url).pathname;
  const file = join(dist, path.slice(1), 'index.html');
  assert.ok(existsSync(file), `Missing build output: ${file}`);
  const html = readFileSync(file, 'utf8');
  assert.ok(html.includes(`rel="canonical" href="${url}"`), `Canonical mismatch: ${path}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1]));
  assert.equal(schemas.filter((x) => x['@id'] === `${origin}/#business`).length, 1, `Business identity count: ${path}`);
  assert.equal(schemas.filter((x) => x['@type'] === 'WebSite').length, path === '/' ? 1 : 0);
  assert.ok(!schemas.some((x) => 'aggregateRating' in x || 'review' in x), `Unsupported review schema: ${path}`);
  if (path.startsWith('/services/')) {
    const service = schemas.find((x) => x['@type'] === 'Service');
    assert.ok(service, `Missing Service node: ${path}`);
    assert.equal(service.provider['@id'], `${origin}/#business`);
  }
}
console.log(`SEO build check passed: ${locs.length} canonical URLs, valid JSON-LD and sitemap references.`);
