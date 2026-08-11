/**
 * Photo preparation for the ROH Tiling site.
 *
 * Source photographs live in photos/source/ and are NOT published — they are
 * kept in the repo so crops can be redone. This script produces the
 * publish-ready masters in src/assets/photos/, which Astro then optimises at
 * build time into responsive WebP with a JPG fallback.
 *
 * Every crop below exists to remove content that must never be published:
 * green painter's tape, tile levelling clips still fitted, loose wiring, and
 * tools or rags in frame. Do not widen a crop without re-checking the result.
 *
 * Run with: npm run photos
 */
import { mkdir, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE = 'photos/source';
const MASTERS = 'src/assets/photos';
const OG = 'public/images';

/**
 * Widest master Astro is given to work from. Nothing on the site renders a
 * photo wider than about 700 CSS pixels, so 1400 still covers a 2x screen
 * while keeping every generated derivative comfortably under 150KB.
 */
const MAX_MASTER_WIDTH = 1400;

/**
 * `crop` is applied to the source at full resolution. `reason` records what the
 * crop removes so a future edit does not silently reintroduce it.
 */
const PHOTOS = [
  {
    source: 'bathroom-green-subway.jpg',
    out: 'teal-vertical-tile-shower.jpg',
    crop: { left: 300, top: 180, width: 850, height: 1520 },
    reason: 'Removes green painter\'s tape on the left skirting and right door jamb, and a mop and plastic sheeting at the right edge.',
  },
  {
    source: 'bathroom-porcelain-shower.jpg',
    out: 'large-format-shower-floor.jpg',
    crop: { left: 190, top: 0, width: 1346, height: 1380 },
    reason: 'Removes loose cabling and cut plasterboard at the left edge, and a taped-off waste at the bottom right.',
  },
  {
    source: 'shower-natural-stone.jpg',
    out: 'large-format-shower-window.jpg',
    crop: { left: 210, top: 0, width: 1326, height: 1560 },
    reason: 'Removes a fixing bracket still fitted at the left edge and a rag on the floor at the bottom of frame.',
  },
  {
    source: 'commercial-geometric-pattern.jpg',
    out: 'commercial-geometric-wall.jpg',
    crop: { left: 430, top: 0, width: 1618, height: 1400 },
    reason: 'Removes loose red wiring hanging from the ceiling and tools and buckets in the bottom left corner.',
  },
];

/**
 * Photographs held back from publication. Kept here so the reason travels with
 * the repo rather than living only in a conversation.
 */
const WITHHELD = [
  {
    source: 'bathroom-marble-look.jpg',
    reason: 'Green painter\'s tape runs around a cardboard-covered cabinet in the centre of frame, with exposed plumbing stubs below it. It cannot be cropped out without losing the subject.',
  },
];

/** The open graph image must be a raster format: Facebook, LinkedIn, WhatsApp
 * and Messenger will not render SVG, so a shared link shows no image at all. */
const OG_IMAGE = {
  from: 'teal-vertical-tile-shower.jpg',
  out: 'og-image.jpg',
  /** Band of the portrait master holding the tiled wall and the vanity. Taken
   * before the resize so the share card is not just ceiling. */
  band: { left: 0, top: 700, width: 850, height: 446 },
  width: 1200,
  height: 630,
};

async function main() {
  await mkdir(MASTERS, { recursive: true });
  await mkdir(OG, { recursive: true });

  for (const file of await readdir(MASTERS)) {
    await unlink(path.join(MASTERS, file));
  }

  for (const photo of PHOTOS) {
    const target = path.join(MASTERS, photo.out);
    await sharp(path.join(SOURCE, photo.source))
      .rotate()
      .extract(photo.crop)
      .resize({ width: MAX_MASTER_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(target);
    const { width, height } = await sharp(target).metadata();
    console.log(`  ${photo.out.padEnd(34)} ${width}x${height}`);
  }

  await sharp(path.join(MASTERS, OG_IMAGE.from))
    .extract(OG_IMAGE.band)
    .resize(OG_IMAGE.width, OG_IMAGE.height)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OG, OG_IMAGE.out));
  console.log(`  ${OG_IMAGE.out.padEnd(34)} ${OG_IMAGE.width}x${OG_IMAGE.height}`);

  for (const held of WITHHELD) {
    console.log(`  withheld: ${held.source} — ${held.reason}`);
  }
}

main();
