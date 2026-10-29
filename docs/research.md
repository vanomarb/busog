# Research notes

Research date: 29 October 2026. API search calls: 3 (below the limit of 10). Source was read for concepts only; no
third-party implementation was copied or installed.

## Repository review

| Repository                                                                  | Stars | License | Last push            | Source review takeaway                                                 |
| --------------------------------------------------------------------------- | ----: | ------- | -------------------- | ---------------------------------------------------------------------- |
| [Townzc/liftcut-tracker](https://github.com/Townzc/liftcut-tracker)         |    89 | MIT     | 2026-10-28T12:27:15Z | Meal groups and diary totals.                                          |
| [brandonp2412/FitBook](https://github.com/brandonp2412/FitBook)             |   176 | MIT     | 2026-10-27T05:15:24Z | Dated diary groups and quantity-aware food presentation.               |
| [frontendnetwork/veganify](https://github.com/frontendnetwork/veganify)     |    68 | MIT     | 2026-10-28T09:37:02Z | Explicit barcode submission and missing-product flow.                  |
| [apoorvdarshan/fud-ai](https://github.com/apoorvdarshan/fud-ai)             |   502 | MIT     | 2026-10-26T00:42:27Z | Review of serving splits, barcode outcomes and partial-day evidence.   |
| [skeletonlabs/skeleton](https://github.com/skeletonlabs/skeleton)           |  6085 | MIT     | 2026-10-28T20:44:56Z | Separate trigger, backdrop, content, title and close responsibilities. |
| [opral/paraglide-js](https://github.com/opral/paraglide-js)                 |   775 | MIT     | 2026-10-29T01:22:15Z | Astro/Svelte example: explicit Vite plugin boundary.                   |
| [withastro/astro](https://github.com/withastro/astro)                       | 63560 | MIT     | 2026-10-28T22:11:50Z | Content loader configuration and statically generated pages.           |
| [sveltejs/svelte](https://github.com/sveltejs/svelte)                       | 88514 | MIT     | 2026-10-29T01:10:18Z | Svelte 5 compiler configuration and reactive state boundaries.         |
| [appwrite/starter-for-astro](https://github.com/appwrite/starter-for-astro) |     4 | MIT     | 2026-10-28T13:32:57Z | A small integration configuration without UI-kit coupling.             |

Nutrition sources inspected: liftcut nutrition page and plan persistence, FitBook diary day groups and quantity display,
Veganify barcode tests. Goal math is independently implemented from Mifflin–St Jeor, and all foods normalize to 100 g.
Framework source inspected: Astro starter content/config files, Svelte compiler configuration, and Astro/Svelte starter
config. The curated tracker set is permissively licensed; popularity is not treated as evidence of nutrition accuracy.

## Design references

- [Foodnoms](https://foodnoms.com): Task-first diary, quiet nutrition detail, visible privacy choices.
- [Lifesum](https://lifesum.com): Food photography and legible macro grouping.
- [Cronometer](https://cronometer.com): Visible provenance and detail on demand.
- [YAZIO](https://www.yazio.com/en): Simple meal group hierarchy.
- [MacroFactor](https://macrofactor.com): Trend context and an explicit goal line.
- [Sweetgreen](https://sweetgreen.com): Food-first art direction and confident typography.
- [Omsom](https://omsom.com): Cultural specificity without explaining away the food.
- [Fly By Jing](https://flybyjing.com): Bold food color and a clear product voice.
- [Diaspora Co.](https://diasporaco.com): Ingredient context and source transparency.
- [OLIPOP](https://drinkolipop.com): Flat color families that organize choices.
- [tubik restaurant concept](https://dribbble.com/shots/26787072-AI-Powered-Mobile-App-for-Restaurant-Operations):
  Primary owner-directed reference: charcoal shell, bento, mono figures, condensed titles.

Marketing structure references: [Linear](https://linear.app) for real product-led previews;
[Raycast](https://raycast.com) for action-led demonstration; [Allbirds](https://allbirds.com) for readable
editorial/commerce transitions. No assets, commercial claims or testimonials are reused. Omsom was inspected through
indexed design-gallery imagery because its live page returned no readable content.

## App Builders PH

[Health category](https://appbuildersph.com/categories/health) returned an empty listing in the indexed category
response, while the [homepage](https://appbuildersph.com) showed a Health-tagged Axel entry about family care. These
inconsistent snapshots do not support a census or user-demand claim. Product inference: local language, ordinary meals,
low-friction access and clear privacy are appropriate hypotheses, not surveyed findings. Busog uses metric units, Manila
dates and ulam/rice/merienda vocabulary without claiming user validation.

## Data and license decisions

[USDA API guide](https://fdc.nal.usda.gov/api-guide/) and [downloads](https://fdc.nal.usda.gov/download-datasets/)
establish public-domain/CC0 data. Use the official SR Legacy JSON archive for a reproducible offline subset; retain FDC
IDs and USDA serving weights. DEMO_KEY allows 30 calls/hour and 50/day per IP: debounce, abort, cache and fall back to
local search.

[Open Food Facts API](https://openfoodfacts.github.io/openfoodfacts-server/api/) and
[license guide](https://openfoodfacts.github.io/openfoodfacts-server/api/tutorials/license-be-on-the-legal-side/) were
read. Use explicit barcode lookup with fields, a minimum interval and cache. Current documented product-read limit is
15/minute/IP. Database ODbL, individual contents DbCL; no OFF images are used.
[Terms](https://world.openfoodfacts.org/terms-of-use) returned a bot interstitial; linked license documentation was
available. OFF records stay separately identifiable in local export rather than being merged into the CC0 snapshot. No
writes, accounts or API usage-form submissions were made.

Additional historical study: ntsd/astro-svelte-tailwind (5 stars, MIT, last push 2023-12-14); excluded from the actively
maintained eight. Paraglide Astro example source was read directly.

Source verification addendum: Fud AI `RecipeServings.kt`, `ServingAmountExpression.kt`, `BarcodeProductLookup.kt` and
`GoalEvidence.kt` were inspected in a later evidence pass. A recipe serving must represent known mass, not an unknown
imported serving count; missing diary days should not imply measured zero intake. Busog labels its history as mock and
keeps the arithmetic independent. Skeleton’s dialog test composition was inspected directly. No source code from these
reviews is included in Busog. Repository metrics are snapshots, not current promises.
