# 09 Code Audit Checklist

## Security
- [x] Static traversal fixed.
- [x] XSS hotspots fixed for current templates.
- [x] Local pilot session/user boundary added.
- [x] Request size limit added.
- [x] Malformed JSON returns 400.
- [x] Extension permissions minimized for local pilot.
- [x] Consent/privacy implemented for local pilot.
- [ ] Production auth provider selected.
- [ ] Legal/privacy copy reviewed.

## Backend
- [x] API input normalization added for current local pilot.
- [x] Error shape centralized for API errors.
- [x] Route tests added.
- [ ] Request IDs added to all responses.
- [x] Global in-memory store replaced with JSON-backed per-user pilot store.

## Frontend
- [x] Dynamic rendering safely escaped for current templates.
- [ ] UI smoke tested in browser.
- [ ] Mobile viewport tested.
- [ ] Accessibility tab behavior reviewed.
- [ ] Demo/sample data clearly labeled.

## Domain
- [ ] Scoring formula reviewed by product owner.
- [ ] Thresholds documented.
- [ ] Formula versioning added.
- [ ] Edge case tests added.

## QA/CI
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `npm test` passes.
- [x] API tests pass.
- [ ] CI configured.
- [x] CI workflow added.

## Release Gate
- [x] Local-pilot P0 findings closed.
- [ ] No broad production release until production hardening is complete.
- [ ] Pilot checklist updated.
- [ ] `status_bundle.txt` updated.
