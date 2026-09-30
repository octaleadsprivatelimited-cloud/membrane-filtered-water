# membraneIQ commerce setup

## Local preview

MySQL stores application data; the Firebase Authentication emulator handles local sign-in. Demo checkout never charges money. Sample products are excluded from the merchant feed.

Requirements: Node.js 24, Docker, Java 21+ and Firebase CLI (`npm install -g firebase-tools`). Configure ignored `.env` from `.env.example` with `STORE_MODE=emulator`, `DATABASE_DRIVER=mysql` and matching Compose/API database credentials. Install with `npm ci --include=dev`, then use separate terminals for long-running commands:

1. `docker compose up -d`
2. `npm run emulators -- --auth-only`
3. `npm run api`
4. `npm run seed` once
5. `npm run dev -- --host 127.0.0.1 --port 5174 --strictPort`

- Store: http://127.0.0.1:5174
- Customer: http://127.0.0.1:5174/account
- Admin: http://127.0.0.1:5174/admin
- Emulator UI: http://127.0.0.1:4401

The seed creates or updates the local Google identity `admin@aquapure.test`, preserving its existing Firebase UID, MySQL records and admin role. Choose **Continue with Google**, then that identity in the emulator Google chooser; no password is needed and no real Google account is involved. `.local/admin-access.txt` contains only these instructions, replacing the previous generated-password instructions. New customers use the same Google button and choose a different mock identity. Seed inserts sample products only into an empty database. Graceful shutdown exports accounts to `.emulator-data`; restart imports them. MySQL data persists in its Docker volume independently. See `MYSQL_SETUP.md` for details.

## Included workflows

- Google-only Firebase sign-in for customer and admin accounts, server-verified Google sessions and administrator custom claims. First Google sign-in creates the customer profile; no separate signup or password reset is needed.
- Customer profiles, five delivery addresses, persistent bag, stock-aware checkout, order history, payment retry/check controls, cancellation/refund requests and status.
- Admin products, publishing/archiving, inventory, customers, fulfillment/tracking, enquiry inbox, service-request review, settings, policies and merchant feed tools.
- Server-calculated INR totals, transactional inventory, idempotent order requests, customer order isolation and server-only admin operations.
- Cashfree hosted checkout hooks, server amount verification and signed payment-webhook handling; provider configuration/testing and reconciliation work remain.
- Google Merchant RSS XML and real-product JSON-LD; demo products and incomplete merchant records are excluded.

## Hostinger deployment with MySQL

Use Hostinger Node.js hosting or a VPS with Node.js 24. Install with `npm ci --include=dev`, build with `npm run build`, and select `app.mjs` as the entry file or `npm start` as the start command. Node serves both the SPA and `/api` on the host's `PORT`. Deploy the full app and shared source modules, not only `dist`.

Set `STORE_MODE=live`, `DATABASE_DRIVER=mysql`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PUBLIC_STORE_URL` and the server Firebase credential. `MYSQL_URL` or `DATABASE_URL` is an alternative to individual fields. Use `DB_SSL=true`/`DB_SSL_CA` if required by the database provider. Follow `MYSQL_SETUP.md` for exact settings/checks and `CONFIGURATION.md` for secret/public classifications.

The database/user must exist with table-creation and CRUD privileges; tables initialize automatically. Back up and migrate existing records before switching stores; demo seed is not a production migration. Set `TRUST_PROXY` only to exact IPs/CIDRs confirmed by Hostinger, otherwise leave it unset. No Hostinger deployment or production migration has been performed by this update.

## Firebase Authentication

1. In project `membrane-7677f`, open Authentication → Sign-in method, enable **Google**, select a project support email, and disable **Email/Password** and other unused providers. Under Settings → Authorized domains, add `membraneiq.com`, `www.membraneiq.com` and any other domain actually used by the deployed store. Public domains use live authentication; localhost uses the emulator.
2. Public web-app settings are in `src/config/appConfig.js`; no frontend environment variables are needed.
3. Set Hostinger's server-only `FIREBASE_SERVICE_ACCOUNT` to complete valid JSON, or `GOOGLE_APPLICATION_CREDENTIALS` to a protected service-account JSON file. The credential must match `FIREBASE_PROJECT_ID=membrane-7677f`. Never add private credentials to frontend code or Git; replace exposed keys.
4. MySQL stores profiles/orders; Firestore setup/rules changes are not needed. Server authentication credentials remain required.
5. Sign in once with the intended admin's Google account, then run `npm run grant-admin -- your-admin-email` in the trusted live server environment. Sign out/in with Google to refresh the role. Demo seed refuses live mode. Customer sign-in never grants an admin role.
6. Set domain, business, shipping and policy details in Admin settings. Rebuild after changing public code configuration.

The API accepts only ID tokens whose verified `firebase.sign_in_provider` is `google.com`, including in the emulator. Linked Google accounts signed in through another provider are rejected with `GOOGLE_SIGN_IN_REQUIRED`; the browser clears old non-Google sessions. Disabling Email/Password in the Firebase console prevents direct use of that provider outside this UI, too.

Existing MySQL profiles and orders are keyed by Firebase UID. Keep the existing Firebase user when linking/migrating accounts; do not delete and recreate users. Confirm an existing customer's Google sign-in resolves to that same UID before migrating production accounts. If Firebase reports a provider-linking conflict, resolve it through a trusted account-recovery process after verifying ownership; never merge records based only on a typed email address.

## Cashfree and order service requests

Set `PUBLIC_STORE_URL` to the real HTTPS origin without a trailing slash. During integration, use `CASHFREE_MODE=sandbox` with server-only `CASHFREE_CLIENT_ID` and `CASHFREE_CLIENT_SECRET`. The default API version is `2025-01-01`. Authorize the checkout domain in Cashfree and configure the signed payment webhook at `https://YOUR_DOMAIN/api/payments/cashfree/webhook`.

Redirects do not mark orders paid. The server queries Cashfree and verifies order ID, currency and amount. Test successful, declined, interrupted and retried payments, duplicate/late webhooks and reconciliation before using production credentials/mode.

Customers can request cancellation before shipment and refunds for eligible paid orders. Admin review requires a note; active cancellation requests block fulfillment. Approval does not transfer money: approved refunds remain unsubmitted to the provider. Pending Cashfree cancellations require provider reconciliation before approval. See `PAYMENT_RULES.md` for all enforced rules.

**Real payment/refund integration is not complete.** Refund API submission/callbacks, provider reconciliation and safe expiry of abandoned reservations remain pending. Do not release stock while an unverified payment could still succeed. No live or sandbox provider transaction has been verified by these local changes.

## Google Merchant Center

Enter real products, accurate prices/stock, HTTPS photos, brand and valid identifiers in Admin. Disable demo flags and enable merchant inclusion only for real products. Review feed readiness and complete business, shipping, return, privacy and terms information.

After verifying the HTTPS domain, live authentication and production payments, enable and submit `https://YOUR_DOMAIN/api/merchant/feed.xml` in Merchant Center. Claim the domain and configure shipping/returns there. Product pages must stay public. Feed generation neither submits products nor guarantees approval; no Google account connection/submission has been performed.

## Validation and troubleshooting

Run `npm run test:commerce` with local MySQL, Auth emulator and API running. Tests create/remove their own records and cover permissions, order isolation, pricing, idempotency, inventory, service requests, fulfillment, enquiries, merchant data and signatures. Also run standalone tests, `npm run build`, `npm run lint`, and `node --env-file-if-exists=.env --test tests/hostinger-startup.test.mjs` after building. Never run test data creation against production.

On Hostinger, `/api/health` must return 200 with MySQL, `/api/config` and `/api/products` 200 JSON, and unauthenticated `/api/me` 401 JSON. Health verifies configured authentication and DB connectivity, not whether credentials are revoked or providers work. Check real signed-in customer/admin requests separately.

`DATABASE_CONFIGURATION` concerns invalid/missing fields; `DATABASE_UNAVAILABLE` concerns DB access/readiness. `FIREBASE_*` errors concern the separate credential. Read the first Hostinger application-log error rather than treating 503 as a customer sign-in failure. Google `auth/operation-not-allowed` requires enabling Google in Firebase; `auth/unauthorized-domain` requires authorizing the current domain.

The Firebase Admin pin prevents an observed CommonJS/ESM incompatibility; re-run startup regression tests before upgrading it. Remaining launch work includes merchant-approved content/policies, tax invoicing, carrier APIs, transactional notifications and real payment/refund integration. A successful local build does not establish these capabilities.

References: [Hostinger Node.js deployment](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/), [Hostinger MySQL connection](https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/), [Firebase Google sign-in](https://firebase.google.com/docs/auth/web/google-signin), [Firebase Auth emulator](https://firebase.google.com/docs/emulator-suite/connect_auth), [Cashfree create order](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create-order), [Google product data specification](https://support.google.com/merchants/answer/7052112).
