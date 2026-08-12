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

export const HOURS = [
  { label: 'Monday – Friday', value: '8:00 AM – 5:00 PM' },
  { label: 'Saturday', value: 'By appointment' },
  { label: 'Sunday', value: 'Closed' },
];

export const GBP_URL = 'https://share.google/mHv0Lpg1JjCY6DuAE';
export const INSTAGRAM_URL = 'https://www.instagram.com/rohtiling/';

export const OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;
export const OG_IMAGE_ALT =
  'ROH Tiling — Wellington tiler. Finished ensuite with large-format porcelain wall tiles.';
