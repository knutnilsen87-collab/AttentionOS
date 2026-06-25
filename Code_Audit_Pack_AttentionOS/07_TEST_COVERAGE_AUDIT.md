# 07 Test Coverage Audit

## Current Tests
File: `tests/domain.test.mjs`

Current coverage:

- high quality focus content scores above drift content
- Digital DNA analysis produces minutes and score
- provider contract maps error categories
- worker state machine allows documented transitions
- health endpoint responds
- static traversal is blocked
- malformed JSON returns 400
- oversized body returns 413
- extension capture requires consent
- profile data persists across server restart
- export and delete reset user data
- extension manifest uses user-triggered capture and local API only

## Current Verification Scripts
- `npm run lint`: Node syntax checks.
- `npm run build`: required-file and domain sanity check.
- `npm test`: Node tests.

## Remaining Test Gaps
- No browser UI automation tests.
- No visual regression tests.
- No real extension install/capture browser smoke.
- No hosted staging smoke.
- No scoring calibration tests.

## Minimum Audit Test Additions
1. Browser smoke for profile save.
2. Browser smoke for privacy toggles/export/delete.
3. Browser smoke for DNA add-source.
4. Manual extension install/capture test.
5. Hosted staging health and flow smoke.

## CI Recommendation
Add a GitHub Actions workflow running:

```powershell
npm run lint
npm run build
npm test
```
