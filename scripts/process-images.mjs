/**
 * Crops the supplied job photos to remove anything that must not be published
 * (green painter's tape, loose wiring, taped pipe ends, tools in frame) and
 * writes clean sources into src/assets/images/.
 *
 * The uncropped frames live in source-photos/, deliberately outside public/,
 * so the originals are never served.
 *
 * Astro's <Picture> takes it from there: responsive WebP with a JPG fallback,
 * explicit width/height, build-time optimisation.
 *
 * Run: node scripts/process-images.mjs
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SRC = 'source-photos';
const OUT = 'src/assets/images';

// left/top/width/height chosen by inspecting each frame. The `removes` note
// records what the crop is there to exclude.
const JOBS = [
  {
    in: 'bathroom-green-subway.jpg',
    out: 'bathroom-teal-vertical-tile.jpg',
    crop: { left: 300, top: 60, width: 790, height: 1600 },
    removes: 'green painter\'s tape (two places), mop and gear at right edge',
  },
  {
    in: 'bathroom-porcelain-shower.jpg',
    out: 'shower-floor-fall-to-drain.jpg',
    crop: { left: 200, top: 120, width: 1000, height: 1500 },
    removes: 'loose cable at left, taped pipe end bottom right, raw plasterboard edge',
  },
  {
    in: 'shower-natural-stone.jpg',
    out: 'shower-large-format-corner.jpg',
    crop: { left: 220, top: 40, width: 1280, height: 1480 },
    removes: 'exposed wiring in wall bracket at left, taped pipe stub at floor',
  },
  {
    in: 'commercial-geometric-pattern.jpg',
    out: 'commercial-changing-room-feature-wall.jpg',
    crop: { left: 420, top: 0, width: 1628, height: 1450 },
    removes: 'loose red wire hanging from ceiling, buckets and tools bottom left',
  },
  {
    in: 'bathroom-marble-look.jpg',
    out: 'floor-marble-look-large-format.jpg',
    crop: { left: 90, top: 1470, width: 1330, height: 560 },
    removes: 'green painter\'s tape, cardboard-covered cistern, exposed pipe stubs',
  },
];

await mkdir(OUT, { recursive: true });

for (const job of JOBS) {
  const info = await sharp(`${SRC}/${job.in}`)
    .rotate() // honour EXIF orientation before cropping
    .extract(job.crop)
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(`${OUT}/${job.out}`);
  console.log(
    `${job.out.padEnd(44)} ${info.width}x${info.height}  ` +
      `${(info.size / 1024).toFixed(0)}KB   removes: ${job.removes}`
  );
}

// Social preview. SVG is not rendered by Facebook, LinkedIn, WhatsApp or
// Messenger, so this replaces og-image.svg with a real 1200x630 JPG.
const ogSource = `${OUT}/bathroom-teal-vertical-tile.jpg`;
const og = await sharp(ogSource)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/images/og-image.jpg');
console.log(`\nog-image.jpg                                 ${og.width}x${og.height}  ${(og.size / 1024).toFixed(0)}KB`);
