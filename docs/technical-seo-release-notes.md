# ROH Tiling — sitemap and local schema release notes

Technical SEO branch: `feat/roh-technical-seo-sitemap-schema`
Based on `feat/roh-wellington-enhancements`, not `main`.

## Implemented (no design/content changes)
- Preserve existing page slugs and canonical no-trailing-slash URLs.
- Continue Astro's generated sitemap index and child sitemap; normalise URLs to those exact canonicals, including `/`.
- Add Vercel `cleanUrls: true` and `trailingSlash: false` for deployment URL consistency. Production edge routing requires verification after deployment.
- Keep `public/robots.txt` advertising the existing sitemap index.
- Use one stable `HomeAndConstructionBusiness` identity on each page (`/#business`), a single homepage `WebSite` identity (`/#website`), and existing per-page Service, BreadcrumbList and FAQPage data.
- Remove unsupported `alternateName`, unverified `priceRange` and strong waterproofing-standard assertions from the business-level description. Retain the existing per-page text unchanged.
- Avoid fake street address, location-specific offices, supplier affiliations, ratings and testimonials in JSON-LD.
- Add preview-only `noindex, nofollow` meta tag based on `VERCEL_ENV=preview` or `SITE_PREVIEW=true`.
- Add `scripts/verify-technical-seo.mjs` to check the sitemap and generated structured data after a build.

## Checked
- Astro compiled 15 pages including the custom 404, creating 14 canonical sitemap URLs.
- Every sitemap URL exactly matched its corresponding HTML canonical in the tested output.
- JSON-LD parsed on all 14 public pages, with one business identity per page, one WebSite node on Home and Service nodes referencing that same business ID.
- Production-mode build omitted noindex. Preview-mode build included `noindex, nofollow` on the homepage.
- Native JS syntax validation and SEO build checks passed.
- The constrained test runner could not complete all 108 Sharp image optimisations without exhausting memory, so the successful sitemap/schema builds used the Astro no-op image service **only in a local testing copy**. The committed production image configuration is unchanged. Run the normal `npm ci && npm run build` in standard CI/Vercel before release.

## Required final checks
1. Confirm the deployed Vercel preview matches this branch and the original approved visual design; the protected preview URL was not independently viewable in this session.
2. Test production-edge routing at HTTP/HTTPS, apex/www and slash/no-slash URLs; ensure exactly one canonical 200 destination without broken assets or `/api/enquiry` routing.
3. Verify Google Business Profile business name, phone, locality, postcode, service areas and hours against `src/data/business.ts`. The business is service-area-based; **do not invent a public street address**.
4. Verify the underlying existing service-page compliance statements with Rohullah (including any NZS 4858, PS3, insurance and warranty claims). This branch did not rewrite the visible copy.
5. Test the live quote form delivery with explicit approval.
6. After visual signoff and production deployment, ensure `https://www.rohullahtiling.co.nz/sitemap-index.xml` and `sitemap-0.xml` serve 200 and correct content; remove the obsolete Search Console `/sitemap.xml` submission if still present.
7. Re-inspect affected pages in Google Search Console (especially Services, Service Areas, Kitchen, Floor and supporting services), then request indexing as needed. A valid sitemap does not guarantee indexation.

## Commands
```sh
npm ci
npm run build
node scripts/verify-technical-seo.mjs
```

Do not merge, publish or request indexing before the final checks.
