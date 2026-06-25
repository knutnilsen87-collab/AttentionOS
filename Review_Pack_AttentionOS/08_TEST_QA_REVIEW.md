# 08 Test And QA Review

## Current Verification Commands
```powershell
npm run lint
npm run build
npm test
```

## Current Automated Coverage
- Syntax checks for server/client/domain/store.
- Static file presence and scoring sanity.
- 4 domain tests.
- 7 API tests.
- 1 extension manifest test.
- Total: 12 tests.

## Current Manual Smoke Evidence
Verified:
- HTML root returned 200.
- `/api/v1/health` returned service status.
- `/api/v1/privacy` returned consent state.
- Extension-style capture was blocked before consent.
- Extension-style capture was accepted after consent.
- Smoke server was stopped after verification.

## QA Gaps
- No browser automation.
- No screenshot/visual regression.
- No real extension install/capture manual test yet.
- No mobile device smoke yet.
- GitHub Actions workflow exists but remote run depends on push/PR.

## Recommended Test Additions
1. Browser smoke with Playwright or equivalent.
2. Accessibility smoke.
3. Manual extension install/capture test.
4. Mobile viewport/device smoke.
5. Hosted staging smoke.

## Release Gate Recommendation
Approve local/staging pilot review. Do not approve broad production release until production auth/database/monitoring/privacy review are complete.
