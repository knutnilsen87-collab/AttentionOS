# 00 Review Entrypoint

## What To Review
The current application is a local MVP scaffold:

- `server.mjs`: Node HTTP server and `/api/v1` routes.
- `public/index.html`: static app shell.
- `public/app.js`: client UI behavior and state.
- `public/styles.css`: responsive UI styling.
- `src/lib/domain.js`: scoring, feed simulation, reflection and provider contract logic.
- `src/lib/store.js`: JSON-backed per-user pilot store.
- `tests/domain.test.mjs`: domain tests.
- `extension/`: browser extension scaffold.

## What Not To Review As Active App Code
- `node_modules/`, `.bad-node_modules*`, `.deps/`, `.empty-node-modules/`
- `dok/`
- old prework zip/files
- original root JPG files, except `public/attentionos-hero.jpg`

## Review Mode
Treat this as a local MVP foundation review, not a production-readiness approval.

## Suggested Review Sessions
1. Architecture and data flow.
2. Backend/API behavior.
3. Frontend UX and accessibility.
4. Domain scoring correctness.
5. Security/privacy and real-user readiness.
6. Test coverage and QA gaps.
7. Completion plan and team ownership.
