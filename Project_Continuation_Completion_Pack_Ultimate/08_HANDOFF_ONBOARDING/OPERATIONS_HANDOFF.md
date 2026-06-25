# OPERATIONS_HANDOFF

## How to run/inspect the project
Run `npm run dev`, then open `http://localhost:3000` or the configured `PORT`.

## What environments matter
Only local development exists today.

## What credentials/tools are needed
Node.js and npm. No credentials.

## What logs/health checks matter
Console output from `server.mjs`; `/api/v1/health` for health check.

## Where failures usually appear
Port conflicts, malformed JSON requests, or stale/generated dependency folders confusing future tooling.

## What to do when blocked
Read `status_bundle.txt`, rerun verification commands, inspect `server.mjs`, then update this pack with the real blocker.
