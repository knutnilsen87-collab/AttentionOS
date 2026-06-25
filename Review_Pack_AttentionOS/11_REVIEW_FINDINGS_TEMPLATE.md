# 11 Review Findings Template

Use this file during team review. Copy each item into GitHub issues if needed.

## Finding Format

```text
ID:
Severity: Blocker / High / Medium / Low
Area: Architecture / Backend / Frontend / Domain / Security / QA / Docs
File:
Line or function:
Finding:
Impact:
Recommendation:
Owner:
Status: Open / Accepted / Fixed / Deferred
```

## Open Findings

### RPF-001
Severity: High
Area: Security/Privacy
File: `server.mjs`, `extension/`
Finding: Production auth/legal/privacy review is still missing, although local pilot consent/session controls are implemented.
Impact: App should not be broadly released publicly yet.
Recommendation: Select production auth provider and complete legal/privacy copy review before public release.
Owner: TBD
Status: Open

### RPF-002
Severity: Medium
Area: Data
File: `src/lib/store.js`
Finding: Store is JSON-backed and per-user for local pilot, but not a production database.
Impact: Multi-instance hosted deployments can diverge or lose operational guarantees.
Recommendation: Move to production database if hosted pilot grows beyond single-node/persistent-volume setup.
Owner: TBD
Status: Open

### RPF-003
Severity: Medium
Area: QA
File: `tests/`
Finding: API/domain/extension tests exist, but browser automation and real extension install tests are still missing.
Impact: UI and extension regressions can slip through.
Recommendation: Add browser smoke tests and perform manual extension install/capture smoke.
Owner: TBD
Status: Open

### RPF-004
Severity: Medium
Area: Product
File: `src/lib/domain.js`
Finding: Scoring formula is hand-authored and uncalibrated.
Impact: Score may feel arbitrary to users.
Recommendation: Review formula with product owner and calibrate with pilot data.
Owner: TBD
Status: Open

## Recently Closed Findings

### RPF-CLOSED-001
Severity: High
Area: Security
Finding: Static traversal risk.
Status: Fixed and regression-tested.

### RPF-CLOSED-002
Severity: High
Area: Frontend/Security
Finding: Current dynamic UI values were not consistently escaped.
Status: Fixed for current templates.

### RPF-CLOSED-003
Severity: High
Area: Data/Auth
Finding: No local persistence or user boundary.
Status: Fixed for local pilot.

### RPF-CLOSED-004
Severity: High
Area: Privacy/Extension
Finding: Extension capture previously lacked real consent-gated API flow.
Status: Fixed for local pilot.
