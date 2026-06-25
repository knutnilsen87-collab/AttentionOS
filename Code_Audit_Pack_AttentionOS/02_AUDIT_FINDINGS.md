# 02 Audit Findings

## Severity Legend
- P0: must fix before real user data or network exposure.
- P1: should fix before pilot.
- P2: should fix before broader development.
- P3: cleanup or polish.

## Remediated Findings

### P0-001: Static File Path Traversal Can Expose Repo Files
Status: Remediated for local pilot.

Evidence:
- `server.mjs` now serves only explicit `/src/lib/domain.js` alias outside `public/`.
- Base path is checked with `relative(...)` and `isAbsolute(...)`.
- `tests/api.test.mjs` covers traversal rejection.

### P0-002: Client Rendering Allows XSS Through Unescaped Dynamic Values
Status: Remediated for current UI templates.

Evidence:
- `public/app.js` now applies `escapeHtml(...)` to dynamic interpolations in dashboard, DNA scan, simulator, reflection, privacy and delivery views.

Remaining caution:
- Future UI edits must preserve this discipline or move to DOM node creation.

### P0-003: No Authentication Or Authorization
Status: Remediated for local pilot, open for production.

Evidence:
- `server.mjs` now sets/reads local `aos_user` session cookie.
- API can use `x-attentionos-user` for local/extension/test user boundary.
- State is partitioned per user.

Remaining production work:
- Replace local pilot session with production auth provider.

### P0-004: No Persistence Or User Boundary
Status: Remediated for local pilot.

Evidence:
- `src/lib/store.js` now persists JSON state at `ATTENTIONOS_STORE_PATH`.
- `tests/api.test.mjs` verifies profile persistence across server restart.

Remaining production work:
- Replace JSON store with database if hosted pilot becomes multi-user or multi-instance.

### P1-005: Request Bodies Have No Size Limit
Status: Remediated.

Evidence:
- `ATTENTIONOS_MAX_BODY_BYTES` controls body size.
- Oversized request returns `413 body_too_large`.
- Regression test exists.

### P1-006: Malformed JSON Returns 500
Status: Remediated.

Evidence:
- Invalid JSON returns `400 invalid_json`.
- Regression test exists.

### P1-007: PATCH Profile Accepts Arbitrary Shape
Status: Improved/remediated for local pilot.

Evidence:
- `src/lib/store.js` filters and normalizes allowed profile fields.
- Unknown fields are not persisted into the active profile model.

### P1-008: Extension Permissions Are Too Broad For Current Functionality
Status: Remediated for local pilot.

Evidence:
- Manifest no longer defines automatic `content_scripts`.
- Capture is user-triggered through `chrome.action.onClicked`.
- Host permissions are limited to local AttentionOS URLs.
- Extension manifest regression test exists.

## Still Open Findings

### P2-009: Domain Scoring Formula Is Uncalibrated
Status: Open.

Impact:
Users may distrust or misunderstand the score.

Recommendation:
Review formula with product owner, add formula versioning and calibrate with pilot data.

### P2-010: Browser/UI Automation Tests Are Missing
Status: Partially open.

Evidence:
API/extension/domain tests exist, but no browser automation or visual regression exists.

Recommendation:
Add browser smoke tests for identity save, privacy controls, DNA scan add-source and responsive layout.

### P2-011: Production Auth/Database/Monitoring Are Missing
Status: Open for production.

Impact:
Current implementation is local-pilot ready, not production-ready.

Recommendation:
Select auth provider, production database, monitoring, backup and rate limiting before public deployment.
