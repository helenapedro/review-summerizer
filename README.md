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

Start the API:

```bash
cd packages/server
bun run index.ts
```

Start the client:

```bash
cd packages/client
bun run dev
```

Open:

```txt
http://localhost:5173
```

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.10. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
