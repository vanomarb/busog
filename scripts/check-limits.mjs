import { readdir, readFile } from 'node:fs/promises';

/** Check handwritten source stays reviewable without counting generated nutrition data. */
async function inspect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const failures = [];
  for (const entry of entries) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) failures.push(...(await inspect(path)));
    else if (/\.(ts|js|mjs|svelte|astro|css|py|svg)$/.test(path)) {
      const lines = (await readFile(path, 'utf8')).trimEnd().split('\n');
      if (lines.length > 250) failures.push(`${path}: ${lines.length} lines`);
      lines.forEach((line, index) => {
        if (line.length > 120) failures.push(`${path}:${index + 1}: ${line.length} characters`);
        // A wrapped SVG must break between attributes; a name split across lines makes the file unreadable.
        if (path.endsWith('.svg') && /[a-z]-$/.test(line)) failures.push(`${path}:${index + 1}: split attribute name`);
      });
    }
  }
  return failures;
}
const failures = (await Promise.all(['src', 'scripts', 'public'].map(inspect))).flat();
process.stdout.write(
  failures.length ? `${failures.join('\n')}\n` : 'Oversized source files: none. Long source lines: none.\n',
);
if (failures.length) process.exitCode = 1;
