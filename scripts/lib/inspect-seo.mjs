// SEO gates of a built site: descriptions, canonical and hreflang, share cards,
// JSON-LD blocks, robots.txt and the sitemap, compared with the pages that were actually built.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const META = /<meta\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi;
const LINK = /<link\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi;
const ATTR = /([^\s=>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
const SCRIPT = /<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi;
const HTML_LANG = /<html\b[^>]*\blang="([^"]*)"/i;
const PNG_SIGNATURE = '89504e470d0a1a0a';

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');

function attrsOf(source) {
  const attrs = {};
  for (const m of source.matchAll(ATTR)) attrs[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? '');
  return attrs;
}

const all = (html, re) => [...html.matchAll(re)].map((m) => attrsOf(m[1]));

/** Problems of one JSON-LD block (type attribute already known to be application/ld+json). Pure. */
export function jsonLdProblems(attrs, body) {
  const problems = [];
  if (attrs.src !== undefined) problems.push('JSON-LD block has a src (it must be inline data)');
  if (body.includes('<')) problems.push('JSON-LD body contains "<" (it must be escaped as \\u003c)');
  let data;
  try {
    data = JSON.parse(body);
  } catch (error) {
    problems.push(`JSON-LD body is not valid JSON (${error.message})`);
    return problems;
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    problems.push('JSON-LD body is not an object');
    return problems;
  }
  if (data['@context'] !== 'https://schema.org') problems.push('JSON-LD @context is not https://schema.org');
  const nodes = Array.isArray(data['@graph']) ? data['@graph'] : [data];
  if (nodes.length === 0) problems.push('JSON-LD has no nodes');
  for (const node of nodes) {
    if (node === null || typeof node !== 'object' || typeof node['@type'] !== 'string') problems.push('JSON-LD node without @type');
  }
  return problems;
}

/** `<url>` entries of a sitemap: loc and the hreflang alternates. Pure. */
export function parseSitemap(xml) {
  const entries = [];
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>([^<]*)<\/loc>/.exec(m[1]);
    const alternates = [...m[1].matchAll(/<xhtml:link\b([^>]*)\/>/g)].map((a) => attrsOf(a[1]));
    entries.push({ loc: loc ? decode(loc[1]) : '', alternates: alternates.map((a) => `${a.hreflang}=${a.href}`).sort() });
  }
  return entries;
}

function pngSize(file) {
  const bytes = readFileSync(file);
  if (bytes.subarray(0, 8).toString('hex') !== PNG_SIGNATURE || bytes.subarray(12, 16).toString('latin1') !== 'IHDR') return null;
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), bytes: bytes.length };
}

/**
 * @param {{ dir: string, site: any, pages: { name: string, url: string, html: string }[] }} input
 *   `pages` are the built HTML files; `url` is the path nginx serves them at ('/tr/features/').
 * @returns {string[]} problems
 */
export function inspectSeo({ dir, site, pages }) {
  const problems = [];
  const fail = (where, message) => problems.push(`${where}: ${message}`);
  const origin = new URL(site.url).origin;
  const defaultCode = site.defaultLocale;
  const max = 160;

  const byUrl = new Map(pages.map((p) => [p.url, p]));
  const facts = new Map();
  for (const page of pages) {
    const metas = all(page.html, META);
    const links = all(page.html, LINK);
    const meta = (key) => metas.find((m) => m.name === key || m.property === key)?.content;
    facts.set(page.url, {
      metas,
      links,
      meta,
      description: meta('description'),
      noindex: /noindex/i.test(meta('robots') ?? ''),
      canonical: links.filter((l) => /(^|\s)canonical(\s|$)/i.test(l.rel ?? '')).map((l) => l.href),
      alternates: links.filter((l) => (l.rel ?? '').toLowerCase() === 'alternate' && l.hreflang !== undefined).map((l) => `${l.hreflang}=${l.href}`).sort(),
      lang: HTML_LANG.exec(page.html)?.[1],
    });
  }

  const abs = (where, label, value) => {
    let url;
    try {
      url = new URL(value);
    } catch {
      fail(where, `${label} "${value}" is not an absolute url`);
      return null;
    }
    if (url.protocol !== 'https:') fail(where, `${label} ${value} is not https`);
    if (url.origin !== origin) fail(where, `${label} ${value} is not on ${origin}`);
    return url;
  };

  // share image: one file, served by this site
  const image = site.seo.ogImage;
  const imageFile = join(dir, ...image.path.split('/').filter(Boolean));
  if (!existsSync(imageFile)) {
    fail(image.path, 'og:image file is missing from the build');
  } else {
    const size = pngSize(imageFile);
    if (!size) fail(image.path, 'og:image is not a PNG');
    else {
      if (size.width !== image.width || size.height !== image.height) fail(image.path, `og:image is ${size.width}x${size.height}, expected ${image.width}x${image.height}`);
      if (size.bytes > image.maxBytes) fail(image.path, `og:image is ${size.bytes} bytes, limit ${image.maxBytes}`);
    }
  }

  for (const page of pages) {
    if (page.name === '404.html') continue;
    const f = facts.get(page.url);
    const where = page.name;
    const self = `${origin}${page.url}`;

    // description
    if (!f.description?.trim()) fail(where, 'no meta description');
    else if (f.description.length > max) fail(where, `meta description is ${f.description.length} characters (limit ${max})`);

    // canonical
    if (f.canonical.length !== 1) fail(where, `${f.canonical.length} canonical links, expected 1`);
    else {
      abs(where, 'canonical', f.canonical[0]);
      if (f.canonical[0] !== self) fail(where, `canonical ${f.canonical[0]} is not the page's own address ${self}`);
    }

    // hreflang: complete, absolute, reciprocal, x-default is the default locale
    const expected = [...site.enabledLocales.map((l) => l.code), 'x-default'];
    const have = f.alternates.map((a) => a.slice(0, a.indexOf('=')));
    for (const code of expected) if (!have.includes(code)) fail(where, `no hreflang="${code}" alternate`);
    for (const code of have) if (!expected.includes(code)) fail(where, `unexpected hreflang="${code}"`);
    for (const alt of f.alternates) {
      const code = alt.slice(0, alt.indexOf('='));
      const href = alt.slice(alt.indexOf('=') + 1);
      const url = abs(where, `hreflang ${code}`, href);
      if (!url) continue;
      const target = byUrl.get(url.pathname);
      if (!target) fail(where, `hreflang ${code} points at ${href}, which is not built`);
      else if (facts.get(target.url).alternates.join('\n') !== f.alternates.join('\n')) fail(where, `hreflang ${code} (${href}) does not list the same alternates back`);
      if (code === f.lang && href !== self) fail(where, `the alternate for its own language ${code} is not the page itself`);
    }
    const xDefault = f.alternates.find((a) => a.startsWith('x-default='))?.slice('x-default='.length);
    const defaultAlt = f.alternates.find((a) => a.startsWith(`${defaultCode}=`))?.slice(defaultCode.length + 1);
    if (xDefault !== defaultAlt) fail(where, `x-default is not the ${defaultCode} page`);

    // share card
    const need = ['og:title', 'og:description', 'og:type', 'og:url', 'og:locale', 'og:site_name', 'og:image', 'og:image:alt', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
    for (const key of need) if (!f.meta(key)?.trim()) fail(where, `no ${key} tag`);
    if (f.meta('og:url') !== f.canonical[0]) fail(where, 'og:url differs from the canonical link');
    if (f.meta('og:description') !== f.description) fail(where, 'og:description differs from the meta description');
    const locale = site.enabledLocales.find((l) => l.code === f.lang);
    if (locale && f.meta('og:locale') !== locale.og) fail(where, `og:locale ${f.meta('og:locale')} is not ${locale.og}`);
    const alternateLocales = f.metas.filter((m) => m.property === 'og:locale:alternate').map((m) => m.content).sort();
    const otherLocales = site.enabledLocales.filter((l) => l.code !== f.lang).map((l) => l.og).sort();
    if (alternateLocales.join() !== otherLocales.join()) fail(where, 'og:locale:alternate does not list the other enabled locales');
    for (const key of ['og:image', 'twitter:image']) {
      const value = f.meta(key);
      if (value && value !== `${origin}${image.path}`) fail(where, `${key} is ${value}, expected ${origin}${image.path}`);
    }
    if (f.meta('og:image:width') !== String(image.width) || f.meta('og:image:height') !== String(image.height)) fail(where, 'og:image width/height tags do not match the configured size');

    // JSON-LD data blocks (the inline-script rule itself is in inspect-dist.mjs)
    for (const m of page.html.matchAll(SCRIPT)) {
      const attrs = attrsOf(m[1]);
      if ((attrs.type ?? '').toLowerCase() !== 'application/ld+json') continue;
      for (const message of jsonLdProblems(attrs, m[2])) fail(where, message);
    }
  }

  // robots.txt
  const robotsFile = join(dir, 'robots.txt');
  if (existsSync(robotsFile)) {
    const robots = readFileSync(robotsFile, 'utf8');
    if (!robots.split(/\r?\n/).includes(`Sitemap: ${origin}/sitemap.xml`)) fail('robots.txt', `no "Sitemap: ${origin}/sitemap.xml" line`);
    if (/^\s*Disallow:\s*\/\s*$/im.test(robots)) fail('robots.txt', 'disallows the whole site (noindex pages must stay crawlable)');
  }

  // sitemap, both ways against the pages that were built
  const sitemapFile = join(dir, 'sitemap.xml');
  if (!existsSync(sitemapFile) || !statSync(sitemapFile).isFile()) return problems;
  const xml = readFileSync(sitemapFile, 'utf8');
  if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"') || !xml.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"')) {
    fail('sitemap.xml', 'missing a sitemap or xhtml namespace');
  }
  const entries = parseSitemap(xml);
  if (entries.length === 0) fail('sitemap.xml', 'has no urls');
  const listed = new Set();
  for (const entry of entries) {
    if (listed.has(entry.loc)) fail('sitemap.xml', `lists ${entry.loc} twice`);
    listed.add(entry.loc);
    const url = abs('sitemap.xml', '<loc>', entry.loc);
    if (!url) continue;
    const page = byUrl.get(url.pathname);
    if (!page) {
      fail('sitemap.xml', `lists ${entry.loc}, which is not in the build`);
      continue;
    }
    const f = facts.get(page.url);
    if (f.noindex) fail('sitemap.xml', `lists ${entry.loc}, which is noindex`);
    if (f.canonical[0] !== entry.loc) fail('sitemap.xml', `${entry.loc} is not the page's canonical address`);
    if (entry.alternates.join('\n') !== f.alternates.join('\n')) fail('sitemap.xml', `alternates of ${entry.loc} differ from the page's hreflang links`);
  }
  for (const page of pages) {
    if (page.name === '404.html') continue;
    const f = facts.get(page.url);
    if (!f.noindex && !listed.has(`${origin}${page.url}`)) fail('sitemap.xml', `does not list the indexable page ${page.url}`);
  }
  return problems;
}
