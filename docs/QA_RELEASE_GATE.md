# QA and Release Gate

## Automated Gates

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

## Manual Smoke

1. Open the dashboard.
2. Edit identity and weekly intent.
3. Adjust discovery mode.
4. Toggle a focus area and change its weight.
5. Add a consumed source in DNA Scan.
6. Confirm score, category minutes and reflection update.
7. Check `/api/v1/health`, `/api/v1/alignment`, `/api/v1/feed-simulator`.
8. Check privacy consent, export and delete/reset.
9. Check extension capture is rejected before consent and accepted after consent.

## Current Regression Tests

- Static traversal is blocked.
- Malformed JSON returns 400.
- Oversized body returns 413.
- Extension capture requires consent.
- Profile data persists across server restart.
- Export/delete reset user data.

## Definition of Done

- Feature is implemented.
- Acceptance criteria are represented in UI or API.
- Tests pass for core behavior.
- Build succeeds.
- Docs are updated where relevant.
