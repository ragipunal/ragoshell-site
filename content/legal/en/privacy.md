# Privacy Policy, Data Protection Notice (GDPR & KVKK) & Cookie-Free Statement

This Privacy Policy and Illumination Notice explains what data is—and is not—processed when you visit [{domain}]({siteUrl}), install or run the {productName} desktop and mobile applications, or use the optional {productName} Cloud services across `{appHost}`, `{apiHost}`, `{dlHost}`, and `{bridgeHost}`. It is drafted to satisfy both Article 10 of the Turkish Personal Data Protection Law No. 6698 (**KVKK**) and Articles 13–14 of the EU/EEA/UK General Data Protection Regulation (**GDPR**).

## 1. Data Controller and Contact Channels

- **Data Controller:** {legalEntity}
- **Registered Address:** {legalAddress}
- **Privacy, KVKK & GDPR Requests:** {privacyContact}
- **General Support:** {supportContact}
- **Security Vulnerability Disclosure:** [{securityTxtPath}]({securityTxtPath})
- **Draft Revision Date:** {draftDate} (VERBİS registration threshold assessment and statutory corporate identifiers are finalized prior to commercial launch of paid plans.)

## 2. This Web Site and Cookie-Free Notice

### 2.1 Zero Cookies and Zero Browser Storage

The public {productName} web site ([{domain}]({siteUrl})) sets **zero HTTP cookies** (`Set-Cookie` is never sent, `document.cookie` is never accessed) and uses **no browser storage** (`localStorage`, `sessionStorage`, `IndexedDB`, or Cache Storage). Because no tracking or non-essential client storage takes place, we do not interrupt visitors with cookie banners.

On the separate account portal (`{appHost}`), signing into an account sets only strictly necessary session and anti-CSRF cookies (`Secure; HttpOnly; SameSite=Lax`), exempt from prior consent under ePrivacy rules and KVKK Cookie Guidelines because they exist solely to keep an authenticated user signed in.

### 2.2 No Third-Party Trackers, Fonts or CDNs

Every stylesheet, vector icon, share image, and font (the operating system's native system font stack) is served directly from `{domain}`. We load **no third-party scripts, pixels, ad networks, or external CDNs**. The [Download]({downloadPath}) page runs a single same-origin script that fetches `/releases.json` from `{domain}` to highlight the installer matching your operating system; no personal identifier is sent with that request. No analytics runs on this site today; if strictly cookie-free server/edge analytics is enabled in a future phase, this policy will be updated beforehand.

### 2.3 Edge Network and Truncated Access Logs

Incoming HTTPS connections are protected by Cloudflare TLS/WAF and forwarded over mutually authenticated TLS (`Origin mTLS`) to our edge `nginx` server:

- **Truncated web access logs:** Our edge `nginx` server strips URL query strings and full `User-Agent` headers, and truncates visitor IPv4 addresses to `/24` (the last octet is zeroed, e.g. `203.0.113.0`) and IPv6 addresses to `/48` before writing access logs.
- **Security and rate-limiting logs:** Full IP addresses are processed transiently in memory for rate limiting and, when security events occur (authentication brute-force attempts, webhook signature failures, or network abuse), retained in security/audit logs for **at most 30 days** on the legal basis of legitimate interest in system security (GDPR Art. 6(1)(f); KVKK Art. 5/2-f).

## 3. Desktop and Mobile Application

### 3.1 Local Database Connections, Credentials and MCP Server

{productName} is a local-first MongoDB client. When you use the application without {productName} Cloud:

- Your MongoDB connection profiles, queries, shell scripts, sampled collection schemas, and query results stay **exclusively on your local device** (under `~/.{productId}/` or the platform's sandboxed app directory).
- Database passwords, SSH private keys/passphrases, TLS certificate passphrases, and AI API keys are stored in your operating system's native encrypted credential vault (`KeyStore`: macOS/iOS Keychain, Windows Credential Locker / DPAPI, Linux Secret Service, Android Keystore)—never in plain text inside `{productId}.json`.
- The embedded read-only Model Context Protocol server (`{productId}-mcp`) is **disabled by default** and communicates locally over standard input/output (`stdio`) only with local AI tools and saved connections that you explicitly authorize.

### 3.2 Optional Release Check and Anonymous Usage Pulse

When an internet connection is available, the Welcome page checks `{apiUrl}/v1/release-check` at most once every 12 hours (staying completely silent when offline) so you can be notified of new releases or critical mandatory security upgrades:

- **Release check fields:** `schemaVersion`, `appVersion`, `platform`, `arch`, `formFactor`, `osVersion`, and `uiLanguage`.
- **Optional aggregate usage counters (`usage` object):** Sent only when `shareAnonymousUsage` is enabled. Contains an on-device salted SHA-256 hash of a random local UUID truncated to 32 hex characters (`installId`), non-identifying feature counters (`launchCount`, `lastSessionSec`, counts of saved/SSH/TLS/replica-set connections, `shellsOpened`, `queriesExecuted`, boolean `aiEnabled`, `uiTheme`, `uiDensity`), and connected MongoDB `major.minor` version strings (such as `7.0`). *(Note: whether `shareAnonymousUsage` ships opt-in `false` by default or legitimate-interest `true` is under pre-launch review `0.9`; in either case you have full local control below.)*
- **Never collected or logged:** The release-check service **never writes client IP addresses to disk or SQLite**, and never receives hostnames, connection URIs, database or collection names, usernames, credentials, SSH keys, or query/script text.
- **How to disable at any time:**
  1. Open **Preferences › Updates & Usage** and uncheck **Share anonymous usage statistics with update checks** (`shareAnonymousUsage: false`) to omit the `usage` object completely while keeping update notifications.
  2. Uncheck **Automatically check for updates on startup** (`checkForUpdates: false`) to stop automatic checks.
  3. Set `"disableHttpsFeatures": true` in `{productId}.json` to block all outbound HTTPS checks in air-gapped or restricted enterprise networks.

### 3.3 Bring-Your-Own-Key and Local AI

When you use the AI query assistant with your own Anthropic or Google Gemini API key (`BYOK`) or a local `Ollama` server, requests travel **directly from your device** to the endpoint you configured. {productName} servers never receive your API key, natural-language prompts, or collection schema context, and your chosen provider's own privacy terms apply.

## 4. {productName} Cloud Services

Using {productName} Cloud (`Pro` or `Team`) is completely optional. When you create an account or subscribe, we process only the minimum data needed to deliver the service:

### 4.1 Account, Device Authorization and Billing Metadata

- **Data processed:** Verified email address, `Argon2id` password hash (plaintext passwords are never stored), optional TOTP 2FA secret or WebAuthn passkey public key, paired client devices via **RFC 8628 Device Authorization Grant** (device name, platform, last-seen timestamp, rotatable refresh token), subscription tier/entitlement state, and payment provider customer/subscription identifiers. Full payment card numbers never touch our servers.
- **Legal basis & retention:** Performance of a contract (GDPR Art. 6(1)(b); KVKK Art. 5/2-c) while your account is active, and compliance with statutory tax/accounting laws (GDPR Art. 6(1)(c); KVKK Art. 5/2-a,ç—10 years for statutory invoice records in Türkiye under the Tax Procedure Law No. 213 and Turkish Commercial Code No. 6102).

### 4.2 Zero-Knowledge End-to-End Encrypted Sync

- **Client-side encryption:** Synced items (connection profiles, optional credentials if you explicitly choose to include them, SSH settings, snippets, query history, startup scripts, and UI preferences) are encrypted **on your device before upload** using `AES-256-GCM` with keys derived locally from your sync secret via `Argon2id`.
- **Zero server knowledge:** Our database (`sync_blobs`) stores only opaque ciphertext, collection identifier, byte size, and ETag/version counters. **Your encryption key is never transmitted to {productName} servers; neither we nor any subprocessor can inspect your synced items, and if you lose your sync passphrase, we cannot recover your encrypted data.**
- **Post-expiry retention:** If a paid subscription ends, encrypted blobs remain read-only (`GET /v1/sync/*`) and exportable (`POST /v1/account/export`) for **90 calendar days** and are permanently deleted afterward unless you renew or delete your account earlier (see [Refund Policy]({refundsPath})).

### 4.3 Keyless Hosted AI Assistant

When you use the {productName} Cloud hosted AI assistant (`POST /v1/ai/generate`), your prompt and relevant collection field/type summary are transmitted over TLS to our commercial LLM API provider solely to generate the response. **Prompts, schema summaries, and model completions are never logged or stored in {productName} databases**, and commercial API endpoints are configured so customer inputs are not used to train foundation models. We record only your monthly aggregate token counter (`ai_usage`: user ID, billing month, token total) to enforce plan quotas.

### 4.4 Hosted WebSocket Bridge

When `Pro` or `Team` subscribers use the optional hosted WebSocket-to-TCP bridge (`{bridgeHost}`), connections are restricted to user-allowlisted public `host:port` targets with mandatory end-to-end TLS between your client and your MongoDB server, ensuring database credentials and wire payloads remain encrypted in transit. To prevent SSRF and network abuse, connection audit logs record only timestamp, user ID, target `host:port`, and byte counts—**never payload contents**—for **at most 30 days**.

## 5. Subprocessors and International Data Transfers

We never sell personal data or share it with advertisers. We engage only the infrastructure and payment subprocessors listed below:

| Provider / Category | Purpose and Data Scope | Region | Data Protection Safeguards |
| --- | --- | --- | --- |
| **Cloudflare, Inc.** | Authoritative DNS, Anycast WAF/DDoS protection, Origin mTLS, and Cloudflare R2 object storage (public installers on `{dlHost}` + client-side `restic`-encrypted database backups) | Global / EU | EU-US Data Privacy Framework, GDPR DPA & Standard Contractual Clauses (SCCs); backups encrypted prior to upload |
| **Primary VPS Infrastructure Provider** | Dedicated Linux compute hosting edge `nginx`, Go API/portal (`{apiHost}`, `{appHost}`), and internal PostgreSQL containers | EU / Türkiye | ISO 27001 physical/network security, GDPR DPA, isolated internal Docker networks |
| **Paddle (`Paddle.com Market Limited` / `Paddle.com Inc.`)** | Global Merchant of Record (MoR) for subscriptions outside Türkiye: checkout, card/wallet processing, global VAT/Sales Tax calculation, invoicing, and refunds | UK / EU / Global | PCI-DSS Level 1, GDPR DPA, UK adequacy & SCCs (acts as independent controller for statutory tax records) |
| **iyzico (`iyzi Ödeme ve Elektronik Para Hizmetleri A.Ş.`)** | Payment Service Provider (PSP) for `TRY` subscriptions in Türkiye: local card processing and subscription billing | Republic of Türkiye | Licensed by the Central Bank of Türkiye (TCMB) / BDDK, PCI-DSS Level 1, KVKK compliant |
| **Transactional Email Provider (Phase `0.7`: Amazon SES / Postmark / Resend)** | Account verification, password reset, billing receipts, and deletion notices (`0` marketing newsletters) | EU / US | TLS encryption in transit, SPF/DKIM/DMARC, GDPR DPA & SCCs |
| **Commercial LLM API Providers (Anthropic PBC / Google Cloud Gemini API)** | *Only when a user actively invokes Hosted Cloud AI:* real-time query/schema inference with zero model training | US / EU | Commercial zero-training API terms, GDPR DPA & SCCs, zero prompt retention on {productName} servers |

Cross-border transfers from Türkiye are conducted in compliance with Article 9 of KVKK (as amended in 2024, relying on adequacy decisions or KVKK standard contractual safeguards) and from the EEA/UK under GDPR Chapter V (Articles 45–46 adequacy decisions and Standard Contractual Clauses).

## 6. Your Rights Under KVKK Article 11 and GDPR Articles 15–22

Depending on your jurisdiction, you have the right to:

- **Under KVKK Article 11:** Learn whether your personal data is processed; request information if processed; learn the purpose of processing and whether data is used accordingly; know third parties in Türkiye or abroad to whom data is transferred; request rectification of incomplete or inaccurate data; request deletion or destruction under KVKK Article 7; request notification of rectification/deletion to recipients; object to unfavorable outcomes produced exclusively by automated systems; and claim compensation for damages caused by unlawful processing.
- **Under GDPR Articles 15–22 & 77:** Request access to your personal data, rectification, erasure ("right to be forgotten"), restriction of processing, **data portability** in a structured machine-readable format, objection to processing based on legitimate interests, withdrawal of consent at any time without affecting prior lawful processing, and lodge a complaint with your local Data Protection Authority (or the Turkish Personal Data Protection Authority—*Kişisel Verileri Koruma Kurumu*).

**Self-service tools and request procedure:**

- **Instant Data Export (`POST /v1/account/export`):** From `{appUrl}`, export a machine-readable JSON archive containing your account profile, paired devices, subscription/entitlement metadata, and encrypted `sync_blobs`.
- **Account Deletion (`DELETE /v1/account`):** Trigger full account deletion directly from `{appUrl}`. Deletion enters a **30-calendar-day reversible cooling-off period** so accidental deletions or hijacked sessions can be aborted; after 30 days, your account, device tokens, and encrypted sync blobs are permanently purged from live databases (encrypted off-site disaster-recovery backups age out automatically on their rolling retention schedule, while legally mandated tax invoices are kept solely for statutory audit periods).
- **Written Applications:** You may also submit requests via {privacyContact}. Validated requests are answered free of charge within **30 days** (KVKK Communiqué on Application Procedures to the Data Controller; GDPR Art. 12(3)).

## 7. Security Measures and 72-Hour Data Breach Notification

We protect account and service infrastructure through `Argon2id` password hashing, client-side `AES-256-GCM` sync encryption, short-lived `ES256` tokens, Cloudflare Authenticated Origin Pulls (`mTLS`), firewall allowlisting, read-only rootless/non-root containers with dropped Linux capabilities, automated vulnerability scanning (`govulncheck`, `npm audit`, OSV-Scanner, Trivy), and encrypted off-site `restic` backups.

If a personal data breach occurs that is likely to pose a risk to the rights and freedoms of individuals, we will notify the competent supervisory authorities (the KVKK Board and/or relevant GDPR supervisory authority) **within 72 hours** of becoming aware of the incident and inform affected users without undue delay in accordance with KVKK Article 12/5 and GDPR Articles 33–34.
