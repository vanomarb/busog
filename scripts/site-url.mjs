// The published address, ending in a slash: the Pages workflow passes the repo's address; local builds use the preview.
export const SITE_URL = (process.env.SITE_URL || 'http://localhost:4321/busog/').replace(/\/?$/, '/');

// Every route and link is under the /busog/ base (astro.config.mjs), so the address must end there too.
if (new URL(SITE_URL).pathname !== '/busog/') {
  throw new Error(`SITE_URL must end in /busog/, not "${SITE_URL}".`);
}
