# Busog QA and reviewer capture guide

The automated checks below were run without launching a browser. Browser, pixel, touch, installed-PWA and screen-reader
steps are **reviewer checks**, deliberately left for the reviewer under the owner's no-browser constraint. Do not read
this checklist as a claim that a physical phone or browser was exercised by the build agent.

Use Node 22.23.4 or newer. Run `npm ci`, `npm run quality`, then `npm run build`. Run
`npm run preview -- --host 127.0.0.1` and visit `http://127.0.0.1:4321/busog/`. Use the actual printed port if 4321 is
busy. Touch emulation must include a coarse pointer and touch points, not only a narrow viewport. For install/offline
tests, use localhost or an HTTPS host.

## Automated evidence

- Prettier write/check, ESLint, Astro check and Svelte check (warnings fail), pure domain checks, state regression
  checks, source limits and static build are required to pass.
- `scripts/test-domain.ts`: USDA snapshot uniqueness/completeness, every recipe's serving conservation, known rice
  value, pound/ounce conversions, both equation constants, target adjustment, invalid input, leap day and Manila
  midnight.
- `scripts/test-state.ts`: add/edit/remove updates shared totals, dated weight replacement, water floor, malformed
  schema, invalid macro split, blocked storage, three-level history back, serving preservation and unrelated history
  state.
- `scripts/check-limits.mjs`: all handwritten TS/JS/Astro/Svelte/CSS/Python source files below 251 lines, all source
  lines at most 120 characters. Generated food/recipe JSON is data, not handwritten component source.
- `scripts/postbuild.mjs`: hashed asset/offline image manifest, cache version and sitemap generation.
- Real read-only requests returned HTTP 200 from USDA search and OFF's product endpoint during the build run. External
  availability and shared DEMO_KEY limits can change; fallbacks must be checked independently.

## Essential 1 — one device layout, before paint

Implementation: `src/pages/app/index.astro`, `App.svelte`, `PhoneShell.svelte`, `WebShell.svelte`, `app-layout.css`.

1. At 1440×900 with a fine pointer, open `/busog/app/`. Expect one web shell and its icon rail.
2. At 390×844 with touch/coarse pointer, open the **same URL**. Expect one full-screen phone shell and tab bar.
3. At desktop size, open `/busog/app/?frame=phone`. Expect the phone shell in a restrained frame, a caption and a
   working Switch to web view link. On an actual phone, the frame parameter must still use full screen.
4. Enable a phone browser's Desktop site mode. Reload. Verify the phone layout and correctly compensated text sizing.
5. Change device/pointer emulation while open. Verify `busog:device` switches shells without duplicating the app or
   losing the selected screen, diary data or active sheet stack. Inspect DOM: exactly one `.phone-shell` or
   `.web-shell`.

## Essential 2 — scrollbar treatment

Implementation: `global.css`, `utilities.css`, themed root scrollbar rules, phone device selectors.

1. Scroll Today, a long food search, a long sheet and the marketing home on the phone. No scrollbar should appear.
2. On desktop, scroll the diary and long website pages. Expect thin themed scrollbars.
3. Repeat light and dark, including phone Desktop site mode.

## Essential 3 — nested sheets follow the finger

Implementation: `src/lib/sheet.ts`, `SheetLayer.svelte`, `SheetHost.svelte`, `sheets.css`.

1. On phone Today, press **Log → Kanin → Portion**. This is exactly three stacked sheets: Log, Food detail, Change
   serving.
2. Drag the top sheet down 120–180px from the grip. It follows the finger continuously and closes when past 25% of its
   height. The detail and Log layers underneath must stay still.
3. Reopen Portion. Drag it slowly 25px, then release. It springs back without losing its state.
4. Hold the grip, then flick downward 60px quickly. It closes even below the distance threshold.
5. In Search, scroll a long result list down. A downward gesture first scrolls the list; it does not drag the sheet.
   Return fully to the top and repeat: the sheet can now follow the finger.
6. Search “itlog”, open its detail and Portion. Pan the horizontally scrollable USDA serving presets. The sheet must
   stay still. Dragging in an input must not dismiss it. No range sliders exist in this build; the handler explicitly
   excludes inputs and `[role=slider]` for that case.
7. On desktop, verify mouse drag on the grip and ordinary clicks on every sheet button. Mouse capture starts only on the
   grip, so clicks in the content remain usable.

## Essential 4 — Back is one layer

Implementation: `src/lib/navigation.ts`; regression checked by `scripts/test-state.ts`.

1. Open Log → Kanin → Portion on phone. Press Android Back, browser Back or the platform edge-back gesture three times.
   Each action closes one sheet; the third returns to Today instead of leaving the app.
2. Reopen the stack, change rice to 158g and apply. Confirm the detail shows 158g after the top layer closes.
3. Save the item. Back must not replay a confirmed logging stack.
4. Open Progress from Today, then use browser Back. Return to the prior app screen.
5. In desktop DevTools, add an unrelated field to `history.state`, then open/close layers. Verify it remains intact. The
   automated history test already checks an equivalent unrelated state field.

## Essential 5 — no opening bounce

Implementation: shell `overflow: clip`, `sheet.ts` focus with `preventScroll`, opacity-only inner entrance.

1. Scroll Today halfway down, open Log, then open and close all three layers. The underlying scroll position must stay.
2. Focus a serving input on a real phone. Watch the keyboard opening; the shell should not jump to an unrelated
   position.
3. Immediately begin a drag during opening. There must be no second transform fighting the finger.

## Essential 6 — phone zoom and controls

Implementation: viewport metadata on both layouts; `touch-action: manipulation`; global 16px input styles.

1. At 390×844 touch, try pinch and double-tap zoom in the demo and calculator. The configured viewport must hold.
2. Focus every input type: search, number, date, password, select and textarea. Computed font size is at least 16px.
3. Confirm the phone's normal browser keyboard remains usable and no input-focus zoom occurs.

## Essential 7 — responsive layout and touch targets

Implementation: responsive styles, `min-width`/`min-height` on controls, bounded grids and explicit chart scrollers.

1. Inspect website home, recipe, library item, FAQ, calculator and quiz at widths **360, 390, 768 and 1440px**.
2. Inspect Today, Foods, Profile, Progress and all sheets at those widths. There must be no outer horizontal scrolling,
   overlapping labels or truncated meaningful text. Long food names wrap.
3. Weekly bars, macro days and serving presets may scroll **inside** their explicit horizontal containers. They must not
   widen the page or start sheet dragging.
4. Inspect interactive control boxes: at least 44×44px. Inline prose links follow the normal inline-link exception;
   navigation and standalone links have generous touch areas. Check the small dish detail arrow and raised Log control.
5. Scroll content under the phone tab bar and desktop chrome; both stay fully opaque.

## Essential 8 — safe areas and zoom compensation

Implementation: `viewport-fit=cover`, safe-area padding/tab offsets and full-height `--zoom` compensation.

1. On a notched phone, check top headings, sheet bottoms, tab bar and both landscape sides.
2. Rotate once with a sheet open; it must remain bounded and dismissible.
3. Repeat Desktop site mode. Inspect `--zoom` and verify the visible shell fits the physical viewport.

## Essential 9 — loading, empty, error and offline

Implementation: `Workspace.svelte`, `FoodSearch.svelte`, `Snap.svelte`, `Diary.svelte`, `Progress.svelte`, store/API
clients.

1. Clear site data, reload and observe the loading message until local data is hydrated.
2. Search an impossible food name. Expect an empty-search explanation. Inspect an empty Dinner meal and a future diary
   day. Each offers a useful next action. An empty weight range explains how to add a weigh-in.
3. In DevTools, block localStorage or provide invalid JSON/schema data, then reload. The app remains usable and explains
   session-only persistence or the recovered mock diary. Automated state tests cover these cases too.
4. Install/cache the app online; wait for its service worker to activate. Disable network, close and reopen the app URL.
   The shell, fonts, sample photos, recipes and bundled ingredient search must work. Log and edit a plate offline.
5. Search “kangkong” while offline: bundled results remain. Try a new barcode: expect an actionable unavailable message.
6. Force USDA 429 or block its API. Local matches stay visible. Rapidly change search text; superseded requests abort.
7. Try an unknown or incomplete OFF barcode. Nothing is invented. Repeat a lookup within five seconds; a rate-limit
   spacing message appears. Mock responses can verify 429 without burdening a public API.
8. Simulated Snap displays a reading state, then review; reduced motion skips its delay.

## Essential 10 — themes, focus, Escape and semantics

Implementation: tokens, global focus styles, named Lucide buttons, sheet trap/restore, reduced-motion rules, layouts.

1. Toggle themes on the site and in You. Reload to confirm persistence when storage is allowed.
2. Check the contrast table in `docs/design.md` against computed colors. Colored cards always use charcoal text.
3. Keyboard through navigation, chart days, logging routes, portions, forms, settings and dialog close controls. Focus
   must remain visible. Open a dialog, Tab and Shift+Tab at its ends, then Escape. Focus returns to the opener.
4. Turn on reduced motion. Sheets avoid entrance movement, springback transitions shorten and Snap skips delays.
5. Screen-reader check: main/nav/aside landmarks, meaningful headings, chart labels/table alternative, named icon
   buttons, source labels and form labels. Only the top sheet is interactive; lower layers and the shell are inert.

## Feature walkthroughs and capture plan

| Feature         | Phone 390×844 touch                                                 | Desktop 1440×900                         | Expected result / implementation                                          |
| --------------- | ------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| Onboarding      | You → Revisit onboarding; change example, then Set my table or Skip | Same through rail Settings               | Editable goals, retained mock meals; `Onboarding`, `ProfileForm`          |
| Today           | Scroll all color cards and diary                                    | Overview above diary plus sticky summary | One total source; `Today`, `DaySummary`, `Diary`                          |
| Turo-turo       | Log → Turo-turo; select two dishes, half/extra, rice cups           | Same in centered dialog                  | Ingredient totals and source marks; `TuroTuro`, `CountMath`               |
| Snap            | Log → Snap; pick photo, wait, edit grams, confirm                   | Same, including keyboard                 | Labelled simulation; USDA-mapped items; `Snap`                            |
| Search          | Type “kangkong”, quickly replace it with “rice”                     | Search circle or Log menu                | Latest query wins; cached/fallback matches; `FoodSearch`, `fdc.ts`        |
| Barcode         | Enter digits; optionally allow supported camera                     | Manual digits or supported camera        | OFF source, complete nutrition only; `BarcodeScanner`, `off.ts`           |
| Food detail     | Log → Kanin → Portion; 158g; Add                                    | Same with Tab/Escape                     | Nested serving preserved, one logged entry; `FoodDetail`, `ServingPicker` |
| Meal editing    | Tap logged row, change grams, Save; then Remove                     | Same                                     | Meal, summary and chart totals update together                            |
| Water/streak    | +250ml, then remove 250ml; inspect streak label                     | Same                                     | Water floor 0; mock-history streak derived from entries                   |
| Progress        | Select 7/30/90 days; open chart table                               | Same, wider chart                        | Calories, goal, macro averages, dated weight trend; `Progress`            |
| Weight          | Plus on weight card; choose historical date; save twice             | Same                                     | One value per date, editable; `WeightEditor`                              |
| Recipes         | Foods → recipe → detail → Add                                       | Same through rail                        | Ingredient-computed nutrition; `Foods`, shared catalogue                  |
| Coach           | Ask protein; try tomorrow’s ulam; type another question             | Same                                     | Visible scripted label, no AI call; `Coach`                               |
| Settings        | Change goals, theme, units and optional API key                     | Same                                     | Local only; key excluded from export; `Profile`                           |
| Export/reset    | Export JSON; inspect sources; restore fresh demo                    | Same                                     | Fresh deterministic history; no stale goal form                           |
| Quiz handoff    | Finish quiz → demo onboarding                                       | Same                                     | Actual age, constants, measurements, activity, goal and target prefilled  |
| Forms           | Contact and Partnerships: invalid then valid submission             | Same with keyboard                       | “This is a concept, nothing was sent.” No request leaves form             |
| Website content | Browse each page type; search FAQ/library/help                      | Same; inspect breadcrumbs and meta       | 258 static pages, licensed images, no dead store badges                   |
| PWA             | Install on iPhone Safari/Android Chrome; test offline               | Install when browser offers it           | Correct manifest scope, safe cache namespace, 404 preserved online        |

Capture the following only after manual review; no placeholder screenshots are included:

- `docs/screenshots/site-1.png`: 1440×900 home hero, dark theme.
- `docs/screenshots/site-2.png`: home Three ways in section or kitchen/recipe composition.
- `docs/screenshots/app-phone-1.png`: Today at 390×844 with touch.
- `docs/screenshots/app-phone-2.png`: Log → Kanin → Portion (three visible layer edges).
- `docs/screenshots/app-phone-3.png`: Turo-turo with chosen dish/rice and computed total.
- `docs/screenshots/app-phone-4.png`: Foods or Progress, ideally light variant for contrast review.
- `docs/screenshots/app-web-1.png`: web overview at 1440×900.
- `docs/screenshots/app-web-2.png`: diary plus sticky summary, or web Turo-turo dialog.

## Preview smoke test record

The final run starts Astro preview once, requests `/busog/`, `/busog/app/`, `/busog/recipes/`,
`/busog/recipes/adobong-manok/`, `/busog/library/food/kanin-white-rice-cooked-rice/` and a missing URL, then stops
preview. Expected statuses are 200 for the first five and 404 for the missing path. Exact results are appended after
execution.

Executed preview results: home **200**, app **200**, recipes index **200**, adobong-manok **200**, kanin food page
**200**, missing route **404** with the custom empty-plate content. A static audit inspected all **258 HTML pages** and
the offline manifest: **0 broken internal href/src paths or missing offline files**. Astro 7 preview runs as a daemon;
it was started once and stopped with `astro preview stop`. No browser was started and no reviewer screenshot files were
fabricated.
