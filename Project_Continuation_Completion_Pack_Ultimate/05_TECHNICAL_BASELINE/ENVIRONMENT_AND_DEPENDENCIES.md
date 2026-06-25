# ENVIRONMENT_AND_DEPENDENCIES

## Required local tools
Node.js and npm for scripts.

## Required services
None for local MVP.

## Required environment variables
Optional `PORT`. `.env.example` contains `NEXT_PUBLIC_APP_NAME` from earlier scaffold context but current runtime does not require it.

## Required credentials
None for local MVP.

## Third-party dependencies
No runtime npm dependencies.

## Fragile dependencies
Local package-manager state is fragile. Avoid relying on current `node_modules`.

## Version mismatch risks
Node 24 was used during verification. Future work should define a supported Node LTS target.
