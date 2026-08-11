/**
 * Single source of truth for name, address, phone and hours.
 *
 * These values were duplicated across a dozen templates, which is how the site
 * ended up with two spellings of the phone number, two locations and a
 * placeholder email in production. Import from here rather than retyping.
 */

export const business = {
  name: 'ROH Tiling',
  legalName: 'Rohullah Rassuli Tiling Services',
  founder: 'Rohullah Rassuli',
  url: 'https://www.rohullahtiling.co.nz',

  /** Display format. Never hand-type this elsewhere. */
  phoneDisplay: '0210 260 2044',
  /** E.164, no trunk zero after the country code. */
  phoneHref: 'tel:+642102602044',
  phoneE164: '+642102602044',

  email: 'rohullah@rohullahtiling.co.nz',

  suburb: 'Whitby',
  city: 'Porirua',
  region: 'Wellington',
  country: 'NZ',
  addressLine: 'Whitby, Porirua, New Zealand',

  geo: { latitude: -41.1308, longitude: 174.8717 },

  areaServed: [
    'Wellington City',
    'Porirua',
    'Lower Hutt',
    'Upper Hutt',
    'Kapiti Coast',
  ],

  hours: {
    display: [
      'Monday to Friday: 7:00am to 6:00pm',
      'Saturday: 8:00am to 2:00pm',
      'Sunday: Closed',
    ],
    /** schema.org openingHours strings */
    schema: ['Mo-Fr 07:00-18:00', 'Sa 08:00-14:00'],
  },

  yearsExperience: '10',
} as const;

/**
 * Form POST target.
 *
 * The forms previously posted to "#", so every enquiry was silently discarded.
 * They now do a plain HTML POST and redirect to /contact/thank-you, which works
 * with JavaScript disabled.
 *
 * ACTION REQUIRED: replace the placeholder id below with the real endpoint
 * before this goes live. Any POST-accepting handler that supports a redirect
 * field will do (Formspree, Basin, Web3Forms, or a Vercel function).
 */
export const formEndpoint = 'https://formspree.io/f/REPLACE_WITH_FORM_ID';
export const formRedirectPath = '/contact/thank-you';

export const serviceLinks = [
  { name: 'Bathroom Tiling', href: '/services/bathroom-tiling' },
  { name: 'Kitchen Tiling', href: '/services/kitchen-tiling' },
  { name: 'Splashback Installation', href: '/services/splashback-installation' },
  { name: 'Floor Tiling', href: '/services/floor-tiling' },
  { name: 'Waterproofing', href: '/services/waterproofing' },
  { name: 'Underfloor Heating', href: '/services/underfloor-heating' },
  { name: 'Commercial Tiling', href: '/services/commercial-tiling' },
  { name: 'Tile Repairs', href: '/services/tile-repairs' },
] as const;

/**
 * The one LocalBusiness block for the whole site. Rendered only by BaseLayout
 * so there is never a second copy competing with it.
 *
 * Deliberately carries no aggregateRating or review: the business has no
 * reviews, and marking up ratings that do not exist risks a manual action.
 */
export function localBusinessSchema(siteUrl: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#business`,
    name: business.name,
    legalName: business.legalName,
    description:
      'Wellington tiler specialising in bathrooms, showers, kitchens, splashbacks and floors. Based in Whitby, Porirua.',
    url: siteUrl,
    telephone: business.phoneE164,
    email: business.email,
    image: `${siteUrl}/images/og-image.jpg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: business.suburb,
      addressRegion: business.region,
      addressCountry: business.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    openingHours: business.hours.schema,
    founder: {
      '@type': 'Person',
      name: business.founder,
    },
    areaServed: business.areaServed.map((name) => ({
      '@type': 'Place',
      name,
    })),
    priceRange: '$$',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Tiling Services',
      itemListElement: serviceLinks.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          url: `${siteUrl}${service.href}`,
          provider: { '@id': `${siteUrl}/#business` },
        },
      })),
    },
  });
}
