/** Run after npm run build: node scripts/verify-build.mjs. No test dependencies. */
import assert from "node:assert/strict";
import { readdir, readFile, access } from "node:fs/promises";
import { join, extname } from "node:path";

const site = "https://www.rohullahtiling.co.nz";
const output = new URL(
  (process.env.BUILD_DIR || "../dist/").replace(/\/?$/, "/"),
  import.meta.url,
);
const preview = process.env.SITE_PREVIEW === "true";
const read = (name) => readFile(new URL(name, output), "utf8");
async function walk(folder) {
  const files = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const name = join(folder, entry.name);
    files.push(...(entry.isDirectory() ? await walk(name) : [name]));
  }
  return files;
}
const attributes = (tag) =>
  Object.fromEntries(
    [
      ...tag.matchAll(
        /\s([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g,
      ),
    ].map((m) => [m[1], (m[2] ?? m[3] ?? m[4] ?? "").replaceAll("&amp;", "&")]),
  );
const tags = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((m) =>
    attributes(m[0]),
  );
const locs = (xml) =>
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const config = JSON.parse(
  await readFile(new URL("../vercel.json", import.meta.url), "utf8"),
);
assert.equal(config.cleanUrls, true);
assert.equal(
  config.trailingSlash,
  undefined,
  "Avoid Vercel automatic 308 before explicit 301",
);
assert.ok(
  config.redirects.every(
    (route) =>
      route.statusCode === 301 && route.source === route.destination + "/",
  ),
  "One literal 301 for each slash variant",
);
const pages = new Map();
for (const file of await walk(output.pathname)) {
  if (!file.endsWith(".html")) continue;
  // Google verification is a public file, not an application page.
  if (/google[^/]+\.html$/.test(file)) continue;
  const path =
    "/" +
    file
      .slice(output.pathname.length)
      .replace(/\.html$/, "")
      .replace(/^index$/, "");
  const html = await readFile(file, "utf8");
  const canonical = tags(html, "link").filter((t) => t.rel === "canonical");
  assert.equal(canonical.length, 1, `${path}: one canonical`);
  assert.equal(
    canonical[0].href,
    site + path,
    `${path}: self-referential canonical`,
  );
  assert.equal(tags(html, "h1").length, 1, `${path}: one H1`);
  assert.match(html, /<title>[^<]+<\/title>/, `${path}: page title`);
  assert.equal(tags(html, 'title').length, 1, `${path}: exactly one title`);
  assert.equal(tags(html, 'meta').filter((tag) => tag.name === 'description').length, 1, `${path}: exactly one meta description`);
  assert.equal(
    tags(html, "meta").find((t) => t.property === "og:url")?.content,
    site + path,
  );
  pages.set(path, html);
}
assert.equal(
  pages.size,
  16,
  "Preserve the 14 public pages plus 404 and noindex receipt",
);
for (const path of pages.keys()) {
  if (!["/", "/404"].includes(path))
    assert.ok(
      config.redirects.some(
        (route) => route.source === path + "/" && route.destination === path,
      ),
      `${path}: exact slash redirect`,
    );
  const robots = tags(pages.get(path), "meta").find(
    (tag) => tag.name === "robots",
  )?.content;
  if (preview || path === "/thank-you") assert.match(robots || "", /noindex/);
  else assert.equal(robots, undefined, `${path}: production remains indexable`);
}
const sitemap = locs(await read("sitemap-0.xml"));
assert.equal(
  sitemap.length,
  new Set(sitemap).size,
  "No duplicate sitemap URLs",
);
assert.deepEqual(
  new Set(sitemap),
  new Set(
    [...pages.keys()]
      .filter((p) => !["/404", "/thank-you"].includes(p))
      .map((p) => site + p),
  ),
);
assert.deepEqual(locs(await read("sitemap-index.xml")), [
  site + "/sitemap-0.xml",
]);
if (preview) assert.match(await read("robots.txt"), /^Disallow: \/$/m);
else
  assert.match(
    await read("robots.txt"),
    /^Sitemap: https:\/\/www\.rohullahtiling\.co\.nz\/sitemap-index\.xml$/m,
  );
let links = 0,
  images = 0;
for (const [path, html] of pages) {
  for (const tag of [...tags(html, "a"), ...tags(html, "link")]) {
    if (!tag.href) continue;
    const url = new URL(tag.href, site + path);
    if (url.origin !== site) continue;
    if (pages.has(url.pathname)) {
      assert.ok(
        url.pathname === "/" || !url.pathname.endsWith("/"),
        `${path}: canonical internal link ${url.pathname}`,
      );
      if (url.hash) {
        const id = decodeURIComponent(url.hash.slice(1));
        assert.ok(
          tags(pages.get(url.pathname), "[a-z][\\w-]*").some(
            (t) => t.id === id,
          ),
          `${path}: target ${url.hash} exists`,
        );
      }
    } else {
      assert.ok(extname(url.pathname), `${path}: unknown page ${url.pathname}`);
      await access(new URL("." + url.pathname, output));
    }
    links++;
  }
  for (const image of tags(html, "img")) {
    assert.ok("alt" in image, `${path}: image alt attribute`);
    assert.ok(
      Number(image.width) > 0 && Number(image.height) > 0,
      `${path}: intrinsic dimensions`,
    );
    if (image.src.startsWith("/"))
      await access(new URL("." + image.src, output));
    images++;
  }
  assert.ok(
    tags(html, "a").some((a) => a.href === "tel:+642102602044"),
    `${path}: tap-to-call preserved`,
  );
}
const contact = pages.get("/contact");
const forms = tags(contact, "form");
assert.equal(forms.length, 1, "One quote/enquiry form");
assert.equal(forms[0].action, "mailto:Rohullah.rassuli@gmail.com");
assert.equal(forms[0]["data-mailto"], "Rohullah.rassuli@gmail.com");
assert.match(contact, /name="company"[^>]*tabindex="-1"/, "Honeypot preserved");
assert.match(
  pages.get("/portfolio"),
  /Photographed mid-installation/,
  "Honest portfolio labels preserved",
);
console.log(
  `PASS: ${pages.size} HTML routes, ${sitemap.length} sitemap URLs, ${links} internal links, ${images} image elements, and enquiry form invariants.`,
);
assert.ok(
  tags(contact, "input").some(
    (field) => field.name === "contact_detail" && "required" in field,
  ),
);
assert.ok(
  tags(contact, "input").some(
    (field) => field.type === "file" && !("required" in field),
  ),
);
assert.ok(
  !tags(contact, "input").some(
    (field) => field.name === "email" && "required" in field,
  ),
  "No compulsory email for phone contacts",
);
console.log(
  "Vercel edge redirects still need a hosted preview check; Astro preview is not the Vercel router.",
);
