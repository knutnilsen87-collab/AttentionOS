# ARCHITECTURE_STATUS

## Intended architecture
Prework suggested frontend, backend API, worker, provider/integration layer and data layer.

## Actual architecture now
Single Node server serves static UI and API routes. Domain logic is shared in `src/lib/domain.js`; state is in-memory in `src/lib/store.js`.

## Where they differ
No separate worker, database, queue, auth provider or external provider layer yet.

## Structural problems
In-memory state cannot support real users. Client imports domain logic through served source path, which is acceptable for local MVP but should be bundled or moved for production.

## Things that are still sound
Domain logic is isolated and testable. API namespace is explicit. No external runtime dependencies reduce local fragility.

## Things that need redesign
Persistence, auth, job execution, extension data sync, deployment and privacy controls.

## Things that only need cleanup, not redesign
Docs, generated dependency leftovers, and old scaffold remnants.
