# URL and heading audit

Local build comparison against feature commit `7db4678`. Every original public route remains. Canonical host is `https://www.rohullahtiling.co.nz`; root stays `/`, other routes have no trailing slash. Each slash variant has an explicit 301 configuration; no production URL was moved.

| Canonical path                 | Title                                                     | H1                                                   | Previous title/H1            |
| ------------------------------ | --------------------------------------------------------- | ---------------------------------------------------- | ---------------------------- |
| `/about`                       | About Us &#124; ROH Tiling Wellington                     | About ROH Tiling                                     | Preserved                    |
| `/contact`                     | Contact Us &#124; ROH Tiling Wellington                   | Contact ROH Tiling                                   | Preserved                    |
| `/`                            | Wellington Tiler &#124; ROH Tiling                        | Wellington Tiler — Bathrooms, Splashbacks and Floors | Title shortened deliberately |
| `/portfolio`                   | Tiling Portfolio Wellington &#124; ROH Tiling             | Our Tiling Portfolio                                 | Preserved                    |
| `/privacy`                     | Privacy Policy &#124; ROH Tiling Wellington               | Privacy Policy                                       | Preserved                    |
| `/service-areas`               | Wellington Tiling Service Areas &#124; ROH Tiling         | Tiling Services Across the Wellington Region         | Preserved                    |
| `/services/bathroom-tiling`    | Bathroom Tiling Wellington &#124; ROH Tiling              | Bathroom Tiling                                      | Preserved                    |
| `/services/floor-tiling`       | Floor Tiling Wellington &#124; ROH Tiling                 | Floor Tiling                                         | Preserved                    |
| `/services/kitchen-tiling`     | Kitchen Tiling & Splashbacks Wellington &#124; ROH Tiling | Kitchen Tiling                                       | Preserved                    |
| `/services/tile-repairs`       | Tile Repair & Replacement Wellington &#124; ROH Tiling    | Tile Repairs                                         | Preserved                    |
| `/services/underfloor-heating` | Underfloor Heating Wellington &#124; ROH Tiling           | Underfloor Heating                                   | Preserved                    |
| `/services/waterproofing`      | Waterproofing Wellington &#124; ROH Tiling                | Waterproofing                                        | Preserved                    |
| `/services`                    | Tiling Services Wellington &#124; ROH Tiling              | Professional Tiling Services in Wellington           | Preserved                    |
| `/terms`                       | Terms of Service &#124; ROH Tiling Wellington             | Terms of Service                                     | Preserved                    |

Home title changed deliberately to “Wellington Tiler | ROH Tiling” for a shorter, readable snippet. All other indexable page titles and H1s are preserved. Meta descriptions were revised where needed to remove unconfirmed claims and describe the actual offer.

`/thank-you` is an additional utility receipt, always noindex and excluded from the 14-URL sitemap. `/404` is also excluded. All preview HTML is noindex; preview robots disallows crawling. Production robots and canonical sitemap remain enabled.
