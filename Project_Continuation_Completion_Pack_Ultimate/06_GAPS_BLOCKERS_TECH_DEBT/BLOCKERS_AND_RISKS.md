# BLOCKERS_AND_RISKS

## Critical blockers
- No persistence.
- No auth/session model.
- No consent/privacy workflow for real user data.
- Browser extension only scaffolded.

## Major risks
- Treating local prototype as production-ready.
- Reintroducing dependency fragility before the package-manager issue is understood.
- Collecting sensitive browsing/attention data without privacy design.

## Delivery blockers
No CI/deployment target and no chosen database/auth stack.

## Technical blockers
In-memory store, no migrations, no durable worker queue, no bundling for client shared code.

## Organizational blockers
Need owner decision on pilot target, production stack and acceptable data collection scope.

## Unknown blockers
Legal/privacy requirements, hosting constraints, user volume and extension store requirements.

## What should be resolved first
Persistence/auth/privacy design, then real extension capture.
