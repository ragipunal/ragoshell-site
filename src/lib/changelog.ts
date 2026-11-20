// Parser for the application repository's CHANGELOG: a title underlined with `=`, then one block per
// release: a heading line "<name> <version>" underlined with `-`, optional intro lines, then `- ` bullets whose
// long items continue on indented lines. Any other line is an error, so a format change fails the build
// instead of rendering garbage.

export interface ChangelogRelease {
  version: string;
  /** Free text between the heading and the first bullet, as one paragraph; empty when there is none. */
  intro: string;
  items: string[];
}

const HEADING = /^\S.*?\s+(\d+\.\d+(?:\.\d+)?(?:[-+][0-9A-Za-z.-]+)?)$/;
const UNDERLINE_DASH = /^-{3,}$/;
const UNDERLINE_EQ = /^={3,}$/;

export function parseChangelog(text: string): ChangelogRelease[] {
  const lines = text.split(/\r?\n/).map((l) => l.replace(/\s+$/, ''));
  const releases: ChangelogRelease[] = [];
  const fail = (n: number, message: string): never => {
    throw new Error(`CHANGELOG line ${n + 1}: ${message}: "${lines[n]}"`);
  };

  let i = 0;
  while (i < lines.length && lines[i] === '') i++;
  if (i >= lines.length || !UNDERLINE_EQ.test(lines[i + 1] ?? '')) fail(Math.min(i, lines.length - 1), 'expected the title underlined with "="');
  i += 2;

  let current: ChangelogRelease | null = null;
  let introLines: string[] = [];
  let last = -1; // index of the bullet that indented lines continue, or -1

  const finishIntro = () => {
    if (current && introLines.length > 0) current.intro = introLines.join(' ');
    introLines = [];
  };

  for (; i < lines.length; i++) {
    const line = lines[i];
    if (line === '') {
      last = -1;
      continue;
    }
    if (!/^\s/.test(line) && !line.startsWith('- ') && UNDERLINE_DASH.test(lines[i + 1] ?? '')) {
      finishIntro();
      const m = HEADING.exec(line);
      if (!m) fail(i, 'release heading without a version');
      current = { version: m![1], intro: '', items: [] };
      releases.push(current);
      last = -1;
      i++; // the underline
      continue;
    }
    if (!current) fail(i, 'text before the first release heading');
    if (line.startsWith('- ')) {
      finishIntro();
      current!.items.push(line.slice(2).trim());
      last = current!.items.length - 1;
    } else if (/^\s+\S/.test(line)) {
      if (last < 0) fail(i, 'indented line that continues no bullet');
      current!.items[last] += ` ${line.trim()}`;
    } else if (current!.items.length === 0) {
      introLines.push(line.trim());
    } else {
      fail(i, 'text after the bullets of a release');
    }
  }
  finishIntro();

  if (releases.length === 0) throw new Error('CHANGELOG has no release block');
  for (const r of releases) if (r.items.length === 0) throw new Error(`CHANGELOG release ${r.version} has no bullets`);
  return releases;
}

/** Splits `text with `code` spans` into pieces so a page can render the spans as <code> without raw HTML. */
export function codeSpans(text: string): { code: boolean; text: string }[] {
  return text
    .split(/(`[^`]+`)/)
    .filter((part) => part !== '')
    .map((part) =>
      part.length > 1 && part.startsWith('`') && part.endsWith('`')
        ? { code: true, text: part.slice(1, -1) }
        : { code: false, text: part },
    );
}

/** Anchor id of a release section: 2.1.0 becomes v2-1-0. */
export function releaseAnchor(version: string): string {
  return `v${version.replace(/[^0-9A-Za-z]+/g, '-')}`;
}
