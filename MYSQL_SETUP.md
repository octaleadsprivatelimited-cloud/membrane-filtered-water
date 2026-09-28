# Local MySQL store

The local store runs at http://127.0.0.1:5174. MySQL 8.4 stores products, customer profiles, orders and settings in separate InnoDB tables, with JSON columns preserving existing data shapes. Firebase Authentication remains responsible for identities; locally only its Auth emulator runs. Firestore is not used for local store data when `DATABASE_DRIVER=mysql`.

## Start

The ignored `.env` has generated local database credentials. See `.env.example` when setting up a new machine. Keep `STORE_MODE=emulator` locally.

Run these from this repository, using separate terminals for the long-running commands:

```sh
docker compose up -d
npm run emulators -- --auth-only
npm run api
npm run seed
npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

Seed only inserts sample products into an empty database. Local admin credentials are in `.local/admin-access.txt`. Existing Auth emulator accounts are imported from `.emulator-data`. MySQL data persists in the Docker volume `membrane-filtered-water_membrane_mysql`. `docker compose stop` keeps it; do not remove the volume if you need its data.

## Verify

```sh
node --env-file=.env --test tests/commerce.test.mjs tests/mysql.test.mjs
npm run build
```

The checkout suite verifies server-side pricing, permission checks, customer order isolation, idempotency, concurrent stock reservation and cancellation. Transactions serialize writes using an InnoDB lock row so a complete order and its stock updates commit or roll back together. This simple locking strategy prioritizes correctness for the current store; high-throughput deployments should use finer-grained inventory locks.

## Deployment / existing data

This change does not copy live Firestore data or deploy to Vercel. The default driver remains Firestore for compatibility with the existing deployment. To deploy MySQL, supply a reachable managed MySQL database via server-only `MYSQL_URL` and set `DATABASE_DRIVER=mysql`. Keep valid Firebase Admin credentials for live authentication. Configure the managed database's required TLS connection settings. The SQL user needs table creation privileges for initialization as well as CRUD access. Migrate existing Firestore store records before switching an existing production store; local sample data is not a production migration.
