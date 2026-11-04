/** Checks the actual Vercel route compiler, not an Astro-preview approximation.
 * ROUTING_MODULE=/path/to/@vercel/routing-utils/dist/index.js node scripts/verify-routing.mjs
 * Install QA tooling outside the application with npm --prefix /tmp/roh-router install @vercel/routing-utils.
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const routing = await import(
  process.env.ROUTING_MODULE || "@vercel/routing-utils"
);
const config = JSON.parse(
  await readFile(new URL("../vercel.json", import.meta.url)),
);
const { routes, error } = routing.getTransformedRoutes(config);
assert.equal(error, null);
const match = (path) =>
  routes.find(
    (route) => route.headers?.Location && new RegExp(route.src).test(path),
  );
for (const redirect of config.redirects) {
  const route = match(redirect.source);
  assert.equal(route.status, 301, redirect.source);
  assert.equal(route.headers.Location, redirect.destination);
  assert.equal(match(redirect.destination), undefined, "No second redirect");
}
for (const path of [
  "/",
  "/api/enquiry",
  "/api/enquiry/",
  "/robots.txt",
  "/sitemap-0.xml",
  "/_astro/test.webp",
  "/_astro/test.webp/",
  "/fonts/dm-sans-latin-variable.woff2",
  "/images/og-image.jpg",
])
  assert.equal(match(path), undefined, path);
const preview = routes.find((route) =>
  route.has?.some((item) => item.type === "host"),
);
assert.ok(preview);
assert.equal(preview.headers["X-Robots-Tag"], "noindex, nofollow");
const host = new RegExp(`^(?:${preview.has[0].value})$`);
assert.ok(host.test("roh-example.vercel.app"));
assert.ok(!host.test("www.rohullahtiling.co.nz"));
console.log(
  `PASS: Vercel compiler accepts config; ${config.redirects.length} literal single 301 redirects; assets/API/root unaffected; noindex header matches preview host only. Query preservation and hosted status still require an actual edge check.`,
);
