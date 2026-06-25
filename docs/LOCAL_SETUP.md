# Local Setup

## Prerequisites

- Node.js 20.9 or newer.
- npm, only for running package scripts.

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Optional Env

```bash
$env:PORT="3000"
$env:ATTENTIONOS_STORE_PATH="data/attentionos-store.json"
$env:ATTENTIONOS_MAX_BODY_BYTES="131072"
```

## Verify

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
