# Implementation map

All file paths are relative to the repository. Generated output lives under `dist/` with `/busog/` as its public base.

## Website page types

| Page type                                  | Source                                                                            |
| ------------------------------------------ | --------------------------------------------------------------------------------- |
| Home                                       | `src/pages/index.astro`, `home.css`, `home-story.css`                             |
| About, Features, How it works, Community   | `src/pages/[slug].astro`, `src/content/pages/*.md`                                |
| Compare                                    | `src/pages/compare.astro`                                                         |
| FAQ                                        | `src/pages/faq.astro`, `src/components/tools/FaqSearch.svelte`, `src/data/faq.ts` |
| Help index and articles                    | `src/pages/help/*`, `src/content/help/*.md`, `CollectionSearch.svelte`            |
| Contact, Partnerships                      | respective `src/pages/*.astro`, `ConceptForm.svelte`                              |
| Press kit                                  | `src/pages/press.astro`, `public/brand/*`, `ProductPreview.svelte`                |
| Download / install                         | `src/pages/download.astro`, `InstallButton.svelte`, manifest and service worker   |
| Privacy, Terms, Supplements                | `src/pages/[slug].astro`, corresponding `src/content/pages/*.md`                  |
| Start and onboarding entry                 | `src/pages/start.astro`, `src/pages/onboarding.astro`                             |
| TDEE / calorie calculator                  | `src/pages/tdee-calculator.astro`, `Calculator.svelte`, `src/domain/goals.ts`     |
| Quiz                                       | `src/pages/quiz.astro`, `Quiz.svelte`, `src/lib/handoff.ts`                       |
| Blog index and eight articles              | `src/pages/blog/*`, `src/content/blog/*.md`                                       |
| Recipes index and 25 recipes               | `src/pages/recipes/*`, `src/data/recipes.json`, `DishPhoto.svelte`                |
| Library index, seven categories, 110 foods | `src/pages/library/*`, `LibrarySearch.svelte`, `NutritionPanel.svelte`            |
| Credits                                    | `src/pages/credits.astro`, `REFERENCES.md`                                        |
| 404                                        | `src/pages/404.astro`                                                             |
| Shared navigation, footer, SEO and themes  | `SiteLayout.astro`, `src/components/site/*`, `src/styles/*`                       |

## App features

All screen components are in `src/components/app/`.

| Feature                                         | Implementation                                                           |
| ----------------------------------------------- | ------------------------------------------------------------------------ |
| Same URL / device selection / phone frame       | `src/pages/app/index.astro`, `App.svelte`, `PhoneShell`, `WebShell`      |
| Optional onboarding and editable targets        | `Onboarding`, `ProfileForm`, `src/domain/goals.ts`                       |
| Today, ring, macros, meal totals, water, streak | `Today`, `DaySummary`, `Diary`, `WeeklyCalories`, `MacroBalance`         |
| Meal clock and phone timeline                   | `MealTiming`, `MealTimeline`, `src/domain/dates.ts`                      |
| Turo-turo counter and portions                  | `TuroTuro`, `CounterCard`, `CountMath`, shared recipe composition        |
| Simulated sample-photo logging                  | `Snap`                                                                   |
| USDA search and OFF barcode lookup              | `FoodSearch`, `BarcodeScanner`, `src/lib/fdc.ts`, `off.ts`, `request.ts` |
| Shared food review and serving picker           | `FoodDetail`, `ServingPicker`, `SourceMark`                              |
| Progress ranges and weight editing              | `Progress`, `WeightEditor`, `src/domain/diary.ts`                        |
| Food and recipe catalogue                       | `Foods`, `src/data/catalog.ts`                                           |
| Scripted coach                                  | `Coach`                                                                  |
| Theme, units, API key, export, reset, credits   | `Profile`, typed local store and storage boundary                        |
| Nested sheets, drag and focus                   | `SheetHost`, `SheetLayer`, `src/lib/sheet.ts`, `src/styles/sheets.css`   |
| Browser/phone Back with preserved router state  | `src/lib/navigation.ts`, regression state test                           |
| Deterministic mock history                      | `src/lib/mock.ts`, versioned `store.ts` and `storage.ts`                 |
| Offline shell, fonts, images and snapshot       | `public/sw.js`, `scripts/postbuild.mjs`, imported food JSON              |

## Deliberate boundaries

- Camera barcode detection is progressive enhancement. Typed barcode lookup works wherever fetch is supported.
- PWA install controls vary by browser; the install page always provides real platform steps.
- Every recipe has a Wikimedia Commons photo of that dish (`DishPhoto.svelte`), credited from `src/data/photos.json` on
  /credits and in REFERENCES.md.
- Region (`src/domain/names.ts`, `src/lib/region.ts`): Filipino-first or English-first names, merienda or snack, and the
  counter's dishes; detected on first visit and editable in settings.
- Research captures, raw source archives, live-response evidence and the local compatible Node runtime are in ignored
  `.research/`. They are neither Git content nor published assets.
- No browser was launched. Touch, visual, screen-reader and installed-PWA verification remain reviewer steps in `qa.md`.
