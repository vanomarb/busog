# Busog design direction

Dark, quiet and photo-led. Near-black surfaces, one warm accent for actions and the selected state, three macro colours
kept for data, real food photos, and one geometric sans in sentence case. The layout vocabulary (an icon rail, a bento
of rounded cards, pill filters, round detail buttons) comes from
[AI-Powered Mobile App for Restaurant Operations by tubik](https://dribbble.com/shots/26787072-AI-Powered-Mobile-App-for-Restaurant-Operations);
the surfaces, accent and photo-forward cards follow modern food and fitness app references. No reference artwork, photos
or copy are reused.

## The idea

Three ways in, one plate: pointing at dishes at the Turo-turo counter, snapping a plate, and USDA search or Open Food
Facts barcode lookup all produce the same typed food entry and the same computed totals, each keeping its source mark.

## Composition

- **Desktop app:** dark shell with a narrow icon rail, a breadcrumb top bar, and a bento of dark cards: weekly calories
  with side stats, a nudge, macro balance, the Turo-turo counter as dish photos, the meal-timing dial and the coach.
- **Phone app:** one full-screen shell, large sentence-case titles, stacked cards, an icon-only floating tab bar with a
  raised orange Log button. Sheets fill at most 88% of the screen and scroll inside themselves.
- **Website:** a hero with two real phone screens (captured from the app into `public/images/app/`), photo-led feature
  cards, recipe cards with the photo on top, and plain reading pages.

## Typography

Plus Jakarta Sans throughout (400/500/600/700, latin, self-hosted, the two hero weights preloaded). Headings are bold,
sentence case and tightly tracked; figures use tabular numbers. One scale in `src/styles/tokens.css` runs from
`--text-2xs` (12px) to `--text-display`; nothing is smaller than 12px and form controls are at least 16px on phones.

## Colour and contrast

Cards are dark in both themes; colour lives in what they show. Tone classes (`.coral`, `.violet`, `.aqua`, `.sage`,
`.yellow`) set `--tone` for a card's bars, selected states and icons. The selected state is the accent; quiet active
states (tab bar, rail, chips) are an inverted ink pill.

| Theme | Foreground        | Background       | Ratio   |
| ----- | ----------------- | ---------------- | ------- |
| Dark  | ink #f4f4f5       | surface #161719  | 16.32:1 |
| Dark  | ink #f4f4f5       | raised-2 #2c2d32 | 12.50:1 |
| Dark  | muted #a3a5ac     | raised-2 #2c2d32 | 5.58:1  |
| Dark  | on-accent #161719 | accent #ff6b3d   | 6.34:1  |
| Dark  | accent #ff6b3d    | raised #212226   | 5.62:1  |
| Light | ink #161719       | raised #ffffff   | 17.94:1 |
| Light | muted #5d5f66     | raised-2 #efeff1 | 5.55:1  |
| Light | on-accent #161719 | accent #e8552a   | 4.92:1  |

Accent and macro colours on light surfaces are used for graphics and icons (3:1 or better), never for small text; delta
chips use ink text on a tinted fill.

## Components

Weekly bars: solid tracks, tone-coloured fills, hatched future days, the selected day as an accent pill. Day circles
show percent of goal. Food rows and recipe cards lead with the dish photo; names on photos sit on a dark scrim. The
Turo-turo counter is a grid of photo tiles with one check badge for the selected state. Lucide icons share one stroke.

## Motion and accessibility

`src/styles/motion.css`: site pages cross-fade with view transitions, cards rise in on scroll where supported, app
screens rise in and dashboard cards stagger. Sheet drags follow the finger directly and spring back or dismiss. Reduced
motion turns all of it off. Focus rings are visible everywhere; sheets trap focus and close with Escape on desktop.

## Honesty

No accounts, user counts, ratings, testimonials or store badges. Photo logging in the preview uses sample plates and
says so; Busog Coach is labelled an early preview. Recipes are Busog's own ingredient lists with visible arithmetic.
Every dish photo is openly licensed and credited from `src/data/photos.json`.
