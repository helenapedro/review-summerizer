# Review Summerizer Client

React interface for viewing product reviews and AI-generated review summaries.

## Setup

Install dependencies from the repository root:

```bash
bun install
```

## Run

Start the backend first:

```bash
cd ../server
bun run index.ts
```

Start the client:

```bash
cd ../client
bun run dev
```

Open:

```txt
http://localhost:5173
```

The client uses this API base URL by default:

```txt
http://localhost:3000
```

Override it with:

```env
VITE_API_BASE_URL="http://localhost:3000"
```

## Build

```bash
bun run build
```
