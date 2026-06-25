# COMPILE_AND_RUNTIME_TRUTH

## Does the project compile/build?
Yes for the current dependency-free architecture. `npm run build` verifies required static/server files and domain scoring output.

## Has that been verified recently?
Yes, on 2026-06-24 during MVP completion.

## Does the project run?
Yes. Start with `npm run dev`.

## Which parts run?
Static UI, Node server, API routes, domain scoring, feed simulator, weekly reflection and provider contract verification.

## Which parts fail?
No current runtime component is known to fail. Old dependency installation folders are unreliable and ignored.

## Which parts have never been attempted?
Production deployment, real extension capture, database persistence, auth and CI.

## Required environment/dependencies to run
Node.js and npm for package scripts. No external npm runtime dependencies are required.

## Most likely compile/runtime blockers
Port conflict on 3000, stale generated dependency folders confusing future developers, and accidental reintroduction of heavy dependencies without lockfile discipline.
