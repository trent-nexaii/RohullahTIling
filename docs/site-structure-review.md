# Click-through structure implementation

Branch: `feat/roh-tiling-site-structure`, based on the existing preview revision `beb09a9`. This is the proposed PR description and design decision, written before layout edits. Main stays unchanged.

## Problem and intended result

The supplied Markdown brief and interactive HTML map describe the existing page hierarchy. They do not require another website, regional landing pages or publication of the planning diagram. A person arriving directly on Bathroom, Kitchen or Floor should see relevant work, understand what affects a quote, and contact Roh without returning to Home. Portfolio should let them find the right kind of work and enquire from that project. Service Areas should connect accurate coverage with the work offered.

The earlier preview already fixes the canonical/sitemap mismatch, shortens Services and Service Areas, consolidates Contact, and replaces the About comparison. Those changes are preserved and checked first. The user has approved those copy changes and confirmed the 24-hour reply. Opening hours remain unconfirmed. The user says the supporting services are offered, but asks to leave their scope pending confirmation, especially the electrical responsibilities for underfloor heating. Their existing pages stay; no new qualification or installation claim is added.

## Visual plan

Keep the current ROH logo, repository photographs and local DM Sans. Tokens: paper `#ffffff`, neutral surface `#f1f2ee`, text `#202522`, body `#303632`, gold action `#d4a017`, accessible gold link `#785806`. Display and body share one face, with large page titles and readable, left-aligned notes. No new font, library, image source or paid dependency.

Two possible compositions were considered:

```text
A: repeat an overview on every service
[page heading] [intro]
[six benefits] [steps] [gallery] [quote]

B: connect the specific job with existing evidence
Bathroom: [offer / photograph] [real bathrooms] [scope / quote inputs]
Kitchen:  [splashback scope / corner detail] [quote inputs / real work]
Floor:    [floor scope / real work] [substrate / quote inputs]
Portfolio:[service filter] [photograph / original notes / enquiry]
Areas:    [coverage jumps] [existing places / choose service]
```

Choose B. The business-specific move is to bring the documented stack-bond shower and fluted corner return into the decision path, with their original workmanship notes and work-in-progress labels. Do not invent suburbs to satisfy the diagram. Generic template sequences, repeated animated entrances and decorative link arrows do not help this path. Keep one quiet image entrance and feedback for actions; the rest of the content should simply be readable.

## Implementation boundaries

- Keep all 14 public routes, existing titles/H1s, real project notes, business identity, delivery destination and URL convention.
- Prioritise Bathroom, Kitchen and Floor in Services; leave the three existing supporting routes available without broadening their claims.
- Keep Porirua, Wellington City, Hutt Valley and Kāpiti as sections of `/service-areas`. No new regional URLs or implied local project proof.
- Use service categories for Portfolio filtering; suburb filtering needs confirmed job locations and is deliberately deferred.
- Pass an allowlisted service context to the existing single enquiry form without adding required fields or changing its transport.
- Preserve existing technical/compliance text for owner review and record exact remaining claims in the handoff. No real enquiry is sent.

## Technical baseline

The baseline production build and `scripts/verify-build.mjs` pass: 15 HTML pages including 404, 14 sitemap entries, 511 internal links and 58 images. Astro 6 uses static file output with `trailingSlash: never`; Vercel uses `cleanUrls: true` and `trailingSlash: false`. Canonicals, sitemap and robots agree locally. Production inspection was attempted read-only, but the environment proxy returned 403 for the production hostname. Live audit observations supplied in the brief remain dated evidence, not newly verified facts. Vercel edge redirects require a hosted check; local Astro preview does not prove edge behavior.

## Implemented page map

| Page / task | Result |
| --- | --- |
| Home | Existing offer, owner proof, genuine photographs and six service links preserved. Shared motion and decorative link suffixes simplified. |
| Services | Short descriptions and direct routes; Bathroom, Kitchen and Floor first, with existing supporting services in their own group. |
| Bathroom | Finished-work image, work/scope/quote jumps, real bathroom gallery brought forward, and job-specific quote guidance. Existing detailed process, compliance paragraphs and FAQ remain. |
| Kitchen | Introduction uses the actual fluted-corner detail; quote guidance covers surfaces, fittings, returns and layout; gallery photos link to matching entries. |
| Floor | Surface/preparation guidance, actual floor/feature photographs brought forward and quote inputs for substrate, transitions and tile format. |
| Supporting services | Existing URLs and substantive copy retained at the user's request. Electrical responsibilities remain an owner-confirmation item. |
| Service Areas | Existing coverage and all places retained, with native in-page jumps and links to service choices. Regional labels are sections, without new location pages. |
| Portfolio | Keyboard-operable service filters; original six IDs and descriptions preserved; two existing gallery photographs now have factual entries; each entry links to its matching service and a contextual enquiry. No job suburbs added. |
| About | Existing approved owner-operator copy preserved; explicit links to Services and project notes added. |
| Contact | One form; name, email and message required; phone/location optional. Allowlisted service context is displayed and included in the existing delivery payload, with a way to clear it. Unknown values are ignored. |

The portfolio count says “photos shown”; it does not claim eight separate jobs. The two added entries use existing `bathroom-floor-tiling-feature-strip-wellington.webp` and `kitchen-splashback-subway-tile-wellington.webp`. Their captions describe visible work and retain work-in-progress status. No suburbs, dates, prices or credentials were inferred.

A form interaction issue found in the browser was fixed: a stale error now clears as the visitor edits the input, preventing its removal on blur from moving the submit button during a click. The enquiry delivery endpoint, destination, honeypot, optional fields and mailto fallback are preserved.

## Validation actually completed

- Production build: `npm run build` passes with 15 HTML pages, including 404.
- `node scripts/verify-build.mjs`: 14 sitemap URLs, 552 internal links (including hash targets and assets), 60 images with alt/intrinsic dimensions, one enquiry form, consistent canonicals/OG URLs and the existing robots sitemap-index reference.
- All 15 rendered titles, H1s and meta descriptions match the baseline. Original six portfolio IDs/descriptions, all three core FAQ schema blocks and bathroom compliance/PS3 paragraphs were checked against the branch base. The delivery handler is byte-for-byte unchanged.
- Chromium: Services → Bathroom → actual portfolio entry → contextual Contact works. Required fields, invalid email/phone, optional empty phone, one intercepted dummy success, the 24-hour message and reset pass. The browser intercepted `/api/enquiry`; no real enquiry or email was sent. Real hosted email delivery is unverified.
- Portfolio filters work from the keyboard, show 4 bathroom / 2 kitchen / 2 floor-feature entries, maintain shareable query context and reveal the correct entry when a project hash conflicts with a filter. Native hash navigation, cleared filters, unknown service input and clearing enquiry context pass.
- All 14 public routes render at 1440, 768 and 390px with HTTP 200, one H1, visible content, loaded local images, correct click-to-call and no horizontal overflow. Mobile menu Enter/Escape/focus return and regional jump → service navigation pass. No JavaScript exceptions were observed.
- Without JavaScript, all eight work photographs and the native form/mailto fallback remain available. Reduced-motion content remains visible.
- Desktop/mobile screenshots for Services, the three core services, Portfolio, Service Areas and Contact were opened and reviewed, including each new quote section. A final mobile refinement brings each service photograph ahead of its longer explanatory copy, so actual work appears in the first phone screen. The existing visual system and brand remain.
- `node --check public/js/main.js` and `git diff --check` pass. No application dependency or package/lockfile changes. This repository has no separate lint, type-check or test-suite scripts; none is claimed to have run.

Browser sources, results and screenshots for this cloud session are under `/workspace/roh-structure-review/`. The final layout pass follows the functional browser pass; only photo order, factual caption wording and the photo-count label were refined afterward.

## Design critique

The original core-service first screens delayed real work behind generic assurances, and the old reveal effect temporarily washed out body copy. Portfolio provided a long sequence without a service choice or project-level enquiry. The revised first screens show an explicit quote action and meaningful section jumps; phone layouts show the job photograph before longer prose. The quote sections ask for useful information rather than repeating benefit cards. Portfolio filtering and enquiry context are real interactions tied to Roh's existing work.

The original trade-detail pages still contain lengthy material/process/FAQ copy and unconfirmed technical assertions. This brief calls for a narrow structure pass and explicit claim review; it does not authorise manufacturing proof or treating those assertions as confirmed. A future owner-approved copy pass can simplify the remaining detail further. No subjective skill score is presented as an independent design verdict.

## Owner confirmation before production review

The user confirmed a reply within 24 hours. Opening hours remain flagged. The latest reply says the supporting services are offered, while asking to leave their scope pending confirmation because Roh is a tiler, not an electrician. Existing wording is retained for review; no new electrical capability or certification is claimed.

The following exact wording remains relevant:


- `src/data/business.ts` / Contact / footer / LocalBusiness schema: Monday–Friday **8:00 AM – 5:00 PM**; Saturday **Closed**; Sunday **Closed**. Values remain as published pending confirmation; the source comment now says so.
- Bathroom meta description retains **“NZS 4858 compliant.”** The visible waterproofing FAQ and its unchanged FAQ schema also retain the compliance statement below.
- `src/pages/services/bathroom-tiling.astro`: “Waterproofing is not optional in wet areas — it is a legal requirement under the New Zealand Building Code. All bathroom tiling by ROH Tiling includes waterproofing that meets the NZS 4858 standard for wet area membranes.”
- `src/pages/services/bathroom-tiling.astro`: “When your project requires building consent, we provide PS3 producer statements to confirm that waterproofing has been installed in accordance with the manufacturer's specifications and NZS 4858. This documentation is essential for code compliance sign-off in the Wellington region.”
- `src/pages/services/bathroom-tiling.astro`: “Yes, waterproofing is a critical step in every bathroom tiling project. We apply NZS 4858 compliant waterproofing membranes to all wet areas including showers, floors, and around baths. This protects your home from moisture damage and is required by New Zealand building standards.”
- `src/pages/services/kitchen-tiling.astro`: “Quality tiles withstand heat, moisture, stains, and daily wear far better than paint or wallpaper. A professionally tiled splashback will look as good in ten years as it does on day one.”
- `src/pages/services/underfloor-heating.astro`: “Electric underfloor heating in a bathroom typically costs just 5-10 cents per hour to run. Combined with a programmable thermostat, you can schedule heating to coincide with your morning and evening routines.”
- `src/pages/services/underfloor-heating.astro`: “We assess the room, measure the floor area, and plan the heating mat layout. We identify the thermostat location and coordinate with your electrician for the power supply connection.”
- `src/pages/services/underfloor-heating.astro`: “The heating system is electrically tested before tiling to confirm all elements are functioning correctly. Resistance readings are recorded and compared to manufacturer specifications.”
- `src/pages/services/underfloor-heating.astro`: “After tiles and grout have fully cured (typically 7-14 days), the system is commissioned by a registered electrician. The thermostat is programmed and the system is ready to use.”
- `src/pages/portfolio.astro`, linear-drain shower notes: “Membrane and band reinforcement went in to NZS 4858 before any tile was laid.” These original notes remain; no fresh technical verification is implied.
- `src/layouts/BaseLayout.astro`, LocalBusiness description: “waterproofing to NZ Standard”. Additional existing service/Terms assertions are itemised in the earlier [website handoff](website-update-handoff.md#owner-confirmation-required).

The Services hub makes no new NZS/PS3/legal assertion. The earlier comparison on About stays replaced by the approved owner-operator account. The bathroom introduction no longer repeats “protects your home from moisture damage for decades” or “meets New Zealand building standards and exceeds your expectations”; the separate compliance paragraphs above remain verbatim for review. The kitchen introduction no longer uses unconfirmed Thorndon/Petone setting examples. The floor introduction replaces generic “adds lasting value” sales copy with the information needed to discuss the actual job. These removals do not verify any guarantee.

## Deployment and manual follow-up

Only the feature branch may be pushed. The repository already has a Vercel Git integration; this creates a preview without adding services or spend. No merge to main, production deployment, DNS/registrar/domain change, Search Console edit or Google Business Profile change is part of this work.

Vercel's existing `cleanUrls: true` / `trailingSlash: false` configuration is preserved. It expresses the intended permanent no-slash normalisation; this environment cannot verify the hosted edge because the production/preview destinations are blocked by its network policy. Run the existing read-only check against the actual preview from an allowed environment:

```sh
node scripts/verify-preview.mjs https://YOUR-ACTUAL-PREVIEW.vercel.app
```

Check each trailing-slash HTML route for one permanent redirect to its no-slash canonical, preserving queries; also check assets/files and the API remain unaffected. A local Astro 200 and sitemap entry do not prove edge behaviour or indexing.

After a separately approved production release, the operator should remove the stale `/sitemap.xml` Search Console submission if still present, retain/submit `https://www.rohullahtiling.co.nz/sitemap-index.xml`, and inspect Home, Bathroom, Kitchen, Floor and Service Areas. The dated October/3 November snapshots are not a claim that current indexing or rankings have improved. Confirm real hosted email delivery and the owner-review items before release. The exact preview link is supplied with the completed branch delivery.

## Files changed

- `docs/client-website-workflow.md`
- `docs/site-structure-review.md`
- `docs/visual-redesign-review.md`
- `docs/website-update-handoff.md`
- `public/js/main.js`
- `src/components/CTASection.astro`
- `src/components/PageHeader.astro`
- `src/components/QuoteBrief.astro`
- `src/data/business.ts`
- `src/data/services.ts`
- `src/layouts/BaseLayout.astro`
- `src/layouts/ServiceLayout.astro`
- `src/pages/about.astro`
- `src/pages/contact.astro`
- `src/pages/index.astro`
- `src/pages/portfolio.astro`
- `src/pages/service-areas.astro`
- `src/pages/services/bathroom-tiling.astro`
- `src/pages/services/floor-tiling.astro`
- `src/pages/services/index.astro`
- `src/pages/services/kitchen-tiling.astro`
- `src/styles/global.css`
