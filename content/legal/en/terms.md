# Terms of Service

These Terms of Service ("Terms") govern your use of [{domain}]({siteUrl}) and the optional {productName} Cloud services operated across `{appHost}`, `{apiHost}`, `{dlHost}`, and `{bridgeHost}`. Please read these Terms alongside our [Privacy Policy]({privacyPath}) and [Imprint]({imprintPath}). No paid plan is on sale; no part of these Terms makes you pay anything.

## 1. Open-Source Client License vs. Cloud Services

- **Free and open-source client (`{appLicenseName}`):** The {productName} desktop and mobile application (including `{productId}-mcp`) is licensed under the **GNU General Public License v3.0 ([{appLicenseName}]({appLicenseUrl}))**, with source code available at [{appRepoUrl}]({appRepoUrl}). Nothing in these Terms restricts, modifies, or supersedes the freedoms granted to you by `{appLicenseName}` to run, inspect, modify, or redistribute the client software.
- **No client paywall:** Local MongoDB administration, the embedded JavaScript shell, schema intelligence, the local read-only MCP server, and Bring-Your-Own-Key (`BYOK` / local `Ollama`) AI features are permanently free and require no {productName} Cloud account.
- **Hosted network services:** These Terms govern our server-side online services (**{productName} Cloud**: Zero-Knowledge encrypted sync, hosted WebSocket bridge, account portal, and signed release distribution), which run as independent network services. Web site code is licensed under [{siteCodeLicenseName}]({siteCodeLicenseUrl}) and site prose under [{siteContentLicenseName}]({siteContentLicenseUrl}), excluding brand names, logos, and third-party trademarks.

## 2. Accounts, Device Authorization and Security

- **Eligibility:** To register a {productName} Cloud account, you must be at least 18 years old (or the age of legal majority in your jurisdiction) and provide a valid, verifiable email address.
- **RFC 8628 Device Authorization:** Desktop and mobile apps link to your account through `{appUrl}/device` using the OAuth 2.0 Device Authorization Grant (RFC 8628), issuing per-device rotatable refresh tokens and signed short-lived `ES256` entitlement tokens. Each account supports up to **3 active devices** at a time, which you may inspect or revoke at any time from `{appUrl}`.
- **Credential and Zero-Knowledge responsibility:** You are responsible for maintaining the confidentiality of your account password, TOTP two-factor codes, paired devices, and **Zero-Knowledge sync passphrase**. Because encryption keys are derived on your device (`Argon2id` + `AES-256-GCM`) and never sent to our servers, **we cannot reset your sync passphrase or decrypt synced data if your passphrase is lost**.

### 2.1 Free Service, Limits and Inactive Accounts

- **Free and provided as is:** {productName} Cloud is offered free of charge. To the extent the law allows, it is provided "as is" and "as available", without any guarantee of uptime, performance, or fitness for a particular purpose, and our liability is excluded to the extent permitted by law. Liability for intent and gross negligence and your mandatory consumer rights are not affected. Keep your own copies of anything you sync.
- **Limits per account:** at most 3 active devices; encrypted sync of up to 20 collections of at most 1 MiB each and 500 uploads per UTC day (further uploads are refused until the next day); on the hosted bridge one session at a time, at most 2 hours per session, closed after 15 minutes without traffic, and 1 GB of traffic per calendar month (UTC), both directions counted together. When the monthly traffic is used up, the bridge refuses new sessions and closes the open one until the next month. Per-minute request limits apply as well.
- **Changes and ending the service:** To keep the service affordable and safe, we may change these limits or pause new sign-ups. Where possible, we announce lower limits on the [Cloud page]({cloudPath}) and in these Terms before they apply. We may end a free service with reasonable notice; you can always export your data from `{appUrl}`, and the app keeps working without the cloud.
- **Inactive accounts:** If an account shows no activity for 12 months (no device signed in to it uses the app, nobody signs in to the portal, nothing is uploaded), we send a warning to its verified email address after 11 months. Unless the account is used in the meantime, its encrypted sync data is deleted 30 days after the warning was delivered. The account and its devices are kept, and using the app or signing in starts the period again.
- **Restricting one account:** In case of abuse we may switch off sync or the hosted bridge for a single account (Section 3).

## 3. Acceptable Use Policy

When using `{appHost}`, `{apiHost}`, or `{bridgeHost}`, you agree **not** to:

- Share a single account among multiple users, resell or proxy bridge capacity to third parties, or create automated or disposable accounts to get around account limits.
- **Engage in SSRF, network scanning, or relay abuse:** Use `{bridgeHost}` or any cloud endpoint to probe, scan, or connect to loopback, private, link-local, or cloud-metadata IP ranges (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`, and IPv6 equivalents), perform DNS-rebinding attacks, connect to non-TLS database targets through the hosted bridge, or access systems without explicit authorization from their owner.
- Interfere with rate limits, cryptographic token verification, or security controls, or transmit unlawful or malicious payloads.

Severe security violations (such as SSRF, port scanning, credential stuffing, or fraud) may result in immediate automated suspension of cloud endpoints. For non-emergency breaches, we provide reasonable notice and an opportunity to cure.

### 3.1 Hosted WebSocket Bridge (`{bridgeHost}`)

- **What transits the bridge:** When you connect through the hosted `{bridgeHost}` service, your MongoDB connection URI (including any embedded credentials), authentication handshakes, and every database command you issue pass through our relay: encrypted `wss://` between your client and the bridge, and a TLS connection between the bridge and your MongoDB server. The bridge terminates WebSocket framing only and does not inspect or retain document contents, query results, or credentials; transit traffic is used solely to reach the target you specified.
- **Target restrictions by design:** The hosted bridge enforces a public-IP egress policy and refuses non-TLS targets. Loopback, private, link-local, cloud-metadata, and reserved address ranges are rejected, as are `mongodb://` URIs without `tls=true`/`ssl=true` (`mongodb+srv://` is accepted).
- **Capacity limits:** One bridge session per account at a time, at most 2 hours each, closed after 15 minutes without traffic, and 1 GB of traffic per account per calendar month (Section 2.1). The total number of simultaneous sessions is capped too, so a new session may be refused while the bridge is full. Attempting to get around these caps is treated as quota abuse under Section 3; we may then switch off bridge access for the account, which ends its open session within about a minute.
- **Operational logging:** Session authentication outcomes and denied-target host names (never credentials, full connection URIs, or database payloads) may appear in operational logs under our [Privacy Policy]({privacyPath}), which also describes the monthly traffic counter (Section 4.3).
- **Self-hosted alternative:** The same open-source gateway can be self-hosted against private or non-TLS targets under your own responsibility (`{appRepoUrl}`); the restrictions in this clause apply only to the hosted `{bridgeHost}` service.

## 4. Database Safety and the AI Assistant

- **Database administration risk and backups:** {productName} executes real commands and JavaScript scripts directly against MongoDB servers you connect to (including write, index, and drop operations). **You are solely responsible for maintaining tested, independent backups, least-privilege database roles, and production safeguards on your MongoDB servers.**
- **AI output verification:** Queries, aggregation pipelines, and index recommendations generated by the AI assistant (with your own key, an OpenAI-compatible endpoint, or a local model) are assistive suggestions that may contain errors; you must review and validate every command before running it against live data.
- **AI endpoints are yours to choose:** {productName} operates no AI service. The provider or server you configure is a third-party or self-hosted service governed by its own terms; its availability, data handling, and usage fees are between you and that provider.

## 5. Intellectual Property and MongoDB Trademark Notice

- **Operator marks and user data:** The {productName} name, two-tone wordmark, and flower emblem are proprietary identifiers of the operator and are not licensed for third-party product branding under `{appLicenseName}` or `{siteCodeLicenseName}`. You retain all rights, title, and ownership in your database schemas, queries, scripts, and synced content.
- **Third-party trademarks:** {trademarkNotice} See our [Trademark Notice]({trademarkPath}) for full nominative-use details.

## 6. Governing Law and Consumer Dispute Resolution

These Terms and any contract concluded directly with the operator are governed by the laws of the Republic of Türkiye, without prejudice to mandatory consumer protection provisions of your country of habitual residence (such as EU/EEA/UK consumer law). Consumers in Türkiye may submit disputes within the annual monetary thresholds published by the Ministry of Trade to the **Provincial or District Consumer Arbitration Committees** (*İl veya İlçe Tüketici Hakem Heyetleri*), and disputes above those thresholds to the **Consumer Courts** (*Tüketici Mahkemeleri*) in either the consumer's domicile or the operator's registered jurisdiction.
