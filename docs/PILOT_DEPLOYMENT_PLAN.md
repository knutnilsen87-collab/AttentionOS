# Pilot Deployment Plan

Updated: 2026-06-25

## Current Deployment Status
Local pilot deployment is implemented and testable. Hosted staging is not deployed because no hosting credentials or target were provided in this workspace.

## Supported Runtime
- Node.js 24 used during local verification.
- No external npm dependencies.
- Start command: `npm start`
- Health check: `/api/v1/health`

## Required Environment Variables
- `PORT`: optional, defaults to `3000`.
- `ATTENTIONOS_STORE_PATH`: optional, defaults to `data/attentionos-store.json`.
- `ATTENTIONOS_MAX_BODY_BYTES`: optional, defaults to `131072`.

## Recommended Staging Target
Any Node HTTP host that supports a persistent disk or mounted volume:

- small VPS
- Render with disk
- Fly.io volume
- Railway persistent volume
- internal pilot machine

Do not use a stateless serverless target unless persistence is moved to an external database.

## Deployment Steps
1. Clone the repo.
2. Set `PORT` if required by host.
3. Set `ATTENTIONOS_STORE_PATH` to a persistent volume path.
4. Run `npm run lint`.
5. Run `npm run build`.
6. Run `npm test`.
7. Start with `npm start`.
8. Verify `/api/v1/health`.
9. Open the web UI.
10. Enable privacy consent before extension capture.

## Pilot Gate
Before real users:

- CI must pass.
- Persistent storage path must survive restart.
- Consent must be enabled before capture.
- Export and delete/reset must be tested.
- Extension capture must be tested manually on the staging target.

## Rollback
Stop the process, restore the previous commit, and restore the previous store JSON backup if needed.
