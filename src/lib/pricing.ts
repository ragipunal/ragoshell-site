// Pure validation and locale formatting for `site.pricing`.
// Imported by `pricing.astro` at build time and tested in `scripts/check-content.mjs`.

export interface RegionalPrices {
  free: string;
  proMonthly: string;
  proYearly: string;
  teamMonthly: string;
  teamYearly: string;
}

export interface PricingConfig {
  mode: 'beta' | 'live';
  billingUrl: string;
  donateUrl: string;
  usd: RegionalPrices;
  try: RegionalPrices;
  teamMinSeats: number;
  maxDevicesPerUser: number;
  syncMaxCollections: number;
  syncMaxBlobMiB: number;
  aiMonthlyTokensPro: string;
  aiMonthlyTokensProShort: string;
  aiMonthlyTokensTeam: string;
  aiMonthlyTokensTeamShort: string;
  trialDays: number;
  trialAiRequests: number;
  refundDays: number;
  billingGraceDays: number;
  offlineGraceDays: number;
  syncReadOnlyRetentionDays: number;
  earlySupporterDiscountPercent: number;
}

const PRICE_KEYS: (keyof RegionalPrices)[] = ['free', 'proMonthly', 'proYearly', 'teamMonthly', 'teamYearly'];

function parseUsdAmount(raw: string, field: string): number {
  const m = /^\$(\d+(?:\.\d{1,2})?)$/.exec(raw.trim());
  if (!m) throw new Error(`pricing: ${field} "${raw}" must be formatted like "$4.99" or "$49"`);
  return Number(m[1]);
}

function parseTryAmount(raw: string, field: string): number {
  const m = /^(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?)\s*₺$/.exec(raw.trim());
  if (!m) throw new Error(`pricing: ${field} "${raw}" must be formatted like "119 ₺" or "1.190 ₺"`);
  return Number(m[1].replace(/\./g, '').replace(',', '.'));
}

function parseCommaInt(raw: string, field: string): number {
  if (!/^\d{1,3}(?:,\d{3})+$/.test(raw)) {
    throw new Error(`pricing: ${field} "${raw}" must use comma thousands (e.g. "2,000,000")`);
  }
  return Number(raw.replace(/,/g, ''));
}

function parseShortMillions(raw: string, expected: number, field: string): void {
  const m = /^(\d+)M$/.exec(raw);
  if (!m || Number(m[1]) * 1_000_000 !== expected) {
    throw new Error(`pricing: ${field} "${raw}" does not match ${expected}`);
  }
}

function assertPositiveInt(value: unknown, min: number, field: string): void {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min) {
    throw new Error(`pricing: ${field} must be an integer >= ${min}`);
  }
}

function assertHttpsUrl(raw: string, field: string, expectedOrigin?: string): void {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`pricing: ${field} "${raw}" is not a valid URL`);
  }
  if (parsed.protocol !== 'https:' || parsed.username !== '' || parsed.password !== '') {
    throw new Error(`pricing: ${field} "${raw}" must be an https URL without credentials`);
  }
  if (expectedOrigin && parsed.origin !== expectedOrigin) {
    throw new Error(`pricing: ${field} "${raw}" must use origin ${expectedOrigin}`);
  }
}

/** Validates `site.pricing` invariants; throws on any misconfiguration. Pure. */
export function validatePricingConfig(raw: unknown, expectedAppOrigin?: string): PricingConfig {
  if (!raw || typeof raw !== 'object') throw new Error('pricing: missing configuration object');
  const pricing = raw as PricingConfig;
  if (pricing.mode !== 'beta' && pricing.mode !== 'live') {
    throw new Error(`pricing: mode "${String((raw as { mode?: unknown }).mode)}" must be "beta" or "live"`);
  }

  assertHttpsUrl(pricing.billingUrl, 'billingUrl', expectedAppOrigin);
  assertHttpsUrl(pricing.donateUrl, 'donateUrl');

  if (!pricing.usd || typeof pricing.usd !== 'object') throw new Error('pricing: missing usd table');
  if (!pricing.try || typeof pricing.try !== 'object') throw new Error('pricing: missing try table');
  for (const key of PRICE_KEYS) {
    if (typeof pricing.usd[key] !== 'string') throw new Error(`pricing: usd.${key} is missing`);
    if (typeof pricing.try[key] !== 'string') throw new Error(`pricing: try.${key} is missing`);
  }

  const usdFree = parseUsdAmount(pricing.usd.free, 'usd.free');
  const usdProMo = parseUsdAmount(pricing.usd.proMonthly, 'usd.proMonthly');
  const usdProYr = parseUsdAmount(pricing.usd.proYearly, 'usd.proYearly');
  const usdTeamMo = parseUsdAmount(pricing.usd.teamMonthly, 'usd.teamMonthly');
  const usdTeamYr = parseUsdAmount(pricing.usd.teamYearly, 'usd.teamYearly');

  const tryFree = parseTryAmount(pricing.try.free, 'try.free');
  const tryProMo = parseTryAmount(pricing.try.proMonthly, 'try.proMonthly');
  const tryProYr = parseTryAmount(pricing.try.proYearly, 'try.proYearly');
  const tryTeamMo = parseTryAmount(pricing.try.teamMonthly, 'try.teamMonthly');
  const tryTeamYr = parseTryAmount(pricing.try.teamYearly, 'try.teamYearly');

  if (usdFree !== 0 || tryFree !== 0) throw new Error('pricing: Free tier prices must be zero');
  if (!(usdProMo > 0 && usdProYr > usdProMo && usdProYr < usdProMo * 12)) {
    throw new Error('pricing: usd.proYearly must be between 1x and 12x usd.proMonthly');
  }
  if (!(usdTeamMo > usdProMo && usdTeamYr > usdTeamMo && usdTeamYr < usdTeamMo * 12)) {
    throw new Error('pricing: usd Team prices must exceed Pro and discount annual vs 12x monthly');
  }
  if (!(tryProMo > 0 && tryProYr > tryProMo && tryProYr < tryProMo * 12)) {
    throw new Error('pricing: try.proYearly must be between 1x and 12x try.proMonthly');
  }
  if (!(tryTeamMo > tryProMo && tryTeamYr > tryTeamMo && tryTeamYr < tryTeamMo * 12)) {
    throw new Error('pricing: try Team prices must exceed Pro and discount annual vs 12x monthly');
  }

  assertPositiveInt(pricing.teamMinSeats, 2, 'teamMinSeats');
  assertPositiveInt(pricing.maxDevicesPerUser, 1, 'maxDevicesPerUser');
  assertPositiveInt(pricing.syncMaxCollections, 1, 'syncMaxCollections');
  assertPositiveInt(pricing.syncMaxBlobMiB, 1, 'syncMaxBlobMiB');
  assertPositiveInt(pricing.trialDays, 1, 'trialDays');
  assertPositiveInt(pricing.trialAiRequests, 1, 'trialAiRequests');
  assertPositiveInt(pricing.refundDays, 14, 'refundDays');
  assertPositiveInt(pricing.billingGraceDays, 1, 'billingGraceDays');
  assertPositiveInt(pricing.offlineGraceDays, 7, 'offlineGraceDays');
  assertPositiveInt(pricing.syncReadOnlyRetentionDays, 30, 'syncReadOnlyRetentionDays');

  if (
    typeof pricing.earlySupporterDiscountPercent !== 'number' ||
    !Number.isInteger(pricing.earlySupporterDiscountPercent) ||
    pricing.earlySupporterDiscountPercent < 0 ||
    pricing.earlySupporterDiscountPercent >= 100
  ) {
    throw new Error('pricing: earlySupporterDiscountPercent must be an integer in 0..99');
  }

  const proTokens = parseCommaInt(pricing.aiMonthlyTokensPro, 'aiMonthlyTokensPro');
  const teamTokens = parseCommaInt(pricing.aiMonthlyTokensTeam, 'aiMonthlyTokensTeam');
  if (teamTokens <= proTokens) throw new Error('pricing: aiMonthlyTokensTeam must exceed aiMonthlyTokensPro');
  parseShortMillions(pricing.aiMonthlyTokensProShort, proTokens, 'aiMonthlyTokensProShort');
  parseShortMillions(pricing.aiMonthlyTokensTeamShort, teamTokens, 'aiMonthlyTokensTeamShort');

  return pricing;
}

/** Formats comma-grouped English digits (`2,000,000`) with dots (`2.000.000`) for Turkish copy. Pure. */
export function localizeTokenCount(commaGrouped: string, locale: string): string {
  return locale === 'tr' ? commaGrouped.replace(/,/g, '.') : commaGrouped;
}
