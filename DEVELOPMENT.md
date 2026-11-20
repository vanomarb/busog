# Development

## Run it

```sh
npm ci
npm run dev
```

Open `http://localhost:4321/busog/`. The site is always served under `/busog/`, as on GitHub Pages. The app is at
`/busog/app/`; add `?frame=phone` to see it in a phone frame on desktop, or `?onboarding=1` to start with onboarding.

The service worker registers only in a production build, so test offline use and installing with `npm run build` and
`npm run preview`.

## Scripts

| Command                | What it does                                                                 |
| ---------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`          | Starts the dev server                                                        |
| `npm run test:domain`  | Runs the tests: nutrition math, goals, dates and the app's stored state      |
| `npm run check`        | Type-checks the Astro and Svelte code; Svelte warnings fail                  |
| `npm run lint`         | Runs ESLint                                                                  |
| `npm run format:check` | Checks formatting with Prettier; `npm run format` fixes it                   |
| `npm run check:limits` | Fails on handwritten source files or lines that are too long                 |
| `npm run quality`      | Runs `format`, then every check above                                        |
| `npm run build`        | Builds the site into `dist/`, then writes the offline asset list and sitemap |
| `npm run preview`      | Serves `dist/` at `http://localhost:4321/busog/`                             |

## Deploy

Every push to `main` runs `.github/workflows/pages.yml`. It checks formatting, lint, types and source limits, runs the
tests, builds, and publishes `dist/` to GitHub Pages at `https://<username>.github.io/busog/`. In the repository's Pages
settings, the source must be GitHub Actions.

The workflow passes the repository's Pages address to the build as `SITE_URL`, and canonical links, Open Graph images
and the sitemap are built from it. A local build uses the preview address, `http://localhost:4321/busog/`. The address
must end in the `/busog/` base, which is set in `astro.config.mjs`.
