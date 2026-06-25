# 07 Security And Privacy Review

## Current State
Local-pilot privacy/security controls are implemented. The app is still not production-ready.

## Implemented
- No secrets in repo.
- No external runtime services.
- `.env*` ignored except `.env.example`.
- Server binds to `127.0.0.1`.
- Request body limit.
- Invalid JSON returns 400.
- Static traversal regression is covered.
- Local session/user boundary.
- JSON-backed per-user store.
- Consent, capture toggle, export and delete/reset.
- Extension capture is user-triggered and consent-gated.

## Not Implemented
- Production auth provider.
- Production authorization model.
- Rate limiting.
- Production database.
- Monitoring/backups.
- Legal/privacy copy review.
- Hosted extension review/store policy.

## Sensitive Data Risk
AttentionOS may process browsing URLs and titles, consumption habits, interests, personal goals and identity statements. Treat all real-user data as sensitive.

## Browser Extension Status
- No automatic all-sites content script.
- Capture runs from extension action.
- Local API host permissions only.
- Server rejects extension capture until consent and capture are enabled.

## Required Before Production
1. Select production auth provider.
2. Select production database or prove single-node persistent-volume pilot is acceptable.
3. Add rate limiting.
4. Add monitoring and backups.
5. Review privacy/legal copy.
6. Manually smoke-test extension capture in target browser.

## Security Review Verdict
Acceptable for controlled local/staging pilot smoke. Block broad production release until production hardening is complete.
