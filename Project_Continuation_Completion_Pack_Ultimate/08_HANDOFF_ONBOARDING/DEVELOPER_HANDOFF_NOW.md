# DEVELOPER_HANDOFF_NOW

## What this project is
AttentionOS is a local MVP scaffold for attention-profile onboarding, Digital DNA scanning, alignment scoring, feed simulation and weekly reflection.

## Where it lives locally
`F:\prosjekter_MAIN\AttentionOS`

## What is source of truth
`status_bundle.txt`, then this filled continuation pack, then `README.md` and `docs/`.

## What is verified
Local build verification, syntax check, domain tests and API/HTML smoke were verified.

## What is not verified
Production deployment, database, auth, CI, real extension capture and privacy controls.

## Biggest blockers
Persistence, auth, consent/privacy and real extension capture.

## What a new developer should do first
Read `status_bundle.txt`, run `npm run lint`, `npm run build`, `npm test`, then inspect `server.mjs` and `src/lib/domain.js`.

## What not to trust blindly
Generated dependency folders, old scaffold assumptions, unfilled prework placeholders and any claim of production readiness.
