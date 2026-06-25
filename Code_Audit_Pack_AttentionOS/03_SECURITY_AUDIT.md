# 03 Security Audit

## Security Verdict
Local-pilot blockers from the first audit are remediated. Block broad production release until production auth, production database, monitoring, backups, rate limiting and legal/privacy copy review are complete.

## Attack Surfaces
- Node HTTP server.
- Static file server.
- `/api/v1` JSON routes.
- Static client with `innerHTML` rendering.
- Browser extension content script.

## Remediated Security Issues
1. Path traversal/static exposure risk in `server.mjs`.
2. XSS risk in current `public/app.js` templates.
3. No local user boundary.
4. No request size limits.
5. Browser extension broad automatic capture.

## Sensitive Data
The product may eventually handle:

- browsing URLs and page titles
- consumption behavior
- identity goals
- interests/passions
- blocked or sensitive content categories
- weekly reflection data

Treat all of it as sensitive.

## Implemented Local-Pilot Security Controls
- Server binds to `127.0.0.1`.
- Local `aos_user` session and `x-attentionos-user` boundary.
- JSON persistence partitioned by local user id.
- Consent, capture toggle, export and delete/reset.
- Extension permissions minimized for local API.
- Request body size limit.
- Invalid JSON returns 400.
- Dynamic UI values are escaped.

## Required Security Controls Before Production
- Production auth provider.
- Production database and backup model.
- Rate limiting.
- Monitoring and audit logs suitable for operations.
- Legal/privacy copy review.
- Manual extension review and store-policy check.

## Extension Privacy Notes
Current extension capture is user-triggered and server-side consent-gated. Captured page title, URL and host are still sensitive; do not broaden capture or deploy publicly without privacy/legal review.
