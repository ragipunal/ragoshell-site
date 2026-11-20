# Free Trial, Cancellation and 14-Day Refund Policy

We want {productName} Cloud (`Pro` and `Team`) to earn its keep through genuine utility—never through billing traps, hidden cancellation menus, or locked data. This policy forms part of our [Terms of Service]({termsPath}) and applies alongside our [Privacy Policy]({privacyPath}).

## 1. 14-Day Free Trial

Every new {productName} Cloud account is eligible for a **14-calendar-day free trial** before committing to a paid subscription:

- **No-card-upfront hybrid trial (default design):** Verified accounts receive 14 days of full Zero-Knowledge encrypted synchronization (`S1`) plus a starter evaluation allowance of hosted AI requests without entering a payment card. When the 14-day period ends, cloud write access pauses automatically with **zero surprise charges** unless you choose to subscribe.
- **Card-backed promotional trials (when offered at checkout):** If you start a trial that collects a payment method upfront, we send an automated reminder email **3 days before the trial ends (Day 11)**. Canceling in one click at `{appUrl}` at any point before Day 15 prevents any charge.

## 2. 14-Day Unconditional Full Refund on First Purchase

Within **14 calendar days** of your initial paid subscription charge (whether monthly or annual, `Pro` or `Team`), you are entitled to a **100% unconditional full refund—no reason required**:

- **Global purchases via Paddle (Merchant of Record):** Request your refund directly from `{appUrl}`, through the self-service link in your Paddle email receipt, or via {supportContact}. Paddle refunds the full amount charged—including any collected VAT, GST, or Sales Tax—to your original payment method.
- **Türkiye purchases via iyzico (`TRY`):** Request your refund from `{appUrl}` or via {supportContact}. We refund 100% of the `TRY` charge (including 20% KDV) back to your card through iyzico and issue the corresponding electronic return accounting record (`e-Arşiv` return workflow).
- **Settlement timing:** Once approved, refunds are submitted immediately; banking and card networks typically post the funds back to your statement within **3–10 business days**.

## 3. Annual Renewal Protection and Fair-Use Limit

- **7-day annual renewal window:** If an annual subscription renews automatically and you intended to cancel, contact us within **7 calendar days** of the renewal charge. Provided no substantial new-period hosted AI token quota or hosted bridge bandwidth has been consumed since the renewal date, we will refund the annual renewal charge in full.
- **One-time fair-use rule:** To protect the service against automated LLM quota exhaustion (*subscribing, consuming a full month of commercial AI API tokens, requesting a refund on Day 13, and repeating*), the unconditional 14-day refund guarantee applies **once per account and payment instrument**. When a refund is issued, cloud entitlements and active cloud session tokens are revoked immediately. Mandatory statutory remedies for defective or unavailable services remain unaffected.

## 4. One-Click Cancellation and Grace Periods

- **One-click cancellation:** You can cancel your subscription at any time from `{appUrl}` with a single click—no phone calls, retention questionnaires, or support approval needed. After canceling, your plan remains `active (canceling)` with full `Pro` or `Team` access until the end of your current paid billing period (`current_period_end`).
- **7-day billing failure grace period:** If an automatic renewal charge fails due to an expired card or temporary bank limit, your cloud features are **not** cut off immediately. We notify you by email and maintain full service during a **7-calendar-day billing grace period** while you update your payment method.
- **14-day offline entitlement grace:** Client devices refresh signed `ES256` entitlement tokens (`GET /v1/me/entitlements`) every 7 days when online and honor a **14-day offline grace window** verified locally, ensuring flights, isolated corporate LANs, or field work never disrupt local synced workflows. *(Live hosted AI and hosted WebSocket bridge sessions require an active internet connection by nature.)*

## 5. Post-Subscription Data Guarantee and 90-Day Read-Only Retention

Ending a subscription—whether by cancellation, refund, or non-renewal—**never holds your work hostage**:

- **Local data is never deleted or locked:** Every MongoDB connection profile, OS `KeyStore` password/SSH key, saved snippet, query history entry, startup script, and UI setting stored on your desktop and mobile devices remains **100% intact and accessible forever**. Your {productName} client continues working permanently on the Free (`{appLicenseName}` + `BYOK` AI) tier without losing a single local feature.
- **90-day read-only cloud sync window:** Once a subscription expires completely (after any billing grace period), uploading new encrypted sync blobs (`PUT /v1/sync/*`) stops, **but your existing encrypted cloud blobs remain read-only (`GET /v1/sync/*`) and exportable (`POST /v1/account/export`) for 90 calendar days**.
- **Advance reminders and clean deletion:** We send reminder emails at **Day 30** and **Day 80** after expiry before permanently purging expired `sync_blobs` on Day 90. If you re-subscribe within those 90 days, synchronization resumes seamlessly where you left off; if you prefer immediate removal sooner, you can trigger `DELETE /v1/account` from `{appUrl}` at any time.
