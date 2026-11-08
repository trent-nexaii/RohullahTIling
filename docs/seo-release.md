# SEO release and merge

This release completes the sitemap/schema/URL work previously deferred during the visual enhancement phase. No page slug, visible design, quote destination or business contact detail was changed.

## URL and sitemap policy

- Production origin remains `https://www.rohullahtiling.co.nz`.
- Root canonical is `/`; other established page canonicals have no trailing slash. Queries/fragments are removed from canonical/OG URLs. External-origin canonical inputs are rejected.
- Astro now builds `index.html` plus clean-URL-compatible `.html` files, with `trailingSlash: never`. Vercel `cleanUrls: true` and `trailingSlash: false` permanently normalize `.html`, `/index.html` and non-root trailing-slash variants. There are no catch-all rewrites to turn unknown pages into homepage soft-404s.
- Host-restricted 308 redirects normalize the apex domain to www, including an explicit homepage rule. They preserve method semantics; query retention was checked against the generated routing rules. The canonical www URLs do not redirect, and `/api/enquiry` remains outside the HTML cleanup rules.
- The sitemap contains exactly the 14 existing indexable pages, excludes 404/API paths and uses the same URLs as canonicals. The sitemap index and production robots.txt point at the existing HTTPS/www sitemap address. No invented last-modified dates, priorities or change frequencies were added.
- The pinned sitemap plugin strips the homepage slash for file-format builds after serialization. A small post-build hook restores that one entry to the actual homepage canonical.
- Vercel Preview builds emit `noindex, follow` metadata and a blocked robots.txt; `.vercel.app` hosts also receive `X-Robots-Tag: noindex, nofollow`, without applying that header to production custom domains. Production regular pages have no noindex directive. The custom 404 is explicitly noindex and excluded from the sitemap.

## Structured data

- A single business entity per page uses the more specific Schema.org `HomeAndConstructionBusiness` subtype of LocalBusiness, retaining the established `/#business` ID.
- Existing central name, phone, email, locality, postcode, business hours, Google/Instagram references and image/logo URLs are reused. Regional service areas are shared between business and Service nodes to prevent drift.
- Connected WebSite, WebPage and BreadcrumbList nodes use stable production IDs. Breadcrumb items include absolute canonical URLs for the current page as well as ancestors. Each of the six Service nodes references the same business and its own WebPage.
- No unsupported ratings/reviews, certifications, street address, coordinates or offices were invented. The service-area business retains its existing partial address rather than exposing or fabricating a street address. Google may require additional verified address information for particular local-business rich-result features; valid linked data does not guarantee eligibility or rankings.
- Existing service/FAQ content and its technical claims remain subject to owner/professional confirmation. This release does not newly verify NZS 4858/PS3 capability or other qualifications.

## Repeatable checks

```sh
npm run build
npm run check:seo
npm test

# Optional preview-policy check; rebuild without SITE_PREVIEW afterwards.
SITE_PREVIEW=true npm run build
npm run check:seo -- --preview
```

The SEO verifier checks all 14 built pages: unique metadata, one H1, canonical/OG agreement, one business entity, no duplicate schema IDs, linked WebSite/WebPage/Service/Breadcrumb IDs, consistent areas/hours, internal links/fragments, sitemap membership and preview/production robots behaviour. It also checks the noindex 404.

Both production and preview builds/checks passed. All three existing enquiry tests passed with mocks and no real email. Vercel's official `@vercel/routing-utils` was installed outside the repository and used to validate the config and generated redirect rules: root, nested pages, slash/HTML/index variants, apex/www, query retention, API-path preservation, no redirect loops and Vercel-host-only noindex headers. That is configuration validation, not a claim of live Vercel observation.

The production build was served locally for HTTP checks of all 14 canonical routes, sitemap/robots/static JS, and unknown-route 404; Chromium checks cover Home/Bathroom/Contact at 1440px and 390px, including overflow, page errors and axe accessibility. The source styles/navigation/footer remain unchanged in this SEO release.

## Deployment verification limits and follow-up

Direct access to the production host was blocked by this execution environment's outbound policy (CONNECT 403). Live Vercel domain settings, deployment status, production HTTP redirects and Google Rich Results/Search Console results could not be independently checked here. Repository routing rules are ready for Vercel; platform-level domain rules or protection settings can take precedence and should be checked once deployment completes.

After the authorised main-branch merge, the existing Git integration can deploy production. Check Vercel for the main commit, then verify `/`, `/services`, `/services/`, `/services.html`, `/services/index.html`, the apex domain, sitemap-index.xml and robots.txt. Confirm regular production pages are indexable and previews are not. Search Console sitemap submission and URL inspections can follow after the deployed URLs are verified; no indexing or Search Console submission was made by this release.
