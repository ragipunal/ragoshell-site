import type { MessageKey } from './i18n';

/** Header navigation: locale-independent path and the dictionary key of its label. */
export const nav: { path: string; key: MessageKey }[] = [
  { path: '/features/', key: 'nav.features' },
  { path: '/download/', key: 'nav.download' },
  { path: '/docs/', key: 'nav.docs' },
  { path: '/changes/', key: 'nav.changes' },
  { path: '/pricing/', key: 'nav.pricing' },
];

/** Footer links: the legal pages (their label keys follow `legal.<page>.title`) and the trademark page. */
export const trademarkPath = '/trademark/';
