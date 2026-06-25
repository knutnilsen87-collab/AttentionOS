# 05 Frontend Audit

## Frontend Files
- `public/index.html`
- `public/app.js`
- `public/styles.css`

## Frontend Strengths
- Fully usable local demo.
- No build tooling required.
- Clear top-level tabs.
- Responsive grid fallback.
- Visible focus styles in CSS.
- Premium dark/gold theme removes the previous split light/dark visual system.
- Changa is self-hosted through static font files.
- Desktop and mobile browser screenshots were produced for QA.

## Frontend Risks
- `innerHTML` rendering remains, but current dynamic values are escaped.
- No committed automated browser tests.
- Client state persists through API-backed JSON store.
- Direct source import from `../src/lib/domain.js`.
- Tab behavior does not implement full ARIA tab semantics.

## Highest Priority Fix
Add committed browser automation or visual regression tests and keep XSS review mandatory for every future template change.

## Escaping Status
The previously identified hotspots now pass through `escapeHtml(...)` in the current implementation. Future dynamic template additions must do the same or use DOM node creation.

## Accessibility Notes
Current labels and focus styles are a good start. Before pilot, review:

- tablist keyboard behavior
- active panel semantics
- contrast on hero image, gold metrics and glass panels
- screen reader announcements for score changes
- mobile form usability
