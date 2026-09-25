# Configuration and Vercel deployment

## Root cause and scope

The live `/api/config`, `/api/me` and `/api/products` requests reach the same Express API. `server/firebase.mjs` initializes Firebase Admin before serving requests. Invalid or missing server credentials produce a 503 response with a safe diagnostic code. This is unrelated to client Firebase settings, Firestore security rules, or a missing store ID. No database, routes or UI were replaced.

The earlier Node module crash was fixed by pinning Firebase Admin to the CommonJS-compatible release. Subsequent checks identified missing, malformed, and then invalid service-account credentials in Production. A valid server credential remains required; public configuration cannot replace a private key.

## Public configuration

`src/config/appConfig.js` contains the existing Firebase web-app configuration, production origin, same-origin `/api` base, INR/IN defaults, local emulator addresses, and Cashfree SDK/API endpoints and default version. It contains no Admin SDK keys or payment secrets. Firebase web API keys identify the client project; authorization continues to be enforced by Firebase Auth and the authenticated API.

The frontend uses no environment variables. `src/firebase/config.js`, `src/commerce/api.js`, the admin feed download and `vite.config.js` consume this configuration. Localhost selects the demo emulator project; public domains use the live project. The browser always requests `/api/...` on its current origin, so custom domains and Vercel preview domains do not accidentally call a different production server.

Admin-editable shipping, policies and business settings remain in Firestore, preserving existing functionality. Public defaults do not overwrite stored settings.

## Environment classification

- Removed client references: `VITE_USE_FIREBASE_EMULATORS`, `VITE_FIREBASE_PROJECT_ID`. Historical `VITE_FIREBASE_*` examples are no longer required.
- Public defaults in code: Firebase web app fields, site URL, API path, local addresses, currency, country, Cashfree endpoints/version and disabled default mode.
- Server-only optional overrides: `STORE_MODE`, `FIREBASE_PROJECT_ID`, `PUBLIC_STORE_URL`, `CASHFREE_MODE`, `CASHFREE_API_VERSION`, `PORT`. None are required for ordinary frontend builds or production public configuration.
- Server secrets: `FIREBASE_SERVICE_ACCOUNT`, `GOOGLE_APPLICATION_CREDENTIALS` (private file path for ADC), `CASHFREE_CLIENT_ID`, `CASHFREE_CLIENT_SECRET`. Never include credential values in source code or frontend variables.
- Runtime-provided values: `VERCEL`, `VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL`, `NODE_ENV`; these select runtime behavior/origin checks. Firebase emulator host variables are server/test-only and are rejected in live mode.
- Historical root-level UI migration scripts are not imported by the application or run during deployment. Any old env strings in those scripts/docs do not configure the deployed frontend.

## Required production setup

1. Keep `FIREBASE_SERVICE_ACCOUNT` as a Production **server environment variable**, containing the original, complete JSON from a valid service account for `membrane-7677f`. Replace the credential that was exposed in chat. Do not add quotes around the complete JSON or paste a file path.
2. Deploy with `npm install` and `npm run build`. Node 24 and the API rewrite are set in code. No `VITE_*` variables are needed.
3. Redeploy after correcting the secret. `/api/config` and `/api/products` must return 200 JSON. `/api/me` without a token must return 401 JSON; signed-in requests must return the user's profile.
4. Keep Firestore rules as they are. The browser uses the API, while Firebase Admin uses server credentials. Opening Firestore rules cannot repair credential initialization.
5. Cashfree is disabled until its server credentials and selected mode are configured. This does not block account login.

Diagnostic codes distinguish missing JSON, malformed JSON, missing credential fields, wrong project and an invalid RSA private key. They never include the private key. A structurally valid key can still be revoked or unauthorized; that requires replacing the credential or correcting its server IAM permissions.

## Local verification

Run `npm run emulators`, `npm run api`, and `npm run dev` in separate terminals. Local API defaults to emulators outside production. For explicitly testing a live backend locally, set `STORE_MODE=live` and use ADC; frontend localhost remains configured for emulators unless you deliberately change the public local config.

Run `node --test tests/app-config.test.mjs tests/api-response.test.mjs tests/service-account.test.mjs tests/server-startup.test.mjs`, `npm run test:commerce` with local services running, and `npm run build`.
