// Pure validation for `site.cloud` and `site.demo`.
// Imported by `cloud.astro`, `index.astro`, and `download.astro` at build time and tested in `scripts/check-content.mjs`.

export interface CloudConfig {
  mode: 'soon' | 'live';
  registerUrl?: string;
  loginUrl?: string;
  donateUrl: string;
}

export interface DemoConfig {
  enabled: boolean;
  url: string;
}

function assertHttpsUrl(raw: unknown, field: string, scope = 'cloud'): void {
  if (typeof raw !== 'string' || raw.trim() === '') {
    throw new Error(`${scope}: missing ${field}`);
  }
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`${scope}: ${field} "${raw}" is not a valid URL`);
  }
  if (parsed.protocol !== 'https:' || parsed.username !== '' || parsed.password !== '') {
    throw new Error(`${scope}: ${field} "${raw}" must be an https URL without credentials`);
  }
}

/**
 * Validates `site.cloud`; throws on any misconfiguration. Pure. Hosted cloud services remain free with fair-use
 * limits and nothing is on sale.
 */
export function validateCloudConfig(raw: unknown): CloudConfig {
  if (!raw || typeof raw !== 'object') throw new Error('cloud: missing configuration object');
  const cloud = raw as CloudConfig;
  if (cloud.mode !== 'soon' && cloud.mode !== 'live') {
    throw new Error(`cloud: mode "${String((raw as { mode?: unknown }).mode)}" must be "soon" or "live"`);
  }
  if (cloud.mode === 'live') {
    assertHttpsUrl(cloud.registerUrl, 'registerUrl');
    assertHttpsUrl(cloud.loginUrl, 'loginUrl');
  }
  assertHttpsUrl(cloud.donateUrl, 'donateUrl');
  return cloud;
}

/**
 * Validates `site.demo`; throws on any misconfiguration. Pure. Validates `url` even while `enabled` is `false`
 * so staging/production flips never ship a malformed playground link.
 */
export function validateDemoConfig(raw: unknown): DemoConfig {
  if (!raw || typeof raw !== 'object') throw new Error('demo: missing configuration object');
  const demo = raw as DemoConfig;
  if (typeof demo.enabled !== 'boolean') {
    throw new Error(`demo: enabled "${String((raw as { enabled?: unknown }).enabled)}" must be boolean`);
  }
  assertHttpsUrl(demo.url, 'url', 'demo');
  return demo;
}
