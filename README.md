# ROH Tiling

Static marketing site for ROH Tiling, a one-person tiling business based in
Whitby, Porirua, working across the Wellington region. Built with Astro and
deployed to Vercel.

```sh
npm install
npm run dev      # local dev server on :4322
npm run build    # static build into dist/
npm run preview  # serve the built site
npm run photos   # regenerate the publish-ready photos (see below)
```

## Business details live in one place

`src/data/business.ts` holds the name, address, phone, email, hours, service
areas and the service list. Every page reads from it. Search engines and
directories treat inconsistent name/address/phone details as evidence of two
different businesses, so nothing here should be retyped into a page.

Two details are easy to get wrong and worth calling out:

- The phone displays as `0210 260 2044` and dials as `tel:+642102602044`.
  There is no trunk zero after the country code; `+6402102602044` fails on
  some dialers.
- The trading name is **ROH Tiling**. `Rohullah Rassuli` is the person: he is
  named on the About page and appears as `founder` in the schema, and the
  registered company name appears once in the footer.

## Photographs

Source photographs live in `photos/source/`. They are **not published** — the
build never touches that directory.

`npm run photos` crops them and writes publish-ready masters into
`src/assets/photos/`, plus the 1200x630 open graph image at
`public/images/og-image.jpg`. Astro then generates responsive WebP with a JPG
fallback at build time.

Every crop in `scripts/prepare-photos.mjs` carries a `reason` recording what it
removes. Photographs must never be published showing:

- people reflected in shower glass
- green painter's tape
- tile levelling clips still fitted
- loose wiring
- tools or rags in frame

If a photo cannot be cropped clean it goes in the `WITHHELD` list in that
script with the reason, rather than being quietly published or quietly
forgotten. No stock photography is used anywhere on the site.

### Adding a photo

1. Drop the original into `photos/source/`.
2. Add an entry to `PHOTOS` in `scripts/prepare-photos.mjs` with a crop that
   removes anything from the list above, and a `reason` saying what it removes.
3. Run `npm run photos` and look at the result before committing it.
4. Import the master and render it with `src/components/Photo.astro`, which
   handles the responsive sizes, the WebP conversion, the explicit width and
   height, and lazy loading. Only the hero image gets `priority`.

Alt text describes the work and names a suburb only where that is known to be
true. Do not invent locations.

## Forms

The site is static, so it has no server of its own to receive a form post. Set
`FORM_ENDPOINT` in `src/data/forms.ts` to a form handler URL (Formspree, Basin,
Getform, a serverless function) and both forms will submit without JavaScript
and redirect to `/quote-sent`.

Until that is set they fall back to a `mailto:` submission, which still works
without JavaScript but depends on the visitor having a mail client configured.

## Things deliberately not on this site

- No testimonials, reviews, ratings or `aggregateRating` schema. The business
  has no reviews on any platform, and marking up ratings that do not exist
  risks a manual action.
- No trade body memberships or supplier endorsements.
- No live chat, popups or exit-intent modals.

## Performance

The site is fast and should stay that way. Fonts are self-hosted from
`public/fonts/` rather than loaded from Google's CDN, which keeps a
render-blocking third-party request off the critical path. Every photo carries
explicit dimensions so cumulative layout shift stays at zero.

Measured on a throttled mobile profile, every page scores 99 or 100 for
performance and 100 for accessibility, best practices and SEO. If a change
drops mobile performance below 90, fix it before shipping.
