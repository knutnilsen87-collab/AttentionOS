# DEPENDENCY_RISK_MAP

## External dependencies
None at runtime today.

## Internal dependencies
`src/lib/domain.js` is central to UI, API and tests. `server.mjs` is the single backend entrypoint.

## Who/what can block progress
Owner decisions on persistence/auth/hosting/privacy. Windows/npm filesystem instability can block framework migrations.

## Provider/service risks
Future auth, database, hosting and AI providers must be selected deliberately.

## Versioning risks
Node version not pinned. No lockfile needed now because there are no dependencies, but future dependencies need a lockfile.

## Access/credential risks
No credentials are needed now. Future GitHub/deployment/auth/database credentials must not enter repo.
