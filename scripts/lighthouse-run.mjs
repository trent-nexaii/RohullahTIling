/**
 * Runs Lighthouse against a static dist/ directory on a throttled mobile
 * profile and prints scores plus LCP/CLS.
 *
 * Requires: npm install --no-save lighthouse chrome-launcher
 * (kept out of package.json so production builds stay lean)
 *
 * Usage: node scripts/lighthouse-run.mjs <dist-dir> <label> [path ...]
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const [distDir, label, ...paths] = process.argv.slice(2);
const routes = paths.length ? paths : ['/'];

const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.xml': 'application/xml', '.ico': 'image/x-icon', '.txt': 'text/plain',
  '.json': 'application/json', '.png': 'image/png',
};

const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split('?')[0]);
    let file = join(distDir, p);
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    } catch {
      file = join(distDir, p.replace(/\/$/, '') + '/index.html');
    }
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
  }
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const chrome = await chromeLauncher.launch({
  chromePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
});

const results = [];
for (const route of routes) {
  const runnerResult = await lighthouse(
    `http://127.0.0.1:${port}${route}`,
    { port: chrome.port, output: 'json', logLevel: 'error' },
    // Default Lighthouse config is mobile: Moto G Power emulation with
    // 4x CPU throttling and a simulated slow 4G link.
    undefined
  );
  const { categories, audits } = runnerResult.lhr;
  const pct = (c) => (c ? Math.round(c.score * 100) : null);
  const totalBytes = audits['total-byte-weight']?.numericValue ?? 0;
  results.push({
    route,
    performance: pct(categories.performance),
    accessibility: pct(categories.accessibility),
    bestPractices: pct(categories['best-practices']),
    seo: pct(categories.seo),
    lcpMs: Math.round(audits['largest-contentful-paint']?.numericValue ?? 0),
    cls: Number((audits['cumulative-layout-shift']?.numericValue ?? 0).toFixed(4)),
    tbtMs: Math.round(audits['total-blocking-time']?.numericValue ?? 0),
    pageWeightKb: Math.round(totalBytes / 1024),
  });
}

await chrome.kill();
server.close();

console.log(`\n### ${label}`);
for (const r of results) {
  console.log(
    `${r.route.padEnd(34)} perf=${String(r.performance).padStart(3)} ` +
      `a11y=${String(r.accessibility).padStart(3)} bp=${String(r.bestPractices).padStart(3)} ` +
      `seo=${String(r.seo).padStart(3)} | LCP=${r.lcpMs}ms CLS=${r.cls} ` +
      `TBT=${r.tbtMs}ms weight=${r.pageWeightKb}KB`
  );
}
console.log(JSON.stringify({ label, results }));
