# TECH_DEBT_AND_CLEANUP

## High-priority tech debt
- Remove or quarantine failed dependency folders from local workspace.
- Decide whether `.env.example` should be updated to current Node/static runtime.
- Add durable persistence.

## Medium-priority tech debt
- Bundle or copy shared client domain logic instead of serving `/src/lib/domain.js`.
- Add request validation helpers.
- Add more API tests.

## Cleanup work that should happen before more features
- Commit this filled pack.
- Update `status_bundle.txt` date/current state.
- Remove stale scaffold generated files if no longer needed.

## Cleanup work that can wait
- Refine UI styles.
- Add richer docs diagrams.
- Add formal OpenAPI document.

## Dead files/docs/code to remove or archive
Generated dependency leftovers and any unfilled placeholder docs that are superseded by this pack.
