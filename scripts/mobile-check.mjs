/**
 * Mobile verification against the built site:
 *   - no horizontal scroll at 360px
 *   - interactive elements at least 44px on their smaller axis
 *   - every tel: link in the correct E.164 format
 *
 * Requires: npm install --no-save playwright
 * (kept out of package.json so production builds stay lean)
 *
 * Usage: node scripts/mobile-check.mjs <dist-dir> [path ...]
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const [distDir, ...paths] = process.argv.slice(2);
const routes = paths.length ? paths : ['/'];
const EXPECTED_TEL = 'tel:+642102602044';

const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain',
};

const server = createServer(async (req, res) => {
  try {
    const p = decodeURIComponent(req.url.split('?')[0]);
    let file = join(distDir, p);
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    } catch {
      file = join(distDir, p.replace(/\/$/, '') + '/index.html');
    }
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('nf');
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 360, height: 740 }, isMobile: true });

let failures = 0;
for (const route of routes) {
  await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'networkidle' });

  const report = await page.evaluate(() => {
    const doc = document.documentElement;
    const overflow = doc.scrollWidth - doc.clientWidth;

    const widest = [...document.querySelectorAll('*')]
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ el, r }) => r.width > 0 && r.right > doc.clientWidth + 1 && !el.closest('[aria-hidden="true"]'))
      .map(({ el, r }) => `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} right=${Math.round(r.right)}`)
      .slice(0, 5);

    const small = [];
    for (const el of document.querySelectorAll('a[href], button, input, select, textarea')) {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || r.width === 0 || r.height === 0) continue;
      // Off-screen or hidden from assistive tech: not a real target (honeypots).
      if (el.closest('[aria-hidden="true"]') || el.getAttribute('tabindex') === '-1') continue;
      // WCAG 2.5.8 exempts links that sit inline within a block of text.
      if (el.tagName === 'A' && el.closest('p, li, .lead')) continue;
      if (/^(radio|checkbox)$/.test(el.type || '')) {
        const label = el.closest('label');
        if (label && Math.min(label.getBoundingClientRect().width, label.getBoundingClientRect().height) >= 44) continue;
      }
      if (Math.min(r.width, r.height) < 44) {
        small.push(
          `${el.tagName.toLowerCase()}${el.className ? '.' + el.className.toString().split(' ')[0] : ''} ` +
            `"${(el.textContent || '').trim().slice(0, 26)}" ${Math.round(r.width)}x${Math.round(r.height)}`
        );
      }
    }

    const tels = [...new Set([...document.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute('href')))];
    return { overflow, widest, small, tels };
  });

  const badTel = report.tels.filter((t) => t !== EXPECTED_TEL);
  const ok = report.overflow <= 0 && report.small.length === 0 && badTel.length === 0;
  if (!ok) failures++;

  console.log(`\n${ok ? 'PASS' : 'FAIL'}  ${route}`);
  console.log(`  horizontal overflow at 360px: ${report.overflow}px`);
  if (report.widest.length) console.log(`  overflowing: ${report.widest.join('; ')}`);
  console.log(`  tap targets under 44px: ${report.small.length}`);
  for (const s of report.small.slice(0, 8)) console.log(`    - ${s}`);
  console.log(`  tel: links: ${report.tels.join(', ') || 'none'}${badTel.length ? '  <-- WRONG FORMAT' : ''}`);
}

await browser.close();
server.close();
console.log(`\n${failures === 0 ? 'ALL PAGES PASS' : failures + ' page(s) failed'}`);
process.exit(failures === 0 ? 0 : 1);
