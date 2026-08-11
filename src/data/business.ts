/**
 * Single source of truth for the business's name, address and phone.
 *
 * Search engines and directories treat inconsistent NAP details as evidence
 * that two listings are different businesses, so every page pulls these values
 * from here rather than hard-coding them.
 */

export const business = {
  /** Trading name. Used everywhere the business is named. */
  name: 'ROH Tiling',
  /** The person. Named on the About page and as `founder` in schema. */
  owner: 'Rohullah Rassuli',
  /** Registered company name. Footer only, on a single line. */
  registeredName: 'Rohullah Rassuli Tiling Services',
  /** Displayed phone number. Never reformat this. */
  phone: '0210 260 2044',
  /**
   * Dial string. No trunk zero after the country code — `+6402102602044`
   * keeps the national trunk prefix and fails on some dialers.
   */
  phoneLink: 'tel:+642102602044',
  /** E.164 form, for schema. */
  phoneE164: '+642102602044',
  email: 'rohullah@rohullahtiling.co.nz',
  locality: 'Whitby',
  region: 'Porirua',
  /** Written form of the base, used in body copy. */
  base: 'Whitby, Porirua',
  country: 'New Zealand',
  url: 'https://www.rohullahtiling.co.nz',
  yearsExperience: 'over 10 years',
  areaServed: [
    'Wellington City',
    'Porirua',
    'Lower Hutt',
    'Upper Hutt',
    'Kapiti Coast',
  ],
  hours: {
    display: [
      { days: 'Monday to Friday', time: '7:00am to 6:00pm' },
      { days: 'Saturday', time: '8:00am to 2:00pm' },
    ],
    /** schema.org openingHours strings. */
    schema: ['Mo-Fr 07:00-18:00', 'Sa 08:00-14:00'],
  },
  geo: { latitude: -41.1308, longitude: 174.8717 },
} as const;

/** Every service page, in the order they appear in menus and grids. */
export const services = [
  {
    name: 'Bathroom Tiling',
    href: '/services/bathroom-tiling',
    schemaDescription:
      'Bathroom and shower tiling, including waterproofing, floor-to-ceiling wall tiling and tiled shower floors, across the Wellington region.',
  },
  {
    name: 'Kitchen Tiling',
    href: '/services/kitchen-tiling',
    schemaDescription:
      'Kitchen floor tiling and feature walls for homes across the Wellington region.',
  },
  {
    name: 'Splashback Installation',
    href: '/services/splashback-installation',
    schemaDescription:
      'Kitchen and bathroom splashback installation in tile, subway, fluted and mosaic finishes, cut around power points and window reveals.',
  },
  {
    name: 'Floor Tiling',
    href: '/services/floor-tiling',
    schemaDescription:
      'Residential and commercial floor tiling, including large-format porcelain and tiled shower floors laid to fall.',
  },
  {
    name: 'Waterproofing',
    href: '/services/waterproofing',
    schemaDescription:
      'Wet area waterproofing to NZ Building Code E3/AS1 for showers, bathrooms and laundries before tiling.',
  },
  {
    name: 'Commercial Tiling',
    href: '/services/commercial-tiling',
    schemaDescription:
      'Commercial tiling and fitout work, including changing rooms, amenities and large floor areas, for Wellington businesses.',
  },
  {
    name: 'Underfloor Heating',
    href: '/services/underfloor-heating',
    schemaDescription:
      'Electric underfloor heating installed beneath tiles in bathrooms, kitchens and living areas.',
  },
  {
    name: 'Tile Repairs',
    href: '/services/tile-repairs',
    schemaDescription:
      'Cracked tile replacement, re-grouting and re-siliconing for homes and businesses across Wellington.',
  },
] as const;
