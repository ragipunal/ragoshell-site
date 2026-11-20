// The pages a search engine may index, as locale-independent paths. While `site.legal.draft` is true, legal pages
// carry `noindex` and stay unlisted; the 404 page is not a page. `scripts/check-site.mjs` compares this list
// with the `noindex` tags that were actually built.
import site from '../../site.config.mjs';
import { publishedDocs } from './app-repo.ts';

export function indexablePaths(): string[] {
  const legal = site.legal.draft ? [] : site.legalPages.map((page: string) => `/legal/${page}/`);
  return ['/', ...site.pages.map((page: string) => `/${page}/`), ...legal, ...publishedDocs().map((doc) => `/docs/${doc.slug}/`)];
}
