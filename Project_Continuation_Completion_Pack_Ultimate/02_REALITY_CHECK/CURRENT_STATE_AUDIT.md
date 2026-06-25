# CURRENT_STATE_AUDIT

## What files/repos/folders currently exist
- Active repo root: `F:\prosjekter_MAIN\AttentionOS`
- Active code: `server.mjs`, `public/`, `src/lib/`, `tests/`, `extension/`
- Active docs: `README.md`, `docs/`, `status_bundle.txt`, this filled continuation pack
- Local inputs not committed: `AttentionOS_Prework_Filled(1).zip`, `dok/`, original JPG files
- Ignored/generated leftovers: `node_modules/`, `.bad-node_modules*`, `.deps/`, `.empty-node-modules/`

## What parts clearly exist
Runnable local web app, API server, domain scoring logic, in-memory store, tests, PWA manifest, extension scaffold and documentation.

## What parts appear partial
Browser extension, auth/security model, persistence, operations, production deployment and real user data consent flows.

## What parts appear broken
No active app code appears broken. Local package-manager dependency folders are unreliable and should be treated as disposable generated artifacts.

## What parts are unclear
Final production stack, database choice, auth provider, hosting target, analytics provider and legal/privacy requirements.

## What parts are missing
Real persistence, user accounts, consented data capture, production worker/queue, CI, deployment, monitoring, privacy export/delete.

## What has never been verified
Production deployment, real browser extension capture, real mobile install testing, real multi-user behavior, database migration path and CI.

## What needs immediate clarification
Whether the next milestone is local MVP polish, pilot with real users, or production-grade architecture.
