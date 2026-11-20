# Terms of Service and Distance Sales Contract Terms

These Terms of Service ("Terms") govern your use of [{domain}]({siteUrl}) and the optional {productName} Cloud services operated across `{appHost}`, `{apiHost}`, `{dlHost}`, and `{bridgeHost}`. Please read these Terms alongside our [Privacy Policy]({privacyPath}), [Refund Policy]({refundsPath}), and [Imprint]({imprintPath}).

## 1. Open-Source Client License vs. Cloud Services

- **Free and open-source client (`{appLicenseName}`):** The {productName} desktop and mobile application (including `{productId}-mcp`, derived from the open-source Robomongo 1.4.4 codebase) is licensed under the **GNU General Public License v3.0 ([{appLicenseName}]({appLicenseUrl}))**, with source code available at [{appRepoUrl}]({appRepoUrl}). Nothing in these Terms restricts, modifies, or supersedes the freedoms granted to you by `{appLicenseName}` to run, inspect, modify, or redistribute the client software.
- **No client paywall:** Local MongoDB administration, the embedded JavaScript shell, schema intelligence, the local read-only MCP server, and Bring-Your-Own-Key (`BYOK` / local `Ollama`) AI features are permanently free and require no {productName} Cloud account.
- **Hosted network services:** These Terms govern our server-side online services (**{productName} Cloud**: Zero-Knowledge encrypted sync, keyless hosted AI proxy, team workspaces, hosted WebSocket bridge, account portal, and signed release distribution), which run as independent network services. Web site code is licensed under [{siteCodeLicenseName}]({siteCodeLicenseUrl}) and site prose under [{siteContentLicenseName}]({siteContentLicenseUrl}), excluding brand names, logos, and third-party trademarks.

## 2. Accounts, Device Authorization and Security

- **Eligibility:** To register a {productName} Cloud account, you must be at least 18 years old (or the age of legal majority in your jurisdiction) and provide a valid, verifiable email address.
- **RFC 8628 Device Authorization:** Desktop and mobile apps link to your account through `{appUrl}/device` using the OAuth 2.0 Device Authorization Grant (RFC 8628), issuing per-device rotatable refresh tokens and signed short-lived `ES256` entitlement tokens. Individual `Pro` accounts and each `Team` seat support up to **5 concurrently paired active devices**, which you may inspect or revoke at any time from `{appUrl}`.
- **Credential and Zero-Knowledge responsibility:** You are responsible for maintaining the confidentiality of your account password, TOTP two-factor codes, paired devices, and **Zero-Knowledge sync passphrase**. Because encryption keys are derived on your device (`Argon2id` + `AES-256-GCM`) and never sent to our servers, **we cannot reset your sync passphrase or decrypt synced data if your passphrase is lost**.

## 3. Subscription Tiers, Billing Channels and Taxes

- **Service tiers:**
  1. **Free (`{appLicenseName}`):** Full local desktop and mobile client + `BYOK` / local AI, forever free.
  2. **{productName} Pro (Individual):** Personal Zero-Knowledge encrypted sync (`S1`, up to 1 MB per collection across 20 sync collections), monthly keyless hosted AI token allowance (`S2`), priority email support (`S4`), and optional hosted TLS WebSocket bridge access (`S5`), billed monthly or annually.
  3. **{productName} Team (Per Seat, minimum 3 seats):** All `Pro` capabilities plus shared passwordless Team Vault metadata and query/snippet libraries with role-based permissions (`Owner`, `Admin`, `Member`, `Read-Only`). Mid-cycle seat additions are prorated for the remainder of the billing cycle; seat reductions take effect as credit at the next renewal.
- **Current prices:** Applicable plan prices, currency, taxes, and quota limits are published on the [Pricing]({pricingPath}) page and confirmed on the checkout summary before any payment is authorized.
- **Dual billing architecture:**
  - **Global (Outside Türkiye) — Paddle (Merchant of Record):** Subscriptions outside Türkiye are sold and processed by **Paddle** as Merchant of Record. Paddle appears on your card statement, issues tax-compliant invoices, and calculates, collects, and remits applicable VAT, GST, or Sales Tax.
  - **Republic of Türkiye (`TRY`) — iyzico (PSP):** Local `TRY` subscriptions are offered exclusively to buyers with a Türkiye billing address and a Türkiye-issued bank or credit card (`TR BIN` check to prevent regional pricing abuse), processed via **iyzico**. Listed `TRY` prices include applicable Turkish VAT (KDV), and official electronic invoices (`e-Arşiv` / `e-Fatura`) are issued by the operator.
- **Renewals and price updates:** Paid plans renew automatically at the end of each monthly or annual period unless canceled beforehand in one click at `{appUrl}`. Any change to recurring list prices requires at least **30 calendar days' advance email notice** and applies only to subsequent billing cycles.
- **Voluntary donations:** Open-source sponsorships or donations (`GitHub Sponsors`, `Buy Me a Coffee`, etc.) are voluntary contributions to open-source development and do not grant commercial {productName} Cloud quotas unless explicitly stated.

## 4. Acceptable Use Policy

When using `{appHost}`, `{apiHost}`, or `{bridgeHost}`, you agree **not** to:

- Share a single individual `Pro` account among multiple users, resell or proxy hosted AI quota or bridge capacity to third parties, or create automated/disposable accounts to bypass free-trial or refund limits.
- **Engage in SSRF, network scanning, or relay abuse:** Use `{bridgeHost}` or any cloud endpoint to probe, scan, or connect to loopback, private, link-local, or cloud-metadata IP ranges (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`, and IPv6 equivalents), perform DNS-rebinding attacks, connect to non-TLS database targets through the hosted bridge, or access systems without explicit authorization from their owner.
- Interfere with rate limits, cryptographic token verification, billing webhooks, or security controls, or transmit unlawful or malicious payloads.

Severe security violations (such as SSRF, port scanning, credential stuffing, or payment fraud) may result in immediate automated suspension of cloud endpoints. For non-emergency breaches, we provide reasonable notice and an opportunity to cure; if we discontinue {productName} Cloud entirely without breach on your part, we will issue a prorated refund of unused prepaid subscription fees.

### 4.1 Hosted WebSocket Bridge (`{bridgeHost}`)

- **What transits the bridge:** When you connect through the hosted `{bridgeHost}` service, your MongoDB connection URI (including any embedded credentials), authentication handshakes, and every database command you issue pass through our relay — encrypted `wss://` between your client and the bridge, and a TLS connection between the bridge and your MongoDB server. The bridge terminates WebSocket framing only and does not inspect or retain document contents, query results, or credentials; transit traffic is used solely to reach the target you specified.
- **Target restrictions by design:** The hosted bridge enforces a public-IP egress policy and refuses non-TLS targets. Loopback, private, link-local, cloud-metadata, and reserved address ranges are rejected, as are `mongodb://` URIs without `tls=true`/`ssl=true` (`mongodb+srv://` is accepted).
- **Capacity limits:** A small number of concurrent bridge sessions applies per paired device and per account (published limits; currently 2 concurrent sessions per device). Attempting to exceed these caps is treated as quota abuse under Section 4.
- **Operational logging:** Session authentication outcomes and denied-target host names (never credentials, full connection URIs, or database payloads) may appear in operational logs under our [Privacy Policy]({privacyPath}).
- **Self-hosted alternative:** The same open-source gateway can be self-hosted against private or non-TLS targets under your own responsibility (`{appRepoUrl}`); the restrictions in this clause apply only to the hosted `{bridgeHost}` service.

## 5. Database Safety, Availability and Limitation of Liability

- **Database administration risk and backups:** {productName} executes real commands and JavaScript scripts directly against MongoDB servers you connect to (including write, index, and drop operations). **You are solely responsible for maintaining tested, independent backups, least-privilege database roles, and production safeguards on your MongoDB servers.**
- **AI output verification:** Queries, aggregation pipelines, and index recommendations generated by AI (`BYOK` or {productName} Cloud) are assistive suggestions that may contain errors; you must review and validate every command before running it against live data.
- **Warranty and liability cap:** Except as required by mandatory statutory law, {productName} Cloud is provided "as is" and "as available." To the fullest extent permitted by applicable law, our total cumulative liability for all claims arising out of or relating to {productName} Cloud in any 12-month period shall not exceed the total subscription fees paid by you for {productName} Cloud during the **12 months** immediately preceding the event giving rise to liability (or USD 50 if greater where required), and neither party shall be liable for indirect, consequential, or lost-profit damages. Nothing in these Terms limits liability for gross negligence, willful misconduct, or statutory consumer rights that cannot be waived under applicable law (including Turkish Code of Obligations No. 6098 and Consumer Protection Law No. 6502).

## 6. Intellectual Property and MongoDB Trademark Notice

- **Operator marks and user data:** The {productName} name, two-tone wordmark, and flower emblem are proprietary identifiers of the operator and are not licensed for third-party product branding under `{appLicenseName}` or `{siteCodeLicenseName}`. You retain all rights, title, and ownership in your database schemas, queries, scripts, and synced content.
- **Third-party trademarks:** {trademarkNotice} See our [Trademark Notice]({trademarkPath}) for full nominative-use details.

## 7. Distance Sales Contract and Preliminary Information Terms (Law No. 6502)

For consumers (*tüketici*) purchasing {productName} Cloud subscriptions electronically—particularly direct `TRY` transactions in the Republic of Türkiye governed by **Law No. 6502 on the Protection of the Consumer** (*Tüketicinin Korunması Hakkında Kanun*) and the **Distance Contracts Regulation** (*Mesafeli Sözleşmeler Yönetmeliği*)—the following clauses serve as both the **Preliminary Information Form** (*Ön Bilgilendirme Formu*) and the **Distance Sales Contract** (*Mesafeli Satış Sözleşmesi*):

### 7.1 Seller and Service Provider Identification

- **Provider / Seller:** {legalEntity}
- **Registered Address:** {legalAddress}
- **Support & Complaint Contact:** {supportContact}
- *(For international checkouts outside Türkiye where Paddle acts as Merchant of Record, Paddle's Buyer Terms apply to payment and tax invoicing alongside our technical service commitments below.)*

### 7.2 Essential Characteristics of the Digital Service

{productName} Cloud is an intangible, recurring electronic subscription service providing encrypted cross-device configuration synchronization (`S1`), keyless hosted AI query assistance within monthly plan quotas (`S2`), optional multi-seat Team Vault sharing (`S3`), priority email support (`S4`), and optional hosted TLS WebSocket bridge access (`S5`). System requirements for compatible client platforms are listed on the [Download]({downloadPath}) page. No physical goods are shipped.

### 7.3 Total Price, Taxes, Payment and Electronic Performance

The total recurring subscription fee (including 20% KDV for `TRY` plans in Türkiye, or plus applicable local tax as itemized at Paddle checkout), selected billing period (monthly or annual), and accepted payment method are displayed in full on the checkout summary screen prior to your electronic confirmation. Delivery is performed **immediately in electronic form** upon payment authorization by activating the corresponding entitlement on your `{appUrl}` account, and an official electronic invoice (`e-Arşiv` / `e-Fatura` or Paddle tax receipt) is sent to your registered email address.

### 7.4 Right of Withdrawal and 14-Day Refund Guarantee

Although Article 15/1-(ğ) of the Turkish Distance Contracts Regulation exempts *"services performed instantly in electronic environment"* from the statutory right of withdrawal once performance begins, **we contractually grant consumers an unconditional 14-calendar-day withdrawal and full refund right on their first subscription purchase**, subject to the straightforward procedure and fair-use terms set out in our [Refund Policy]({refundsPath}).

### 7.5 Governing Law and Consumer Dispute Resolution

Contracts concluded directly with the operator are governed by the laws of the Republic of Türkiye, without prejudice to mandatory consumer protection provisions of your country of habitual residence (such as EU/EEA/UK consumer law). Consumers in Türkiye may submit disputes within the annual monetary thresholds published by the Ministry of Trade to the **Provincial or District Consumer Arbitration Committees** (*İl veya İlçe Tüketici Hakem Heyetleri*), and disputes above those thresholds to the **Consumer Courts** (*Tüketici Mahkemeleri*) in either the consumer's domicile or the operator's registered jurisdiction.
