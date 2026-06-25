# Remediation Status

Updated: 2026-06-25

## Fixed In This Implementation Pass

| Finding | Status | Evidence |
|---|---|---|
| P0-001 Static file path traversal | Fixed | `server.mjs` now uses explicit `/src/lib/domain.js` alias and base-path check; API test covers traversal |
| P0-002 XSS through unescaped dynamic values | Fixed for current UI templates | `public/app.js` escapes dynamic interpolations; future changes still need review |
| P0-003 No auth/user boundary | Fixed for local pilot | Local `aos_user` session cookie and `x-attentionos-user` header partition user state |
| P0-004 No persistence/user boundary | Fixed for local pilot | JSON-backed per-user store at `ATTENTIONOS_STORE_PATH` |
| P1-005 No request body limit | Fixed | `ATTENTIONOS_MAX_BODY_BYTES`, 413 regression test |
| P1-006 Malformed JSON returns 500 | Fixed | Invalid JSON returns 400, regression test |
| P1-007 PATCH profile arbitrary shape | Improved | Store filters/normalizes allowed fields |
| P1-008 Extension permissions broad | Fixed for local pilot | User-triggered activeTab capture, localhost host permissions only |
| P2-010 Route/UI tests missing | Improved | API and extension regression tests added; browser automation still pending |

## Still Open Before Production

- Production-grade auth provider.
- Production database.
- Monitoring and backups.
- Hosted staging smoke.
- Browser automation tests.
- Legal/privacy copy review.
- Scoring calibration with pilot users.

## Current Verification

- `npm run lint`: PASS
- `npm run build`: PASS
- `npm test`: PASS, 12 tests
- Local smoke: PASS
