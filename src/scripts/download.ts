// The only script of the site, loaded by the download page only (a hashed file under /_astro/). It reads the
// release manifest, treats it as untrusted input (lib/releases.ts), and fills in the page. The page is complete
// without it, so any failure just leaves the static table. It stores nothing and sends nothing about the visitor.
import { detectPlatform, parseManifest, platforms, type Platform, type ReleaseInfo } from '../lib/releases';

const root = document.querySelector<HTMLElement>('[data-download]');
if (root) void run(root);

const fill = (template: string, values: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

async function loadManifest(root: HTMLElement): Promise<ReleaseInfo | null> {
  const url = root.dataset.releases;
  if (!url) return null;
  const hosts = (root.dataset.hosts ?? '').split(',').filter(Boolean);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, { cache: 'no-store', credentials: 'omit', signal: controller.signal });
    if (!response.ok) return null;
    return parseManifest(await response.json(), hosts);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function run(root: HTMLElement): Promise<void> {
  const info = await loadManifest(root);
  if (!info) return;

  const get = root.dataset.get ?? '';
  const dlHost = root.dataset.dlHost ?? '';
  const rows = new Map<Platform, HTMLTableRowElement>();
  for (const row of root.querySelectorAll<HTMLTableRowElement>('tr[data-platform]')) {
    const platform = row.dataset.platform as Platform;
    if ((platforms as readonly string[]).includes(platform)) rows.set(platform, row);
  }

  // table: a direct link wherever the manifest has one
  for (const [platform, row] of rows) {
    const download = info.downloads[platform];
    const cell = row.querySelector('[data-action]');
    if (!download || !cell) continue;
    const link = document.createElement('a');
    link.href = download.url;
    link.rel = 'noopener';
    const direct = new URL(download.url).hostname === dlHost;
    link.textContent = !direct && download.label ? download.label : get;
    cell.replaceChildren(link);
  }

  // the visitor's platform, highlighted
  const primary = root.querySelector<HTMLElement>('[data-primary]');
  const versionText = root.querySelector<HTMLElement>('[data-version-text]');
  const primaryLink = root.querySelector<HTMLAnchorElement>('[data-primary-link]');
  if (!primary || !versionText || !primaryLink) return;

  let text = fill(root.dataset.versionTemplate ?? '', { version: info.version });
  if (info.date) text += ` · ${fill(root.dataset.releasedTemplate ?? '', { date: info.date })}`;
  versionText.textContent = text;

  const mine = detectPlatform({
    userAgent: navigator.userAgent,
    platform: (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? navigator.platform ?? '',
    maxTouchPoints: navigator.maxTouchPoints ?? 0,
  });
  const download = mine ? info.downloads[mine] : undefined;
  if (mine && download) {
    primaryLink.href = download.url;
    primaryLink.rel = 'noopener';
    primaryLink.textContent = fill(root.dataset.primaryTemplate ?? '', { platform: rows.get(mine)?.dataset.name ?? '' });
    primaryLink.hidden = false;
  }
  primary.hidden = false;
}
