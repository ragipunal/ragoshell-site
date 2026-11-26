// Pure validation for `site.cloud`.
// Imported by `cloud.astro` at build time and tested in `scripts/check-content.mjs`.

export interface CloudConfig {
  mode: 'soon' | 'live';
  registerUrl?: string;
  loginUrl?: string;
  donateUrl: string;
}

function assertHttpsUrl(raw: unknown, field: string): void {
  if (typeof raw !== 'string' || raw.trim() === '') {
    throw new Error(`cloud: missing ${field}`);
  }
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`cloud: ${field} "${raw}" is not a valid URL`);
  }
  if (parsed.protocol !== 'https:' || parsed.username !== '' || parsed.password !== '') {
    throw new Error(`cloud: ${field} "${raw}" must be an https URL without credentials`);
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
