// Content gate: tests the pure libraries the pages rely on (changelog parser, markdown renderer, release manifest
// validation, platform detection) and parses the real files this site publishes from the application repository.
// Needs the application repository (APP_REPO_DIR or the sibling folder); fails clearly when it is missing.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import site from '../site.config.mjs';
import { appRepoDir, changelogReleases, publishedDocs } from '../src/lib/app-repo.ts';
import { codeSpans, parseChangelog, releaseAnchor } from '../src/lib/changelog.ts';
import { interpolateLegal, legalSourceLocale, readLegalSource, renderLegalDocument } from '../src/lib/legal.ts';
import { renderMarkdown, rewriteHref } from '../src/lib/markdown.ts';
import { validateCloudConfig, validateDemoConfig } from '../src/lib/cloud.ts';
import { detectPlatform, parseManifest } from '../src/lib/releases.ts';
import { indexablePaths } from '../src/lib/routes.ts';
import { DESCRIPTION_LIMIT, checkDescription, checkVerificationToken, jsonLdDocument, robotsTxt, shorten, siteNodes, sitemapXml, softwareNode } from '../src/lib/seo.ts';
import { docSlug } from '../src/lib/slug.ts';
import { jsonLdProblems, parseSitemap } from './lib/inspect-seo.mjs';

const problems = [];
const check = (name, ok, detail = '') => {
  if (!ok) problems.push(`${name}${detail ? `: ${detail}` : ''}`);
};
const throws = (name, fn) => {
  try {
    fn();
    problems.push(`${name}: expected an error`);
  } catch {
    /* expected */
  }
};

// slug
check('docSlug', docSlug('McpServer') === 'mcp-server' && docSlug('Shell') === 'shell');

// changelog parser
const sample = ['Title', '=====', '', 'App 2.1.0', '---------', '- one', '  more of one', '- two `x`', '', 'App 2.0.0', '---------', 'Intro', 'lines', '', '- a', ''].join('\n');
const parsed = parseChangelog(sample);
check('changelog versions', parsed.map((r) => r.version).join() === '2.1.0,2.0.0');
check('changelog continuation', parsed[0].items[0] === 'one more of one');
check('changelog intro', parsed[1].intro === 'Intro lines');
check('codeSpans', codeSpans('a `b` c').map((p) => p.code).join() === 'false,true,false');
check('releaseAnchor', releaseAnchor('2.1.0') === 'v2-1-0');
throws('changelog stray text', () => parseChangelog(sample.replace('- a', '- a\nstray')));
throws('changelog no title', () => parseChangelog('App 1.0.0\n---------\n- a'));
throws('changelog empty release', () => parseChangelog('T\n=\n\nApp 1.0.0\n-----\n'));

// markdown renderer
const ctx = { docs: { Shell: '/docs/shell/' }, repoUrl: (p) => `https://repo.example/${p}` };
const html = renderMarkdown('# T\n\nHello <script>alert(1)</script> <img src=x onerror=alert(1)>\n\n[a](javascript:alert(1)) [b](docs/Shell.md#x) [c](Gone.md) [d](../src/a.cpp)\n\n```cpp\n<b>\n```', ctx).html;
check('md raw html escaped', !/<(script|img)/i.test(html) && html.includes('&lt;script&gt;') && html.includes('&lt;img'));
check('md javascript link dropped', !html.includes('javascript:'));
check('md doc link rewritten', html.includes('href="/docs/shell/#x"'));
check('md unpublished link is text', !html.includes('Gone.md') || !html.includes('href="Gone.md"'));
check('md repo link', html.includes('href="https://repo.example/src/a.cpp"'));
check('md code escaped', html.includes('&lt;b&gt;'));
throws('md image refused', () => renderMarkdown('![x](a.png)', ctx));
check('rewriteHref external', rewriteHref('https://x.example/a', ctx) === 'https://x.example/a');
check('rewriteHref ftp dropped', rewriteHref('ftp://x', ctx) === null);
check('rewriteHref protocol-relative dropped', rewriteHref('//x.example', ctx) === null);
check('rewriteHref root path dropped by default', rewriteHref('/legal/privacy/', ctx) === null);
check('rewriteHref root path kept when allowed', rewriteHref('/legal/privacy/', { ...ctx, allowRootPaths: true }) === '/legal/privacy/');
check('rewriteHref protocol-relative still dropped when root paths allowed', rewriteHref('//x.example', { ...ctx, allowRootPaths: true }) === null);
const omittedH1 = renderMarkdown('# Main Title\n\nBody\n\n## Section', { ...ctx, omitFirstH1: true });
check('md omitFirstH1 extracts title and skips h1 in html', omittedH1.title === 'Main Title' && !omittedH1.html.includes('<h1') && omittedH1.headings.length === 1 && omittedH1.headings[0].depth === 2);

// legal placeholder interpolation
check('interpolateLegal resolves tokens', interpolateLegal('Hello {productName} at {domain}', { productName: 'X', domain: 'd.test' }) === 'Hello X at d.test');
throws('interpolateLegal rejects unknown token', () => interpolateLegal('Hello {missing}', { productName: 'X' }));
throws('interpolateLegal rejects malformed brace', () => interpolateLegal('Hello {unclosed', { productName: 'X' }));
throws('interpolateLegal rejects hyphenated brace', () => interpolateLegal('Hello {bad-token}', { productName: 'X' }));

// manifest validation
const hosts = site.download.allowedHosts;
const good = {
  latestVersion: '2.1.0',
  publishedAt: '2026-10-30',
  downloads: {
    windows: { url: `https://${site.hosts.dl}/releases/2.1.0/setup.exe`, label: 'Windows' },
    android: { url: 'https://play.google.com/store/apps/details?id=x', label: 'Google Play' },
    macos: { url: 'http://dl.example/insecure', label: 'x' },
    linux: { url: 'javascript:alert(1)', label: 'x' },
    ios: { url: `https://user:pw@${site.hosts.dl}/x`, label: 'x' },
  },
  extra: 'ignored',
};
const info = parseManifest(good, hosts);
check('manifest valid', info?.version === '2.1.0' && info.date === '2026-10-30');
check('manifest keeps allowed', Boolean(info?.downloads.windows) && Boolean(info?.downloads.android));
check('manifest drops insecure, script, credentials', !info?.downloads.macos && !info?.downloads.linux && !info?.downloads.ios);
check('manifest rejects bad version', parseManifest({ ...good, latestVersion: '<b>' }, hosts) === null);
check('manifest rejects non-object', parseManifest('x', hosts) === null && parseManifest(null, hosts) === null && parseManifest([], hosts) === null);
check('manifest tolerates no downloads', parseManifest({ latestVersion: '1.0.0' }, hosts)?.version === '1.0.0');

// platform detection
const detect = (userAgent, platform, maxTouchPoints = 0) => detectPlatform({ userAgent, platform, maxTouchPoints });
check('detect windows', detect('Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Windows') === 'windows');
check('detect mac', detect('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'MacIntel', 0) === 'macos');
check('detect ipad as mac', detect('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'MacIntel', 5) === 'ios');
check('detect iphone', detect('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', 'iPhone', 5) === 'ios');
check('detect android', detect('Mozilla/5.0 (Linux; Android 14; Pixel 8)', 'Linux armv81', 5) === 'android');
check('detect linux', detect('Mozilla/5.0 (X11; Linux x86_64)', 'Linux x86_64') === 'linux');
check('detect chromeos', detect('Mozilla/5.0 (X11; CrOS x86_64 14541.0.0)', 'Linux x86_64') === null);

// search and sharing metadata
const urlFor = (locale, path) => (locale === 'en' ? path : `/${locale}${path}`);
const sample2 = sitemapXml({ origin: 'https://example.test', defaultLocale: 'en', locales: ['en', 'tr'], paths: ['/', '/a/'], urlFor });
const entries = parseSitemap(sample2);
check('sitemap has a url per page and locale', entries.map((e) => e.loc).join() === 'https://example.test/,https://example.test/tr/,https://example.test/a/,https://example.test/tr/a/');
check('sitemap alternates and x-default', entries[1].alternates.join() === 'en=https://example.test/,tr=https://example.test/tr/,x-default=https://example.test/');
check('sitemap escapes', sitemapXml({ origin: 'https://example.test', defaultLocale: 'en', locales: ['en'], paths: ['/a&b/'], urlFor }).includes('/a&amp;b/'));
check('robots names the sitemap', robotsTxt('https://example.test/sitemap.xml').includes('Sitemap: https://example.test/sitemap.xml\n'));
check('shorten keeps short text', shorten('short text', 20) === 'short text');
const cut = shorten('word '.repeat(60), DESCRIPTION_LIMIT);
check('shorten cuts at a word within the limit', cut.length <= DESCRIPTION_LIMIT && cut.endsWith('word…'), String(cut.length));
check('description accepted', checkDescription(' ok ', 160, 'p') === 'ok');
throws('description missing', () => checkDescription(undefined, 160, 'p'));
throws('description blank', () => checkDescription('  ', 160, 'p'));
throws('description too long', () => checkDescription('x'.repeat(161), 160, 'p'));
check('verification token may be empty', checkVerificationToken('') === '');
throws('verification token with markup', () => checkVerificationToken('a"><script>'));
const ld = jsonLdDocument([{ '@type': 'Thing', name: '</script><b>' }]);
check('json-ld escapes <', !ld.includes('<') && JSON.parse(ld)['@graph'][0].name === '</script><b>');
check('json-ld document passes the gate', jsonLdProblems({}, ld).length === 0);
check('json-ld site nodes pass the gate', jsonLdProblems({}, jsonLdDocument(siteNodes({ name: 'N', origin: 'https://example.test', logo: 'https://example.test/l.svg', sameAs: ['https://example.test/r'], locales: ['en'] }))).length === 0);
check('json-ld software node passes the gate', jsonLdProblems({}, jsonLdDocument([softwareNode({ name: 'N', url: 'https://example.test/d/', description: 'd', language: 'en', operatingSystems: ['A', 'B'], license: 'https://example.test/l', downloadUrl: 'https://example.test/r' })])).length === 0);
check('gate: invalid json', jsonLdProblems({}, '{').length === 1);
check('gate: raw <', jsonLdProblems({}, '{"@context":"https://schema.org","@type":"T","a":"<"}').some((m) => m.includes('"<"')));
check('gate: wrong context', jsonLdProblems({}, '{"@context":"https://evil.test","@type":"T"}').some((m) => m.includes('@context')));
check('gate: node without type', jsonLdProblems({}, '{"@context":"https://schema.org","@graph":[{"name":"x"}]}').some((m) => m.includes('@type')));
check('gate: src', jsonLdProblems({ src: '/x.js' }, '{"@context":"https://schema.org","@type":"T"}').some((m) => m.includes('src')));
check('gate: not an object', jsonLdProblems({}, '[1]').length === 1);

// cloud & demo config invariants
check('site.cloud passes validation', validateCloudConfig(site.cloud) === site.cloud);
check('cloud soon mode accepted', validateCloudConfig({ ...site.cloud, mode: 'soon' }).mode === 'soon');
throws('cloud rejects unknown mode', () => validateCloudConfig({ ...site.cloud, mode: 'paid' }));
throws('cloud live mode requires registerUrl', () => validateCloudConfig({ ...site.cloud, mode: 'live', registerUrl: '' }));
throws('cloud insecure donateUrl', () => validateCloudConfig({ ...site.cloud, donateUrl: 'http://evil.test/donate' }));
check('site.demo passes validation', validateDemoConfig(site.demo) === site.demo && site.demo.url === site.urls.demo);
check('demo enabled mode accepted', validateDemoConfig({ ...site.demo, enabled: true }).enabled === true);
throws('demo rejects missing object', () => validateDemoConfig(null));
throws('demo rejects non-boolean enabled', () => validateDemoConfig({ ...site.demo, enabled: 'yes' }));
throws('demo rejects insecure url', () => validateDemoConfig({ ...site.demo, url: 'http://demo.example.test' }));
throws('demo rejects credentialed url', () => validateDemoConfig({ ...site.demo, url: 'https://u:p@demo.example.test' }));

// the real files
check(
  'indexable paths match legal.draft',
  (() => {
    const paths = indexablePaths();
    const expectedCount = 1 + site.pages.length + site.docs.publish.length + (site.legal.draft ? 0 : site.legalPages.length);
    const hasLegal = site.legalPages.every((p) => paths.includes(`/legal/${p}/`));
    const noLegal = !paths.some((x) => x.startsWith('/legal/'));
    return paths.includes('/') && paths.includes('/docs/shell/') && paths.length === expectedCount && (site.legal.draft ? noLegal : hasLegal);
  })(),
);

// legal documents
check('legalSourceLocale keeps tr for tr', legalSourceLocale('tr', 'terms') === 'tr');
check('legalSourceLocale falls back to en for ar', legalSourceLocale('ar', 'terms') === 'en');
const legalRequiredTokens = {
  privacy: ['KVKK', 'GDPR', 'AES-256-GCM', 'Argon2id', '/v1/account/export', '/v1/account', '72', 'Cloudflare', 'shareAnonymousUsage', 'disableHttpsFeatures', site.hosts.demo],
  terms: ['RFC 8628', '127.0.0.0/8', site.license.app.name, site.hosts.demo],
  imprint: ['/.well-known/security.txt', site.repo.appRepoUrl, site.repo.siteRepoUrl, site.hosts.demo],
};
const legalForbiddenTokens = [
  'Paddle',
  'iyzico',
  'refundsPath',
  '/legal/refunds/',
  'bridgeHost',
  'bridgeUrl',
  'wss://',
  `${site.hosts.app}/ws`,
  'Hosted WebSocket Bridge',
  'Barındırılan WebSocket Köprüsü',
];
const legalHeadingsByPage = new Map();
for (const page of site.legalPages) {
  for (const { code } of site.enabledLocales) {
    const label = `content/legal/${code}/${page}.md`;
    try {
      if (legalSourceLocale(code, page) === code) {
        const raw = readLegalSource(code, page);
        check(`${label} does not hardcode domain`, !raw.includes(site.domain));
        check(`${label} does not hardcode repo host`, !raw.includes(site.repo.base));
        for (const token of legalForbiddenTokens) {
          check(`${label} source does not mention "${token}" (dropped or dormant feature)`, !raw.includes(token));
        }
      }
      const rendered = renderLegalDocument(code, page);
      check(`${label} (${code}) has a title`, rendered.title !== '');
      check(`${label} (${code}) has substantial html`, rendered.html.length > 800);
      check(`${label} (${code}) has no unresolved braces`, !/[{}]/.test(rendered.html) && !/[{}]/.test(rendered.title));
      check(`${label} (${code}) has no inline style or script`, !/\sstyle\s*=|<script/i.test(rendered.html));
      const depths = rendered.headings.map((h) => h.depth).join(',');
      check(`${label} (${code}) has structured sections`, rendered.headings.length >= 5);
      if (!legalHeadingsByPage.has(page)) {
        legalHeadingsByPage.set(page, { locale: code, depths });
      } else {
        const ref = legalHeadingsByPage.get(page);
        check(`${label} (${code}) matches ${ref.locale} section structure`, depths === ref.depths, `${depths} !== ${ref.depths}`);
      }
      for (const token of legalForbiddenTokens) {
        check(`${label} (${code}) does not mention "${token}" (dropped or dormant feature)`, !rendered.html.includes(token));
      }
      for (const token of legalRequiredTokens[page] ?? []) {
        check(`${label} (${code}) covers "${token}"`, rendered.html.includes(token));
      }
    } catch (error) {
      problems.push(`${label} (${code}): ${error.message}`);
    }
  }
}
const dir = appRepoDir();
if (!existsSync(dir)) {
  problems.push(`application repository not found at ${dir}; set ${site.docs.repoEnv} to its folder`);
} else {
  let releases = [];
  try {
    releases = changelogReleases();
    check('real changelog has releases', releases.length > 0);
  } catch (error) {
    problems.push(`real CHANGELOG: ${error.message}`);
  }
  try {
    for (const doc of publishedDocs()) {
      const rendered = renderMarkdown(doc.source, ctx);
      check(`doc ${doc.name} has a title`, rendered.title !== '');
      check(`doc ${doc.name} has content`, rendered.html.length > 200);
      check(`doc ${doc.name} has a description of at most ${DESCRIPTION_LIMIT} characters`, rendered.description !== '' && rendered.description.length <= DESCRIPTION_LIMIT);
    }
  } catch (error) {
    problems.push(`published documents: ${error.message}`);
  }
  const sampleManifest = join(dir, 'services', 'release-pulse-api', 'releases.json');
  if (existsSync(sampleManifest)) {
    const manifest = parseManifest(JSON.parse(readFileSync(sampleManifest, 'utf8')), hosts);
    check('sample manifest of the application repository is accepted', manifest !== null && Object.keys(manifest.downloads).length >= 3);
  }
}

if (problems.length > 0) {
  console.error(`check-content: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log('check-content: changelog parser, markdown renderer, manifest validation, platform detection, cloud invariants and the real published files are fine');
