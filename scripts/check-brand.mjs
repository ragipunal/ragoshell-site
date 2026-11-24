// Brand gate: the product name is spelled once, in site.config.mjs. Fails when
//  - any other code, data or published content file (`content/`) spells it (any case, with or without a space, hyphen or underscore inside),
//  - any file or folder name spells it,
//  - any file at all spells the pre-rename name.
// Internal repository documentation (docs/*.md, README.md, *.mdc, LICENSE*) may name the product; it is not shipped, so only the old name is checked there.
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', '.astro', '.agents', '.claude', '.cursor', '.gitea', 'docs', '.jury', '.shots']);
const SKIP_FILES = new Set(['package-lock.json']);
const CODE_EXT = new Set([
  '.astro', '.ts', '.mjs', '.js', '.cjs', '.json', '.css', '.svg', '.txt', '.yml', '.yaml', '.html', '.xml', '.toml',
]);
const ALLOWED = new Set(['site.config.mjs']);

// Written as patterns so this file does not contain either name itself.
const NAME = /rago[\s_-]?shell/i;
const OLD_NAME = /rago[\s_-]?mongo/i;

const problems = [];

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(join(dir, entry.name));
    } else if (entry.isFile() && !SKIP_FILES.has(entry.name)) {
      yield join(dir, entry.name);
    }
  }
}

for (const file of walk(root)) {
  const rel = relative(root, file).split(sep).join('/');
  if (ALLOWED.has(rel)) continue;
  if (NAME.test(rel)) problems.push(`${rel}: the file path spells the product name`);

  const buffer = readFileSync(file);
  if (buffer.includes(0)) continue; // binary
  const lines = buffer.toString('utf8').split(/\r?\n/);
  const isCode = CODE_EXT.has(extname(file).toLowerCase()) || rel.startsWith('content/');
  lines.forEach((line, i) => {
    if (isCode && NAME.test(line)) problems.push(`${rel}:${i + 1}: spells the product name; read it from site.config.mjs`);
    if (OLD_NAME.test(line)) problems.push(`${rel}:${i + 1}: spells the pre-rename name`);
  });
}

if (problems.length > 0) {
  console.error(`check-brand: ${problems.length} hit(s)\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log('check-brand: 0 hits (the name is spelled only in site.config.mjs)');
