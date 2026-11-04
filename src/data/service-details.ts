import ensuite from "../assets/images/ensuite-large-format-porcelain-tiling-wellington.webp";
import teal from "../assets/images/shower-tiling-vertical-stack-teal-tile-wellington.webp";
import corner from "../assets/images/kitchen-splashback-fluted-terracotta-tile-wellington.webp";
import floor from "../assets/images/bathroom-floor-tiling-feature-strip-wellington.webp";
import walkIn from "../assets/images/walk-in-shower-tiling-linear-drain-wellington.webp";
import subway from "../assets/images/kitchen-splashback-subway-tile-wellington.webp";
import type { ServiceId } from "./services";

export const serviceDetails = {
  "bathroom-tiling": {
    title: "Bathroom Tiling Wellington | ROH Tiling",
    heading: "Bathroom Tiling",
    introduction:
      "Shower walls, bathroom floors and full-height tiling. Talk to Roh about your bathroom, from the surface underneath to the last tile at the doorway.",
    image: ensuite,
    alt: "Completed ROH ensuite with large-format porcelain walls, frameless shower and wall-hung basin",
    caption:
      "A finished porcelain ensuite. See the cuts around the basin and the shower junction.",
    project: "ensuite-large-format-porcelain",
    scopeHeading: "Walls, floors and shower junctions.",
    scope: [
      [
        "Walls and showers",
        "Discuss which surfaces need tiling, the shower layout, niches and exposed edges. Tile size and the starting point affect how cuts meet at corners.",
      ],
      [
        "Floors and junctions",
        "Doorways, changes in level and the drain position all matter. Existing surfaces need assessment before the preparation and tiling scope can be quoted.",
      ],
      [
        "Work beneath the finish",
        "Wet-area preparation and waterproofing need to suit the actual room. Ask Roh to confirm the system, who is doing each part and any documentation before work is agreed.",
      ],
    ],
    proofHeading: "A closer look at the shower layout",
    proofImage: teal,
    proofAlt:
      "Teal vertical stack-bond shower wall tiles and a dark floor with a linear drain, work in progress",
    proofText:
      "Vertical stack-bond joints continue beneath the skylight; the dark floor tiles meet a linear drain. This photograph was taken during installation. It shows the tile layout, not proof of the hidden waterproofing system.",
    proofProject: "teal-stack-bond-shower",
    related: ["waterproofing", "floor-tiling"],
    question: "Can you quote before the old tiles are removed?",
    answer:
      "Send photographs and describe the existing room. The condition underneath may only become clear after removal; ask which preparation is included and how any extra work would be agreed.",
  },
  "kitchen-tiling": {
    title: "Kitchen Tiling & Splashbacks Wellington | ROH Tiling",
    heading: "Kitchen Tiling",
    introduction:
      "Splashbacks, kitchen walls and tiled floors. Start with the benchtop, cabinetry and tile you have in mind, then work through the corners and edges with Roh.",
    image: corner,
    alt: "Fluted terracotta kitchen splashback with ribs aligned across an internal corner during installation",
    caption: "Fluted terracotta at a corner return. Work in progress.",
    project: "fluted-terracotta-splashback",
    scopeHeading: "Where the tile meets the kitchen.",
    scope: [
      [
        "Splashback extent",
        "A short run above the benchtop and a full-height wall need different preparation and quantities. Include the cooker area, windows and any open shelving in your measurements.",
      ],
      [
        "Corners and exposed edges",
        "Ribbed, patterned and subway tiles each meet a return differently. Share the tile size so the setting out and visible edge finish can be discussed.",
      ],
      [
        "Fittings and timing",
        "Say whether the benchtop and cabinetry are fitted. Power points and plumbing affect the cuts; any electrical or plumbing alterations need the appropriate trade.",
      ],
    ],
    proofHeading: "Courses carried around the windows",
    proofImage: subway,
    proofAlt:
      "White subway kitchen splashback tiles running around windows during installation",
    proofText:
      "The horizontal courses continue around the corner and across the window returns. The surrounding fittings were still being completed when this photograph was taken.",
    proofProject: "subway-splashback",
    related: ["floor-tiling", "tile-repairs"],
    question: "Do I need to choose tiles before asking for a quote?",
    answer:
      "You can enquire before choosing. A tile size, finish or reference photograph helps with the discussion; confirm the final tile and layout before the scope and price are agreed.",
  },
  "floor-tiling": {
    title: "Floor Tiling Wellington | ROH Tiling",
    heading: "Floor Tiling",
    introduction:
      "Tiled floors for bathrooms, kitchens and living spaces. Tell Roh what is underfoot now and how the new tiles will meet the adjoining rooms.",
    image: floor,
    alt: "Stone-look porcelain floor and wall tiles with a patterned feature strip during installation",
    caption:
      "Stone-look floor with a patterned feature strip. Work in progress.",
    project: "stone-look-floor-feature",
    scopeHeading: "Start with what is underneath.",
    scope: [
      [
        "The existing floor",
        "Concrete, timber, old adhesive and existing coverings call for different preparation. Describe uneven areas, cracks or movement so they can be assessed.",
      ],
      [
        "Tile size and set-out",
        "Large-format, timber-look and patterned tiles create different cuts and joint layouts. Room shape and the starting line affect the finished pattern.",
      ],
      [
        "Levels and transitions",
        "Door clearances, adjoining flooring and any heating build-up need to be planned together. Include every room and doorway in the enquiry, not just the open floor area.",
      ],
    ],
    proofHeading: "Pattern resolved at the edges",
    proofImage: null,
    proofAlt: "",
    proofText:
      "The patterned window-seat project shows another setting-out problem: how a repeating pattern meets visible edges. It is a feature-tiling example, not a photograph of a completed floor.",
    proofProject: "patterned-window-seat",
    related: ["underfloor-heating", "bathroom-tiling", "tile-repairs"],
    question: "Can new tiles go over the existing floor?",
    answer:
      "That depends on its condition, stability and the finished height. Send a photograph and describe the covering; Roh can discuss what needs inspection before quoting preparation.",
  },
  waterproofing: {
    title: "Waterproofing Wellington | ROH Tiling",
    heading: "Waterproofing",
    introduction:
      "Planning the wet-area work beneath a tiled shower or bathroom. Discuss the surface, drain and full waterproofing scope before the tiles cover it.",
    image: walkIn,
    alt: "Tiled shower hob and linear drain during installation; the waterproofing layer is not visible",
    caption:
      "Shower tiling in progress. This photograph does not verify the hidden membrane.",
    project: "walk-in-shower-linear-drain",
    scopeHeading: "Agree the wet-area scope before work starts.",
    scope: [
      [
        "Surfaces and junctions",
        "Identify the shower, floor, wall junctions and any penetrations. Existing damage or a changed layout may affect the preparation required.",
      ],
      [
        "System and responsibilities",
        "Ask which waterproofing system is proposed, who will install it and how its requirements fit the substrate and shower design. Confirm the scope with Roh for your job.",
      ],
      [
        "Records and other trades",
        "Discuss inspection, documentation and any council or project requirements before work is booked. No compliance certificate or producer statement is promised by this page.",
      ],
    ],
    proofHeading: "The finish is only the visible layer",
    proofImage: null,
    proofAlt: "",
    proofText:
      "The portfolio shows the tiled hob, drain and floor layout. Product records, preparation photographs and job-specific documentation are needed to establish what is underneath; ask Roh for the evidence relevant to your job.",
    proofProject: "walk-in-shower-linear-drain",
    related: ["bathroom-tiling", "tile-repairs"],
    question: "Does new grout fix a leaking shower?",
    answer:
      "A leak needs assessment. Replacing grout or silicone alone does not establish that the waterproofing underneath is sound. Describe where the water appears and any known damage when you enquire.",
  },
  "tile-repairs": {
    title: "Tile Repair & Replacement Wellington | ROH Tiling",
    heading: "Tile Repairs",
    introduction:
      "A cracked tile, worn grout or a joint that needs attention. Send a close-up and a wider photograph so Roh can discuss the repair and whether the cause needs further assessment.",
    image: null,
    alt: "",
    caption: "",
    project: null,
    scopeHeading: "A repair starts with the cause.",
    scope: [
      [
        "Cracked or loose tiles",
        "Say where the damage is, how many tiles are affected and whether there is movement or moisture. Replacing the visible tile may not resolve the cause underneath.",
      ],
      [
        "Grout and silicone",
        "Describe worn, missing or stained joints and any previous repairs. Wet-area symptoms need assessment before a cosmetic repair is agreed.",
      ],
      [
        "Matching the existing tile",
        "A spare tile, product name, size and thickness help. An exact match may not be available; discuss the replacement and likely visual differences first.",
      ],
    ],
    proofHeading: "Show the damage in context",
    proofImage: null,
    proofAlt: "",
    proofText:
      "A close-up shows the joint or crack; a wider view shows its position in the room. The current portfolio has tiling examples, but no verified before-and-after repair case study is available yet.",
    proofProject: null,
    related: ["bathroom-tiling", "waterproofing"],
    question: "Can one tile be replaced?",
    answer:
      "Sometimes, depending on the surrounding tiles, the substrate and access. Include any spare tiles in your enquiry. In a wet area, removing a tile can affect the waterproofing and needs a job-specific assessment.",
  },
  "underfloor-heating": {
    title: "Underfloor Heating Wellington | ROH Tiling",
    heading: "Underfloor Heating",
    introduction:
      "Thinking about warmth beneath a tiled floor? Discuss the floor build-up and tiling with Roh before choosing a heating system or booking the work.",
    image: null,
    alt: "",
    caption: "",
    project: null,
    scopeHeading: "Plan the heating and tiling together.",
    scope: [
      [
        "Floor area and layout",
        "Share room dimensions and fixed furniture positions. The heated area and the total tiled area may be different.",
      ],
      [
        "Build-up and floor levels",
        "The existing substrate, insulation, heating system and tile finish all affect the finished height. Doorways and adjacent floors need to be considered.",
      ],
      [
        "Electrical work",
        "Roh is a tiler. Electrical design, connection and certification need an appropriately qualified electrician. Confirm who supplies, lays and tests the chosen system before agreeing a job; Roh’s installation role is still to be confirmed.",
      ],
    ],
    proofHeading: "Confirm the system before requesting installation",
    proofImage: null,
    proofAlt: "",
    proofText:
      "No verified heating-installation photographs or system specifications have been supplied. Use the enquiry to discuss the tiled floor and the trades needed; this page does not promise electrical work or a particular heating product.",
    proofProject: null,
    related: ["floor-tiling", "bathroom-tiling"],
    question: "Can heating be added without lifting the tiles?",
    answer:
      "A system beneath the tiles generally needs access to the floor build-up. Describe the existing room and whether you are replacing the floor so the options can be assessed with the appropriate trades.",
  },
} satisfies Record<ServiceId, unknown>;
