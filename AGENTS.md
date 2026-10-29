# Working in Busog

Busog is an Astro static site with Svelte 5 islands and a single local app at `/busog/app/`. The public base is
`/busog/`. Use Node 22.23.4 or newer; dependencies are pinned by `package-lock.json`.

## Structure

- `src/pages/` and `src/layouts/`: static routes, SEO, metadata and site landmarks.
- `src/components/site/`: shared marketing components; product previews reuse actual app card components.
- `src/components/app/`: device shells, screens, sheet host and focused UI responsibilities.
- `src/components/tools/`: calculator, quiz, searchable catalogues and local-only form islands.
- `src/content/`: original blog/help/information Markdown. Recipes use a file content loader.
- `src/domain/`: pure food scaling, recipe sums, target equations and Manila date/diary calculations.
- `src/data/`: normalized USDA JSON, provenance, recipe compositions and catalogue helpers.
- `src/lib/`: versioned store, validation, mock generator, browser history, sheet drag/focus and food clients.
- `scripts/`: reproducible data generation, regression checks, source limits and static post-build files.
- `public/`: original brand assets, licensed optimized food images, notices, manifest and service worker.
- `docs/`: design, research, reference audit, feature map and exact reviewer QA steps.

## Data rules

Never invent a calorie or macro value. USDA records retain FDC IDs and original food descriptions. Open Food Facts
records retain separate ODbL / DbCL attribution and are not merged into the CC0 snapshot. Incomplete records are
rejected. Recipe totals derive from snapshot ingredients and gram weights; numbers are rounded only for display. Match
cooked/raw food states, keep portion assumptions visible, and update `REFERENCES.md` plus site Credits for any new
imagery.

Regenerate food data with `python3 scripts/snapshot.py` and recipe compositions with `python3 scripts/recipes.py`.
Generated JSON is checked in so normal builds do not need network access. Raw source archives, reference captures,
research HTML and temporary evidence belong in ignored `.research/`, never in published content.

## Product rules

Keep the three paths converging on the same typed diary entries and the same pure math. Source marks must survive edits
and exports. Mock data stays deterministic relative to Manila dates. No accounts or real user datasets are introduced.
Recognition and coach replies remain clearly simulated unless a future explicit scope change supplies a real service.
Forms validate locally and send nothing; no analytics, email gates, invented user counts, reviews or press claims.

The same app URL chooses exactly one shell. Keep head detection before paint, late `busog:device` changes, safe areas,
`--zoom`, opaque bars and phone scrollbar hiding. Do not replace history state wholesale: preserve unrelated fields.
Nested sheets keep their own transforms; topmost alone receives drag/focus, native scroll wins until it reaches the top,
and horizontal strips/inputs are excluded. Mouse capture is grip-only so content buttons keep working.

Follow `docs/design.md`: sage canvas, charcoal signature shell, bold flat color cards, condensed display typography and
mono figures. Both themes must meet AA for text; macro identity also needs labels and distinct patterns. All standalone
controls have at least 44px targets, mobile inputs at least 16px, visible focus and reduced-motion support.

## Quality rules

Keep one component per file and one responsibility per module. Exported functions/components explain their purpose in a
doc comment. No `any`, dead code, `console.log`, TODO markers, UI kits or animation frameworks. Handwritten source is at
most 250 lines per file and 120 characters per line. Generated nutrition data is exempt; SVG source is checked too.

Run `npm run quality`, then `npm run build`. The gate runs Prettier write/check, ESLint, Astro plus Svelte checks,
meaningful domain/state regressions and source-size limits. Update mathematical/state examples when behavior changes; do
not add implementation-mirroring tests for cosmetic edits. Review manual touch/accessibility/PWA steps in `docs/qa.md`
when relevant. Honor any session-specific restriction on browser launching or external actions.

Service-worker caching stays scoped to Busog. Use network-first navigation/images and cache-first only for hashed
assets. Preserve the offline asset manifest, versioned cache names, static 404, canonical metadata and Pages workflow.
Do not commit, push or deploy unless the active user task authorizes those actions.
