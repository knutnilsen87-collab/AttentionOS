# 08 Remediation Plan

## Completed Local-Pilot Remediation
1. Static serving allowlist/path guard.
2. Dynamic UI escaping for current templates.
3. Request body size limit.
4. Invalid JSON returns 400.
5. JSON-backed per-user store.
6. Local session/user boundary.
7. Consent, capture toggle, export and delete/reset.
8. User-triggered extension capture.
9. API/extension regression tests.
10. GitHub Actions CI workflow.

## Remaining Phase 1: Hosted Staging Smoke
1. Choose staging target.
2. Set `ATTENTIONOS_STORE_PATH` to persistent volume.
3. Run lint/build/test on host.
4. Verify `/api/v1/health`.
5. Manually test browser UI.
6. Manually test extension capture before/after consent.

## Remaining Phase 2: Production Hardening
1. Select production auth provider.
2. Select production database or confirm single-node pilot storage.
3. Add monitoring/logging suitable for operations.
4. Add backups and restore procedure.
5. Add rate limiting.
6. Review legal/privacy copy.

## Remaining Phase 3: Product Confidence
1. Review scoring formula.
2. Add formula version field.
3. Add explainability text.
4. Calibrate with pilot data.
5. Add browser automation tests.
