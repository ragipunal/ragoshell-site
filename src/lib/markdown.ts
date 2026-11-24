// Renders a document of the application repository to HTML for the docs pages. Raw HTML in the source is
// shown as text, images are refused, only http(s) and mailto links survive, and links to other documents are
// rewritten to this site or to the repository. Pure (no file access) so a node script can test it.
import { Marked } from 'marked';
import { DESCRIPTION_LIMIT, shorten } from './seo.ts';

export interface RenderContext {
  /** Published documents: file stem (`Shell`) to the page's URL path (`/docs/shell/`), already localized. */
  docs: Record<string, string>;
  /** URL of a file of the application repository, for links that do not point at a published document. */
  repoUrl: (path: string) => string;
  /** Keep root-relative site paths (`/legal/privacy/`, `/.well-known/security.txt`) in local site content. */
  allowRootPaths?: boolean;
  /** Skip emitting the first `# ` heading in HTML when the page template renders `<h1>` itself. */
  omitFirstH1?: boolean;
}

export interface Heading {
  depth: number;
  id: string;
  text: string;
}

export interface Rendered {
  html: string;
  title: string;
  description: string;
  headings: Heading[];
}

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const plainText = (markdown: string): string =>
  markdown
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_]/g, '')
    .replace(/\s*\u2014\s*/g, ': ')
    .replace(/\u2013/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

export function slugify(text: string): string {
  return plainText(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

/** The URL a link should get, or null to drop the link and keep its text. */
export function rewriteHref(href: string, ctx: RenderContext): string | null {
  const value = href.trim();
  if (value === '' || value.startsWith('//')) return null;
  if (value.startsWith('#')) return value;
  if (ctx.allowRootPaths && value.startsWith('/')) return value;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return /^(https?:|mailto:)/i.test(value) ? value : null;

  const hashAt = value.indexOf('#');
  const path = hashAt === -1 ? value : value.slice(0, hashAt);
  const hash = hashAt === -1 ? '' : value.slice(hashAt);
  const joined = path.startsWith('docs/') ? path : `docs/${path}`;
  const resolved = joined
    .split('/')
    .reduce<string[]>((parts, segment) => {
      if (segment === '..') parts.pop();
      else if (segment !== '.' && segment !== '') parts.push(segment);
      return parts;
    }, [])
    .join('/');
  if (resolved === '' || resolved.startsWith('..') || path.startsWith('/')) return null;

  const doc = /^docs\/([^/]+)\.md$/.exec(resolved);
  if (doc) return ctx.docs[doc[1]] ? `${ctx.docs[doc[1]]}${hash}` : null;
  return `${ctx.repoUrl(resolved)}${hash}`;
}

export function renderMarkdown(source: string, ctx: RenderContext): Rendered {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();
  let firstH1Omitted = false;

  const marked = new Marked({ gfm: true, async: false });
  marked.use({
    renderer: {
      html({ text }) {
        return escapeHtml(text);
      },
      image({ href }) {
        throw new Error(`markdown: an image (${href}) in a published document; the site does not render images yet`);
      },
      heading({ tokens, depth, text: rawText }) {
        if (ctx.omitFirstH1 && depth === 1 && !firstH1Omitted) {
          firstH1Omitted = true;
          return '';
        }
        const inline = this.parser.parseInline(tokens);
        const text = plainText(rawText);
        const base = slugify(text) || 'section';
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        const id = count === 0 ? base : `${base}-${count}`;
        headings.push({ depth, id, text });
        return `<h${depth} id="${escapeHtml(id)}">${inline}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const inline = this.parser.parseInline(tokens);
        const target = rewriteHref(href, ctx);
        if (target === null) return inline;
        const external = /^https?:/i.test(target);
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
        return `<a href="${escapeHtml(target)}"${titleAttr}${external ? ' rel="noopener"' : ''}>${inline}</a>`;
      },
      text(token) {
        if (!('tokens' in token && token.tokens)) {
          token.text = token.text.replace(/\s*\u2014\s*/g, ': ').replace(/\u2013/g, '-');
        }
        return false;
      },
      code({ text, lang }) {
        const language = lang ? lang.split(/\s+/)[0].replace(/[^\w+-]/g, '') : '';
        const cls = language ? ` class="language-${language}"` : '';
        return `<pre><code${cls}>${escapeHtml(text)}\n</code></pre>\n`;
      },
    },
  });

  const html = marked.parse(source) as string;

  const tokens = new Marked().lexer(source);
  const first = tokens.find((t) => t.type === 'heading' && (t as { depth: number }).depth === 1) as { text: string } | undefined;
  const paragraph = tokens.find((t) => t.type === 'paragraph') as { text: string } | undefined;
  const title = first ? plainText(first.text) : '';
  const description = shorten(paragraph ? plainText(paragraph.text) : '', DESCRIPTION_LIMIT);

  return { html, title, description, headings };
}
