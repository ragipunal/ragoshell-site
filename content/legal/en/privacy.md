# Privacy Policy, Data Protection Notice (GDPR & KVKK) & Cookie-Free Statement

This Privacy Policy and Illumination Notice explains what data is (and is not) processed when you visit [{domain}]({siteUrl}), install or run the {productName} desktop and mobile applications, or use the optional {productName} Cloud services across `{appHost}`, `{apiHost}`, `{dlHost}`, and `{bridgeHost}`. It is drafted to satisfy both Article 10 of the Turkish Personal Data Protection Law No. 6698 (**KVKK**) and Articles 13-14 of the EU/EEA/UK General Data Protection Regulation (**GDPR**).

## 1. Data Controller and Contact Channels

- **Data Controller:** {legalEntity}
- **Location:** {legalAddress}
- **Privacy, KVKK & GDPR Requests:** {privacyContact}
- **General Support:** {supportContact}
- **Security Vulnerability Disclosure:** [{securityTxtPath}]({securityTxtPath})
- **Last Updated:** {draftDate}

## 2. This Web Site and Cookie-Free Notice

### 2.1 Zero Cookies and Zero Browser Storage

The public {productName} web site ([{domain}]({siteUrl})) sets **zero HTTP cookies** (`Set-Cookie` is never sent, `document.cookie` is never accessed) and uses **no browser storage** (`localStorage`, `sessionStorage`, `IndexedDB`, or Cache Storage). Because no tracking or non-essential client storage takes place, we do not interrupt visitors with cookie banners.

On the separate account portal (`{appHost}`), signing into an account sets only strictly necessary session and anti-CSRF cookies (`Secure; HttpOnly; SameSite=Lax`), exempt from prior consent under ePrivacy rules and KVKK Cookie Guidelines because they exist solely to keep an authenticated user signed in.

### 2.2 No Third-Party Trackers, Fonts or CDNs

Every stylesheet, vector icon, share image, and self-hosted font is served directly from `{domain}`. We load **no third-party scripts, pixels, ad networks, or external CDNs**. Client-side progressive motion runs as a hashed same-origin module with zero network telemetry, and the [Download]({downloadPath}) page runs a same-origin script that fetches `/releases.json` from `{domain}` to highlight the installer matching your operating system; no personal identifier is sent with that request. No analytics runs on this site today; if strictly cookie-free server/edge analytics is enabled in a future phase, this policy will be updated beforehand.

### 2.3 Edge Network and Truncated Access Logs

Incoming HTTPS connections are protected by Cloudflare TLS/WAF and forwarded over mutually authenticated TLS (`Origin mTLS`) to our edge `nginx` server:

- **Truncated web access logs:** Our edge `nginx` server strips URL query strings and full `User-Agent` headers, and truncates visitor IPv4 addresses to `/24` (the last octet is zeroed, e.g. `203.0.113.0`) and IPv6 addresses to `/48` before writing access logs.
- **Security and rate-limiting logs:** Full IP addresses are processed transiently in memory for rate limiting and, when security events occur (authentication brute-force attempts, invalid token attempts, or network abuse), retained in security/audit logs for **at most 30 days** on the legal basis of legitimate interest in system security (GDPR Art. 6(1)(f); KVKK Art. 5/2-f).

## 3. Desktop and Mobile Application

### 3.1 Local Database Connections, Credentials and MCP Server

{productName} is a local-first MongoDB client. When you use the application without {productName} Cloud:

- Your MongoDB connection profiles, queries, shell scripts, sampled collection schemas, and query results stay **exclusively on your local device** (under `~/.{productId}/` or the platform's sandboxed app directory).
- Database passwords, SSH private keys/passphrases, TLS certificate passphrases, and AI API keys are stored in your operating system's native encrypted credential vault (`KeyStore`: macOS/iOS Keychain, Windows Credential Locker / DPAPI, Linux Secret Service, Android Keystore), never in plain text inside `{productId}.json`.
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

The AI query assistant is off until you turn it on, and {productName} operates no AI service of its own. You choose the endpoint: Anthropic, Google Gemini, an OpenAI-compatible server (an online service or one you run yourself), or a local model such as `Ollama` or LM Studio. Nothing is sent until you press Generate. The request then travels **directly from your device** to that endpoint and contains your natural-language request; the database and collection names; the collection's field names, types, indexes and document count; the server version; and the fields of related collections in the same database. Sampled document values (frequent values, minimum and maximum) are included only if you allow them in Preferences. **Test connection** requests only the endpoint's model list and sends no schema or prompt.

- {productName} servers never receive your API key, prompts, schema summaries, or the generated query. A key is only ever sent to the endpoint it was entered for, and never over plain `http` outside your own device.
- With a local model on your own device or local network, the data does not leave that machine, unless the model or a proxy behind that address forwards it to an online service (for example, `Ollama` cloud models).
- The endpoint you choose processes the request under its own terms and privacy policy, and any usage fees are between you and that provider. It is not a {productName} subprocessor: {productName} does not control, and is not responsible for, how third-party or self-hosted endpoints handle data. Before you use a provider with business or personal data, check its data use and retention terms.

## 4. {productName} Cloud Services

Using {productName} Cloud is completely optional and free of charge; no paid plan is on sale. When you create an account, we process only the minimum data needed to deliver the service:

### 4.1 Account and Device Authorization

- **Data processed:** Verified email address, `Argon2id` password hash (plaintext passwords are never stored), optional TOTP 2FA secret or WebAuthn passkey public key, paired client devices via **RFC 8628 Device Authorization Grant** (device name, platform, last-seen timestamp, rotatable refresh token), portal sign-in times, the account's entitlement state (which cloud features it may use), and the date an inactivity warning was sent (Section 4.2).
- **Legal basis & retention:** Performance of a contract (GDPR Art. 6(1)(b); KVKK Art. 5/2-c) while your account exists. Inactivity alone never deletes the account (Section 4.2).

### 4.2 Zero-Knowledge End-to-End Encrypted Sync

- **Client-side encryption:** Synced items (connection profiles, optional credentials if you explicitly choose to include them, SSH settings, snippets, query history, startup scripts, and UI preferences) are encrypted **on your device before upload** using `AES-256-GCM` with keys derived locally from your sync secret via `Argon2id`.
- **Zero server knowledge:** Our database (`sync_blobs`) stores only opaque ciphertext, collection identifier, byte size, and ETag/version counters. **Your encryption key is never transmitted to {productName} servers; neither we nor any subprocessor can inspect your synced items, and if you lose your sync passphrase, we cannot recover your encrypted data.**
- **Daily upload counter:** To enforce the limit of 500 uploads per day, we store the account, the UTC date, and the number of uploads made that day (`sync_write_days`). Earlier days are removed at the next upload, and the counter is deleted together with your sync data or account. It is an operational counter and is not part of the data export. Legal basis: legitimate interest in preventing abuse (GDPR Art. 6(1)(f); KVKK Art. 5/2-f).
- **Inactive accounts:** If an account shows no activity for 12 months (the latest of: a device signed in to it using the app, a portal sign-in, an upload, or the account's creation), we send a warning to its verified email address after 11 months. Unless the account is used in the meantime, its encrypted sync data and daily counter are deleted 30 days after the warning was delivered. The account itself is kept, and we keep an internal record that the deletion happened, without the email address or any content. Legal basis: the storage limitation principle (GDPR Art. 5(1)(e); KVKK Art. 4/2-d).

### 4.3 Hosted WebSocket Bridge

When you use the optional hosted bridge (`{bridgeHost}`), your client sends your MongoDB connection URI (with any credentials in it) and each command over encrypted `wss://`. The bridge connects to your server over TLS, runs the commands, and returns the results. These are held in memory only while the session runs and are never written to disk. Only public targets that use TLS are allowed.

- **Operational logs:** errors and denied targets (host name and reason), never credentials, full connection URIs, or database payloads; kept for **at most 30 days**.
- **Monthly traffic counter:** To enforce the 1 GB monthly limit, the bridge keeps a file with the current calendar month and, for each account that used the bridge that month, a SHA-256 hash of the account ID and the number of bytes transferred. The hash is pseudonymous, not anonymous: we can match it to an account ID. The counters are reset at the start of each month, so a value is kept until the end of its month at most.
- **Restriction list:** If we switch off bridge access for an account because of abuse, its account ID is kept on an internal list while the restriction lasts.
- **Legal basis:** legitimate interest in security and preventing abuse (GDPR Art. 6(1)(f); KVKK Art. 5/2-f).

## 5. Subprocessors and International Data Transfers

We never sell personal data or share it with advertisers. We engage only the infrastructure subprocessors listed below:

| Provider / Category | Purpose and Data Scope | Region | Data Protection Safeguards |
| --- | --- | --- | --- |
| **Cloudflare, Inc.** | Authoritative DNS, Anycast WAF/DDoS protection, Origin mTLS, Cloudflare Email Routing (inbound support/privacy/security mail forwarding), and public installers on `{dlHost}` | Global / EU | EU-US Data Privacy Framework, GDPR DPA & Standard Contractual Clauses (SCCs) |
| **Primary VPS Infrastructure Provider** | Dedicated Linux compute hosting edge `nginx`, Go API/portal (`{apiHost}`, `{appHost}`), hosted bridge (`{bridgeHost}`), internal PostgreSQL containers, and encrypted local `restic` backups | EU / Türkiye | ISO 27001 physical/network security, GDPR DPA, isolated internal Docker networks |
| **Resend** | Outbound transactional email: account verification, password reset, 2FA recovery, inactivity warnings, and deletion notices (`0` marketing newsletters) | EU / US | TLS encryption in transit, SPF/DKIM/DMARC, GDPR DPA & SCCs |

Cross-border transfers from Türkiye are conducted in compliance with Article 9 of KVKK (as amended in 2024, relying on adequacy decisions or KVKK standard contractual safeguards) and from the EEA/UK under GDPR Chapter V (Articles 45-46 adequacy decisions and Standard Contractual Clauses).

## 6. Your Rights Under KVKK Article 11 and GDPR Articles 15-22

Depending on your jurisdiction, you have the right to:

- **Under KVKK Article 11:** Learn whether your personal data is processed; request information if processed; learn the purpose of processing and whether data is used accordingly; know third parties in Türkiye or abroad to whom data is transferred; request rectification of incomplete or inaccurate data; request deletion or destruction under KVKK Article 7; request notification of rectification/deletion to recipients; object to unfavorable outcomes produced exclusively by automated systems; and claim compensation for damages caused by unlawful processing.
- **Under GDPR Articles 15-22 & 77:** Request access to your personal data, rectification, erasure ("right to be forgotten"), restriction of processing, **data portability** in a structured machine-readable format, objection to processing based on legitimate interests, withdrawal of consent at any time without affecting prior lawful processing, and lodge a complaint with your local Data Protection Authority (or the Turkish Personal Data Protection Authority, *Kişisel Verileri Koruma Kurumu*).

**Self-service tools and request procedure:**

- **Instant Data Export (`POST /v1/account/export`):** From `{appUrl}`, export a machine-readable JSON archive containing your account profile, paired devices, entitlement metadata, and encrypted `sync_blobs`.
- **Account Deletion (`DELETE /v1/account`):** Trigger full account deletion directly from `{appUrl}`. Deletion enters a **30-calendar-day reversible cooling-off period** so accidental deletions or hijacked sessions can be aborted; after 30 days, your account, device tokens, and encrypted sync blobs are permanently purged from live databases (encrypted local `restic` backups age out automatically on their rolling retention schedule).
- **Written Applications:** You may also submit requests via {privacyContact}. Validated requests are answered free of charge within **30 days** (KVKK Communiqué on Application Procedures to the Data Controller; GDPR Art. 12(3)).

## 7. Security Measures and 72-Hour Data Breach Notification

We protect account and service infrastructure through `Argon2id` password hashing, client-side `AES-256-GCM` sync encryption, short-lived `ES256` tokens, Cloudflare Authenticated Origin Pulls (`mTLS`), firewall allowlisting, read-only rootless/non-root containers with dropped Linux capabilities, automated vulnerability scanning (`govulncheck`, `npm audit`, OSV-Scanner, Trivy), and encrypted local `restic` backups.

If a personal data breach occurs that is likely to pose a risk to the rights and freedoms of individuals, we will notify the competent supervisory authorities (the KVKK Board and/or relevant GDPR supervisory authority) **within 72 hours** of becoming aware of the incident and inform affected users without undue delay in accordance with KVKK Article 12/5 and GDPR Articles 33-34.
