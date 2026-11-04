export const services = [
  {
    id: "bathroom-tiling",
    name: "Bathroom tiling",
    primary: true,
    description:
      "Shower walls, bathroom floors and floor-to-ceiling tiling. Explore layouts, tile options and preparation.",
  },
  {
    id: "kitchen-tiling",
    name: "Kitchen tiling",
    primary: true,
    description:
      "Kitchen splashbacks, feature walls and floors, from subway tiles to fluted corner returns.",
  },
  {
    id: "floor-tiling",
    name: "Floor tiling",
    primary: true,
    description:
      "Tiled floors for bathrooms, kitchens and living spaces, planned around the existing surface.",
  },
  {
    id: "waterproofing",
    name: "Waterproofing",
    primary: false,
    description:
      "Discuss the wet-area preparation, system and responsibilities for your tiled bathroom.",
  },
  {
    id: "tile-repairs",
    name: "Tile repairs",
    primary: false,
    description:
      "Cracked tile replacement, re-grouting and re-siliconing for existing tiled surfaces.",
  },
  {
    id: "underfloor-heating",
    name: "Underfloor heating",
    primary: false,
    description:
      "Planning a heated tiled floor, including the build-up and the electrician’s role.",
  },
] as const;

export type ServiceId = (typeof services)[number]["id"];
export const servicePath = (id: ServiceId) => `/services/${id}`;
export const quotePath = (id: ServiceId) => `/contact?service=${id}#quote-form`;

export const quoteGuides = {
  waterproofing: {
    heading: "What to discuss for wet-area work",
    introduction:
      "Send your suburb and photographs of the room. Explain whether it is a new shower, a renovation or a suspected leak.",
    factors: [
      [
        "Existing condition",
        "Describe old coverings, known damage and whether the substrate is already exposed.",
      ],
      [
        "Shower and drain",
        "Include the layout, drain position, niches and any plans available.",
      ],
      [
        "Scope and records",
        "Ask about the proposed system, installer responsibilities and job-specific documentation.",
      ],
    ],
  },
  "tile-repairs": {
    heading: "Help Roh assess the repair",
    introduction:
      "Start with your suburb and a short description of the damage. A photograph is helpful; a site assessment may still be needed.",
    factors: [
      [
        "Damage and location",
        "Say which room, how many tiles and whether water or movement is involved.",
      ],
      [
        "Matching material",
        "Mention spare tiles, the tile size and any product details you have.",
      ],
      [
        "Previous work",
        "Describe earlier repairs or leaks so the visible damage can be considered in context.",
      ],
    ],
  },
  "underfloor-heating": {
    heading: "Planning a heated tiled floor",
    introduction:
      "Send your suburb, room dimensions and the existing floor covering. Mention whether a system or electrician has already been chosen.",
    factors: [
      [
        "The room",
        "Include fixed cabinetry and fittings as well as the open floor area.",
      ],
      [
        "The build-up",
        "Say whether it is a new floor or renovation, and describe the substrate and adjacent floor heights.",
      ],
      [
        "Trades and system",
        "Confirm who is supplying, installing, connecting and testing the system before work is agreed.",
      ],
    ],
  },
  "bathroom-tiling": {
    heading: "What to send for a bathroom quote",
    introduction:
      "Start with your suburb and whether this is a shower, an ensuite or a whole bathroom. Share any measurements you already have.",
    factors: [
      [
        "Surfaces and preparation",
        "Which walls and floors need tiling? Are old tiles still in place, and is there any known damage underneath?",
      ],
      [
        "Tile choice and layout",
        "Include the tile size, pattern and any niches, corners or floor-to-ceiling areas you have in mind.",
      ],
      [
        "Wet-area work and timing",
        "Mention the shower layout, other trades involved and your preferred timing. Waterproofing and any documentation need to be discussed for the actual job.",
      ],
    ],
  },
  "kitchen-tiling": {
    heading: "Planning your splashback or kitchen floor",
    introduction:
      "Send your suburb, the surfaces you want tiled and any measurements. Let Roh know whether the cabinetry and benchtop are already installed.",
    factors: [
      [
        "The area to be tiled",
        "A short splashback, full-height wall and kitchen floor involve different amounts of preparation and cutting.",
      ],
      [
        "Edges, corners and fittings",
        "Describe internal corners, window returns, power points and exposed edges. These affect the setting out.",
      ],
      [
        "Tile and pattern",
        "Share the tile size and finish if chosen. Fluted tiles, mosaics and patterned layouts need to be planned around the joins.",
      ],
    ],
  },
  "floor-tiling": {
    heading: "The floor underneath matters",
    introduction:
      "For a floor quote, send the suburb, approximate area and the type of floor underneath. If you are unsure, describe what is there now.",
    factors: [
      [
        "Existing floor",
        "Is it concrete or timber, and what covering is currently in place? Mention uneven areas or visible cracks.",
      ],
      [
        "Rooms and transitions",
        "List the rooms, doorways and adjoining floor finishes. Include any changes in level or access restrictions.",
      ],
      [
        "Tile format and use",
        "Give the tile size and layout if known, and say whether the area is indoors, outdoors or a wet area.",
      ],
    ],
  },
} as const;
