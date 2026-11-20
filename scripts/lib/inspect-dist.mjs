// Inspects a built site folder against what nginx and its CSP allow (the infra repository,
// nginx/templates/10-site.conf.template): required files, no inline script or style, nothing loaded from
// another origin, hashed assets under /_astro/, no releases.json, no cookies, and no broken internal links.
// The search and sharing gates (sitemap, canonical, hreflang, share cards, JSON-LD) are in inspect-seo.mjs.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { docSlug } from '../../src/lib/slug.ts';
import { inspectSeo } from './inspect-seo.mjs';

const TAG = /<([a-zA-Z][^\s/>]*)((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?)*)\s*\/?>/g;
const ATTR = /([^\s=>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
const LOADING_REL = /stylesheet|icon|preload|prefetch|modulepreload|manifest|preconnect|dns-prefetch/i;
const HASHED = /\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9]+$/;
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:)?\/\//i;

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile()) yield full;
  }
}

function parseAttrs(source) {
  const attrs = {};
  for (const m of source.matchAll(ATTR)) {
    attrs[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return attrs;
}

const isFile = (p) => existsSync(p) && statSync(p).isFile();

export function inspect(dir, site) {
  const problems = [];
  const fail = (file, message) => problems.push(`${file}: ${message}`);
  const rel = (file) => relative(dir, file).split(sep).join('/');
  const siteOrigin = new URL(site.url).origin;

  // required files
  const required = ['index.html', '404.html', '.well-known/security.txt', 'robots.txt', 'sitemap.xml', 'favicon.svg'];
  const pagePaths = ['', ...site.pages, ...site.legalPages.map((p) => `legal/${p}`), ...site.docs.publish.map((n) => `docs/${docSlug(n)}`)];
  for (const { code } of site.enabledLocales) {
    const prefix = code === site.defaultLocale ? '' : `${code}/`;
    for (const page of pagePaths) required.push(`${prefix}${page}${page ? '/' : ''}index.html`);
  }
  for (const file of required) if (!isFile(join(dir, file))) fail(file, 'required file is missing from the build');
  if (!existsSync(join(dir, '_astro'))) fail('_astro/', 'no hashed asset folder');
  if (existsSync(join(dir, site.releasesPath.replace(/^\//, '')))) {
    fail(site.releasesPath, 'must not be in the build; nginx serves it from the release pipeline');
  }

  const all = [...walk(dir)];

  // hashed assets, no cookie or storage use, no external urls in css
  for (const file of all) {
    const name = rel(file);
    if (name.startsWith('_astro/') && !HASHED.test(name)) fail(name, 'asset under _astro/ has no content hash in its name');
    if (/\.(js|mjs)$/.test(name) && /document\.cookie|localStorage|sessionStorage/.test(readFileSync(file, 'utf8'))) {
      fail(name, 'uses cookies or web storage');
    }
    if (name.endsWith('.css')) {
      const css = readFileSync(file, 'utf8');
      if (/(?:@import\s+(?:url\()?\s*["']?|url\(\s*["']?)(?:https?:)?\/\//i.test(css)) fail(name, 'css loads from another origin');
    }
  }

  // html
  const htmlFiles = all.filter((f) => f.endsWith('.html'));
  const urlOf = (file) => {
    const name = rel(file);
    return name.endsWith('index.html') ? `/${name.slice(0, -'index.html'.length)}` : `/${name}`;
  };
  const idCache = new Map();
  const idsOf = (file) => {
    if (!idCache.has(file)) {
      const ids = new Set();
      for (const m of readFileSync(file, 'utf8').matchAll(/\s(?:id|name)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) {
        ids.add(m[1] ?? m[2] ?? m[3]);
      }
      idCache.set(file, ids);
    }
    return idCache.get(file);
  };

  // nginx: try_files $uri $uri/ $uri.html, with index.html as the directory index
  const resolveUrl = (pathname) => {
    const p = decodeURIComponent(pathname);
    const target = join(dir, ...p.split('/'));
    if (p.endsWith('/')) return isFile(join(target, 'index.html')) ? { file: join(target, 'index.html') } : null;
    if (isFile(target)) return { file: target };
    if (isFile(join(target, 'index.html'))) return { file: join(target, 'index.html'), redirect: true };
    if (isFile(`${target}.html`)) return { file: `${target}.html` };
    return null;
  };

  for (const file of htmlFiles) {
    const name = rel(file);
    const pageUrl = new URL(urlOf(file), siteOrigin);
    const html = readFileSync(file, 'utf8');

    for (const m of html.matchAll(TAG)) {
      const tag = m[1].toLowerCase();
      const attrs = parseAttrs(m[2]);

      if (tag === 'script') {
        const type = (attrs.type ?? '').toLowerCase();
        // The one inline block allowed is JSON-LD: a data block the browser never runs. Its content is checked in
        // inspect-seo.mjs (valid JSON, schema.org, no "<"); with a src or any other type it is a script like the rest.
        if (attrs.src === undefined && type !== 'application/ld+json') fail(name, 'inline <script> (CSP script-src is self only)');
        if (type === 'application/ld+json' && attrs.src !== undefined) fail(name, 'JSON-LD <script> with a src');
        // the download page's script is the only JavaScript of the site
        if (attrs.src !== undefined && !/(^|\/)download\/index\.html$/.test(name)) fail(name, 'script outside the download page');
        if (attrs.src !== undefined && !attrs.src.startsWith('/_astro/')) fail(name, `script ${attrs.src} is not a hashed file under /_astro/`);
      }
      if (tag === 'style') fail(name, 'inline <style> block');
      for (const [attr, value] of Object.entries(attrs)) {
        if (attr === 'style') fail(name, `style= attribute on <${tag}>`);
        if (/^on[a-z]+$/.test(attr)) fail(name, `${attr}= event handler on <${tag}>`);
        if (/^\s*javascript:/i.test(value)) fail(name, `javascript: url in ${attr} on <${tag}>`);
      }

      // urls to check for existence, and urls the browser loads (those must stay on this origin)
      const refs = [];
      const loads = [];
      if (tag === 'a' && attrs.href !== undefined) refs.push(attrs.href);
      if (tag === 'link' && attrs.href !== undefined) {
        refs.push(attrs.href);
        const rel_ = attrs.rel ?? '';
        if (LOADING_REL.test(rel_)) loads.push(attrs.href);
        if (/stylesheet/i.test(rel_) && !attrs.href.startsWith('/_astro/')) {
          fail(name, `stylesheet ${attrs.href} is not a hashed file under /_astro/`);
        }
      }
      if (['img', 'script', 'iframe', 'source', 'video', 'audio', 'embed', 'track'].includes(tag) && attrs.src !== undefined) {
        refs.push(attrs.src);
        loads.push(attrs.src);
      }
      if (attrs.srcset !== undefined) {
        for (const part of attrs.srcset.split(',')) {
          const url = part.trim().split(/\s+/)[0];
          if (url) {
            refs.push(url);
            loads.push(url);
          }
        }
      }
      if (tag === 'object' && attrs.data !== undefined) {
        refs.push(attrs.data);
        loads.push(attrs.data);
      }
      if (tag === 'form' && attrs.action !== undefined) loads.push(attrs.action);

      for (const url of loads) {
        if (EXTERNAL.test(url) && !url.startsWith(`${siteOrigin}/`)) fail(name, `<${tag}> loads ${url} from another origin`);
      }

      for (const ref of refs) {
        if (ref === '' || ref === '#') continue;
        let url;
        try {
          url = new URL(ref, pageUrl);
        } catch {
          fail(name, `unparseable url "${ref}"`);
          continue;
        }
        if (url.origin !== siteOrigin) continue; // other sites, mailto: and tel: are not checked
        const hit = resolveUrl(url.pathname);
        if (!hit) {
          fail(name, `broken internal link ${ref}`);
          continue;
        }
        if (hit.redirect) fail(name, `link ${ref} lacks its trailing slash (nginx would redirect)`);
        if (url.hash.length > 1 && hit.file.endsWith('.html')) {
          const id = decodeURIComponent(url.hash.slice(1));
          if (!idsOf(hit.file).has(id)) fail(name, `link ${ref}: no element with id "${id}" in ${rel(hit.file)}`);
        }
      }
    }
  }

  const seoPages = htmlFiles.map((file) => ({ name: rel(file), url: urlOf(file), html: readFileSync(file, 'utf8') }));
  problems.push(...inspectSeo({ dir, site, pages: seoPages }));
  return { problems, pages: htmlFiles.length };
}
