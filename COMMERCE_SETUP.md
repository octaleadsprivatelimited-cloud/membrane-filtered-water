# AquaPure commerce setup

## Local preview

The store uses Firebase Authentication and Firestore emulators locally. Demo checkout never charges money. Sample products are excluded from the Google feed.

Requirements: Node 22+, Java 21+, and Firebase CLI (`npm install -g firebase-tools`). Install packages with `npm ci`, then run these in separate terminals from this directory:

1. `npm run emulators`
2. `npm run seed` once, then `npm run api`
3. `npm run dev -- --host 127.0.0.1 --port 5173`

- Store: http://127.0.0.1:5173
- Customer: http://127.0.0.1:5173/account
- Admin: http://127.0.0.1:5173/admin
- Emulator UI: http://127.0.0.1:4401

The seed script saves generated local administrator credentials in `.local/admin-access.txt` (ignored by Git). Register customer accounts through the sign-in screen. Emulator password reset links appear in the emulator logs/UI, not email. Shut down emulators gracefully to export data to `.emulator-data`; on restart that snapshot is imported. You can also save a snapshot while running with `firebase emulators:export .emulator-data --project demo-aquapure-store --force`.

## Included

- Firebase email/password registration, login, password reset, server-verified sessions, administrator custom claims.
- Customer profile, up to five delivery addresses, bag, stock-aware checkout, order history, payment retry and verification.
- Administrator product creation/editing, draft/publish/archive, inventory, customer list, fulfillment status and tracking reference, store settings, policy pages, feed readiness report and XML preview.
- Server-calculated INR prices/shipping, transactional stock reservation, idempotent order requests, owner-only orders and server-only admin operations. Firestore direct client access is denied.
- Cashfree hosted checkout integration, server-side amount verification and signed webhook handling. Cashfree is disabled until credentials and a public HTTPS domain are supplied.
- Google Merchant RSS XML feed and real-product JSON-LD. Products with demo status or incomplete merchant data are excluded.

## Connect your Firebase project

1. Create a Firebase web app, enable Email/Password Authentication, create Firestore, and add your actual store domain to Authentication's authorized domains.
2. Copy `.env.example` to `.env`. Set `STORE_MODE=live`, `FIREBASE_PROJECT_ID`, `VITE_USE_FIREBASE_EMULATORS=false`, and the `VITE_FIREBASE_*` web-app settings from Firebase. Browser Firebase config is public configuration; service-account keys are not.
3. Use a managed service identity/Application Default Credentials on the API host. For local live development, point `GOOGLE_APPLICATION_CREDENTIALS` at a private service-account file outside the repo. Never put server credentials into `VITE_*` variables, source control, or chat.
4. Deploy rules with `firebase deploy --only firestore:rules --project YOUR_PROJECT_ID`. These rules deny direct client access; the authenticated API uses the Admin SDK.
5. Register your administrator through the store, then run `npm run grant-admin -- your-admin-email` in the trusted server environment. Sign out and in to refresh the role. Do not run the demo seed script against production.
6. Set the public domain and business/shipping/policy details in Admin → Store settings. Rebuild the client after changing any Vite configuration.

## Connect Cashfree

Set `PUBLIC_STORE_URL` to the actual HTTPS origin, without a trailing slash. Set `CASHFREE_MODE=sandbox` first and supply `CASHFREE_CLIENT_ID` and `CASHFREE_CLIENT_SECRET` in server environment/secrets. The integration pins `CASHFREE_API_VERSION=2025-01-01` by default. Whitelist the checkout domain in Cashfree and configure the signed webhook at:

`https://YOUR_DOMAIN/api/payments/cashfree/webhook`

Validate successful, declined, interrupted and retried payments using Cashfree's sandbox before switching to production credentials and `CASHFREE_MODE=production`. Payment success is confirmed by the server querying Cashfree and validating the order ID, currency and amount; browser redirects alone never mark an order paid.

**Remaining payment operations:** automatic expiry/release of abandoned Cashfree stock reservations and automated refunds are not implemented. Pending orders reserve inventory until reconciled; do not manually release inventory while payment can still succeed. Customer cancellation is available for demo orders only. Real refunds/cancellations require provider reconciliation and an additional store workflow before launch. No live or sandbox Cashfree transaction has been tested yet because account credentials/domain were not provided.

## Google Merchant Center

In Admin → Products, enter actual product names, descriptions, accurate price/stock, public HTTPS product photos, brand and valid GTIN or manufacturer part number. Only mark identifiers as unavailable when the product genuinely has none. Disable the demo flag and enable Merchant inclusion for each real product. Review the readiness report.

Provide business contact details, shipping and return terms, privacy and terms pages. Use a real HTTPS domain with live Firebase and production payments, then enable the feed in store settings. Submit `https://YOUR_DOMAIN/api/merchant/feed.xml` as a scheduled data source in Merchant Center after verifying/claiming the domain and configuring shipping/returns there. Product pages must remain publicly accessible. Check Google's diagnostics and Rich Results Test after deployment. Feed generation does not submit products or guarantee approval. No account connection or Google submission has been made.

References: [Google product data specification](https://support.google.com/merchants/answer/7052112), [Google merchant listings](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing), [Cashfree create order](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create-order), [Firebase Auth emulator](https://firebase.google.com/docs/emulator-suite/connect_auth).

## Hosting and validation

`npm run build` creates `dist`. `npm run api` serves both the API and built frontend, including SPA routes. Deploy that Node service behind HTTPS with persistent Firebase storage and securely injected server environment variables. Static-only hosting needs a reverse proxy/rewrite of `/api/*` to this Node service. Configure rate-limit proxy trust for your specific hosting topology before launch; the default does not trust forwarded IP headers.

Run `npm run test:commerce` while the emulators and API are running. Tests create and remove their own test records, and check admin authorization, order isolation, server pricing, idempotency, concurrent inventory, cancellations, fulfillment transitions, feed validation and signature verification. `npm run build` and `npm run lint` check the frontend.

The current demo still has sample marketing/contact content and placeholder policy text until filled in settings. Review these before launch. Tax invoicing, carrier API integration, transactional notification emails, image uploads (URLs are supported), automatic payment expiry/refunds, and deployment are not included in this local implementation.

Dependency audit currently reports two moderate transitive findings (`gaxios` / `uuid`) in the Firebase Admin dependency tree; `npm audit fix` did not resolve them. Revisit with upstream updates before production. Build succeeds with a bundle-size warning; lint exits successfully with React advisory warnings.

## Production login troubleshooting (membraneIQ)

Production defaults to Firebase project `membrane-7677f`. Set `FIREBASE_SERVICE_ACCOUNT` to the full service-account JSON in **Vercel → Settings → Environment Variables → Production** and set `FIREBASE_PROJECT_ID=membrane-7677f`. The account must belong to that same project. Never put the private key in a `VITE_` variable. Redeploy after changing server variables. Set `PUBLIC_STORE_URL=https://www.membraneiq.com` for payments and callbacks. Enable the desired Email/Password and Google providers and authorize the custom domain in Firebase Authentication.

`/api/config` should return JSON with status 200; `/api/me` without a token should return JSON with status 401. A plain-text `FUNCTION_INVOCATION_FAILED` response means the Vercel function crashed, not that the customer's password was rejected. Read the first exception in the deployment's **Logs**. The entrypoint catches module startup failures, explicitly includes `server/**`, and returns JSON for handled configuration failures. Token verification failures caused by backend credentials return 503, not a misleading 401.

For local tests only: run `npm run emulators`, `STORE_MODE=emulator npm run api`, and `VITE_USE_FIREBASE_EMULATORS=true npm run dev`. Run `STORE_MODE=emulator npm run test:commerce` and `node --test tests/api-response.test.mjs tests/server-startup.test.mjs`. Production remains on live Firebase unless emulator mode is explicitly selected.

The September 2026 Vercel crash was `ERR_REQUIRE_ESM` from `jwks-rsa@4` requiring ESM-only `jose@6`. Firebase Admin is pinned to `13.10.0`, whose JWKS dependency supports CommonJS without `require(esm)`, and the deployment explicitly selects Node 24. The startup regression test runs with `--no-experimental-require-module` to reproduce the host restriction. Re-test this path before upgrading Firebase Admin to version 14+.
