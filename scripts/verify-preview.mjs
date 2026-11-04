/** Read-only Vercel edge smoke test. Usage: node scripts/verify-preview.mjs https://your-preview.vercel.app */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
assert.ok(
  process.argv[2],
  "Usage: node scripts/verify-preview.mjs https://your-preview.vercel.app",
);
const base = new URL(process.argv[2]);
assert.equal(
  base.protocol,
  "https:",
  "Pass the actual HTTPS Vercel preview URL",
);
const xml = await readFile(
  new URL("../dist/sitemap-0.xml", import.meta.url),
  "utf8",
);
const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname,
);
const get = (path) => fetch(new URL(path, base), { redirect: "manual" });
for (const path of paths) {
  const page = await get(path);
  assert.equal(page.status, 200, `${path}: final URL must serve directly`);
  assert.match(
    await page.text(),
    /name="robots" content="noindex, nofollow"/,
    `${path}: preview noindex`,
  );
  if (path === "/") continue;
  const query = "?utm_source=canonical-check&value=tile%20work";
  const res = await get(path + "/" + query);
  assert.ok(
    res.status === 301,
    `${path}/: permanent redirect required (got ${res.status})`,
  );
  const location = new URL(res.headers.get("location"), base);
  assert.equal(location.pathname, path);
  assert.equal(location.searchParams.get("utm_source"), "canonical-check");
  assert.equal(location.searchParams.get("value"), "tile work");
  assert.equal(
    (await fetch(location, { redirect: "manual" })).status,
    200,
    "Exactly one redirect, no chain",
  );
}
for (const file of [
  "/robots.txt",
  "/sitemap-index.xml",
  "/sitemap-0.xml",
  "/favicon.ico",
  "/js/main.js",
]) {
  assert.equal(
    (await get(file)).status,
    200,
    `${file}: files serve without redirects`,
  );
}
assert.match(await (await get("/robots.txt")).text(), /Disallow: \/$/m);
assert.equal(
  (await get("/sitemap.xml")).status,
  404,
  "Do not introduce a second sitemap",
);
console.log(
  `PASS: ${paths.length} canonical routes, single permanent slash redirects with queries retained, and unchanged file paths on the supplied preview.`,
);
