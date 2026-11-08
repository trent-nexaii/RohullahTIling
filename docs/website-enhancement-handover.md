# ROH Tiling enhancements — side branch from main

## Baseline and isolation

Branch: `feat/roh-wellington-enhancements`. Parent baseline: GitHub `main`, commit `02abbc7191eb8760b0c46690316be5fcd38bc9c8`.

The user explicitly rejected the cream Vercel screenshot as the baseline. All preview-derived homepage components and local fonts have been removed. The shared BaseLayout (header, navigation and footer), global design tokens, typography and homepage hero composition come from main. No redesign branch was merged. Main has not been changed; this branch is not deployed or pushed.

## Implemented

- Main's existing split hero and crop remain; only the photo area gains three-image carousel controls. Crossfade interval is 5.5 seconds, with previous/next/pause, keyboard access, hover/focus/visibility pauses, reduced-motion default and stable intrinsic dimensions. The first photo retains Astro optimization, preload and high priority; other slide URLs are set on demand. The terracotta splashback and teal shower are labelled work in progress. No carousel dependency.
- Homepage retains all original substantial sections and content. Core services and real project evidence now follow the hero/review link; the existing detailed introduction is retained later. A completed ensuite is added to the featured-work cards. Coverage, a small supplier section, personal introduction and final quote action remain easy to find.
- `GoogleReviewTrust.astro` renders a compact link to the existing Google Business Profile on Home and major internal pages. No authenticated review data, Shapo configuration or quotation approval was supplied, so no rating/count, quotations, scripts or review schema were invented.
- `TileSuppliers.astro` uses existing card styling and official Tilemax, Tile Space and Tile Trends text links. Bathroom/Kitchen have small contextual sourcing references. No supplier relationship, logo permission, endorsement or partnership is asserted.
- `PageHeader.astro` retains the main shared structure. Primary Bathroom, Kitchen and Floor headers gain relevant static project images, Wellington H1s and quote actions on a brighter cream split layout. Supporting headers stay text-led with slightly softer overlay, brighter subtitles and a shallower bottom spacing. Progress photos remain labelled. No generic images stand in for waterproofing, repairs or heating evidence.
- Existing service content, FAQs, preparation/process information and galleries are preserved. Bathroom/Kitchen/Floor gain practical quote-planning paragraphs and project/quote links. The Services/Home core cards gain real project photos using the existing component. Portfolio entries gain enquiry links; project descriptions, anchors and service links remain.
- Service Areas retains Porirua relevance, clarifies Wellington City and adds useful Lower Hutt/Upper Hutt enquiry guidance without invented project locations or new suburb routes.
- Prominent repeated sole-trader copy is reduced; unsupported numerical experience is omitted from changed marketing copy. About retains Rohullah's personal introduction and photo.
- Contact keeps existing phone/email destinations, fields, validation and mailto fallback. Confirmed success requires both a successful HTTP response and JSON `ok: true`. Busy/disabled states and in-flight protection prevent repeated concurrent submissions. Unsupported 24-hour response promises are not added to changed messaging.
- `api/enquiry.js` retains its original request/response contract and destinations; adds a 15-second provider timeout and status-only failure logging. No credentials were copied or exposed.
- Separate `roh_enquiry_success` and `roh_click_to_call` events are dispatched on window and pushed to an existing dataLayer if present. Payloads contain form category or page path, never enquiry contents/contact details. Success fires only after API confirmation and excludes honeypot responses. No analytics service or external tracking script is added; configure analytics/consent separately.
- Small contrast fixes darken outline-button text and connect existing mobile call/quote classes to their intended gold/charcoal backgrounds.

## Business confirmation required

- Exact years of hands-on experience before using 10+ years.
- Authenticated Google rating/count, approved quotations and any authorised Shapo configuration.
- Actual supplier relationships/process and logo permissions. Current links are independent references.
- Exact project suburbs, permission and material/installation details beyond the existing repository evidence. No locations were invented. Confirm existing commercial scope and Kāpiti coverage.
- Existing NZS 4858 references, claimed edition/installation requirements, PS3 issuing capability and compliance statements need professional/business confirmation. They remain existing source claims, not newly verified credentials. Confirm heating/electrical testing, registered-electrician responsibilities, commissioning times and manufacturer requirements. No warranty/certification was invented.
- Supply finished kitchen/floor photography and genuine waterproofing, repair or heating evidence. Current progress shots are labelled honestly.

## Technical follow-up — separate final phase

- Main's no-trailing-slash canonicals and route slugs are retained. The Astro directory build still generates slash-style sitemap URLs. Development serves both variants; production redirect behaviour could not be verified because outbound requests to the deployed hosts were blocked. Confirm hosting rules before implementing redirects, accounting for assets and `/api/enquiry`.
- Sitemap/robots source and Astro configuration are unchanged. Normal builds regenerate ignored dist outputs. No indexing submission or production deployment occurred.
- Preserve and review the existing single LocalBusiness entity, Service provider references, BreadcrumbList and FAQ markup. Verify factual claims; do not add duplicate entities or unsupported rating/review schema.
- After review and separately authorised deployment, use current Search Console evidence to reinspect Kitchen, Floor, Services, Service Areas and supporting services. Reinspect updated Home/About/Portfolio/Bathroom pages as appropriate before deciding on indexing requests.
- Live enquiry delivery remains unverified: Astro dev does not serve the Vercel handler, and RESEND_API_KEY is absent in this environment. Configure secrets and a verified sender securely on the actual host, then conduct a live test only with approval. Provider acceptance is not proof of inbox delivery. No real enquiry was sent.

## Validation

Production build passes with 15 pages. Three dependency-free Node enquiry tests pass (no skips), covering validation, honeypot, unconfigured provider, acceptance, rejection and timeout using mocks. JavaScript syntax and diff-whitespace checks pass. Existing service heading/FAQ structures and FAQ JSON-LD are retained; shared BaseLayout, business data, legal pages, Astro configuration, dependencies and lockfile match main byte for byte.

Final browser results and screenshots are under `/workspace/roh-review/main-branch-*`. Validation covers 14 regular routes at 1440px and 390px: single H1, canonicals, unique titles, image loading, horizontal overflow and axe WCAG A/AA checks; plus carousel timing/manual/keyboard/reduced-motion/stability, mobile menu/Escape, mocked form validation/loading/success/fallback, duplicate submission protection and separate tracking events. All 28 page/width scans completed with no reported accessibility violations or broken images; all carousel/menu/form/tracking functional checks passed. Automated scans are not a full accessibility certification. There is no configured standalone typecheck command; Astro build compiles the application.
