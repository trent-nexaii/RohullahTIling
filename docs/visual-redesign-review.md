# ROH Tiling visual redesign review

Preview branch: `feat/roh-tiling-vercel-update`. This revision responds to the user's request to remove the remaining generic, AI-looking design. It expands the earlier scoped visual work; the original brief's factual, route and production constraints remain in force.


The first implementation left the shared template and homepage untouched. The user has now explicitly requested removal of the AI-looking traits, so this visual pass replaces that system on the existing preview branch. Main/production remain protected. Routes, canonical work, form destination, confirmed 24-hour reply, real photo notes and unknown owner claims remain as before.

Subject inventory: Rohullah Rassuli; Whitby home base; answers the call and quotes/tiles himself; ten years on the tools in existing copy; finished grey-porcelain ensuite; fluted terracotta internal corner; teal vertical stack-bond shower under a skylight; grey linear-drain shower; patterned window seat; photographs honestly labelled during installation; existing ROH gold logo and dark mark; the confirmed 24-hour reply.

Argument: see the finished work → look closely at setting-out decisions (real photo notes) → meet the person doing it → choose the work → send a location and project description. No generic why-choose-us grid or promises without proof.

Direction: Photographs at uneven sizes, seed 846578896. Existing DM Sans and gold/charcoal are retained; DM Sans now carries the headings too, with pale neutral rather than yellow cream. Typeface is self-hosted under its SIL OFL licence. Idea: Roh's actual corner returns, skylight grout lines and patterned edges become an uneven sequence of full-size site photographs with inspectable workmanship notes. Live interaction: native details under the two featured projects, exposing setting-out notes and links to the detailed portfolio. No invented media or job suburbs.

The first hero ('Two prints in darkness') required most of the screen to remain empty and a 44-character maximum; this conflicts with the preserved 53-character H1 and the need to show enough information and imagery immediately. One redraw produced 'Stepped title, two photographs', which assumes two nine-character words. Keep the direction's wide title/uneven photo geometry but adapt the title block to the existing H1; do not keyword-edit it just to fit a blueprint. About's multi-person pinned portraits were replaced with the provided 'Wide photo, colour tile, facts' alternative because Roh is one owner-operator. No theatrical pinned scenes or external footage: the honest site photographs provide the content.

Copy deck: existing H1; 'I'm Rohullah. I quote the job, prepare the surface and lay every tile myself.'; 'Look at the joins.' with real setting-out notes; 'Rohullah Rassuli. On the tools.' using the existing first-person account; 'What needs tiling?' with the six real services; 'Tell me about your tiling job.' with confirmed 24-hour reply. Inner pages use plain left-aligned titles, service scope as readable lists, unframed images, and a direct contact close.

## What changed

The homepage now leads with the finished porcelain ensuite and Rohullah's own account. Two unequal project photographs expose the actual stack-bond lines and fluted corner return; keyboard-operable native disclosure controls reveal the existing setting-out notes. The owner portrait, practical service list and short quote close complete the page. The same plain navigation, neutral surfaces and typography carry through About, Portfolio, Contact, Services and the detail pages.

Removed the patterned gradient hero, icon-card rows, decorative badges, resting shadows, ornamental rules, generic why-choose-us blocks and repeated marketing paragraphs from Home/About. Shared service cards render as unboxed scope lists. Portfolio keeps its original project descriptions, IDs and work-in-progress notes. Detail-page trade copy remains; it is not newly fact-checked or presented as owner-approved compliance proof.

Contact retains one form and the existing delivery code. The blank external Maps iframe is replaced by an explicit Google Maps link to Whitby, without inventing a street address. Fonts are served locally so the design renders without Google's font endpoint. No application dependency or lockfile changes.

## Assets and content

All displayed trade imagery and brand marks come from the repository. Home uses `ensuite-large-format-porcelain-tiling-wellington.webp`, `shower-tiling-vertical-stack-teal-tile-wellington.webp`, `kitchen-splashback-fluted-terracotta-tile-wellington.webp`, `patterned-tile-window-seat-wellington.webp` and `rohullah-rassuli-tiler-wellington.webp`. Portfolio also retains the existing linear-drain and white-gloss shower images. No stock, generated or bundled example photograph stands in for a client project. No new job suburb, testimonial, customer number or sample project is invented. There is no new external photo/clip credit requirement and no sample site content to replace.

DM Sans is locally hosted from the pinned `@fontsource-variable/dm-sans@5.2.8` distribution. Its SIL Open Font License is included at `public/fonts/OFL-DM-Sans.txt`. Original gold brand assets remain. No real client video is available in the repository; unrelated footage would not prove this owner's work.

## Verification

- `npm run build` passes: 15 HTML pages, including the custom 404.
- `node scripts/verify-build.mjs` passes: 14 sitemap URLs, 511 internal links, 58 image elements and the existing enquiry-form invariants; canonicals, Open Graph URLs, image alt/dimensions and hash targets checked.
- All 15 rendered title/H1 pairs match the previous commit exactly. Existing no-slash URL configuration, schemas, robots and sitemap handling are retained.
- Chromium checks: all 14 public routes return 200 locally; Services, Service Areas, Contact, About, Bathroom Tiling and Portfolio captured at 1440, 768 and 390px with no horizontal overflow or broken images. Screenshots were opened. Focused rechecks confirm two-line H1s, a single service column on phones, Contact content fitting its grid, and portfolio headings within two lines at the tested widths.
- Required form fields, invalid email, invalid optional phone, empty optional phone, tab order/focus, reset and confirmed 24-hour success copy pass. One dummy successful response was intercepted in Chromium; no enquiry was sent and real email delivery is not claimed.
- Keyboard menu open/Escape/focus return, click-to-call number and native project-note disclosures pass. No browser JavaScript exceptions were observed. Reduced-motion inspection keeps the content visible.
- Taste source lint on Home, About, PageHeader, CTASection and global CSS: **0 FAIL, 0 WARN**. Final homepage production-build browser inspection: **0 FAIL, 2 WARN** at 1440, 768 and 390px. This is a homepage house-style result, not a claim that every unchanged detail page passes the full aesthetic rubric.
- `git diff --check` and client JavaScript syntax check pass. No repository type-check or test-suite script exists.

The two remaining homepage warnings are `size-count` and `no-footage`. Fluid display headings and compact navigation/caption sizes produce more computed sizes than the inspector's preferred scale; they retain one face and clear roles. No footage is added because the supplied material has no authentic client clip. Both are recorded rather than suppressed.

| Homepage measurement | Before | Final |
| --- | --- | --- |
| Failing rule categories | 8 | 0 |
| H1 lines at 1440 / 768 / 390 | 3 / 2 / 4 | 2 / 2 / 2 |
| Actually loaded web font | None measured | DM Sans at all widths |
| Decorative gradients | 2 | 0 |
| Resting shadows | 13 | 0 |
| Decorative thin dividers | 3 | 0 |
| Repeated icon cards | 6 | 0 |
| Measured moving elements at 1440 / 768 / 390 | 14 / 9 / 9 | 17 / 17 / 18 |

Current workspace evidence: `/workspace/roh-redesign/before-home/`, `/workspace/roh-redesign/final/`, `/workspace/roh-redesign/pages/`, `browser-results.txt` and `layout-results.txt`. Every screenshot listed by the final homepage inspector was opened, including the lower-page sheets at each width.

## Screenshot critique

These are self-assessment scores, not an independent award or proof of user preference.

ROUND 1
Seen in one second: a trade template with a long serif heading and a small project image.
Idea (one sentence): the genuine project evidence is surrounded by interchangeable trade-site decoration.
Live thing: service links and quote/call controls.
Layout words by section: hero=split / intro=prose / services=icon cards / reasons=cards / owner=split / close=patterned CTA.
Scores: design 5.5 · usability 6 · creativity 4.5 · content 7 → overall 5.6.
Caps applied: inspector failures; three/four-line H1; shadows, gradients and rules.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `before-home/desktop-fold.jpg`: the real work is too small to lead. Enlarge the finished ensuite and connect it directly to Rohullah's account.
2. `before-home/desktop-page-01.jpg`: repeated cards and decorative surfaces dominate. Replace them with unequal project photographs and specific workmanship notes.
3. `before-home/mobile-fold.jpg`: the H1 occupies four lines before a convincing project view. Preserve its wording but widen the measure and compose a complete phone first screen.

ROUND 2
Seen in one second: a finished bathroom and the person who lays the tiles.
Idea (one sentence): Roh's documented joins become the photographic sequence visitors can inspect.
Live thing: native disclosures for the setting-out notes.
Layout words by section: hero=wide title and photograph / work=unequal prints / detail=landscape / owner=portrait / services=list / close=contact.
Scores: design 7 · usability 7 · creativity 6.5 · content 8 → overall 7.0.
Caps applied: inner-page heading wraps remain visible; this interim score describes Home, not an all-site gate pass.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `pages/services/390.jpg` (interim): scoped page CSS keeps the service menu in two narrow columns. Add an explicit single-column phone composition.
2. `pages/services/1440.jpg` and `pages/service-areas/1440.jpg` (interim): long H1s take three lines. Give those original titles a wider measure and appropriate size.
3. `pages/portfolio/768.jpg` (interim): the photograph leaves too little width for project titles and notes. Give the text the wider tablet column; correct Contact's percentage row gap so stacked content keeps its intended spacing.

ROUND 3
Seen in one second: Rohullah's finished porcelain ensuite, with an owner-operated Wellington tiling offer.
Idea (one sentence): the actual fluted corner return, skylit stack bond and patterned edge become a sequence of photographs with inspectable setting-out notes.
Live thing: two keyboard-operable project-note disclosures with portfolio links, usable without JavaScript.
Layout words by section: hero=wide title and photograph / work=unequal prints / detail=landscape / owner=portrait / services=list / close=contact.
Scores: design 7.5 · usability 8 · creativity 6.5 · content 8 → overall 7.5.
Caps applied: the known photographic approach also suits another careful tiler, so creativity stays below 7; no homepage failure cap remains.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `final/desktop-fold.jpg`: the original SEO H1 is longer than an ideal visual headline. Its wording is explicitly preserved; the final two-line composition is the accepted compromise.
2. `final/mobile-page-01.jpg`: genuine installation photos include unfinished adjoining trades. Keep the explicit work-in-progress captions; replace them only when Roh supplies finished photographs of those same projects.
3. `final/desktop-page-02.jpg`: the closing service list is quieter than the photographic sections. It prioritises six direct choices and a clear enquiry route; future improvement should use additional genuine project evidence rather than more decoration.

## Preview and remaining limits

The branch preview alias is https://rohullah-t-iling-git-feat-roh-tilin-96992d-trent-7382s-projects.vercel.app . The Git-connected Vercel project rebuilds this alias when the feature branch is pushed. Main and production are not targets of this revision.

This environment cannot reach the hosted Vercel domain through its network policy. Local rendering and GitHub's Vercel deployment status can be checked; hosted edge redirect behavior and actual email delivery still need the checks described in the original handoff. Opening hours and existing compliance/producer-statement assertions remain flagged there. The user has confirmed the 24-hour response promise.
