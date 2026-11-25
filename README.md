# RagoShell site

The static web site of RagoShell: Astro, static output, English at the root and 14 localized routes under
`/<code>/`, no cookies, no analytics, nothing loaded from third parties.

## Setup

Node 22.23.4 or newer (`engines` in `package.json`; `.nvmrc` says 24, the current LTS). Astro 7 needs it; the
Node 20 line that some machines still have is too old.

```bash
npm ci
```

The documentation and change log pages are built from the application repository, which must be checked out
next to this one. Its folder is the sibling named like the repository; if yours has another name, point
`APP_REPO_DIR` at it (`APP_REPO_DIR=../other-folder npm run build`). The build and `npm run check` stop with a
message when the folder is missing. CI checks the repository out itself.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | dev server with hot reload (<http://localhost:4321>) |
| `npm run check` | `astro check`, `scripts/check-brand.mjs`, `scripts/check-content.mjs` (change log parser, markdown renderer, release manifest validation, platform detection, and the real published files), and `scripts/check-site.mjs` (builds into a temporary folder, then checks links and CSP rules) |
| `npm run build` | static build into `dist/` |
| `npm run check:dist` | the same inspection against the real `dist/`: required files, no inline script or style (JSON-LD data blocks excepted, and checked), no external loads, hashed assets under `/_astro/`, no `releases.json`, broken internal links = 0, plus the sitemap, canonical, hreflang, share-card and description checks |
| `npm run preview` | serves `dist/` locally |

Set `ASTRO_TELEMETRY_DISABLED=1` (CI does) or run `npx astro telemetry disable` so the toolchain reports nothing.

## Where things are

- `site.config.mjs`: the **only** place that spells the product name, the domain and sub-domain addresses,
  the repository addresses, the license names, the `cloud` page switch (`soon`: nothing is on sale) and sponsorship link, and the MongoDB trademark notice. `scripts/check-brand.mjs` fails
  when any other source file spells the name.
- `src/i18n/locales/<code>.ts`: dictionaries (English is the reference). A missing or extra key, a missing
  dictionary for an enabled locale, a placeholder mismatch or a missing trademark notice fails the build.
  All 15 application languages (`en`, `tr`, `ar`, `az`, `de`, `es`, `fr`, `hi`, `ja`, `kk`, `ky`, `pt-BR`,
  `ru`, `uz`, `zh-CN`) are enabled as machine-draft translations awaiting native review, matching the app.
  `ar` renders with `dir="rtl"`.
- `src/pages/[...locale]/`: pages, generated once per enabled locale: home, features, download, docs, changes,
  cloud, trademark and the legal drafts (`content/legal/`, with English fallback + notice for locales without
  dedicated legal files). `src/pages/.well-known/security.txt.ts` builds `security.txt` (RFC 9116) from the
  config.
- Documents and change log: `docs.publish` in the config is the allowlist of documents read from the application
  repository; `src/lib/` holds the markdown renderer, the change log parser and the release manifest checks.
- Client-side scripts are content-hashed modules under `/_astro/` (`src/scripts/motion.ts` for progressive
  motion and UI per `docs/Motion.md`, and `src/scripts/download.ts` on the download page only to read
  `/releases.json`, which nginx serves and the build never contains). Every page stays complete without JS.
- Search and sharing: `src/pages/sitemap.xml.ts` and `src/pages/robots.txt.ts` are built
  from the config; `Base.astro` writes the description, canonical, hreflang, Open Graph, Twitter card and JSON-LD
  tags and fails the build on a missing or over-long (>160) description; `src/lib/seo.ts` holds the pure
  builders; `scripts/lib/inspect-seo.mjs` is the dist gate. `site.seo.googleSiteVerification` takes the Search
  Console tag token (empty = no tag).
- `public/`: files copied as they are (`favicon.svg`, `og-image.png`, the 1200×630 share image).

## Deployment

CI runs `npm run check`, `npm run build`, and `npm run check:dist` to produce the static `dist/` tree.
In production, `dist/` is unpacked atomically into timestamped release directories and promoted via a `current`
symlink. `/releases.json` is not part of this build; nginx serves it from the release pipeline.

## License

Code: MIT (`LICENSE`). Written content and translations: CC BY-SA 4.0 (`LICENSE-CONTENT`). The product name,
logo and trademark notice are covered by neither.
