export const services = [
  { id: 'bathroom-tiling', name: 'Bathroom tiling', primary: true, description: 'Shower walls, bathroom floors and floor-to-ceiling tiling. Explore layouts, tile options and preparation.' },
  { id: 'kitchen-tiling', name: 'Kitchen tiling', primary: true, description: 'Kitchen splashbacks, feature walls and floors, from subway tiles to fluted corner returns.' },
  { id: 'floor-tiling', name: 'Floor tiling', primary: true, description: 'Porcelain, ceramic and natural stone floors for homes and commercial spaces.' },
  { id: 'waterproofing', name: 'Waterproofing', primary: false, description: 'Membrane preparation and installation beneath tiles in showers, bathrooms and other wet areas.' },
  { id: 'tile-repairs', name: 'Tile repairs', primary: false, description: 'Cracked tile replacement, re-grouting and re-siliconing for existing tiled surfaces.' },
  { id: 'underfloor-heating', name: 'Underfloor heating', primary: false, description: 'Electric heating beneath tiled floors, planned alongside the tiling work.' },
] as const;

export type ServiceId = typeof services[number]['id'];
export const servicePath = (id: ServiceId) => `/services/${id}`;
export const quotePath = (id: ServiceId) => `/contact?service=${id}#quote-form`;

export const quoteGuides = {
  'bathroom-tiling': {
    heading: 'What to send for a bathroom quote',
    introduction: 'Start with your suburb and whether this is a shower, an ensuite or a whole bathroom. Share any measurements you already have.',
    factors: [
      ['Surfaces and preparation', 'Which walls and floors need tiling? Are old tiles still in place, and is there any known damage underneath?'],
      ['Tile choice and layout', 'Include the tile size, pattern and any niches, corners or floor-to-ceiling areas you have in mind.'],
      ['Wet-area work and timing', 'Mention the shower layout, other trades involved and your preferred timing. Waterproofing and any documentation need to be discussed for the actual job.'],
    ],
  },
  'kitchen-tiling': {
    heading: 'Planning your splashback or kitchen floor',
    introduction: 'Send your suburb, the surfaces you want tiled and any measurements. Let Roh know whether the cabinetry and benchtop are already installed.',
    factors: [
      ['The area to be tiled', 'A short splashback, full-height wall and kitchen floor involve different amounts of preparation and cutting.'],
      ['Edges, corners and fittings', 'Describe internal corners, window returns, power points and exposed edges. These affect the setting out.'],
      ['Tile and pattern', 'Share the tile size and finish if chosen. Fluted tiles, mosaics and patterned layouts need to be planned around the joins.'],
    ],
  },
  'floor-tiling': {
    heading: 'The floor underneath matters',
    introduction: 'For a floor quote, send the suburb, approximate area and the type of floor underneath. If you are unsure, describe what is there now.',
    factors: [
      ['Existing floor', 'Is it concrete or timber, and what covering is currently in place? Mention uneven areas or visible cracks.'],
      ['Rooms and transitions', 'List the rooms, doorways and adjoining floor finishes. Include any changes in level or access restrictions.'],
      ['Tile format and use', 'Give the tile size and layout if known, and say whether the area is indoors, outdoors or a wet area.'],
    ],
  },
} as const;
