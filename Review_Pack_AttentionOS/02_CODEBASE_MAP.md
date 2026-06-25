# 02 Codebase Map

## Root Files
| Path | Purpose | Review Notes |
|---|---|---|
| `package.json` | Scripts and dependency declaration | No dependencies by design |
| `server.mjs` | HTTP server, static file serving, API routes | Critical backend review target |
| `README.md` | Run/verify instructions | Should stay synced with status bundle |
| `status_bundle.txt` | Single source of truth | Primary live status |

## Frontend
| Path | Purpose | Review Notes |
|---|---|---|
| `public/index.html` | Static HTML shell | Check semantics and loading |
| `public/app.js` | Client-side rendering and interactions | Check state, escaping, UX, duplication |
| `public/styles.css` | Layout, responsive styling, focus states | Check accessibility and mobile behavior |
| `public/site.webmanifest` | PWA metadata | Basic scaffold |
| `public/attentionos-hero.jpg` | Visual asset | Used in hero |

## Domain And State
| Path | Purpose | Review Notes |
|---|---|---|
| `src/lib/domain.js` | Scoring, analysis, feed, reflection, state machine, provider verify | Most important business logic |
| `src/lib/store.js` | JSON-backed per-user pilot store, privacy, export/delete, recomputation | Replace with production DB if hosted pilot grows |

## API
All API routes are implemented inside `server.mjs`.

## Tests
| Path | Purpose | Review Notes |
|---|---|---|
| `tests/domain.test.mjs` | Node test coverage for domain behavior | Passing |
| `tests/api.test.mjs` | API safety, persistence, privacy and consent-gated capture tests | Passing |
| `tests/extension.test.mjs` | Extension manifest safety test | Passing |
| `scripts/verify-static.mjs` | Build/static verification script | Checks required files and scoring sanity |

## Extension
| Path | Purpose | Review Notes |
|---|---|---|
| `extension/manifest.json` | MV3 manifest | User-triggered local capture permissions |
| `extension/content-script.js` | Captures page context | Runs only when extension action triggers it |
| `extension/service-worker.js` | Sends consent-gated capture to local API | Requires consent enabled in app |

## Docs
| Path | Purpose |
|---|---|
| `docs/` | API, data model, QA, setup, implementation phases |
| `Project_Continuation_Completion_Pack_Ultimate/` | Filled continuation/handoff pack |
| `Review_Pack_AttentionOS/` | This review pack |
