import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';

const root = new URL('../dist/', import.meta.url);
const origin = 'https://www.rohtiling.co.nz';
const preview = process.argv.includes('--preview');
const expected = ['/', '/about', '/contact', '/portfolio', '/privacy', '/service-areas', '/services', '/services/bathroom-tiling', '/services/floor-tiling', '/services/kitchen-tiling', '/services/tile-repairs', '/services/underfloor-heating', '/services/waterproofing', '/terms'];
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], m[2].replaceAll('&amp;', '&')]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map(m => attrs(m[0]));
const canonical = path => origin + path;
function checkUrl(value) {
  const url = new URL(value);
  assert.equal(url.origin, origin, value);
  assert.equal(url.search + url.hash, '', value);
  assert(url.pathname === '/' || !url.pathname.endsWith('/'), value);
  assert(!url.pathname.endsWith('.html'), value);
}
const pages = new Map();
const titles = [], descriptions = [];
for (const path of expected) {
  const html = await readFile(new URL(path === '/' ? 'index.html' : `${path.slice(1)}.html`, root), 'utf8');
  pages.set(path, html);
  const meta = tags(html, 'meta');
  const links = tags(html, 'link');
  assert.equal(links.filter(t => t.rel === 'canonical').length, 1, path);
  assert.equal(links.find(t => t.rel === 'canonical').href, canonical(path), path);
  assert.equal(meta.find(t => t.property === 'og:url').content, canonical(path));
  assert.equal(meta.find(t => t.name === 'twitter:url').content, canonical(path));
  for (const name of ['og:image', 'twitter:image']) {
    assert.equal(meta.find(t => t.property === name || t.name === name).content, origin + '/images/og-image.jpg');
  }
  assert(!/rohullahtiling\.co\.nz|https?:\/\/[^\s"<>]*\.vercel\.app/i.test(html), path + ' stale or preview URL');
  assert.equal((html.match(/<h1\b/g) || []).length, 1, path);
  titles.push(html.match(/<title>([\s\S]*?)<\/title>/)[1]);
  descriptions.push(meta.find(t => t.name === 'description').content);
  const robots = meta.find(t => t.name === 'robots')?.content || '';
  assert.equal(robots.includes('noindex'), preview, path);
  const nodes = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(m => { const x = JSON.parse(m[1]); return x['@graph'] || [x]; });
  const ids = nodes.filter(n => n['@id']).map(n => n['@id']);
  assert.equal(new Set(ids).size, ids.length, path + ' duplicate schema IDs');
  assert(!nodes.some(n => ['AggregateRating', 'Review'].includes(n['@type'])), path);
  const business = nodes.filter(n => n['@type'] === 'HomeAndConstructionBusiness');
  assert.equal(business.length, 1, path);
  const biz = business[0];
  assert.equal(biz['@id'], origin + '/#business');
  assert.equal(biz.url, canonical('/'));
  assert.equal(biz.logo, origin + '/images/roh-tiling-logo.webp');
  assert.equal(biz.image, origin + '/images/og-image.jpg');
  assert.equal(biz.name, 'ROH Tiling');
  assert.equal(biz.telephone, '+642102602044');
  assert.equal(biz.address.addressLocality, 'Whitby');
  assert.equal(biz.address.addressCountry, 'NZ');
  assert(!biz.address.streetAddress, 'Do not invent a public street address');
  assert.equal(biz.openingHoursSpecification.length, 1);
  assert.equal(biz.openingHoursSpecification[0].opens, '08:00');
  assert.deepEqual(biz.areaServed.map(a => a.name), ['Wellington', 'Porirua', 'Lower Hutt', 'Upper Hutt', 'Kapiti Coast']);
  assert.equal(nodes.find(n => n['@type'] === 'WebSite').publisher['@id'], biz['@id']);
  assert.equal(nodes.find(n => n['@type'] === 'WebSite').url, canonical('/'));
  const webpage = nodes.find(n => n['@type'] === 'WebPage');
  assert.equal(webpage.url, canonical(path));
  assert.equal(webpage['@id'], canonical(path) + '#webpage');
  const breadcrumb = nodes.find(n => n['@type'] === 'BreadcrumbList');
  if (path !== '/') {
    assert(breadcrumb, path);
    assert.equal(webpage.breadcrumb['@id'], breadcrumb['@id']);
    breadcrumb.itemListElement.forEach((item, i) => { assert.equal(item.position, i + 1); checkUrl(item.item); });
    assert.equal(breadcrumb.itemListElement.at(-1).item, canonical(path));
  }
  if (path.startsWith('/services/')) {
    const service = nodes.find(n => n['@type'] === 'Service');
    assert(service, path);
    assert.equal(service.url, canonical(path));
    assert.equal(service['@id'], canonical(path) + '#service');
    assert.equal(service.mainEntityOfPage['@id'], webpage['@id']);
    assert.equal(service.provider['@id'], biz['@id']);
    assert.deepEqual(service.areaServed, biz.areaServed);
  }
}
assert.equal(new Set(titles).size, expected.length, 'duplicate title');
assert.equal(new Set(descriptions).size, expected.length, 'duplicate description');
for (const [path, html] of pages) {
  for (const link of tags(html, 'a').filter(a => a.href?.startsWith('/'))) {
    const url = new URL(link.href, origin);
    if (pages.has(url.pathname)) {
      checkUrl(origin + url.pathname);
      if (url.hash) assert(tags(pages.get(url.pathname), '[a-z][a-z0-9-]*').some(t => t.id === decodeURIComponent(url.hash.slice(1))), `${path} broken fragment ${link.href}`);
    } else {
      assert(!url.pathname.startsWith('/api/'), 'No crawlable API links');
      await stat(new URL(url.pathname.slice(1), root));
    }
  }
}
const locations = [];
for (const file of await readdir(root)) {
  if (!/^sitemap-\d+\.xml$/.test(file)) continue;
  const xml = await readFile(new URL(file, root), 'utf8');
  locations.push(...[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]));
}
locations.forEach(checkUrl);
assert.deepEqual([...locations].sort(), expected.map(canonical).sort());
const index = await readFile(new URL('sitemap-index.xml', root), 'utf8');
assert(index.includes(origin + '/sitemap-0.xml'));
const robots = await readFile(new URL('robots.txt', root), 'utf8');
assert.equal(robots.includes('Disallow: /'), preview);
if (!preview) assert(robots.includes('Sitemap: ' + origin + '/sitemap-index.xml'));
const notFound = await readFile(new URL('404.html', root), 'utf8');
assert(tags(notFound, 'meta').find(t => t.name === 'robots')?.content.includes('noindex'));
assert(!locations.includes(origin + '/404'));
const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
assert(!config.redirects?.length, 'Domain migration redirects belong in Vercel domain settings');
assert.equal(config.cleanUrls, true);
assert.equal(config.trailingSlash, false);
console.log(`SEO verified: 14 pages, 6 Service nodes, business/site/page/breadcrumb IDs, internal links, sitemap and ${preview ? 'preview noindex' : 'production indexing'} policy.`);
