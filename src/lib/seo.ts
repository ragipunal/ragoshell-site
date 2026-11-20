// Builders for the sitemap, robots.txt and structured data, and the description rule.
// Pure (no file access, no other src imports) so a node script can test them.

const SITEMAP_LIMIT = 50_000;

/** Longest meta description the build accepts (search results cut about there). */
export const DESCRIPTION_LIMIT = 160;

/** Cuts `text` at a word boundary to at most `max` characters, ending in an ellipsis when it was cut. */
export function shorten(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

export const escapeXml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export interface SitemapOptions {
  origin: string;
  defaultLocale: string;
  /** Enabled locale codes. */
  locales: string[];
  /** Locale-independent paths of the indexable pages: '/' or '/features/'. */
  paths: string[];
  /** Path of a page in a locale ('/tr/features/'). */
  urlFor: (locale: string, path: string) => string;
}

/** Every page in every locale, each with the full alternate set and x-default (Google's sitemap hreflang form). */
export function sitemapXml(options: SitemapOptions): string {
  const { origin, defaultLocale, locales, paths, urlFor } = options;
  const absolute = (locale: string, path: string) => new URL(urlFor(locale, path), origin).href;
  const rows: string[] = [];
  for (const path of paths) {
    const alternates = [
      ...locales.map((l) => ({ hreflang: l, href: absolute(l, path) })),
      { hreflang: 'x-default', href: absolute(defaultLocale, path) },
    ].map((a) => `    <xhtml:link rel="alternate" hreflang="${escapeXml(a.hreflang)}" href="${escapeXml(a.href)}"/>`);
    for (const locale of locales) {
      rows.push('  <url>', `    <loc>${escapeXml(absolute(locale, path))}</loc>`, ...alternates, '  </url>');
    }
  }
  if (paths.length * locales.length > SITEMAP_LIMIT) throw new Error('seo: the sitemap would exceed 50,000 URLs');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...rows,
    '</urlset>',
    '',
  ].join('\n');
}

/** Nothing is disallowed: a page with `noindex` must stay crawlable or the tag is never seen. */
export function robotsTxt(sitemapUrl: string): string {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemapUrl}`, ''].join('\n');
}

/** Returns the description when it is present and short enough, otherwise throws (the build fails). */
export function checkDescription(description: string | undefined, max: number, page: string): string {
  const text = (description ?? '').trim();
  if (text === '') throw new Error(`seo: ${page} has no description`);
  if (text.length > max) throw new Error(`seo: the description of ${page} is ${text.length} characters (limit ${max})`);
  return text;
}

/** A Search Console token goes into a tag, so only the characters Google uses are accepted. */
export function checkVerificationToken(token: string): string {
  if (token !== '' && !/^[A-Za-z0-9_-]+$/.test(token)) throw new Error('seo: googleSiteVerification has unexpected characters');
  return token;
}

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** One JSON-LD document; `<` is escaped so no value can close the script element. */
export function jsonLdDocument(nodes: { [key: string]: Json }[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
}

export interface SiteIdentity {
  name: string;
  origin: string;
  /** Absolute address of the logo. */
  logo: string;
  /** Other places that are this project (the repository). */
  sameAs: string[];
  locales: string[];
}

/** Organization and WebSite of the home page. No search action: the site has no search. */
export function siteNodes(site: SiteIdentity): { [key: string]: Json }[] {
  const organization = `${site.origin}/#organization`;
  return [
    { '@type': 'Organization', '@id': organization, name: site.name, url: `${site.origin}/`, logo: site.logo, sameAs: site.sameAs },
    {
      '@type': 'WebSite',
      '@id': `${site.origin}/#website`,
      name: site.name,
      url: `${site.origin}/`,
      inLanguage: site.locales,
      publisher: { '@id': organization },
    },
  ];
}

export interface SoftwareInfo {
  name: string;
  /** Absolute address of the download page in this locale. */
  url: string;
  description: string;
  language: string;
  operatingSystems: string[];
  license: string;
  downloadUrl: string;
}

/** SoftwareApplication of the download page. No price and no version: neither is known at build time. */
export function softwareNode(info: SoftwareInfo): { [key: string]: Json } {
  return {
    '@type': 'SoftwareApplication',
    name: info.name,
    url: info.url,
    description: info.description,
    inLanguage: info.language,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: info.operatingSystems.join(', '),
    license: info.license,
    downloadUrl: info.downloadUrl,
  };
}
