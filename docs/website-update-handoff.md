# ROH Tiling website update — branch review

This document records the initial scoped implementation. See [site-structure-review.md](site-structure-review.md) for the current click-through structure work and validation, and [visual-redesign-review.md](visual-redesign-review.md) for the earlier visual pass. The owner-confirmation items and deployment follow-up still apply.

Branch: `feat/roh-tiling-vercel-update`. No merge or production deployment is authorised by this change.

## Proposed PR description and design decision (recorded before layout edits)

Visitors arriving on Services need to choose the right trade work, see evidence of it, and contact Roh. The repository contains real on-site photographs, detailed portfolio notes and an owner-operator identity. The existing six-service menu helps, but long repeated explanations, icon cards and unconfirmed compliance claims obscure the choice. Keep the approved gold/charcoal colours, Playfair Display/DM Sans, logo, titles and H1s. Replace the hub's card grid and repeated prose with a short service list beside the actual fluted-tile corner-return photograph, linked to its workmanship notes. That alignment detail is evidence of Roh's work, not generic trade decoration.

Service Areas should answer coverage in one compact directory, retaining the existing named suburbs and grouping, without repeating the six services in each area or claiming undocumented local projects. Contact should have one short quote/enquiry form, preserving its existing delivery destination and fallback. The user approved consolidating the forms and replacing the About comparison; they subsequently confirmed the 24-hour reply promise. Opening hours remain unconfirmed.

Taste Skill is already installed and guides review. This narrow brief and the established client design take precedence over its full-redesign, animation, image-count and house-style prescriptions. No new imagery, new location pages, dependencies or whole-site reskin are required.

## Technical approach

Use Astro's no-slash convention and file-format static output, with Vercel's built-in `cleanUrls: true` and `trailingSlash: false`. Vercel serves `/contact` from `contact.html` and permanently normalises `/contact/` without hand-maintained redirect lists. Canonicals and sitemap entries must match the no-slash routes; `/` remains `/`. Do not rewrite `/api/enquiry` or assets. Keep the robots sitemap-index reference.

Changed files: `astro.config.mjs`, `vercel.json`, `src/layouts/BaseLayout.astro`, `src/pages/services/index.astro`, `src/pages/service-areas.astro`, `src/pages/contact.astro`, `src/pages/about.astro`, `src/styles/global.css`, `scripts/verify-build.mjs`, `scripts/verify-preview.mjs`, and this handoff. The sitemap integration has a small final build hook because version 3.7.2 strips the homepage slash even after its serialize callback; the hook restores only that root entry and is covered by the build verification.

## Owner confirmation required

- `src/data/business.ts` (also visible in Contact/footer and LocalBusiness schema): Monday–Friday **8:00 AM – 5:00 PM**, Saturday **Closed**, Sunday **Closed**. The user confirmed the 24-hour reply promise, but not these opening hours. Values are retained pending confirmation, not newly verified against GBP.
- `src/pages/services/bathroom-tiling.astro`: “Waterproofing is not optional in wet areas — it is a legal requirement under the New Zealand Building Code. All bathroom tiling by ROH Tiling includes waterproofing that meets the NZS 4858 standard for wet area membranes.”
- Same page: “When your project requires building consent, we provide PS3 producer statements to confirm that waterproofing has been installed in accordance with the manufacturer's specifications and NZS 4858. This documentation is essential for code compliance sign-off in the Wellington region.”
- Same page, visible FAQ and FAQ schema: “Yes, waterproofing is a critical step in every bathroom tiling project. We apply NZS 4858 compliant waterproofing membranes to all wet areas including showers, floors, and around baths. This protects your home from moisture damage and is required by New Zealand building standards.” The meta description also says “NZS 4858 compliant.” These are retained for review, not strengthened or verified.
- Original Services introduction: “Our commitment to New Zealand building standards — including NZS 4858 waterproofing compliance — means your tiling investment is protected for years to come.” Original cards: “NZS 4858 compliant workmanship for lasting results.” and “NZS 4858 compliant waterproofing for bathrooms, showers, wet areas, and balconies.” Original final section: “Every project is completed to New Zealand Building Code standards, and we provide PS3 producer statements for waterproofing work when required by your building consent.” These leave the hub as part of removing duplicate detailed copy; this is not a finding that the claims are correct or incorrect.
- Guarantee-like hub wording removed with duplicate prose: “quality workmanship that stands the test of time”, “your tiling investment is protected for years to come”, “no job is too small or too large”. The bathroom/service detail pages still need owner review for scope and durability statements; no new guarantee is introduced.
- Related assertions also remain in Waterproofing (compliance/PS3 section and process), Terms (responsibilities and workmanship), Portfolio (walk-in shower notes/tag), and BaseLayout's business description. Portfolio notes, real photos and work-in-progress labels are deliberately preserved; no job suburb is inferred from filenames.

## Operator follow-up after approval and deployment

- Check the actual Vercel preview/edge behaviour for every HTML route: slash URL → one permanent redirect → no-slash 200, retaining query strings. Check that assets, files and `/api/enquiry` remain unaffected. Local Astro preview is not Vercel's edge redirect engine.
- In Search Console, remove the stale `/sitemap.xml` submission if still present; submit/retain `https://www.rohullahtiling.co.nz/sitemap-index.xml` and inspect Home, bathroom, kitchen, floor and Service Areas after deployment. No Search Console/account/DNS changes were made here. Do not infer indexing or ranking changes from a code build.
- Review the branch before any merge. No hosted preview URL exists unless separately recorded below.

## Validation

Production read-only inspection was attempted but the environment proxy denied the production hostname. Live observations from the supplied brief are dated context, not reverified results. There is no hosted preview URL or linked Vercel project in this checkout; nothing was deployed or pushed.

Passed on the branch:

- `npm run build`: 15 HTML pages (14 public pages plus the custom 404), 75 generated image variants including the hub photo sizes. No new application dependency or lockfile change. The existing unused-import Vite warning is non-fatal.
- `node scripts/verify-build.mjs`: 15 self-referential canonicals/OG URLs, 14 unique sitemap URLs, root slash preserved, 773 internal links (including fragment targets and static files), 62 image elements with alt attributes and intrinsic dimensions, one enquiry form and preserved delivery/honeypot invariants. No missing titles or extra H1s.
- Built Astro preview on port 4323: HTTP 200 for all 14 public routes. Home, Portfolio, core detail pages, `robots.txt`, form handler/client transport and dependency files remain unchanged.
- Chromium at 1440, 768 and 390px: Services, Service Areas, Contact and About were rendered and their screenshots opened. No horizontal overflow or broken local image loads. Photos retain existing responsive sizes and lazy-loading attributes; the new service-hub photo has descriptive alt text and intrinsic dimensions.
- Local browser interaction checks: required name/email/message, invalid email, invalid optional phone, empty optional phone, input focus appearance and tab order, one dummy submission intercepted before the server, reset and the confirmed 24-hour success message. No real enquiry was sent; email delivery is not validated.
- Mobile navigation: Enter opens it, Escape closes it and returns focus to the menu button. Tap-to-call retains `+642102602044`. The mobile call/quote bar's two CSS selectors did not match its existing class names; correcting those restores opaque charcoal/gold backgrounds instead of transparent text over page content. Colours were checked in the browser.
- Reduced-motion checks on the three changed layouts confirm their main content is visible. The Taste inspector's `reduced-hidden` finding includes intentionally closed navigation links; this does not describe hidden page content.
- `git diff --check` and syntax checks for the new `.mjs` verification scripts passed. This repository has no lint, type-check or test-suite scripts; no such suite is claimed to have run.

Vercel uses its built-in 308 slash normalisation (confirmed by inspecting the official `vercel/vercel` routing source). This is configured, **not edge-verified**. After an approved preview is available, run:

```sh
npm run build
node scripts/verify-build.mjs
node scripts/verify-preview.mjs https://YOUR-ACTUAL-PREVIEW.vercel.app
```

The preview script makes read-only GET requests, checks single permanent redirects and query preservation for every sitemap page, and confirms static file paths are not redirected. It has not been run against a hosted preview. It does not submit a form.

### Design review limits and evidence

The existing palette and typography declarations are retained. The browser's `fontsLoaded` measurement was empty, so screenshots show the fallback fonts; Google Maps also remained blank under this environment's network restrictions. Verify both externally loaded integrations on the actual preview. No substitute fonts or invented map/location proof were introduced.

Current-instance screenshots and raw reports are in `/workspace/roh-review/`: `before-services/`, `after-services/`, `after-service-areas/`, `after-contact/`, `after-about/`. The browser smoke-check source/results are also there. These are local review artifacts, not a hosted preview or committed site assets.

Taste Skill source lint and browser inspection ran, but **did not pass the full house-style gate**: the Services inspector reduced from six FAIL categories to four. Resting card shadows and icon-card rows were removed from the hub; retained findings cover the existing shared header gradient, fewer than four pictures, a headline smaller than the skill's redesign threshold, and hidden navigation in its reduced-motion scan. Remaining warnings include the existing cream field/dividers, limited motion and no footage. The Contact source lint also flags inherited card/map shadows, its response-note divider and the focus-ring shadow (a functional focus treatment). These are documented, not suppressed. A full reskin, four-photo quota or extra motion would conflict with the supplied narrow brief.

ROUND 1 (original Services)
Seen in one second: dark heading, then a full-width block of generic prose.
Idea (one sentence): the original service menu is delayed by repeated explanations.
Live thing: six service links and call/quote actions.
Layout words by section: header=centred / intro=prose / services=icon cards / explanation=prose / close=CTA.
Scores: design 6 · usability 6 · creativity 5 · content 6 → overall 5.8.
Caps applied: inspector failures, inherited template devices, too few photographs for the skill rubric.
Top three problems:
1. `before-services/mobile-fold.jpg`: no service choice in the first viewport; remove the long introduction.
2. `before-services/desktop-page-01.jpg`: six identical icon cards with no actual project evidence; replace them with direct service links and the real fluted-corner photograph.
3. `before-services/mobile-page-01.jpg`: repeated explanations and compliance promises lengthen the journey; keep detail on the existing service pages and flag claims here for owner review.

ROUND 2 (final scoped Services)
Seen in one second: the retained Wellington service heading, then service choices beside real work on desktop.
Idea (one sentence): connect the work a visitor needs with the alignment detail Roh actually photographed.
Live thing: direct service navigation, the linked workmanship note and the quote/call paths.
Layout words by section: header=retained / services=list with photograph / next=quote / footer=retained.
Scores: design 6.5 · usability 8 · creativity 6 · content 8 → raw 7.0, capped at 6.0 by the full skill rubric.
Caps applied: retained shared-header findings and picture-count threshold; this is not presented as a full Taste redesign or an award-level score.
Top three limitations:
1. `after-services/mobile-fold.jpg`: the original header takes much of the first screen; the mobile call/quote bar now provides clear actions, but changing the whole header is outside this brief.
2. `after-services/desktop-fold.jpg`: typography is shown with fallback fonts; repeat the visual check with Google Fonts loading on Vercel.
3. `after-services/mobile-page-01.jpg`: the evidence photograph follows the service list on mobile, preserving the decision task before proof. No extra unverified photos or animation were added to raise a rubric score.

No reference direction was dealt: the existing client-specific direction was retained for a scoped update. Only repository photos are used; no stock, generated or newly sourced trade photographs were added. There is no sample content in the delivered pages. The dummy form data existed only inside the intercepted local browser check.
