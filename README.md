# Review Summerizer

Monorepo for a product review summarization app.

## Packages

- `packages/server` - Bun, Express, Prisma, MySQL API
- `packages/client` - React and Vite frontend

## Run Locally

Install dependencies:

```bash
bun install
```

Start the API and client together from the root folder:

```bash
bun run dev
```

Open:

```txt
http://localhost:5173
```

The API runs on:

```txt
http://localhost:3000
```

You can still run each package separately:

```bash
bun run dev:server
bun run dev:client
```

Build the client:

```bash
bun run build
```
