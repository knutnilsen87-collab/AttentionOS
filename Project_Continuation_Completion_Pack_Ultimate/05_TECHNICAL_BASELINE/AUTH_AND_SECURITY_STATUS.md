# AUTH_AND_SECURITY_STATUS

## Current auth state
Not implemented.

## Current authorization state
Not implemented. All local API routes are open.

## Current secret/config handling
No secrets required. `.env*` is ignored except `.env.example`.

## Current abuse/rate-limit posture
No rate limiting. Acceptable only for local MVP.

## Current security gaps
No auth, no CSRF model, no rate limiting, no persistence encryption model, no consent flow, no audit log.

## Security-sensitive unknowns
What user data will be captured, retention period, deletion/export rights, analytics provider and legal terms.
