// Pure validation for `site.pricing`.
// Imported by `pricing.astro` at build time and tested in `scripts/check-content.mjs`.

export interface PricingConfig {
  mode: 'soon';
  donateUrl: string;
}

function assertHttpsUrl(raw: string, field: string): void {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`pricing: ${field} "${raw}" is not a valid URL`);
  }
  if (parsed.protocol !== 'https:' || parsed.username !== '' || parsed.password !== '') {
    throw new Error(`pricing: ${field} "${raw}" must be an https URL without credentials`);
  }
}

/**
 * Validates `site.pricing`; throws on any misconfiguration. Pure. Only "soon" exists: a paid plan needs its own page
 * and legal terms written first (card sales were dropped on 2026-11-22).
 */
export function validatePricingConfig(raw: unknown): PricingConfig {
  if (!raw || typeof raw !== 'object') throw new Error('pricing: missing configuration object');
  const pricing = raw as PricingConfig;
  if (pricing.mode !== 'soon') {
    throw new Error(`pricing: mode "${String((raw as { mode?: unknown }).mode)}" must be "soon" (no paid plan is on sale)`);
  }
  assertHttpsUrl(pricing.donateUrl, 'donateUrl');
  return pricing;
}
