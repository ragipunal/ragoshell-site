// Reads the files this site publishes from the application repository (checked out next to this one, or
// wherever the environment variable named in site.config.mjs points). Build time only.
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import site from '../../site.config.mjs';
import { parseChangelog, type ChangelogRelease } from './changelog.ts';
import { docSlug } from './slug.ts';

const OLD_NAME = /rago[\s_-]?mongo/i;

export function appRepoDir(): string {
  const fromEnv = process.env[site.docs.repoEnv];
  return fromEnv ? resolve(fromEnv) : resolve(process.cwd(), '..', site.productId);
}

export function readAppFile(relative: string): string {
  const file = join(appRepoDir(), relative);
  if (!existsSync(file)) {
    throw new Error(
      `application repository: ${relative} not found at ${file}. ` +
        `Check out the application repository next to this one or set ${site.docs.repoEnv} to its folder.`,
    );
  }
  const text = readFileSync(file, 'utf8');
  if (OLD_NAME.test(text)) throw new Error(`application repository: ${relative} spells the pre-rename name`);
  return text;
}

export interface PublishedDoc {
  /** File stem, for example `McpServer`. */
  name: string;
  slug: string;
  source: string;
}

/** Only the documents on the allowlist are read. */
export function publishedDocs(): PublishedDoc[] {
  return site.docs.publish.map((name: string) => ({
    name,
    slug: docSlug(name),
    source: readAppFile(`docs/${name}.md`),
  }));
}

export function changelogReleases(): ChangelogRelease[] {
  return parseChangelog(readAppFile('CHANGELOG'));
}
