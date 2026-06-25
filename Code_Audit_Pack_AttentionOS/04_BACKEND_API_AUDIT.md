# 04 Backend API Audit

## Backend Entry Point
`server.mjs`

## API Surface
| Route | Method | Audit status |
|---|---|---|
| `/api/v1/health` | GET | Low risk |
| `/api/v1/session` | GET/POST | Local pilot session |
| `/api/v1/profile` | GET | Local user boundary |
| `/api/v1/profile` | PATCH | Normalized allowed fields |
| `/api/v1/content-scan` | GET | Local user boundary |
| `/api/v1/content-scan` | POST | Validated and consent-gated for extension |
| `/api/v1/alignment` | GET | Local user boundary |
| `/api/v1/feed-simulator` | GET | Local user boundary |
| `/api/v1/reflection` | GET | Local user boundary |
| `/api/v1/privacy` | GET/PATCH | Consent/capture/retention |
| `/api/v1/export` | GET | Data export |
| `/api/v1/user-data` | DELETE | Delete/reset |
| `/api/v1/provider/verify` | POST | Body-limited |
| `/api/v1/jobs` | GET | Local user boundary |
| `/api/v1/jobs` | POST | Local user boundary and persistence |
| `/api/v1/jobs/transition` | POST | Demo-only, no persisted job mutation |

## Backend Strengths
- Small file and inspectable control flow.
- No dependency attack surface.
- API routes use one namespace.
- Provider contract behavior is isolated in domain logic.
- Body limits and invalid JSON handling exist.
- API regression tests exist.

## Backend Risks
- Production auth is not implemented.
- Production database is not implemented.
- No structured logging.
- Hosted staging smoke not performed.

## Recommended Backend Refactor Order
1. Add production auth provider.
2. Add production database if pilot grows.
3. Add structured operational logging.
4. Add rate limiting.
5. Add hosted staging smoke.
6. Add browser automation tests.
