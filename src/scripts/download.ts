// Loaded on the download page (a hashed file under /_astro/). Reads the release manifest, treats it as
// untrusted input (lib/releases.ts), and fills in the page. The static table works complete without JS; any
// failure or offline preview falls back to it cleanly. Stores nothing and sends nothing about the visitor.
import { detectPlatform, parseManifest, platforms, type Platform, type ReleaseInfo } from '../lib/releases';

const root = document.querySelector<HTMLElement>('[data-download]');
if (root) void run(root);

const fill = (template: string, values: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

async function loadManifest(root: HTMLElement): Promise<ReleaseInfo | null> {
  const url = root.dataset.releases;
  if (!url) return null;
  // Local static preview (`serve.mjs dist` / `astro preview`) does not host nginx's /releases.json.
  if ((location.hostname === '127.0.0.1' || location.hostname === 'localhost') && root.dataset.forceReleases !== 'true') {
    return null;
  }
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

  for (const [platform, row] of rows) {
    const download = info.downloads[platform];
    const cell = row.querySelector('[data-action]');
    if (!download || !cell) continue;
    const link = document.createElement('a');
    link.href = download.url;
    link.rel = 'noopener';
    link.className = 'table-action-link';
    const direct = new URL(download.url).hostname === dlHost;
    link.textContent = !direct && download.label ? download.label : get;
    cell.replaceChildren(link);
  }

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
    const labelTarget = primaryLink.querySelector<HTMLElement>('[data-primary-label]') ?? primaryLink;
    labelTarget.textContent = fill(root.dataset.primaryTemplate ?? '', { platform: rows.get(mine)?.dataset.name ?? '' });
    primaryLink.hidden = false;
  }
  primary.hidden = false;
}
