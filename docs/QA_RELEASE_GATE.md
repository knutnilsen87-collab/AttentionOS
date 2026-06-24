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

## Definition of Done

- Feature is implemented.
- Acceptance criteria are represented in UI or API.
- Tests pass for core behavior.
- Build succeeds.
- Docs are updated where relevant.
