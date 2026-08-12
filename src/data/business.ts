/**
 * ROH Tiling — single source of truth for NAP and brand data.
 *
 * NAP consistency is a ranking signal: name, phone and locality must match
 * the Google Business Profile character for character everywhere they appear.
 * Change them here, not in individual pages.
 */

export const SITE_URL = 'https://www.rohullahtiling.co.nz';

/** Business name. The person is "Rohullah Rassuli"; the business is "ROH Tiling". */
export const BUSINESS_NAME = 'ROH Tiling';
export const OWNER_NAME = 'Rohullah Rassuli';

/** Displayed exactly as shown on the Google Business Profile. */
export const PHONE_DISPLAY = '021 026 02044';
/** E.164 for tel: links and schema. */
export const PHONE_E164 = '+642102602044';

export const EMAIL = 'Rohullah.rassuli@gmail.com';

/**
 * Service-area business — no street address is published anywhere.
 * A fabricated street address does active harm to local ranking.
 */
export const LOCALITY = 'Whitby, Porirua, Wellington';
export const ADDRESS_LOCALITY = 'Whitby';
export const ADDRESS_REGION = 'Wellington';
export const POSTAL_CODE = '5024';

/**
 * Opening hours — must match the Google Business Profile exactly.
 * Hours that disagree between the site and the GBP are a local-ranking
 * inconsistency, so this is the ONLY place they are defined: the visible
 * hours list and the LocalBusiness openingHoursSpecification are both
 * derived from it below.
 *
 * `opens`/`closes` (24h) generate the schema entry. Omit them for a day
 * that is closed, so it is shown to humans but not asserted as open
 * hours to Google.
 *
 * Current values mirror the Google Business Profile: Mon–Fri 8am–5pm,
 * weekends closed. If the weekend offering changes, change it on the GBP
 * first, then mirror it here — never the other way around.
 */
export const HOURS = [
  {
    label: 'Monday – Friday',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    value: '8:00 AM – 5:00 PM',
    opens: '08:00',
    closes: '17:00',
  },
  { label: 'Saturday', days: ['Saturday'], value: 'Closed' },
  { label: 'Sunday', days: ['Sunday'], value: 'Closed' },
];

/** LocalBusiness openingHoursSpecification, derived from HOURS. */
export const OPENING_HOURS_SPECIFICATION = HOURS
  .filter((h) => h.opens && h.closes)
  .map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  }));

export const GBP_URL = 'https://share.google/mHv0Lpg1JjCY6DuAE';
export const INSTAGRAM_URL = 'https://www.instagram.com/rohtiling/';

export const OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;
export const OG_IMAGE_ALT =
  'ROH Tiling — Wellington tiler. Finished ensuite with large-format porcelain wall tiles.';
