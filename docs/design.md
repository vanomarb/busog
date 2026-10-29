# Busog design direction

The final owner update supersedes the original warm editorial direction. Primary visual reference:
[AI-Powered Mobile App for Restaurant Operations by tubik](https://dribbble.com/shots/26787072-AI-Powered-Mobile-App-for-Restaurant-Operations).
The supplied desktop and phone images were studied directly. No reference art or words are reused.

## The idea

Three ways in, one plate: pointing at ulam, reviewing a simulated photo, and USDA search/OFF barcode lookup all produce
the same typed food entry and computed totals. Provenance remains attached. Turo-turo makes this Filipino-first product
recognizable without requiring a mascot or unsupported accuracy claims.

## Composition

Desktop app: sage canvas, charcoal rounded shell, narrow icon rail, breadcrumb top bar, day selector and notification
circle. Asymmetric bento: coral weekly calories with side stats; yellow nudge above violet macro balance; aqua
illustrated counter; sage meal dial; charcoal scripted coach. Diary and sticky summary follow. Phone: one full-screen
mounted shell, colored headers, stacked cards, opaque floating pill navigation and a coral raised log action. The same
URL chooses its layout before paint. Forced phone view adds a restrained frame.

Marketing: large condensed statements and an actual component-built app preview. An asymmetric source-path section leads
to a broad recipe strip, readable editorial content and a practical final demo CTA. Avoid repeating identical card grids
for every section. Content pages prioritize reading; uppercase is reserved for display titles.

## Typography and rhythm

Self-host Barlow Condensed 600/700 for display, IBM Plex Mono 400/500 for figures, chips and labels, and DM Sans
400/500/600 for readable prose. Display scale 88/72/56/40 desktop, 56/44/36/28 phone; body 18/16, small labels 12/13.
Use 8px spacing increments, 24px card padding, 32px major card radii, 40px desktop shell radius, full pill controls.
Numbers are tabular. Body lines stay below 75 characters. Controls are at least 44px; mobile inputs at least 16px.

## Palette and contrast

Flat fills only. Colored cards always use #20231f text, including coral and periwinkle. Macro colors are aqua, yellow
and lavender; labels and positions convey their identity without relying on red/green discrimination. Dark is the
signature default. Light theme uses #eef3ec shell, #ffffff raised surfaces, #20231f text and #505b50 muted. The same
saturated card families remain in both. The following are WCAG relative-luminance contrast calculations:

| Foreground | Background |   Ratio |
| ---------- | ---------- | ------: |
| #f6f8f3    | #232522    | 14.45:1 |
| #bbc5b8    | #232522    |  8.68:1 |
| #f6f8f3    | #343632    | 11.42:1 |
| #20231f    | #ff705e    |  5.85:1 |
| #20231f    | #9690ff    |  5.85:1 |
| #20231f    | #bce9e7    | 12.07:1 |
| #20231f    | #c5d4ca    | 10.32:1 |
| #20231f    | #f5d369    | 10.90:1 |
| #20231f    | #cac4ff    |  9.72:1 |
| #20231f    | #eef3ec    | 14.12:1 |
| #505b50    | #eef3ec    |  6.32:1 |
| #505b50    | #ffffff    |  7.11:1 |

Dark tokens: background #c5d4ca, surface #232522, raised #343632, ink #f6f8f3, muted #bbc5b8, line #5b6259, primary
#bce9e7, accent #ff705e, success #b5d9ba, warning #f5d369, danger #ff9788, protein #bce9e7, carbs #f5d369, fat #cac4ff.

## Component rules

Cards use real headings, source labels and circular detail buttons. Weekly bars have hatched future/remaining areas,
dotted guides and a dark selected-day pill. Day circles show percent-of-goal with dark selection. Filters are pills.
Deltas compare computed prior periods of mock history. Timing uses a real 24-hour dial and logged timestamps; the
current clock uses Manila time. Nudges derive from remaining protein; countdown is live. Coach answers are scripted and
labelled. Food characters are original flat inline SVGs (rice, egg, banana, fish), used only in onboarding, the counter,
foods header and empty states. Lucide icons share stroke weight.

## Motion and accessibility

User-driven sheet movement is direct and unanimated; release springs back in 180ms or dismisses. Entrance uses opacity
and a separate inner transition, never competing with drag transforms. No decorative infinite motion. Reduced motion
removes transitions and scanning delays. Focus rings are solid and visible on both shell and cards. Sheets lock the
shell, focus without scrolling, trap keyboard focus, restore prior focus and dismiss with Escape. Topmost sheets alone
receive pointer drag; inner scroll must be at the top and controls/horizontal scrollers are excluded.

## Honesty and images

No accounts, claims of actual users, testimonials, store badges or fake integrations. Source recipes are illustrative
compositions, not laboratory measurements of a restaurant serving; the exact ingredient calculation is visible.
Recognition and coach replies are explicitly simulated. Every dish has an openly licensed photo of that dish, credited
from `src/data/photos.json`.

## Type scale and motion

Sizes come from one scale in `src/styles/tokens.css`: `--text-2xs` (12px) through `--text-display`. Mono labels sit at
12–13px; nothing is smaller. Motion tokens are `--fast` 160ms, `--base` 260ms, `--slow` 420ms with an ease-out curve.
Site pages cross-fade with view transitions; app screens rise in and cards stagger. `src/styles/motion.css` holds it
all, and reduced motion turns it off. Mockup UI comes from Busog components. Concept notes belong in the footer and
install page.

## Final implementation refinements

The design was reread during the polish pass. Dark chart strokes on periwinkle use separate line patterns (solid
protein, dashed carbs, dotted fat), plus labelled legend chips. These graphic-contrast ratios supplement the text table
above and apply in both themes because the colored card fills remain stable:

| Stroke  | Card    | Contrast |
| ------- | ------- | -------: |
| #234c43 | #9690ff |   3.54:1 |
| #614b00 | #9690ff |   3.07:1 |
| #20231f | #9690ff |   5.85:1 |

Small repeated chart/metadata labels use 9–12px mono in dense app cards; all form controls remain at least 16px.
Interactive chart days and serving presets retain 44px minimum targets and scroll in bounded horizontal containers on
narrow cards. The phone meal dial is followed by a real logged-meal timeline. The 07:00–21:00 demonstration eating
window is labelled as a demo assumption; its clock and nudge use live Manila time, while its arc spans logs.

The first-install worker precaches the shell, 69 hashed assets and eight licensed image variants. Only hashed assets use
cache-first; navigation and food photographs use network-first. Cache cleanup is restricted to `busog-` keys. The
compatible local runtime used for verification is Node 22.23.4; it is ignored, and the required version is recorded in
package engines and `.nvmrc`. No browser screenshots or touch results are claimed by this pass.
