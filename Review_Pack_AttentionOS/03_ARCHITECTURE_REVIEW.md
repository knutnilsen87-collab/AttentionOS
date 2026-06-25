# 03 Architecture Review

## Current Architecture
```text
Browser
  -> public/index.html
  -> public/app.js
  -> /api/v1/* routes in server.mjs
       -> src/lib/store.js
       -> data/attentionos-store.json or ATTENTIONOS_STORE_PATH
       -> src/lib/domain.js

Extension action
  -> extension/content-script.js
  -> extension/service-worker.js
  -> POST /api/v1/content-scan
       -> consent gate
       -> per-user JSON store
```

## Backend
`server.mjs` is a single Node HTTP server bound to `127.0.0.1`. It serves static files, handles JSON API routes under `/api/v1`, applies body limits, returns 400 for invalid JSON and partitions local pilot users by session cookie or `x-attentionos-user`.

## Frontend
The frontend is a static app that loads state from the API, renders product tabs, saves profile/privacy settings, exports data and can delete/reset local user data.

## State
State is stored through `src/lib/store.js` in a JSON-backed per-user pilot store. Default path: `data/attentionos-store.json`. Override with `ATTENTIONOS_STORE_PATH`.

## Architecture Strengths
- Small surface area.
- Easy to run.
- Business logic is isolated.
- No framework dependency risk.
- API routes are visible in one file.
- Local-pilot persistence and user boundary are implemented.
- Consent-gated extension capture is implemented.

## Architecture Concerns
- Local session is not production auth.
- JSON store is not ideal for multi-instance production.
- No real worker separation.
- No hosted deployment adapter yet.
- No production monitoring, backups or rate limiting.

## Recommended Architecture Review Questions
1. Should the first hosted pilot keep JSON storage on a persistent volume or move straight to a database?
2. Which production auth provider should replace local sessions?
3. Should domain logic stay shared in source, be bundled, or be API-only for the client?
4. What capture fields should the extension permanently support?
5. What operational target should own monitoring/backups?
