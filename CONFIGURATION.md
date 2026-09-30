# Application configuration

## Hosting, database and authentication

The target is Hostinger Node.js hosting with MySQL. MySQL is the default for products, customer profiles, orders, settings and enquiries. Firebase still handles customer/admin authentication. Explicitly selected Firestore remains a compatibility option; it is not needed for this deployment.

Use Node.js 24, install with `npm ci --include=dev`, build with `npm run build`, and use `app.mjs` as the entry file or `npm start` as the start command. Deploy the full application, including backend/shared source modules, not only `dist`. See `MYSQL_SETUP.md` for Hostinger setup. No Hostinger deployment or production data migration has been performed by this update.

## Public configuration

`src/config/appConfig.js` contains Firebase's public web-app settings, production origin, same-origin `/api` base, INR/IN defaults, local emulator addresses and Cashfree SDK/API endpoints/version. It contains no service-account or payment secrets. The public Firebase API key identifies the client project; authentication and backend authorization protect access.

The frontend uses no environment variables. Firebase initialization, API requests, admin feed download and Vite's proxy consume this configuration. Localhost selects the demo authentication emulator; public domains use the live Firebase project. Browser API requests stay on the current origin. Update public defaults and rebuild when changing the permanent domain or Firebase web app.

Admin-editable shipping, policies and business settings are stored in MySQL. Defaults do not overwrite stored settings. Enquiries also remain in MySQL and appear in the admin inbox; no outgoing email service is configured.

## Google-only accounts

Customer and admin pages use **Continue with Google**. There is no email/password signup, sign-in or password-reset form. The first Google sign-in creates a profile, and subsequent visits use the same Firebase UID and MySQL records. Protected API routes verify the Firebase token and require its actual sign-in provider to be `google.com`; password/custom-token sessions are rejected even if a Google identity is linked or an admin claim is present.

In Firebase project `membrane-7677f`, enable Google under Authentication → Sign-in method, select the project support email and disable Email/Password and other unused providers. Add `membraneiq.com`, `www.membraneiq.com` and other actual deployment domains under Authentication → Settings → Authorized domains. These provider settings are console configuration, not Hostinger environment variables; no MySQL or Firestore rules change is needed. This code update does not change the Firebase console.

Sign in with the intended administrator's Google account before running `npm run grant-admin -- your-admin-email` in the trusted live server environment. Sign out/in to refresh the claim. Existing accounts must retain their Firebase UID to keep prior orders; handle provider-linking conflicts through verified account recovery rather than deleting/recreating users. Local emulator Google sign-in and seed instructions are in `COMMERCE_SETUP.md`.

## Server environment variables

| Variable | Purpose |
| --- | --- |
| `NODE_ENV=production` | Production runtime; the entry point also sets this explicitly. |
| `STORE_MODE=live` | Live authentication; production startup rejects emulator mode. |
| `DATABASE_DRIVER=mysql` | Explicit production database selection; also the default. |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Hostinger MySQL fields; port defaults to 3306. Password stays server-only. |
| `MYSQL_URL` or `DATABASE_URL` | Alternative complete connection string containing secrets; use instead of individual fields. |
| `DB_SSL=true`, `DB_SSL_CA` | Optional verified database TLS; CA accepts PEM certificate contents. |
| `FIREBASE_SERVICE_ACCOUNT` | Complete original JSON from a valid service account for `membrane-7677f`. |
| `GOOGLE_APPLICATION_CREDENTIALS` | Alternative protected service-account JSON file path. |
| `FIREBASE_PROJECT_ID=membrane-7677f` | Must match the credential and public client project. |
| `PUBLIC_STORE_URL=https://www.membraneiq.com` | Actual public HTTPS origin for origin checks and payment callbacks. |
| `CASHFREE_MODE`, `CASHFREE_CLIENT_ID`, `CASHFREE_CLIENT_SECRET` | Provider mode and server credentials, added when integrating/testing payments. |
| `CASHFREE_API_VERSION` | Optional override; default is `2025-01-01`. |
| `PORT` | Host-provided listening port; local API default is 8787. |
| `TRUST_PROXY` | Exact proxy IPs/CIDRs confirmed by Hostinger; leave unset until confirmed. Do not use blanket trust. |

Paste service-account JSON as the server variable's value without adding outer quotes around the whole object. Never put private credentials in frontend code, Git or chat. Replace previously exposed keys. A valid server Firebase credential remains necessary with MySQL.

Local-only values include `STORE_MODE=emulator`, Compose passwords `MYSQL_PASSWORD`/`MYSQL_ROOT_PASSWORD`, and emulator endpoints. Do not deploy these to Hostinger. Legacy Vercel runtime fields are not required. Historical root-level UI migration scripts are not imported by the app or executed during deployment.

## Readiness and diagnostics

Production startup rejects emulator mode, checks the frontend build, validates the port, validates Firebase credential structure and initializes MySQL before listening. `/api/health` checks configured authentication and database connectivity; expect 200 with `database: "mysql"`. It does not prove that Firebase credentials are still valid or that provider operations work. Verify a real signed-in profile separately.

Previous 503 responses came from invalid/missing Firebase credentials. Safe diagnostic codes distinguish missing JSON, malformed JSON, missing fields, wrong project and an invalid RSA private key. Public Firebase settings and Firestore rules cannot repair these errors. Syntactically valid keys can still be revoked or unauthorized.

`DATABASE_CONFIGURATION` identifies invalid/missing MySQL fields. `DATABASE_UNAVAILABLE` identifies connection/initialization failure. Check Hostinger's server logs, exact database fields, network access and privileges. Changing the frontend parser cannot repair an unavailable backend.

Firebase Admin is pinned to `13.10.0` to avoid the earlier CommonJS/ESM dependency startup failure; re-run startup regression tests before upgrading.

## Payments and verification

Cashfree is disabled until mode and server credentials are provided. Cancellation/refund request and admin review interfaces exist, but refund provider submission, reconciliation and safe abandoned-payment expiry remain pending. See `PAYMENT_RULES.md` before enabling real payments. A local build does not verify a live payment or Hostinger deployment.

Use the local MySQL/Auth emulator workflow in `MYSQL_SETUP.md`. Run `npm run test:commerce` with services running, standalone tests under `tests`, `npm run build`, and `node --env-file-if-exists=.env --test tests/hostinger-startup.test.mjs`. Do not run integration tests or demo seeds against production records.
