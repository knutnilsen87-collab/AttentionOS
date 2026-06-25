# Pilot Release Checklist

## Automated Checks
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm test`
- [ ] GitHub Actions CI green

## Backend Checks
- [ ] `/api/v1/health` returns 200.
- [ ] Invalid JSON returns 400.
- [ ] Oversized body returns 413.
- [ ] Static traversal is blocked.
- [ ] Persistent store survives restart.

## Privacy Checks
- [ ] Capture is blocked before consent.
- [ ] Consent can be enabled.
- [ ] Capture can be paused.
- [ ] Export returns user data.
- [ ] Delete/reset clears local user data.

## Extension Checks
- [ ] Extension loads in browser.
- [ ] Capture is user-triggered from extension action.
- [ ] Capture is rejected before consent.
- [ ] Capture is accepted after consent.
- [ ] Captured item appears in DNA scan.

## Product Checks
- [ ] Identity Builder saves profile.
- [ ] Manual source entry updates score.
- [ ] Feed Simulator updates after source/profile changes.
- [ ] Weekly Reflection updates after source/profile changes.
- [ ] Mobile viewport remains usable.

## Decision Gate
Pilot may proceed only if every critical item above is checked and the pilot audience understands this is an early prototype.
