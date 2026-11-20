import site from '../../site.config.mjs';
import type { MessageKey, Messages } from './types';

export type { MessageKey } from './types';

const modules = import.meta.glob<{ default: Messages }>('./locales/*.ts', { eager: true });

const dictionaries: Record<string, Messages> = {};
for (const [path, mod] of Object.entries(modules)) {
  const code = path.replace(/^\.\/locales\//, '').replace(/\.ts$/, '');
  dictionaries[code] = mod.default;
}

export const defaultLocale: string = site.defaultLocale;
export const locales = site.enabledLocales;
export const localeCodes: string[] = locales.map((l) => l.code);

/** Values every message may use without passing them; they all come from site.config.mjs. */
const brandParams: Record<string, string> = {
  productName: site.productName,
  domain: site.domain,
  appLicense: site.license.app.name,
  bridgeLicense: site.license.bridge.name,
};

const placeholders = (message: string): string[] =>
  [...message.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

/** Build-time validation: an enabled locale must be complete, or the build fails. */
function validate(): void {
  const problems: string[] = [];
  const reference = dictionaries[defaultLocale];
  if (!reference) throw new Error(`i18n: no dictionary for the default locale "${defaultLocale}"`);
  const referenceKeys = Object.keys(reference) as MessageKey[];
  const notices = site.trademarkNotice as Record<string, string | undefined>;

  for (const { code } of locales) {
    const dict = dictionaries[code];
    if (!dict) {
      problems.push(`${code}: enabled in site.config.mjs but src/i18n/locales/${code}.ts does not exist`);
      continue;
    }
    for (const key of referenceKeys) {
      const value = (dict as Record<string, string | undefined>)[key];
      if (typeof value !== 'string' || value.trim() === '') {
        problems.push(`${code}: missing key "${key}"`);
      } else if (placeholders(value).join() !== placeholders(reference[key]).join()) {
        problems.push(`${code}: key "${key}" uses different placeholders than ${defaultLocale}`);
      }
    }
    for (const key of Object.keys(dict)) {
      if (!(key in reference)) problems.push(`${code}: extra key "${key}" (not in ${defaultLocale})`);
    }
    if (!notices[code]?.trim()) {
      problems.push(`${code}: no trademarkNotice entry in site.config.mjs`);
    }
  }
  if (problems.length > 0) {
    throw new Error(`i18n: incomplete translations\n  - ${problems.join('\n  - ')}`);
  }
}
validate();

export function isLocale(code: string): boolean {
  return localeCodes.includes(code);
}

export function localeInfo(code: string) {
  const info = locales.find((l) => l.code === code);
  if (!info) throw new Error(`i18n: unknown or disabled locale "${code}"`);
  return info;
}

/** Translate `key` for `locale`; `{name}` placeholders come from `params` or the brand values. */
export function t(locale: string, key: MessageKey, params: Record<string, string> = {}): string {
  const dict = dictionaries[locale];
  if (!dict || !localeCodes.includes(locale)) throw new Error(`i18n: unknown or disabled locale "${locale}"`);
  const message = dict[key];
  if (typeof message !== 'string') throw new Error(`i18n: missing key "${key}" in "${locale}"`);
  const values = { ...brandParams, ...params };
  return message.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = values[name];
    if (value === undefined) throw new Error(`i18n: key "${key}" in "${locale}" needs the value "${name}"`);
    return value;
  });
}

export function trademarkNotice(locale: string): string {
  const notice = (site.trademarkNotice as Record<string, string | undefined>)[locale];
  if (!notice) throw new Error(`i18n: no trademarkNotice for "${locale}"`);
  return notice;
}

/** Path of a page in a locale: '/' or '/tr/' for the home page, '/tr/downloads/' for '/downloads'. */
export function localeUrl(locale: string, path = '/'): string {
  const body = path.replace(/^\/+|\/+$/g, '');
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  return `${prefix}/${body}${body ? '/' : ''}`;
}

/** `getStaticPaths` for src/pages/[...locale]/*.astro: the default locale has no path segment. */
export function localeStaticPaths(
  variants: { params: Record<string, string>; props?: Record<string, unknown> }[] = [{ params: {} }],
) {
  return locales.flatMap(({ code }) =>
    variants.map((v) => ({
      params: { locale: code === defaultLocale ? undefined : code, ...v.params },
      props: { locale: code, ...v.props },
    })),
  );
}
