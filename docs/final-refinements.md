# Final refinements — no redesign

Branch: `feat/roh-wellington-enhancements`. These changes build on `1024a7e`; main is unchanged. The gold/charcoal/cream identity, typography, main-derived split hero, headline/actions, section order, API, navigation/footer and service content remain unchanged.

## Photo/carousel follow-up

The hero now advances every **nine seconds**. Its overlay/buttons are hidden during normal viewing and appear only when a keyboard user focuses the controls. Hover/focus pause, manual operation, reduced-motion behaviour, image optimization and stable framing remain intact. The two finished hero projects are unchanged because the newly shown job photos have unfinished fittings or installation equipment.

The fifth supplied photo matches the existing higher-resolution `bathroom-floor-tiling-feature-strip-wellington.webp` asset. It now has a dedicated portfolio entry (`/portfolio#bathroom-floor-feature-strip`), linked from the homepage project card and Floor gallery. The existing portfolio progress notice and new caption clearly identify it as mid-installation, without inventing a suburb or technical certification.

The subsequently supplied ZIP resolved image access. Three distinct new JPEGs are now stored unchanged in `src/assets/images`: `sage-green-shower-niche-progress.jpg`, `charcoal-shower-floor-progress.jpg` and `botanical-bathroom-tiling-progress.jpg`. Astro generates the optimized display assets. The other two supplied photographs match existing higher-resolution bathroom-floor/feature-strip and white-gloss-shower assets, so they were not duplicated as separate jobs.

The three new views have descriptive portfolio entries (`green-shower-niche`, `charcoal-shower-floor`, `botanical-bathroom-floor`) and existing service/quote links. Green/charcoal images also appear in the Bathroom gallery and replace two homepage progress cards; the botanical room is included in the Floor gallery. Floor-related crops keep the drain and tile cuts visible. All new photographs are explicitly marked as mid-installation: missing fittings, levelling clips and tools have not been removed or concealed to imply completion. No suburb, material certification or new business claim was invented. The botanical surface is described only as a feature wall, without claiming its material.

The hero retains its two genuinely finished project photographs, hidden normal-view controls and nine-second interval. Its layout, heading, actions, optimization and reduced-motion behaviour are unchanged by the ZIP import. No generated or stock substitutes were used.

Build passed (15 pages); internal links/project anchors passed across all 14 regular pages. Desktop/mobile validation covers Home, Portfolio, Floor and Bathroom at 1440px/390px. All eight ZIP-import page/width checks passed with no axe WCAG A/AA violations, broken images or overflow. Internal links and all new project anchors passed across all 14 regular pages. The prior nine-second interval, hover pause, reduced-motion default and keyboard-revealed control checks remain applicable: carousel logic and styling did not change in this photo import. No API, main-branch or production changes.

## Exact files changed

- `src/pages/index.astro`: replace construction hero slides with the existing completed patterned window-seat photograph; retain the completed porcelain ensuite as the first slide. Derive the initial counter from actual slide count. Remove the dormant rating/count/URL constants, conditional rating markup and associated unused styles so there is only one review display source. Timing, controls, reduced motion, original crop/layout, first-image preload and deferred loading are retained. The overlay moves to the top on the window-seat slide so it does not obscure the completed tiles.
- `src/components/GoogleReviewTrust.astro`: one compact Google attribution and “Read our Google reviews” link, sourced from central GBP_URL. No rating, count, stars, quotations, script/widget or review schema is added while verification is unavailable. Add an optional compact treatment.
- `src/components/PageHeader.astro`: use the compact review strip on existing major internal pages; no header/layout restructuring.
- `src/components/TileSuppliers.astro`: retain permission-safe official text links in three balanced desktop cards (stacked on phones); remove inherited shadow/lift/animation from this row. No supplier brand asset was supplied or approved, so no substitute or invented logo was added.
- This handover records the photo audit, unresolved factual/asset requirements and QA.

## Photo audit and final carousel

Only two existing project photographs meet the brief based on their portfolio completion flags and visual inspection. The hero deliberately contains two distinct jobs, not three placeholders or duplicate crops:

1. `ensuite-large-format-porcelain-tiling-wellington.webp` — retained first/eager slide. Existing portfolio describes a completed ensuite and marks `wip: false`; photograph shows the finished shower, basin and fittings without active construction.
2. `patterned-tile-window-seat-wellington.webp` — second/deferred slide. Existing portfolio marks `wip: false`; photograph shows a finished patterned seat/window setting without tools, debris or obvious active construction. Caption: “Completed patterned-tile window seat”. No new location claim.

Excluded from the hero: fluted terracotta splashback, teal shower, white-gloss shower and linear-drain shower (existing portfolio progress flags/unfinished surrounding work); bathroom floor (unfinished surrounding renovation); subway splashback (existing service gallery labels work in progress). Owner portrait and business icon are not separate completed-project evidence.

ROH needs to supply a third high-quality photograph after the entire job and surrounding fittings are finished, ideally a completed kitchen splashback to add service variety. Existing progress photos remain honestly labelled in the portfolio/service content; they are not presented as finished hero projects.

## Google, supplier and experience evidence

The exact existing GBP URL remains `https://share.google/mHv0Lpg1JjCY6DuAE`. A fresh request was blocked by outbound network policy (CONNECT 403), so a current 5.0 rating cannot be verified. The strip therefore says “Google · Read our Google reviews”, with no numerical or implied five-star claim. Owner-supplied current evidence for this exact profile is still needed before displaying a rating. No Shapo configuration or authorised integration exists in the supplied repository/context.

Supplier URLs remain the official addresses supplied in the brief: Tilemax (`https://tilemax.co.nz/`), Tile Space (`https://tiles.co.nz/`) and Tile Trends (`https://tiletrends.co.nz/`). No approved logo files, logo-use permissions or confirmed sourcing relationships are present. Supply official logo assets with permission and confirm which businesses ROH uses before replacing these text references or changing the heading to “Suppliers We Work With”. No endorsement/accreditation is implied.

No verified business evidence establishes an exact ten-year experience duration. Existing nonnumeric experience wording is retained, with the personal owner introduction on About. Confirm the actual years before adding “Over 10 years”. No new qualifications, team/office claims, response guarantees or project suburbs were introduced.

## Validation and preview limitations

Production build passed with 15 pages. Existing three Node enquiry tests passed with no skips, using mocked provider calls; no real enquiry sent. Source comparison confirms no changes to API/client delivery code, BaseLayout/header/footer, global stylesheet, central business data, service-page content, Astro configuration, package manifest or lockfile in this refinement.

The supplied Vercel preview URL was also blocked by outbound policy (CONNECT 403). Its remote rendering/deployment state therefore cannot be claimed as inspected. Desktop/mobile QA runs against the actual updated branch locally in Chromium at 1440px and 390px; screenshot/result artifacts are in `/workspace/roh-review/refinement-*`. All 28 page/width scans completed with zero axe WCAG A/AA violations, no broken images or horizontal overflow. H1/canonical/title checks passed; carousel timing, keyboard/manual controls, hover pause, reduced motion, stable frame, mobile menu/Escape, mocked form success/fallback and separate tracking events passed. A targeted second-slide retest at both widths also passed, including supplier/GBP URL assertions. There is no standalone typecheck script in package.json; Astro build compiles the site.

No production deployment, merge, route change, canonical change, sitemap configuration change or schema change was performed. Publishing this feature branch can trigger a Vercel Preview through the existing integration; production remains untouched.

## Next technical SEO phase

Preserve established no-trailing-slash canonicals and verify production slash/redirect behaviour before aligning sitemap URLs (the existing directory-format build still emits slash-style sitemap entries). Review LocalBusiness/Service/Breadcrumb/FAQ accuracy and existing NZS 4858/PS3 claims separately. Do not add unsupported review/AggregateRating schema. Search Console changes, indexing submissions and production publication remain deferred. Live enquiry inbox delivery remains unverified; no credentials or live email tests were requested in this refinement.
