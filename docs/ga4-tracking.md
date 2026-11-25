# ROH Tiling GA4 and GTM handover

GA4 property `562296382`, web stream `16266534849`, measurement ID `G-2PHKFXFMS7`, GTM container `GTM-MW3J6S4L`.

## Setup

GTM replaces the standalone Google tag. The existing consent choice still controls analytics and the website only requests GTM after acceptance. Advertising consent remains denied. The GTM base tag sends one page view on each full navigation. Its customer-provided data collection is disabled. Preview pages load GTM only in a tab started with the Tag Assistant debug parameter and with analytics consent.

The GA4 stream points to `https://www.rohtiling.co.nz`. The site gives GTM the authored page path and only the referring site's origin. It discards fragments and query parameters apart from the explicit Google Business Profile campaign tuple, normalised to `google / organic / gbp`. Use that tuple in the verified Business Profile website link before reporting attributable GBP activity. Existing untagged Google traffic has no reliable GBP split.

| Event | Source | Reporting |
| --- | --- | --- |
| `page_view` | One base tag per full page after analytics consent | Sessions and navigation |
| `generate_lead` | `/api/enquiry` returns HTTP success and `ok: true`, with the honeypot empty | GA4 key event. Use `form_type` of `quote` or `contact`. Provider acceptance confirms the site submission. |
| `phone_click` | Visitor selects a `tel:` link | Call intent |
| `email_click` | Visitor selects a `mailto:` link | Email intent |

Failed validation, delivery errors, malformed responses, honeypot activity and automatic mail client fallback send no lead event. The in-progress submission guard prevents a second simultaneous send. GA4 event data contains controlled event names and form types, without enquiry fields or contact link destinations.

## Review and verification

On 25 November 2026 NZDT, the existing direct Google tag sent a page view in Tag Assistant and GA4 Realtime. The website draft's seven analytics assertions passed with mocked browser objects. Production GTM, a successful enquiry, an inbox receipt and live GBP attribution require verification.

1. Review the GTM workspace in Preview against the Vercel preview. Verify accepted, rejected and revoked consent, one page view per navigation, separately recorded phone and email links, and payloads on desktop and mobile. Exercise both form success and failure with a mocked backend. Use a real test enquiry only with approval and identify it as a test.
2. With production approval, publish the GTM version and merge this draft. Verify the website deploy and rerun Tag Assistant, DebugView and Realtime checks. Confirm one lead per accepted enquiry and zero leads for failures. Check production requests for private URLs and form/customer data.
3. If a production check fails, restore the last verified website deployment and GTM version using the approved rollback. Independently repeat the prior live-tag and enquiry checks after rollback.
4. For monthly reporting use organic session attribution, `generate_lead` counts, the session key-event rate for `generate_lead`, and separate phone and email event counts. Apply the verified GBP campaign filter for the GBP subset. Leave unreliable or unavailable measures blank.
