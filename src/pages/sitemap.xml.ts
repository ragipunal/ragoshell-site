import site from '../../site.config.mjs';
import { defaultLocale, localeCodes, localeUrl } from '../i18n';
import { indexablePaths } from '../lib/routes';
import { sitemapXml } from '../lib/seo';

// Built from the config and the indexable page list, so the domain is spelled once.
export const GET = () =>
  new Response(
    sitemapXml({ origin: site.url, defaultLocale, locales: localeCodes, paths: indexablePaths(), urlFor: localeUrl }),
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
