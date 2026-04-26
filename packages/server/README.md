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
OPENAI_API_KEY="sk-..."
SUMMARIZER_MODEL="gpt-5.4-mini"
SUMMARY_TTL_HOURS=24
SUMMARY_REVIEW_LIMIT=20
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
SHADOW_DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/SHADOW_DATABASE"
SUMMERIZER_DB_NAME="DATABASE"
SUMMERIZER_DB_HOST="HOST"
SUMMERIZER_DB_PORT=3306
SUMMERIZER_DB_USER="USER"
SUMMERIZER_DB_PASSWORD="PASSWORD"
SUMMERIZER_DB_CONNECTION_LIMIT=10
```

`SHADOW_DATABASE_URL` is used by `prisma migrate dev`. It must point to a separate empty database because Prisma may reset it while developing migrations.
`OPENAI_API_KEY` is used for generated summaries. `OPEN_API_KEY` is still accepted as a legacy fallback.

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

Review responses include the related product record. `GET /products/1/reviews` also includes the product review summary so product pages can load reviews and summary with one request.

Fetch a stored product review summary:

```txt
GET /products/1/summary
```

Generate or refresh a product review summary:

```txt
POST /products/1/summary
POST /products/1/summary?force=true
```

Generated summaries are stored in the `summaries` table. The API reuses an unexpired stored summary unless `force=true` is provided.
When generating a summary, the server sends only the most recent `SUMMARY_REVIEW_LIMIT` reviews to the language model.

## Validate

Type-check the server:

```bash
bunx tsc --noEmit
```
