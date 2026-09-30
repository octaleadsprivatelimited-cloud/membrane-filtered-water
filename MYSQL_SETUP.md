# Hostinger and MySQL setup

MySQL is the default database. Products, customer profiles, orders, settings and enquiries are stored in separate InnoDB tables with JSON columns. Firebase Authentication continues to handle customer/admin identities. MySQL does not replace authentication; no Firestore rules changes are needed for this deployment.

## Hostinger production deployment

Use Hostinger **Node.js hosting** or a VPS running Node.js 24. Static hosting that serves only `dist` cannot run the store API. Select the repository directory as the application root.

| Setting | Value |
| --- | --- |
| Node.js version | 24 |
| Install command | `npm ci --include=dev` |
| Build command | `npm run build` |
| Application entry file | `app.mjs` |
| Start command, when available | `npm start` |

Deploy the full application, including `app.mjs`, `scripts`, `server`, `src/config`, `src/shared`, package files and built `dist`. Backend modules import shared configuration/pricing files. Install dependencies on the host; do not copy local `node_modules`. Route requests to the Node process, which serves both the frontend and `/api` on the host-provided `PORT`, binding to `0.0.0.0`.

Create a MySQL database and assigned user in hPanel. Configure these **server environment variables**, using the exact host and full prefixed database/user names shown by Hostinger:

```dotenv
NODE_ENV=production
STORE_MODE=live
DATABASE_DRIVER=mysql
DB_HOST=YOUR_HOSTINGER_DATABASE_HOST
DB_PORT=3306
DB_USER=YOUR_HOSTINGER_DATABASE_USER
DB_PASSWORD=YOUR_DATABASE_PASSWORD
DB_NAME=YOUR_HOSTINGER_DATABASE_NAME
PUBLIC_STORE_URL=https://www.membraneiq.com
FIREBASE_PROJECT_ID=membrane-7677f
```

Also set `FIREBASE_SERVICE_ACCOUNT` to the complete, unmodified service-account JSON for that Firebase project. Keep this in the server environment, never frontend configuration or Git. Alternatively, `GOOGLE_APPLICATION_CREDENTIALS` may point to a private service-account JSON file accessible to the server. Replace previously exposed credentials. Enable **Google** in Firebase Authentication, disable **Email/Password** and other unused providers, and authorize `membraneiq.com` and `www.membraneiq.com` (plus any other actual store domain). The customer and admin panels accept only Google sign-in. See `COMMERCE_SETUP.md` for role assignment and existing-account migration guidance.

`MYSQL_URL` or `DATABASE_URL` can replace the individual connection fields:

```text
mysql://USER:URL_ENCODED_PASSWORD@HOST:3306/DATABASE
```

Use one connection style. URL credentials must be percent-encoded; `DB_PASSWORD` uses the literal password. `MYSQL_URL` takes precedence over `DATABASE_URL`, and either URL takes precedence over individual fields. Use `DB_SSL=true` when required by the database service. Set `DB_SSL_CA` to the CA certificate PEM contents if a private CA is required; certificate verification stays enabled. Confirm the connection hostname, network access and TLS requirements with Hostinger for this application/database pair.

The user needs `CREATE`, `SELECT`, `INSERT`, `UPDATE` and `DELETE` on this database. Tables initialize automatically; the database must already exist. MySQL 8 is the locally verified version. Back up and migrate existing production records before switching stores; a deployment or local seed does not copy live data.

Leave `TRUST_PROXY` unset until Hostinger confirms the proxy IPs/CIDRs between its edge and the Node app. Then use only those exact IPs/CIDRs as a comma-separated value. Do not use blanket trust or assume a hop count. This affects client-IP rate limiting.

## Verify the deployment

1. `/api/health` must return 200 JSON with `status: "ok"` and `database: "mysql"`.
2. `/api/config` and `/api/products` must return 200 JSON. An empty catalog is valid for a new database.
3. `/api/me` without a token must return 401 JSON. Then verify a signed-in customer profile and an authorized admin account.
4. Open nested frontend routes such as `/account` and `/admin` directly.
5. Create the production catalog through Admin; do not run the local demo seed in production.

The health check verifies configured authentication and database connectivity; it does not establish whether the Firebase credential is revoked or provider operations work. A real authenticated request is also required.

`DATABASE_CONFIGURATION` means missing/invalid connection fields. `DATABASE_UNAVAILABLE` means the database cannot be initialized/queried; check the server log's MySQL error code and the hostname, credentials, access and privileges. Firebase codes concern the separate authentication credential. Production startup also checks the frontend build and rejects emulator mode.

No Hostinger deployment or production data migration has been performed by this configuration update. Real Cashfree payments/refunds still require integration and verification described in `PAYMENT_RULES.md`.

## Local development

Use Node.js 24, Docker, Java 21+ and Firebase CLI. Copy local examples from `.env.example` into the ignored `.env`; keep `STORE_MODE=emulator`. Choose `MYSQL_PASSWORD` and `MYSQL_ROOT_PASSWORD` for Compose and a matching API `MYSQL_URL`. Use separate terminals for long-running commands:

```sh
npm ci --include=dev
docker compose up -d
npm run emulators -- --auth-only
npm run api
npm run seed
npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

The store runs at http://127.0.0.1:5174. Only Firebase's Auth emulator is required with MySQL. Seed inserts sample products into an empty database and refuses live mode. Choose **Continue with Google**, then `admin@aquapure.test` in the local emulator Google chooser for the seeded admin. Seed preserves an existing admin UID, links the mock Google identity, removes its local password provider and writes password-free instructions to ignored `.local/admin-access.txt`. These identities are local tests, not real Google accounts. Auth accounts are imported from `.emulator-data` and exported on graceful shutdown. MySQL data persists in its Docker volume; `docker compose stop` preserves it.

## Local verification

With MySQL, Auth emulator and API running:

```sh
npm run test:commerce
npm run build
node --env-file-if-exists=.env --test tests/hostinger-startup.test.mjs
```

Tests verify pricing, permissions, customer isolation, idempotency, concurrent stock reservation, cancellation and admin workflows. The startup test uses a synthetic Firebase certificate and local MySQL; it is not live credential verification. Transactions serialize writes using an InnoDB lock row so order/stock changes commit or roll back together. Higher throughput may need finer-grained locks.

References: [Hostinger Node.js deployment](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/), [Hostinger MySQL connection](https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/).
