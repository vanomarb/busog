import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

/** Publish a hashed-asset list so a first installed visit can reliably reopen offline. */
async function collect(directory) {
  const items = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const item of items) {
    const path = `${directory}/${item.name}`;
    if (item.isDirectory()) files.push(...(await collect(path)));
    else files.push(path);
  }
  return files;
}
const files = await collect('dist');
const assets = files
  .filter((path) => /\/_astro\/[^/]+\.[\w-]{8,}\./.test(path))
  .map((path) => `/busog/${path.slice(5)}`);
const images = files.filter((path) => path.startsWith('dist/images/')).map((path) => `/busog/${path.slice(5)}`);
await writeFile('dist/offline-assets.json', JSON.stringify([...assets, ...images]));
const version = createHash('sha256').update(assets.join('\n')).digest('hex').slice(0, 12);
const worker = await readFile('dist/sw.js', 'utf8');
await writeFile('dist/sw.js', worker.replace("'busog-v1'", `'busog-${version}'`));
const site = process.env.SITE_URL || 'https://busog-demo.github.io';
const routes = files.filter((path) => path.endsWith('/index.html')).map((path) => path.slice(5, -10));
const urls = routes.map((path) => `<url><loc>${site}/busog/${path}</loc></url>`).join('\n');
await writeFile(
  'dist/sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /busog/\nSitemap: ${site}/busog/sitemap.xml\n`);
process.stdout.write(`Offline manifest: ${assets.length} hashed assets. Sitemap: ${routes.length} pages.\n`);
