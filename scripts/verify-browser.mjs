/** Local feature QA; all outbound mail is mocked. No real enquiry is delivered.
 * Run an Astro preview on :4330, then PLAYWRIGHT_MODULE=<path/to/playwright/index.mjs>
 * CHROMIUM_PATH=/usr/bin/chromium node scripts/verify-browser.mjs
 */
import assert from "node:assert/strict";
import { writeFile, mkdir } from "node:fs/promises";
import handler from "../api/enquiry.js";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--no-sandbox"],
});
const base = process.env.QA_BASE || "http://127.0.0.1:4330";
const artifacts = process.env.QA_ARTIFACTS || "/tmp/roh-browser-qa";
await mkdir(artifacts, { recursive: true });
const routes = [
  "/",
  "/services",
  "/services/bathroom-tiling",
  "/services/kitchen-tiling",
  "/services/floor-tiling",
  "/services/waterproofing",
  "/services/tile-repairs",
  "/services/underfloor-heating",
  "/portfolio",
  "/service-areas",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];
const errors = [],
  checks = [],
  mail = [];
const originalFetch = globalThis.fetch;
const oldKey = process.env.RESEND_API_KEY;
process.env.RESEND_API_KEY = "local-test-only";
let mode = "success",
  apiCalls = 0;
globalThis.fetch = async (url, init) => {
  assert.equal(url, "https://api.resend.com/emails");
  mail.push(JSON.parse(init.body));
  return {
    ok: mode !== "provider-failure",
    status: mode === "provider-failure" ? 502 : 200,
  };
};
async function pageAt(width, js = true, reduced = "no-preference") {
  const context = await browser.newContext({
    viewport: { width, height: width === 1440 ? 1000 : 844 },
    javaScriptEnabled: js,
    reducedMotion: reduced,
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/*", async (route) => {
    if (!route.request().url().startsWith(base)) return route.abort();
    if (new URL(route.request().url()).pathname !== "/api/enquiry")
      return route.continue();
    apiCalls++;
    if (mode === "network-failure") return route.abort();
    if (mode === "bad-json")
      return route.fulfill({
        status: 200,
        body: "<html>not a confirmation</html>",
      });
    const req = {
      method: route.request().method(),
      body: route.request().postData(),
    };
    const res = {
      headers: {},
      setHeader(k, v) {
        this.headers[k] = v;
      },
      status(code) {
        this.code = code;
        return this;
      },
      json(body) {
        this.body = body;
        return this;
      },
    };
    await handler(req, res);
    await route.fulfill({
      status: res.code,
      contentType: "application/json",
      body: JSON.stringify(res.body),
    });
  });
  return page;
}
async function fill(page, method = "phone") {
  await page.locator("#quote-name").fill("Local Preview Test");
  await page.locator(`[name=preferred_contact][value=${method}]`).check();
  await page
    .locator("#quote-contact")
    .fill(method === "phone" ? "021 000 0000" : "preview@example.test");
  await page.locator("#quote-suburb").fill("Whitby");
  await page
    .locator("#quote-description")
    .fill("Local QA only. No external delivery.");
}
const events = (page) =>
  page.evaluate(() =>
    (window.dataLayer || []).filter((e) => e.event === "roh_quote_completed"),
  );
try {
  // Every route, four widths, fonts, photos and same-screen primary action.
  for (const width of [1440, 768, 390, 320]) {
    const page = await pageAt(width);
    for (const path of routes) {
      const response = await page.goto(base + path);
      assert.equal(response.status(), 200, path);
      await page.evaluate(() => document.fonts.ready);
      const result = await page.evaluate(async () => {
        const h1 = document.querySelector("h1");
        for (const image of document.images) {
          image.loading = "eager";
          await image.decode().catch(() => {});
        }
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          h1s: document.querySelectorAll("h1").length,
          missing: [...document.images]
            .filter((i) => !i.complete || !i.naturalWidth)
            .map((i) => i.src),
          font: getComputedStyle(h1).fontFamily,
          quote: [...document.querySelectorAll("a")]
            .find((a) => a.textContent === "Request a quote")
            ?.getBoundingClientRect().top,
          phone: document.querySelector(".nav-phone")?.getBoundingClientRect()
            .bottom,
        };
      });
      assert.equal(
        result.overflow,
        false,
        `${width} ${path} horizontal overflow`,
      );
      assert.equal(result.h1s, 1);
      assert.deepEqual(result.missing, [], `${path} images`);
      assert.match(result.font, /Playfair Display/);
      assert.ok(result.phone < 844);
      if (path === "/")
        assert.ok(result.quote < 700, `${width}: home quote in first screen`);
      checks.push({ width, path, ...result });
    }
    await page.context().close();
  }
  // Keyboard navigation, skip link, menu, focus, and reduced motion.
  let page = await pageAt(390, true, "reduce");
  await page.goto(base);
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.className),
    "skip-link",
  );
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => location.hash), "#page-content");
  await page.locator("#hamburger").click();
  assert.equal(
    await page.locator("#hamburger").getAttribute("aria-expanded"),
    "true",
  );
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent),
    "Services",
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page.evaluate(() => document.activeElement.id),
    "hamburger",
  );
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  await page.context().close();
  // Portfolio filters, keyboard operation, query and deep-link disagreement.
  page = await pageAt(390);
  await page.goto(base + "/portfolio");
  await page.getByRole("button", { name: "Kitchens", exact: true }).focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(".portfolio-item:visible").count(), 2);
  assert.match(page.url(), /service=kitchen-tiling/);
  assert.match(
    await page.locator(".portfolio-filter-status").textContent(),
    /2 photos/,
  );
  await page.goto(
    base + "/portfolio?service=kitchen-tiling#teal-stack-bond-shower",
  );
  assert.equal(await page.locator("#teal-stack-bond-shower").isVisible(), true);
  assert.equal(
    await page
      .getByRole("button", { name: "Bathrooms", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.context().close();
  // Phone-only success + photo: browser -> actual handler -> fake provider -> receipt.
  page = await pageAt(390);
  await page.goto(base + "/contact?service=bathroom-tiling#quote-form");
  assert.equal(
    await page.locator("#quote-service").inputValue(),
    "bathroom-tiling",
  );
  await fill(page);
  await page
    .locator("#quote-photo")
    .setInputFiles({
      name: "test.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jH7sAAAAASUVORK5CYII=",
        "base64",
      ),
    });
  let before = apiCalls;
  await page
    .getByRole("button", { name: "Request a quote", exact: true })
    .click();
  await page.waitForURL("**/thank-you");
  await page
    .getByRole("heading", { name: "Thanks. Your enquiry has been sent." })
    .waitFor();
  assert.equal(apiCalls, before + 1);
  assert.equal((await events(page)).length, 1);
  assert.equal(mail.at(-1).reply_to, undefined);
  assert.equal(mail.at(-1).attachments.length, 1);
  assert.deepEqual(Object.keys((await events(page))[0]).sort(), [
    "contact_method",
    "event",
    "service",
  ]);
  await page.screenshot({
    path: artifacts + "/phone-success.png",
    fullPage: true,
  });
  await page.reload();
  assert.equal((await events(page)).length, 0);
  assert.match(await page.locator("h1").textContent(), /sent/);
  await page.context().close();
  // Email without a phone and invalid data before submit.
  page = await pageAt(1440);
  await page.goto(base + "/contact?service=kitchen-tiling");
  before = apiCalls;
  await page
    .getByRole("button", { name: "Request a quote", exact: true })
    .click();
  assert.equal(
    await page.evaluate(() => document.activeElement.id),
    "quote-name",
  );
  assert.equal(apiCalls, before);
  await fill(page, "email");
  assert.equal(
    await page.locator("#quote-contact").getAttribute("type"),
    "email",
  );
  await page
    .getByRole("button", { name: "Request a quote", exact: true })
    .click();
  await page.waitForURL("**/thank-you");
  await page
    .getByRole("heading", { name: "Thanks. Your enquiry has been sent." })
    .waitFor();
  assert.equal((await events(page)).length, 1);
  assert.equal(mail.at(-1).reply_to, "preview@example.test");
  await page.context().close();
  // Failure modes retain the enquiry and never fire completion or navigate.
  for (const failure of [
    "provider-failure",
    "network-failure",
    "bad-json",
    "honeypot",
  ]) {
    mode = failure;
    page = await pageAt(390);
    await page.goto(base + "/contact?service=floor-tiling");
    await fill(page);
    if (failure === "honeypot")
      await page.locator("#quote-company").fill("bot", { force: true });
    const count = mail.length;
    await page
      .getByRole("button", { name: "Request a quote", exact: true })
      .click();
    await page.locator('.form-status a[href^="mailto:"]').waitFor();
    assert.match(page.url(), /contact/);
    assert.equal((await events(page)).length, 0);
    assert.equal(
      await page.locator("#quote-name").inputValue(),
      "Local Preview Test",
    );
    if (failure === "honeypot") assert.equal(mail.length, count);
    await page.context().close();
  }
  mode = "success";
  // Direct receipt visits don't create success, and photo validation prevents POST.
  page = await pageAt(390);
  await page.goto(base + "/thank-you");
  assert.equal((await events(page)).length, 0);
  assert.equal(await page.locator("h1").textContent(), "Your quote request");
  await page.goto(base + "/contact?service=tile-repairs");
  await fill(page);
  await page
    .locator("#quote-photo")
    .setInputFiles({
      name: "bad.svg",
      mimeType: "image/svg+xml",
      buffer: Buffer.from("<svg/>"),
    });
  before = apiCalls;
  await page
    .getByRole("button", { name: "Request a quote", exact: true })
    .click();
  assert.equal(apiCalls, before);
  assert.match(await page.locator("#quote-photo-error").textContent(), /2 MB/);
  await page.context().close();
  // Session storage unavailable: inline confirmed success + one event.
  page = await pageAt(390);
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("storage disabled");
    };
  });
  await page.goto(base + "/contact?service=tile-repairs");
  await fill(page);
  await page
    .getByRole("button", { name: "Request a quote", exact: true })
    .click();
  await page
    .locator(".form-status")
    .filter({ hasText: "Your enquiry has been sent" })
    .waitFor();
  assert.equal((await events(page)).length, 1);
  await page.context().close();
  // Without JS all projects remain reachable; the form explains email handoff.
  page = await pageAt(390, false);
  await page.goto(base + "/portfolio");
  assert.equal(await page.locator(".portfolio-item:visible").count(), 8);
  await page.goto(base + "/contact");
  assert.match(
    await page.locator("noscript").textContent(),
    /opens your email app/,
  );
  assert.equal(await page.locator("#quote-photo").isDisabled(), true);
  assert.equal(
    await page.locator("form").getAttribute("action"),
    "mailto:Rohullah.rassuli@gmail.com",
  );
  await page.context().close();
  assert.deepEqual(errors, [], "No browser exceptions");
  await writeFile(
    artifacts + "/results.json",
    JSON.stringify(
      {
        checks,
        errors,
        apiCalls,
        mockedMailRequests: mail.length,
        mailDelivered: false,
      },
      null,
      2,
    ),
  );
  console.log(
    `PASS: ${checks.length} route/viewport checks; keyboard, reduced motion, filters, phone/email/photo success, failure/spam, receipt events, no-JS. ${mail.length} provider calls mocked; no mail delivered.`,
  );
} finally {
  globalThis.fetch = originalFetch;
  if (oldKey === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = oldKey;
  await browser.close();
}
