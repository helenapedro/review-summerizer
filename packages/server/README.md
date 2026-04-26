# Review Summerizer Server

Express API for product reviews and generated review summaries. The server runs on Bun and uses Prisma with a MySQL database.

## Setup

Install dependencies from the repository root or from this package:

```bash
bun install
```

Create `packages/server/.env` with the required server and database settings:

```env
PORT=3000
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
SHADOW_DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/SHADOW_DATABASE"
SUMMERIZER_DB_NAME="DATABASE"
SUMMERIZER_DB_HOST="HOST"
SUMMERIZER_DB_PORT=3306
SUMMERIZER_DB_USER="USER"
SUMMERIZER_DB_PASSWORD="PASSWORD"
```

`SHADOW_DATABASE_URL` is used by `prisma migrate dev`. It must point to a separate empty database because Prisma may reset it while developing migrations.

## Database

Run migrations from `packages/server`:

```bash
bunx prisma migrate dev
```

Generate the Prisma client after schema changes:

```bash
bunx prisma generate
```

Apply existing migrations in deployed environments:

```bash
bunx prisma migrate deploy
```

## Run

Start the API from `packages/server`:

```bash
bun run index.ts
```

By default, the server listens on:

```txt
http://localhost:3000
```

## API

Health check:

```txt
GET /health
```

Fetch all reviews:

```txt
GET /reviews
```

Fetch reviews for a product:

```txt
GET /reviews?productId=1
GET /products/1/reviews
```

Review responses include the related product record.

## Validate

Type-check the server:

```bash
bunx tsc --noEmit
```
