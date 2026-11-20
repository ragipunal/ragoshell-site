// Pure helpers of the download page script: the manifest (`/releases.json`) is untrusted input, and the
// platform guess uses only what the browser exposes. Kept free of DOM and imports so a node script can test it.

export const platforms = ['windows', 'macos', 'linux', 'android', 'ios'] as const;
export type Platform = (typeof platforms)[number];

export interface ReleaseDownload {
  url: string;
  /** Text from the manifest (for example a store name), or '' when it was missing or unusable. */
  label: string;
}

export interface ReleaseInfo {
  version: string;
  /** YYYY-MM-DD, or null. */
  date: string | null;
  downloads: Partial<Record<Platform, ReleaseDownload>>;
}

const VERSION = /^[0-9A-Za-z][0-9A-Za-z.+-]{0,31}$/;
const DATE = /^\d{4}-\d{2}-\d{2}/;

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** The URL as a string when it is https, has no credentials and its host is on the allowlist; otherwise null. */
export function safeUrl(value: unknown, allowedHosts: readonly string[]): string | null {
  if (typeof value !== 'string' || value.length > 2048) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || url.username !== '' || url.password !== '') return null;
  return allowedHosts.includes(url.hostname) ? url.href : null;
}

/** Validates a parsed manifest; returns null when it is unusable. Unknown fields are ignored. */
export function parseManifest(input: unknown, allowedHosts: readonly string[]): ReleaseInfo | null {
  if (!isRecord(input)) return null;
  const version = input.latestVersion;
  if (typeof version !== 'string' || !VERSION.test(version)) return null;
  const published = input.publishedAt;
  const date = typeof published === 'string' && DATE.test(published) ? published.slice(0, 10) : null;

  const downloads: ReleaseInfo['downloads'] = {};
  if (isRecord(input.downloads)) {
    for (const platform of platforms) {
      const entry = input.downloads[platform];
      if (!isRecord(entry)) continue;
      const url = safeUrl(entry.url, allowedHosts);
      if (url === null) continue;
      const label = typeof entry.label === 'string' ? entry.label.trim() : '';
      downloads[platform] = { url, label: label.length > 0 && label.length <= 40 ? label : '' };
    }
  }
  return { version, date, downloads };
}

export interface BrowserFacts {
  userAgent: string;
  /** `navigator.userAgentData?.platform` when present, else `navigator.platform`. */
  platform: string;
  maxTouchPoints: number;
}

/** Best guess of the visitor's platform among the five, or null (for example ChromeOS or unknown). */
export function detectPlatform(facts: BrowserFacts): Platform | null {
  const ua = facts.userAgent.toLowerCase();
  const platform = facts.platform.toLowerCase();
  if (ua.includes('android')) return 'android';
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  // iPadOS reports itself as a Mac; a Mac has no touch screen
  if ((platform.includes('mac') || ua.includes('macintosh')) && facts.maxTouchPoints > 1) return 'ios';
  if (ua.includes('cros')) return null;
  if (platform.includes('win') || ua.includes('windows')) return 'windows';
  if (platform.includes('mac') || ua.includes('macintosh')) return 'macos';
  if (platform.includes('linux') || ua.includes('linux') || ua.includes('x11')) return 'linux';
  return null;
}
