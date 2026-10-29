Three ways in. One plate. Made for rice, ulam and real life.

**Category:** Health

Busog is a Filipino-first calorie and macro tracker: a marketing website and the app itself, for phone and desktop, on
one static site. “Busog” means pleasantly full. The look is dark and photo-led: near-black cards, one warm accent, real
dish photos and Plus Jakarta Sans in sentence case (see [docs/design.md](docs/design.md)).

The product centers on **Three ways in, one plate**:

- **Turo-turo:** point at the dishes on the counter, choose rice cups and a portion, and inspect the ingredient
  calculation.
- **Snap:** pick a plate photo, review the USDA ingredients it maps to, adjust the grams and confirm. The preview uses
  sample plates, and nothing is uploaded.
- **Search and scan:** search USDA ingredients, with an offline snapshot fallback, or look up a packaged-food barcode
  using Open Food Facts. Supported browsers can scan with the camera; manual digits always work.

Every route creates the same kind of diary entry, with grams and a visible source mark. Nutrition summaries, meal
subtotals and progress charts use those same entries. Busog Coach is an early preview that answers from your own diary.

The site includes 181 static pages: all marketing, help, legal and tool types, eight original articles, 25 original
recipes (13 Filipino, 12 international), seven food categories and 110 food-reference pages. There are no accounts,
payments, fabricated testimonials, analytics or live lead-capture forms. Contact forms validate locally and send
nothing.

### Region

Busog has a **Region** setting (You → Make it yours), chosen automatically on the first visit from the browser's time
zone and language:

- **Philippines:** Filipino names first ("Kanin (white rice) · cooked", "Adobong manok"), merienda, and a turo-turo
  counter of Filipino dishes.
- **International:** English names first ("White rice · cooked", "Chicken adobo"), "Snack" for merienda, and a counter
  of international dishes.

Search understands both names in either region. Starting fresh brings back a sample diary for the chosen region.

## Try and run

Requires **Node 22.23.4 or newer**, npm and Python 3 only for regenerating source data. `.nvmrc` and `.node-version`
record the verification runtime. The production build itself needs no data API or network request.

```sh
nvm use
npm ci
npm run dev
```

Open the printed development URL at `/busog/`. The app always lives at `/busog/app/`:

- Desktop web: `/busog/app/`
- Desktop phone frame: `/busog/app/?frame=phone`
- Phone: both URLs choose the same full-screen phone layout.
- Optional onboarding: `/busog/app/?onboarding=1`

For production/PWA review:

```sh
npm run quality
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

In this agent environment Astro 7 detached preview into a daemon. Stop a registered instance with
`npm run preview -- stop`. Service-worker registration is production-only; use preview or an HTTPS deployment to test
caching and installation. The Download page has iPhone and Android steps.

If the machine has a root-owned npm cache, use `npm_config_cache=/tmp/npm-cache-busog npm ci`.

## Data, math and licenses

The checked-in snapshot contains **110 curated everyday foods**, each a complete USDA FoodData Central SR Legacy
(April 2018) record chosen by exact FDC ID in `scripts/snapshot_foods.py`, with a Filipino name where one is common. It
preserves FDC IDs, food states, serving weights and per-100g calories/protein/carbohydrate/fat. USDA data is public
domain / CC0. No nutrition values are invented or supplied by an AI.

Recipes are original weighed ingredient compositions. Totals are computed in `src/domain/`; cooking-state and serving
assumptions are shown on the page. Every recipe has an openly licensed Wikimedia Commons photo of that dish (CC0, CC BY
or CC BY-SA), credited on the Credits page from `src/data/photos.json`.

Live USDA search uses public `DEMO_KEY`, debounce, cancellation, memory caching, bounded waits and a snapshot fallback.
An optional personal data.gov key stays in the local versioned store and is excluded from exports. Open Food Facts
barcode records retain **ODbL / DbCL** attribution separately from the CC0 snapshot. Lookup is explicit, cached and
spaced below the documented request limit. Missing or incomplete records never receive guessed values.

The sample diary (diary, water, weight history and streak) is generated deterministically relative to the current
Asia/Manila date. Edits live in localStorage behind one typed, versioned boundary, or in memory if storage is blocked.
The target calculator is an adult educational Mifflin–St Jeor example, not individual medical advice.

Full sources, image licenses, font notices and the primary visual study by **tubik** are credited in
[REFERENCES.md](REFERENCES.md) and on the site's Credits page. Full font and icon notices ship in `public/licenses/`.

## Regenerate the snapshot

```sh
python3 scripts/snapshot.py
python3 scripts/recipes.py
npm run test:domain
npm run build
```

The snapshot script downloads the fixed official USDA SR Legacy archive into ignored `.research/`, looks up every
curated FDC ID, refuses any record missing a macronutrient, and writes `src/data/foods.json` plus checksum provenance.
It requires no API key. Never edit food numbers in the JSON by hand. The recipe script (`scripts/recipe_list.py`) writes
ingredient lists and instructions, never nutrition totals, and fails if a recipe uses a food missing from the snapshot.

## Quality and architecture

```sh
npm run format
npm run format:check
npm run lint
npm run check
npm run test:domain
npm run check:limits
npm run build
```

`npm run quality` runs the first six checks in order. Type checks include both Astro and Svelte, with Svelte warnings
failing. Domain and state regressions cover serving conservation, target math, source integrity, Manila dates, local
storage failures and a three-level history stack. Source limits apply to handwritten code and SVG assets; generated
nutrition JSON is exempt.

- `src/pages/`, `src/layouts/`, `src/components/site/`: static site, metadata and reusable marketing components.
- `src/content/`, `src/content.config.ts`: blog, help and page Markdown. Recipes come straight from `src/data/`.
- `src/components/app/`: one responsive app with separately mounted phone/web shells, shared screens and sheets.
- `src/domain/`: pure typed nutrition, goals, date, diary and region-naming logic.
- `src/lib/`: versioned store, history, drag/focus, sample data and food clients.
- `scripts/`: reproducible data, domain/state verification, source limits and post-build offline/sitemap output.

See [the implementation map](docs/implementation.md), [design rules](docs/design.md), [research](docs/research.md),
[reference audit](docs/reference-audit.md) and [QA guide](docs/qa.md).

## GitHub Pages

The base is `/busog/`. `.github/workflows/pages.yml` runs quality checks, builds and supplies the repository owner's
Pages origin through `SITE_URL`. For another host, set `SITE_URL` to its origin before building; preserve or
deliberately update the base and absolute internal links. The checked-in default origin is only a fallback for local
builds.

The service worker caches only namespaced Busog data. Navigation and food images are network-first; only hashed build
assets are cache-first. Post-build output includes a complete offline asset list, sitemap, robots file and custom 404.

## Performance and motion

- Marketing pages ship almost no JavaScript: the menu is a native popover, the home preview is rendered at build time
  (0.4 KB gzipped of script scales it), and recipe pages hydrate only the portion calculator when it scrolls into view.
- Two fonts are preloaded; all faces are self-hosted latin subsets at the weights in use.
- Page changes use the browser's cross-document view transitions; cards rise in with CSS scroll-driven animation where
  supported. In the app, screens rise in, dashboard cards stagger and bars grow. Everything is off under reduced motion.
- One type scale (`src/styles/tokens.css`) sets every size; nothing is below 12px.

## Screenshots

Captured in Chrome after the checks in [docs/qa.md](docs/qa.md).

- `docs/screenshots/cover.png` — cover image (the home hero).
- `docs/screenshots/site-1.png` — home hero, desktop.
- `docs/screenshots/site-2.png` — the kitchen, desktop.
- `docs/screenshots/app-phone-1.png` — Today, phone.
- `docs/screenshots/app-phone-2.png` — turo-turo counter, phone.
- `docs/screenshots/app-phone-3.png` — a recipe page, phone.
- `docs/screenshots/app-phone-4.png` — Foods, phone.
- `docs/screenshots/app-web-1.png` — desktop dashboard.
- `docs/screenshots/app-web-2.png` — desktop "Try the app" phone frame.
