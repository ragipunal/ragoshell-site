// The single source of the brand and of every address, license name and legal notice of this site.
// No page, component, dictionary or script spells these values: they import this file or use the
// `{productName}`-style placeholders of src/i18n. `scripts/check-brand.mjs` fails when another source file
// spells the name.

/**
 * @typedef {{ code: string, og: string, label: string, dir: 'ltr' | 'rtl', enabled: boolean }} LocaleConfig
 * `og` is the Open Graph locale (language_TERRITORY). `label` is the language's own name, shown in the language
 * picker. `enabled: false` locales have no pages and need no dictionary yet; to enable one add
 * src/i18n/locales/<code>.ts and flip the flag.
 */

const productName = 'RagoShell';
const productId = 'ragoshell';
const domain = 'ragoshell.com.tr';

const repoBase = 'https://github.com';
const repoOwner = 'ragipunal';
const appRepoUrl = `${repoBase}/${repoOwner}/${productId}`;
const repoBlobBase = `${appRepoUrl}/blob/main`;

/** @type {LocaleConfig[]} The first entry is the default locale and is served at the root. */
const locales = [
  { code: 'en', og: 'en_US', label: 'English', dir: 'ltr', enabled: true },
  { code: 'tr', og: 'tr_TR', label: 'Türkçe', dir: 'ltr', enabled: true },
  // All 15 application languages are enabled (machine-draft translations awaiting native review, matching the application).
  { code: 'ar', og: 'ar_AR', label: 'العربية', dir: 'rtl', enabled: true },
  { code: 'az', og: 'az_AZ', label: 'Azərbaycanca', dir: 'ltr', enabled: true },
  { code: 'de', og: 'de_DE', label: 'Deutsch', dir: 'ltr', enabled: true },
  { code: 'es', og: 'es_ES', label: 'Español', dir: 'ltr', enabled: true },
  { code: 'fr', og: 'fr_FR', label: 'Français', dir: 'ltr', enabled: true },
  { code: 'hi', og: 'hi_IN', label: 'हिन्दी', dir: 'ltr', enabled: true },
  { code: 'ja', og: 'ja_JP', label: '日本語', dir: 'ltr', enabled: true },
  { code: 'kk', og: 'kk_KZ', label: 'Қазақша', dir: 'ltr', enabled: true },
  { code: 'ky', og: 'ky_KG', label: 'Кыргызча', dir: 'ltr', enabled: true },
  { code: 'pt-BR', og: 'pt_BR', label: 'Português (Brasil)', dir: 'ltr', enabled: true },
  { code: 'ru', og: 'ru_RU', label: 'Русский', dir: 'ltr', enabled: true },
  { code: 'uz', og: 'uz_UZ', label: 'Oʻzbekcha', dir: 'ltr', enabled: true },
  { code: 'zh-CN', og: 'zh_CN', label: '简体中文', dir: 'ltr', enabled: true },
];

const enabledLocales = locales.filter((l) => l.enabled);

const site = {
  productName,
  productId,
  /** The two tones of the wordmark. */
  wordmark: ['Rago', 'Shell'],
  domain,
  url: `https://${domain}`,

  hosts: {
    site: domain,
    app: `app.${domain}`,
    api: `api.${domain}`,
    dl: `dl.${domain}`,
    bridge: `bridge.${domain}`,
  },
  urls: {
    app: `https://app.${domain}`,
    api: `https://api.${domain}`,
    dl: `https://dl.${domain}`,
    bridge: `https://bridge.${domain}`,
  },
  contacts: {
    support: `support@${domain}`,
    privacy: `privacy@${domain}`,
    security: `security@${domain}`,
  },
  /** nginx serves this file from the release pipeline's output; it is never part of the site build. */
  releasesPath: '/releases.json',

  repo: {
    base: repoBase,
    owner: repoOwner,
    appRepoUrl,
    siteRepoUrl: `${appRepoUrl}-site`,
    issuesUrl: `${appRepoUrl}/issues`,
    blobUrl: (path) => `${repoBlobBase}/${path}`,
  },

  license: {
    code: { name: 'MIT', url: 'https://opensource.org/license/mit' },
    content: { name: 'CC BY-SA 4.0', url: 'https://creativecommons.org/licenses/by-sa/4.0/' },
    app: { name: 'GPLv3', url: 'https://www.gnu.org/licenses/gpl-3.0.html' },
    bridge: { name: 'Apache-2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0' },
  },

  /**
   * The cloud & deployment page. The client is GPLv3 free software, optional hosted cloud services are free
   * with fair-use limits, nothing is sold, and self-hosted enterprise servers are supported.
   */
  cloud: {
    /** @type {'soon'} The only mode: hosted cloud services are free with fair-use limits; nothing is on sale. */
    mode: 'soon',
    donateUrl: `${repoBlobBase}/DONATE.md`,
  },

  /**
   * The MongoDB trademark notice, required on the site and in store listings.
   * Every enabled locale needs an entry (the build fails otherwise).
   */
  trademarkNotice: {
    en: `MongoDB is a registered trademark of MongoDB, Inc. ${productName} is not affiliated with or endorsed by MongoDB, Inc.`,
    tr: `MongoDB, MongoDB, Inc.’in tescilli ticari markasıdır. ${productName}, MongoDB, Inc. ile bağlantılı değildir ve MongoDB, Inc. tarafından onaylanmamıştır.`,
    ar: `تُعد MongoDB علامة تجارية مسجلة لشركة MongoDB, Inc. ولا يرتبط ${productName} بشركة MongoDB, Inc. ولا يحظى بدعمها.`,
    az: `MongoDB, MongoDB, Inc. şirkətinin qeydiyyatdan keçmiş ticarət nişanıdır. ${productName} MongoDB, Inc. ilə əlaqəli deyil və onun tərəfindən təsdiqlənmir.`,
    de: `MongoDB ist eine eingetragene Marke von MongoDB, Inc. ${productName} ist mit MongoDB, Inc. weder verbunden noch von ihr unterstützt.`,
    es: `MongoDB es una marca registrada de MongoDB, Inc. ${productName} no está afiliado ni respaldado por MongoDB, Inc.`,
    fr: `MongoDB est une marque déposée de MongoDB, Inc. ${productName} n’est ni affilié à MongoDB, Inc., ni approuvé par celle-ci.`,
    hi: `MongoDB, MongoDB, Inc. का एक पंजीकृत ट्रेडमार्क है। ${productName}, MongoDB, Inc. से संबद्ध या उसके द्वारा समर्थित नहीं है।`,
    ja: `MongoDBはMongoDB, Inc.の登録商標です。${productName}はMongoDB, Inc.と提携しておらず、同社による承認も受けていません。`,
    kk: `MongoDB, MongoDB, Inc. компаниясының тіркелген сауда белгісі. ${productName} MongoDB, Inc. компаниясымен байланысты емес және оның қолдауына ие емес.`,
    ky: `MongoDB, MongoDB, Inc. компаниясынын катталган соода белгиси. ${productName} MongoDB, Inc. менен байланышы жок жана анын колдоосуна ээ эмес.`,
    'pt-BR': `MongoDB é uma marca registrada da MongoDB, Inc. O ${productName} não é afiliado nem endossado pela MongoDB, Inc.`,
    ru: `MongoDB является зарегистрированным товарным знаком MongoDB, Inc. ${productName} не аффилирован с MongoDB, Inc. и не одобрен ею.`,
    uz: `MongoDB, MongoDB, Inc. kompaniyasining roʻyxatdan oʻtgan savdo belgisidir. ${productName} MongoDB, Inc. bilan bogʻliq emas va uning tomonidan tasdiqlanmagan.`,
    'zh-CN': `MongoDB是MongoDB, Inc.的注册商标。${productName}与MongoDB, Inc.没有关联，也未获得其认可。`,
  },

  /** Pages every locale has (routes under src/pages/[...locale]/), and the legal pages under /legal/. */
  pages: ['features', 'download', 'docs', 'changes', 'cloud', 'trademark'],
  legalPages: ['terms', 'privacy', 'imprint'],

  /**
   * Legal draft status and operator contact placeholders.
   * While `draft` is true, legal pages display the counsel-review banner, emit `noindex`, and stay out of sitemap.xml.
   */
  legal: {
    draft: true,
    draftDate: '2026-11-22',
    entity: {
      en: '[Pending statutory commercial registration: Legal entity name, tax office/ID and MERSİS]',
      tr: '[Yasal ticari sicil tescili bekleniyor: Ticari unvan, vergi dairesi/VKN ve MERSİS kaydı]',
    },
    address: {
      en: '[Pending statutory commercial registration: Registered business address in the Republic of Türkiye]',
      tr: '[Yasal ticari sicil tescili bekleniyor: Türkiye Cumhuriyeti yasal tebligat ve merkez adresi]',
    },
    supportContact: {
      en: `[support@${domain}](mailto:support@${domain})`,
      tr: `[support@${domain}](mailto:support@${domain})`,
    },
    privacyContact: {
      en: `[privacy@${domain}](mailto:privacy@${domain})`,
      tr: `[privacy@${domain}](mailto:privacy@${domain})`,
    },
    securityContact: {
      en: `[security@${domain}](mailto:security@${domain})`,
      tr: `[security@${domain}](mailto:security@${domain})`,
    },
    securityTxtPath: '/.well-known/security.txt',
  },

  /**
   * Documents of the application repository that the site publishes.
   * Only these files are ever read; everything else in docs/ is omitted. The folder is found through the
   * environment variable named here, or the sibling folder named like the product's repository.
   */
  docs: {
    publish: ['Shell', 'McpServer', 'Platforms', 'AiAssistant'],
    language: 'en',
    repoEnv: 'APP_REPO_DIR',
  },

  download: {
    platforms: ['windows', 'macos', 'linux', 'android', 'ios'],
    /** Fallback link of the download page when /releases.json is unavailable. */
    allDownloadsUrl: `${appRepoUrl}/releases`,
    /** Hosts a download link from /releases.json may point to; anything else is dropped by the page script. */
    allowedHosts: [`dl.${domain}`, 'github.com', 'play.google.com', 'apps.apple.com'],
  },

  /** Search and sharing metadata. */
  seo: {
    /** One 1200x630 PNG under public/, served by this site, used by every page's share card. */
    ogImage: { path: '/og-image.png', width: 1200, height: 630, maxBytes: 300 * 1024 },
    /** Google Search Console HTML-tag token; empty = no tag (a DNS TXT record needs none). Letters, digits, - and _ only. */
    googleSiteVerification: '',
  },

  /** RFC 9116: how long security.txt stays valid, counted from each build (the RFC advises under a year). */
  securityTxtValidDays: 364,

  defaultLocale: locales[0].code,
  locales,
  enabledLocales,
};

export default site;
