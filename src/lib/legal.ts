// Loads, interpolates and renders the bilingual legal drafts under `content/legal/<locale>/<page>.md`.
// Every brand, host, license and contact string comes from `site.config.mjs`.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import site from '../../site.config.mjs';
import { renderMarkdown, type Rendered } from './markdown.ts';

function localizedPath(locale: string, path: string): string {
  const body = path.replace(/^\/+|\/+$/g, '');
  const prefix = locale === site.defaultLocale ? '' : `/${locale}`;
  return `${prefix}/${body}${body ? '/' : ''}`;
}

function requiredLocaleEntry(map: Record<string, string | undefined>, locale: string, field: string): string {
  const value = map[locale]?.trim();
  if (!value) throw new Error(`legal: missing ${field} entry for locale "${locale}" in site.config.mjs`);
  return value;
}

/** Strict `{name}` substitution: unknown tokens or stray `{` / `}` characters fail the build. Pure. */
export function interpolateLegal(template: string, params: Record<string, string>, label = 'legal'): string {
  const resolved = template.replace(/\{([A-Za-z0-9_]+)\}/g, (_, name: string) => {
    const value = params[name];
    if (value === undefined) throw new Error(`${label}: unknown placeholder "{${name}}"`);
    return value;
  });
  if (/[{}]/.test(resolved)) {
    throw new Error(`${label}: unresolved or malformed brace token in interpolated output`);
  }
  return resolved;
}

/** Placeholder parameters supplied to `content/legal/<locale>/<page>.md` from `site.config.mjs`. */
export function legalParams(locale: string): Record<string, string> {
  const notices = site.trademarkNotice as Record<string, string | undefined>;
  const entity = site.legal.entity as Record<string, string | undefined>;
  const address = site.legal.address as Record<string, string | undefined>;
  const supportContact = site.legal.supportContact as Record<string, string | undefined>;
  const privacyContact = site.legal.privacyContact as Record<string, string | undefined>;
  const securityContact = site.legal.securityContact as Record<string, string | undefined>;

  return {
    productName: site.productName,
    productId: site.productId,
    envPrefix: site.productId.toUpperCase(),
    bundleId: `tr.com.${site.productId}.app`,
    domain: site.domain,
    siteUrl: site.url,
    appHost: site.hosts.app,
    appUrl: site.urls.app,
    apiHost: site.hosts.api,
    apiUrl: site.urls.api,
    dlHost: site.hosts.dl,
    dlUrl: site.urls.dl,
    bridgeHost: site.hosts.bridge,
    bridgeUrl: site.urls.bridge,
    appRepoUrl: site.repo.appRepoUrl,
    siteRepoUrl: site.repo.siteRepoUrl,
    issuesUrl: site.repo.issuesUrl,
    appLicenseName: site.license.app.name,
    appLicenseUrl: site.license.app.url,
    siteCodeLicenseName: site.license.code.name,
    siteCodeLicenseUrl: site.license.code.url,
    siteContentLicenseName: site.license.content.name,
    siteContentLicenseUrl: site.license.content.url,
    trademarkNotice: requiredLocaleEntry(notices, locale, 'trademarkNotice'),
    draftDate: site.legal.draftDate,
    legalEntity: requiredLocaleEntry(entity, locale, 'legal.entity'),
    legalAddress: requiredLocaleEntry(address, locale, 'legal.address'),
    supportContact: requiredLocaleEntry(supportContact, locale, 'legal.supportContact'),
    privacyContact: requiredLocaleEntry(privacyContact, locale, 'legal.privacyContact'),
    securityContact: requiredLocaleEntry(securityContact, locale, 'legal.securityContact'),
    securityTxtPath: site.legal.securityTxtPath,
    securityTxtUrl: `${site.url}${site.legal.securityTxtPath}`,
    termsPath: localizedPath(locale, '/legal/terms/'),
    privacyPath: localizedPath(locale, '/legal/privacy/'),
    imprintPath: localizedPath(locale, '/legal/imprint/'),
    trademarkPath: localizedPath(locale, '/trademark/'),
    downloadPath: localizedPath(locale, '/download/'),
    pricingPath: localizedPath(locale, '/pricing/'),
  };
}

export function readLegalSource(locale: string, page: string, rootDir = process.cwd()): string {
  if (!site.legalPages.includes(page)) throw new Error(`legal: unknown legal page "${page}"`);
  const file = join(rootDir, 'content', 'legal', locale, `${page}.md`);
  if (!existsSync(file)) throw new Error(`legal: missing file content/legal/${locale}/${page}.md`);
  return readFileSync(file, 'utf8');
}

export function renderLegalDocument(locale: string, page: string, rootDir = process.cwd()): Rendered {
  const label = `content/legal/${locale}/${page}.md`;
  const raw = readLegalSource(locale, page, rootDir);
  const markdown = interpolateLegal(raw, legalParams(locale), label);
  const rendered = renderMarkdown(markdown, {
    docs: {},
    repoUrl: (path) => site.repo.blobUrl(path),
    allowRootPaths: true,
    omitFirstH1: true,
  });
  if (rendered.title === '') throw new Error(`${label}: missing top-level "# " heading`);
  return rendered;
}
