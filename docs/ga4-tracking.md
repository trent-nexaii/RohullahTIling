# GA4 tracking handover

Measurement ID: `G-2PHKFXFMS7`. Reviewed against main commit `3d9016f05d73bb6ef10ebd76f669f0e42881b70e`.

## Implementation and scope

The repository already contained the correct GA4 ID, an opt-in consent banner, a privacy notice, phone-click tracking and success-only form tracking. Extend that installation; do not paste a second Google tag or add GTM alongside it.

`BaseLayout.astro` includes `/js/analytics.js` once on all public rendered pages, including the 404 page. Astro deliberately uses `is:inline` for the existing unbundled public script. The script creates Google's official asynchronous `gtag.js` tag only after consent, queues the consent defaults/update, `gtag('js', new Date())`, and one `gtag('config', 'G-2PHKFXFMS7', ...)`. Repeat inclusion and repeated opt-in cannot configure it twice. Advertising consent remains denied. Declining/revoking consent suppresses measurement; events before acceptance are not replayed.

The site uses static Astro output and ordinary full-page navigation, with no SPA router or ClientRouter. Each destination initializes exactly one page view after consent. No manual page-view listener is necessary. Preview builds retain the existing analytics exclusion through `VERCEL_ENV=preview` or `SITE_PREVIEW=true`; this is independent of SEO noindex handling.

The config overrides `page_location` with the current origin plus the authored canonical path, and reduces `page_referrer` to its origin. It omits query strings, fragments and unknown request paths; 404s use `/404`. This trades query-based campaign attribution and detailed referring-page reporting for avoiding user-supplied URL data. Canonical tags, SEO metadata, structured data, sitemap and Vercel redirects/headers are unchanged.

## Events

| Event | Trigger | Parameters | Meaning |
| --- | --- | --- | --- |
| `generate_lead` | `/api/enquiry` returns HTTP success and `{ ok: true }`, with an empty honeypot | `form_type`: `quote` or `contact`; `page_path` | Email provider accepted the form submission; not proof of inbox delivery or a qualified lead |
| `click_to_call` | A `tel:` anchor is clicked | `engagement_type`: `phone_link`; `page_path` | Call attempt only |
| `email_click` | A `mailto:` anchor is clicked | `engagement_type`: `email_link`; `page_path` | Email-link click only |

Both contact forms already prevent concurrent submissions with `data-submitting` and a disabled submit button. Keep that guard. Validation failures, HTTP errors, malformed responses, network failures, mailto fallback and honeypot responses do not generate leads. Programmatically opening the fallback email app does not produce an email-link event; clicking its visible email link does. Delegated click handling includes links added in success/fallback messages and preserves normal link behaviour. Analytics exceptions cannot turn a successful enquiry into a fallback email.

No form field values, names, email addresses, phone numbers, link destinations, email subject/body or message contents are sent by these events. Existing `roh_enquiry_success` and `roh_click_to_call` custom browser events remain available; there is also a `roh_email_click` hook. These hooks do not separately push GA events into the data layer.

## Verification

- `npm ci` completed. No runtime dependency changes.
- `node --check public/js/analytics.js` and `node --check public/js/main.js` passed. There is no configured lint command.
- `npm test`: all eight tests passed, covering consent, one-time tag/config initialization, event parameter allowlists, URL privacy, 404 paths, blocked storage, revocation and the existing API contract with mocked email-provider responses.
- `npm run build` and `npm run check:seo` passed. Astro reports an existing unused-import warning from its internal assets dependency.
- A preview build and `node scripts/verify-seo.mjs --preview` passed; every preview HTML file was checked for analytics exclusion. Rebuilt production output afterward.
- Astro diagnostics, using `@astrojs/check` and TypeScript installed outside the repository: 33 files, zero errors and zero warnings. The project has no separate configured type-check command.
- Headless Chromium checks use the built production site, replace the Google tag response with an empty script, block other external traffic, and mock `/api/enquiry`. They cover all 15 rendered pages, navigation, phone/email clicks, both forms, rapid duplicate submits, error/fallback/honeypot paths, consent and a throwing analytics implementation. No live enquiry or GA event is sent by these checks.
- Repository inspection found one GA4 implementation and no GTM or competing tracker. GA4 property settings and Vercel dashboard-level injections have not been inspected.

Builds in the managed environment used `ASTRO_TELEMETRY_DISABLED=1` to avoid writing Astro's telemetry preferences outside the workspace.

## Review and live verification

This change requires review before merging to main or deploying production. It does not change GA4 property settings or mark any event as a key event.

After an approved production deployment:

1. In GA4 Admin → Data streams → the website stream, verify measurement ID `G-2PHKFXFMS7` and the production website URL. Review any connected Google tags, GTM containers, event creation rules and Vercel-injected scripts for a second config or duplicate `generate_lead` mapping.
2. Review Enhanced measurement. Disable automatic **Form interactions** so `form_submit` cannot be mistaken for a successful lead. Review automatic outbound clicks, downloads and site-search collection for private URLs or form metadata; disable those automatic features if they would collect customer data. The repository's manual contact events omit link URLs and form values, but cannot audit remote stream settings. Confirm automatic user-provided-data collection remains off and configure GA4 data redaction for email addresses and sensitive query parameters as an additional safeguard.
3. Use Tag Assistant/GA Debugger on the approved production release, accept analytics, and inspect DebugView and Realtime. Expect one initial `page_view`, then one per full-page navigation. Verify only one Google tag request/config and no private URL parameters. Preview deployments intentionally do not run GA4.
4. Click a telephone and email link. Expect one `click_to_call` or `email_click` per click. Neither confirms that a conversation/enquiry occurred.
5. Verify `generate_lead` with a genuine, authorized successful enquiry, or observe the next genuine customer enquiry. Do not submit fabricated enquiries to test production. Check the event occurs once after success, includes the right `form_type`, and never occurs on validation failures, errors or fallback. Local browser tests cover those cases with mocks only.
6. Mark `generate_lead` as a GA4 key event if the reporting owner wants form leads counted as conversions. Keep call attempts/email clicks separate from qualified-lead reporting. Optionally register `form_type` as an event-scoped custom dimension for quote/contact breakdowns. Confirm results in Realtime and later standard reports; connect/use the property in Nexaii's monthly reporting after collection is verified.

Live GA4 receipt, account-side settings, email inbox delivery and production deployment are not verified by local testing.
