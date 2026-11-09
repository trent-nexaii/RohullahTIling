# URL migration to www.rohtiling.co.nz

Implemented locally; no push or production deployment performed.

## Framework, routing and indexable pages

Astro 6.1.3, static output, file-based routes, file-format HTML. `vercel.json` retains `cleanUrls: true` and `trailingSlash: false`. Astro's `site` uses the shared `SITE_URL` constant. BaseLayout generates self-referencing canonicals, Open Graph, Twitter and connected JSON-LD; ServiceLayout adds Service nodes. No request host or Vercel preview hostname supplies canonical URLs.

The 14 indexable paths remain: `/`, `/about`, `/contact`, `/portfolio`, `/privacy`, `/service-areas`, `/services`, `/services/bathroom-tiling`, `/services/floor-tiling`, `/services/kitchen-tiling`, `/services/tile-repairs`, `/services/underfloor-heating`, `/services/waterproofing`, `/terms`. `/404` is noindex and excluded; `/api/enquiry` is a serverless endpoint, not an indexable page. The existing Google verification HTML file remains intact and outside the sitemap.

## Files modified

- `src/data/business.ts`: production origin changed to `https://www.rohtiling.co.nz`; shared social images and schema URLs inherit it.
- `src/layouts/BaseLayout.astro`: added per-page `twitter:url`, matching canonical and Open Graph URLs.
- `public/robots.txt`: sitemap reference changed to the new origin.
- `src/pages/privacy.astro`, `src/pages/terms.astro`: website domain text updated.
- `api/enquiry.js`, `public/js/main.js`: enquiry email source labels updated; API sender documentation uses the new domain. Sender defaults, recipient and actual delivery configuration are unchanged.
- `vercel.json`: removed the two old-domain normalization redirects; migration redirects are owned by existing Vercel domain settings. Clean URL handling and Vercel-host-only noindex header remain.
- `scripts/verify-seo.mjs`: new expected origin and regression checks for Twitter, social images, business/site URLs, stale/preview URLs and absence of duplicate migration redirects.
- `docs/seo-release.md`: marked the earlier release report as historical and superseded for domain/redirect details.
- `docs/domain-migration.md`: this report.

## Canonical examples

| Before | After |
| --- | --- |
| `https://www.rohullahtiling.co.nz/` | `https://www.rohtiling.co.nz/` |
| `https://www.rohullahtiling.co.nz/about` | `https://www.rohtiling.co.nz/about` |
| `https://www.rohullahtiling.co.nz/services/bathroom-tiling` | `https://www.rohtiling.co.nz/services/bathroom-tiling` |

The root retains its slash; other canonical paths retain no trailing slash. Query strings and fragments are excluded from canonicals. Page paths, titles, descriptions, keywords, business details, styling and branding were preserved. The checkout already identifies the business as “ROH Tiling” with owner Rohullah Rassuli; this migration does not rename it or invent details.

## Sitemap, robots and structured data

The existing Astro sitemap integration generates `dist/sitemap-index.xml` and `dist/sitemap-0.xml` at build time. The index references the new-domain sitemap; its URL set contains exactly the 14 canonical, indexable URLs. The established sitemap index endpoint is retained rather than adding a competing `/sitemap.xml`. Production robots allows `/` and references `https://www.rohtiling.co.nz/sitemap-index.xml`. Production public pages contain no noindex metadata. Preview builds retain new-production-domain canonicals, add `noindex, follow`, and block crawling in robots; existing `.vercel.app` header configuration adds `noindex, nofollow`.

The existing LocalBusiness subtype (`HomeAndConstructionBusiness`), WebSite, WebPage, BreadcrumbList and six Service nodes inherit the new origin for `url`, `@id`, logo/image and cross-references. Names, address locality, phone, email, opening hours, service areas and external profile links remain unchanged. No ratings, street addresses or business claims were added. Navigation, footer and assets already use relative internal paths; the form posts to relative `/api/enquiry`. Source audit found no remaining old-domain references in application/configuration files except the intentional stale-domain regression pattern in the verifier. Historical documentation retains context.

## Checks actually run

- `npm ci --cache /tmp/roh-npm-cache`: passed, 261 packages; lockfile unchanged. Initial default-cache installation failed because the sandbox home cache was unavailable; writable cache resolved it without disabling integrity or TLS checks.
- `ASTRO_TELEMETRY_DISABLED=1 npm run build`: passed. Default telemetry initially failed writing home configuration; disabling optional telemetry resolved it. An upstream Vite unused-import warning remains.
- `npm run check:seo`: passed on the final production build: 14 pages, six services, metadata, connected schema references, internal links/fragments, exact sitemap membership and indexing policy.
- `ASTRO_TELEMETRY_DISABLED=1 VERCEL_ENV=preview npm run build` and `npm run check:seo -- --preview`: passed. Rebuilt production afterward and reran its SEO verifier successfully.
- `npm test`: all three existing mocked enquiry tests passed; no real email sent.
- `node --check` for the API handler, public JavaScript and SEO verifier: passed. `git diff --check`: passed. No standalone lint or typecheck script is configured; a full lint/typecheck was not run.
- Started the documented development server; local HTTP/content checks passed for Home and Bathroom Tiling.
- Started Astro production preview; all 14 canonical paths returned HTTP 200 with correct canonicals and no noindex response/meta. Robots, sitemap index, URL sitemap, public JavaScript and OG image returned 200. An unknown path returned a noindex 404.
- Read-only HTTPS requests to old apex, old www and new www nested page: blocked by environment proxy CONNECT 403. These are not successful production checks. No live Vercel routing/header behavior, Google Rich Results or Search Console validation is claimed.

## Unresolved and post-deployment verification

No additional path redirects are required by the source changes because all existing paths remain. The user reports both old hosts already have permanent 308 Vercel domain redirects. Their actual path/query preservation could not be independently verified here. Manually verify old apex and old www for `/`, `/about`, `/contact` and `/services/bathroom-tiling`, including a query string: expect 308 to the corresponding new path, never a blanket homepage redirect. If paths are dropped, correct the Vercel domain redirect settings, without adding duplicate code redirects. Also verify the new apex normalizes to the chosen www primary domain.

After deploying this reviewed change:

1. Repeat the live redirect checks over HTTP and HTTPS, and check for chains/loops. Confirm new canonical destinations return 200.
2. Fetch production HTML and headers for all sitemap URLs; confirm self canonicals, social URLs, structured data, absence of noindex/X-Robots-Tag and production-domain assets. Confirm unknown routes return 404.
3. Fetch production robots.txt, sitemap-index.xml and sitemap-0.xml; ensure only the 14 new canonical URLs are listed and public crawling is allowed. Ensure the production build has no SITE_PREVIEW=true or preview VERCEL_ENV override.
4. Confirm Vercel previews retain production canonicals and noindex headers/metadata, including any custom preview aliases.
5. Validate representative Home and Service pages with Google Rich Results Test; inspect URLs in Search Console. Verify the new property, submit the new sitemap and complete the old property's Change of Address workflow where applicable. Monitor indexing, redirects and crawl errors.
6. Review Vercel/Resend sender settings separately if moving email authentication; a website migration does not establish new-domain sender verification. Live delivery was not tested.

Cloud setup supports local development/build/SEO/mocked tests in this instance. Draft reads and draft save returned INVALID_ARGUMENT, so reusable environment configuration persistence is unconfirmed. Tested setup/start instructions are retained outside the checkout at `/workspace/roh-environment-setup.md`; no environment publication or fresh-task restoration is claimed. Live checks need additive outbound domain access to the three hosts tested, preserving existing network settings.
