// Build inspection gate. With a folder (`npm run check:dist`) it inspects that build; without one
// (`npm run check`) it first builds into a temporary folder, so the check runs before the real build.
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import site from '../site.config.mjs';
import { inspect } from './lib/inspect-dist.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = process.argv[2];

let dir;
let temp;
if (arg) {
  dir = resolve(root, arg);
} else {
  // Inside the project, not os.tmpdir(): Astro moves its build output with rename(), which fails across
  // devices (EXDEV) when /tmp is a different mount than the checkout, as on the CI runner.
  const cache = join(root, 'node_modules', '.cache');
  mkdirSync(cache, { recursive: true });
  temp = mkdtempSync(join(cache, 'site-check-'));
  dir = temp;
  const astro = join(root, 'node_modules', 'astro', 'bin', 'astro.mjs');
  const build = spawnSync(process.execPath, [astro, 'build', '--outDir', temp], {
    cwd: root,
    stdio: ['ignore', 'ignore', 'inherit'],
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
  });
  if (build.status !== 0) {
    rmSync(temp, { recursive: true, force: true });
    console.error('check-site: the temporary build failed');
    process.exit(1);
  }
}

let result;
try {
  result = inspect(dir, site);
} finally {
  if (temp) rmSync(temp, { recursive: true, force: true });
}

if (result.problems.length > 0) {
  console.error(`check-site: ${result.problems.length} problem(s)\n  ${result.problems.join('\n  ')}`);
  process.exit(1);
}
console.log(
  `check-site: ${result.pages} page(s) inspected, no problems (broken links 0, inline script/style 0, external loads 0; sitemap, canonical, hreflang, share cards, JSON-LD checked)`,
);
