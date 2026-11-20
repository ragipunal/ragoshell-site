import { defineConfig } from 'astro/config';
import site from './site.config.mjs';

// Static output served by nginx (`try_files $uri $uri/ $uri.html`): every page is a folder with index.html.
// CSS is never inlined, so the site has no inline <style> and the CSP needs no hashes for it.
export default defineConfig({
  site: site.url,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    assets: '_astro',
    inlineStylesheets: 'never',
  },
  i18n: {
    defaultLocale: site.defaultLocale,
    locales: site.enabledLocales.map((l) => l.code),
    routing: { prefixDefaultLocale: false },
  },
  // Never inline assets or scripts as data: URLs or inline code; everything stays a hashed file.
  vite: { build: { assetsInlineLimit: 0 } },
  devToolbar: { enabled: false },
});
