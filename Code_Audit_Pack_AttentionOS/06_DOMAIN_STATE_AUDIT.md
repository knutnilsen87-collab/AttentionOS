# 06 Domain And State Audit

## Domain Logic
`src/lib/domain.js` contains the core product behavior.

## State Logic
`src/lib/store.js` contains the JSON-backed per-user pilot store, privacy settings, export/delete/reset logic and recomputation.

## Domain Strengths
- Pure functions are easy to test.
- Scoring function returns explanation fields: matchedTags and driftTags.
- Worker state transitions are explicit.
- Provider contract mapping is clear.

## State Strengths
- Defaults are cloned for user state.
- Store persists to `ATTENTIONOS_STORE_PATH`.
- Local users are partitioned.
- Privacy settings exist.
- Export and delete/reset exist.
- Store inputs are normalized.
- Persistence across restart is tested.

## Domain Risks
- Formula and thresholds are not product-validated.
- Score can be gamed by tag choices.
- Drift/high-alignment thresholds are hardcoded.
- Weekly reflection text is generic and deterministic.

## State Risks
- JSON store is local-pilot storage, not production database.
- Local session is not production auth.
- Audit log is lightweight and local only.
- No retention cleanup job exists yet.

## Remediation Ideas
- Add formula versioning to analysis output.
- Add domain tests for more edge cases.
- Add retention cleanup when real capture is used.
- Move to production database if hosted pilot grows.
- Replace local session with production auth before public release.
