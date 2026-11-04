# ROH Tiling — craft redesign review

Feature branch: `feat/roh-tiling-craft-redesign`. Production/main is outside this release.

## Evidence and design plan (before implementation)

The supplied 4 November 2026 brief is the implementation specification. The user has separately confirmed a reply within 24 hours. Opening hours, experience, compliance documents, warranties and the electrical scope remain unconfirmed.

I rendered the exact previous feature commit `7db4678` and the original main snapshot `02abbc7` locally at 1440×1000 and 390×844. Screenshots are in `/workspace/roh-brand-review/before`. Main was extracted read-only, never checked out or modified. Its remote Google fonts were substituted with local copies of the same declared families for this comparison. These are reproducible source comparisons, not a fresh live-production audit.

The hosted preview and production hosts are blocked by this environment's outbound proxy (CONNECT 403). This is distinct from the Vercel login observed by the brief's author. Trent has confirmed the existing preview opens publicly; no deployment-protection setting will be silently changed.

Observed problems: the previous feature uses DM Sans for all headings and white/green-grey surfaces, losing the original Playfair/cream/charcoal brand. Its desktop copy and quote sit below much of the opening photograph. Mobile hides the Whitby/base sentence. The original main restores the brand and early action but adds gradients, badge clutter and a long centred mobile introduction. Both need a more direct relationship between real work and enquiry.

### Tokens

- Charcoal `#1A1A1A`: header/footer, headings. Body `#333333`.
- Cream `#FFF8E7`: primary canvas. White `#FFFFFF`: form surface.
- Brass `#D4A017`: primary action with charcoal labels.
- Deep gold `#946A09`: underlined links on cream; darker `#785806` on white to meet 4.5:1.
- Border `#E0D5C0`; pale gold `#F5DEB3` for quiet selected states; error `#C41E1E`.
- Playfair Display: H1 and selected editorial H2 only. DM Sans: body, navigation, H3, forms.
- Container 1280px, fluid gutters, 8px spacing basis; left-aligned copy, readable 45–65ch paragraphs. No decorative statistics, badges, gradients or stock assets.

### Composition alternatives

A: opening photograph occupies a full-width banner with copy over it. Rejected: text contrast would need a scrim, obscure real tile details and echo the original template.

```
[ROH / navigation / actual phone]
[ photograph + overlay heading ]
[service cards][service cards]
```

B: chosen. A cream introduction and real porcelain ensuite meet on a simple, off-centre vertical join. Keep the heading, Whitby owner-operator sentence, quote and actual phone together; photograph stays unoverlaid. On mobile the actions precede the image. Further down, compare two genuinely different tile details rather than repeating identical cards.

```
[ROH / navigation                  / phone]
[heading + owner + base |                ]
[quote + phone         | ensuite photo  ]
[                      | caption        ]
[selected work: teal shower / fluted corner]
[plain service choices       | owner]
[quote invitation / contact details]
```

Brief review: cream and serif are explicitly ROH's brand, not a new generic aesthetic. The distinctive element is the actual ensuite and its scale, supported by truthful setting-out notes. Removed decorative arrows and repeated labels from the proposed navigation treatment. Service pages will pair their particular job image with practical scope and quote factors, rather than six copies of a marketing-card/steps/FAQ sequence.

## Implementation and QA record

### What changed

- Restored the supplied ROH palette and self-hosted Playfair Display / DM Sans. The opening photograph and owner/base/action share one composition. Removed the giant footer wordmark and the bottom sticky bar; actual phone remains visible in the header at 320px.
- Home keeps its exact H1 and deliberately shortens only its title. All other public H1s and titles are preserved: see [url-audit.md](url-audit.md). Service pages now explain the actual preparation, quote inputs, a relevant project or an honest evidence gap, and 1–3 related services. The directory has six distinct choices.
- Portfolio keeps eight genuine photos, existing anchors and keyboard/query-aware filters. Removed decorative tags and unverified membrane/15-year assertions. No suburb, project grouping, testimonial or completed-job count was invented.
- One contact form: name, preferred phone OR email, suburb, service, description and one optional JPG/PNG/WebP up to 2 MB. It keeps the honeypot and the same configured email destination/provider. Server validation checks contact route, lengths, service, photo size/base64 and signature. Provider acceptance is required before confirmation. A request ID supplies provider idempotency.
- `/thank-you` is always noindex and outside the sitemap. `roh_quote_completed` fires once on confirmed success; direct visits, reloads, spam and failed sends do not generate another completion. `roh_phone_click` is separate and is not a completed call. Events contain no enquiry PII. No analytics vendor/property was installed or changed; these are event hooks, not a connected reporting dashboard.
- Production/preview builds are separate: Vercel preview environment (or `SITE_PREVIEW=true`) produces noindex HTML and disallow robots. A host-qualified noindex header also covers `*.vercel.app`. Production canonicals keep the established host.
- Removed Vercel's automatic trailing-slash 308 and compiled 14 explicit literal 301s (13 non-root public pages + receipt). Assets/API are untouched. Official routing compiler accepts the configuration. The hosted edge and query preservation are still unverified from this environment.
- Removed unconfirmed hours from visible marketing and structured data, and removed unverified experience, every-tile, compliance, certification, installation-cost and warranty promises. Terms now directs people to confirm job-specific terms in the written quote instead of asserting unverified PS3/standard/warranty/payment durations. Owner review is required before any production adoption. Privacy facts now reflect self-hosted fonts, linked maps, photo attachments and temporary receipt storage. Existing retention/security statements remain for owner review.

### Checks completed locally

| Check                         | Result / limits                                                                                                                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Production and preview builds | Pass; 16 HTML routes, 14 canonical sitemap entries, 591 internal links, 39 image elements                                                                                                  |
| Original routes / title / H1  | All 14 preserved; only Home title shortened; one H1/title/canonical per page                                                                                                               |
| Layout                        | 56 checks: 14 public pages × 1440, 768, 390, 320px; no horizontal overflow, missing images or browser exceptions                                                                           |
| Interaction                   | Keyboard skip link/menu/Escape, portfolio filters/deep links, reduced motion, no-JS gallery and email handoff pass                                                                         |
| Form API                      | 11 native Node tests including phone/email, legacy email compatibility, HTML escaping, honeypot, 2 MB boundary, invalid photos/inputs, missing config and provider/network failure         |
| Enquiry journey               | Browser → actual handler → mocked provider → receipt passes for phone/photo and email; failure/spam/bad JSON cause no completion; storage-disabled inline receipt works; no real mail sent |
| Accessibility                 | Axe WCAG A/AA audit of 15 pages × desktop/mobile: zero reported violations; manual focus checks also pass. Automated checks are not a full assistive-technology audit                      |
| Contrast                      | Charcoal/cream 16.44:1; body/cream 11.93; link/cream 4.59; link/white 6.57; button 7.33; error/white 5.91; muted/cream 6.10                                                                |
| Lighthouse mobile, local Home | Performance 99; accessibility 100; best practices 100; SEO 100. FCP 0.8s, LCP 2.3s, CLS 0, TBT 0ms. Lab result, not hosted/field performance or an SEO outcome                             |
| Vercel routing compiler       | `@vercel/routing-utils@6.6.1`: 14 single literal 301s, canonical/root/assets/API unaffected; preview host-only header match passes                                                         |
| Hosted review access          | Trent confirms the existing preview opens the site in a private window. New branch access/build status will be reported separately                                                         |
| Hosted form / edge            | Network policy blocks direct Vercel requests. Provider credentials and actual mailbox receipt not verified; no live test enquiry sent                                                      |

### Screenshots and critique

Workspace artifact: `/workspace/roh-brand-review/index.html` is a standalone screenshot review with source comparisons and all six pages at 1440px and 390px. Full images are also in `/workspace/roh-brand-review/after/`; baseline snapshots are in `before/`. Screenshots were opened and reviewed for Home, Services, Bathroom, Kitchen, Portfolio and Contact at both sizes. Images were decoded before capture so lazy-loaded photos appear in full-page screenshots.

Compared with the previous feature, the quote now appears around y=597 at desktop and y=382 at 390px on Home, beside a legible owner/base description. The actual photograph appears in the mobile first screen, while the header phone remains visible. Compared with the original main snapshot, the new page retains ROH's brand but removes the gradient/badge treatment and keeps the tile detail free of overlaid copy. These are source-build observations, not a claim to have re-audited live production.

Rendered critique: the first pass repeated generic “detail makes the difference” and “local face” headings; replaced them with the concrete setting-out topic and Rohullah's name. The directory's initial mobile photo appeared too late after the six choices; moved real fluted-tile proof into the opening. Underfloor heating and repair pages intentionally avoid borrowed photos that would imply proof of those installations. The portfolio is still limited by single photographs and missing suburb permissions; its evidence requirement is only partially met until Roh supplies those records.

### Reproduce

```sh
npm ci
npm run build
node scripts/verify-build.mjs
node tests/enquiry.test.mjs
SITE_PREVIEW=true npx astro build --outDir /tmp/roh-preview-build
SITE_PREVIEW=true BUILD_DIR=/tmp/roh-preview-build/ node scripts/verify-build.mjs
```

Browser and router checks are optional QA tooling outside application dependencies. Run a local preview on port 4330, provide `PLAYWRIGHT_MODULE` / `CHROMIUM_PATH` to `scripts/verify-browser.mjs` and `ROUTING_MODULE` to `scripts/verify-routing.mjs`. The browser script mocks every outbound provider request. From an environment with hosted access, use `node scripts/verify-preview.mjs <actual-preview-url>` for read-only edge/noindex checks. That script does not submit a form.

### Acceptance status

Passed locally: brand, owner/base clarity, first-screen actions and authentic image, contrast, page hierarchy/links, preserved URLs, no fabricated claims, form success/failure measurement, screenshots, dated GSC interpretation and main/production isolation.

Pending: new hosted build/public access confirmation, edge/query verification, actual delivery configuration/mailbox receipt and owner-approved multi-image/suburb project evidence. This is a review candidate, not an approved production release.

## Supplied search baseline (not freshly queried)

Source: attached brief, pulled 4 November 2026 for `https://www.rohullahtiling.co.nz/`.

| Period           | Clicks | Impressions |   CTR | Average position |
| ---------------- | -----: | ----------: | ----: | ---------------: |
| 7 Sep–4 Oct 2026 |     16 |         418 | 3.83% |            17.68 |
| 5 Oct–1 Nov 2026 |     20 |         316 | 6.33% |            13.87 |

All clicks in both periods came from Home. Bathroom: recent 90 impressions, 0 clicks; submitted/indexed at inspection. Services: discovered, not indexed. Kitchen, floor, waterproofing, heating, repairs and service-areas: unknown to Google at that inspection. Contact: crawled, not indexed. These are dated search observations, not leads, demand estimates, stable rankings or proof of design causation. Page totals and property totals use different aggregation; do not sum page/query rows into property totals. Sitemap summary conflicted with individual URL Inspection: do not claim zero indexed pages.

## Owner/release follow-up

- Supply genuine permitted suburbs and 2–5 related images per project. Current assets do not establish which photos are the same job; no grouping or location will be invented.
- Confirm waterproofing products/process and any documentation, electrical responsibilities for heating, insurance, warranties, years of experience and published hours before stronger claims return.
- Provider credentials, actual mailbox receipt, public preview access and hosted redirect behavior require environment/reviewer access. Do not send a real test enquiry without authorization.
- After an approved live release: verify live canonicals/index state and matched-period GSC; confirm any stale sitemap removal separately. No GSC submission, paid keyword research, DNS or production action is authorized here.
