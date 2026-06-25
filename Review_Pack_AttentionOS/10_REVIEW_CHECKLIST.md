# 10 Review Checklist

## Architecture
- [ ] Is plain Node/static acceptable for the hosted pilot?
- [ ] Is JSON-backed storage acceptable for the first pilot, or should DB work happen first?
- [ ] Is local session enough for staging, or should production auth be selected now?
- [ ] Is the extension workflow placed in the right layer?

## Backend/API
- [ ] All `/api/v1` routes reviewed.
- [ ] Error shapes reviewed.
- [x] Body size and malformed JSON behavior tested.
- [x] Static traversal regression tested.
- [x] Persistence across restart tested.
- [ ] Rate limiting plan defined before public release.

## Frontend
- [ ] Full UI flow reviewed.
- [ ] Mobile layout reviewed.
- [ ] Keyboard navigation reviewed.
- [x] Current dynamic HTML escaping reviewed and remediated.
- [ ] Browser automation added or manual browser smoke completed.

## Domain/Product
- [ ] Scoring formula approved or changes requested.
- [ ] Drift thresholds approved.
- [ ] Discovery mode behavior approved.
- [ ] Reflection language approved.
- [ ] Feed simulator lane logic approved.

## Security/Privacy
- [x] Local pilot session boundary exists.
- [x] Local pilot persistence exists.
- [x] Consent/privacy/export/delete exists.
- [x] Extension capture is consent-gated.
- [ ] Production auth selected before public release.
- [ ] Production DB/backup posture selected before public release.
- [ ] Legal/privacy copy reviewed before real users.

## QA
- [x] `npm run lint` passes.
- [x] `npm run build` passes.
- [x] `npm test` passes, 12 tests.
- [x] API smoke passes.
- [ ] Browser/mobile smoke performed.
- [ ] Real extension install/capture smoke performed.
- [x] CI workflow configured.

## Handoff
- [x] `status_bundle.txt` updated.
- [ ] Review findings copied into issue tracker if needed.
- [ ] Next owner assigned.
