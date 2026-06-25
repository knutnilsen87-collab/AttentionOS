# AttentionOS Implementation Phases

Status: implemented as local pilot-ready MVP scaffold on 2026-06-25.

## Phase 1 - Specification lock

- Product promise: Take Back Control of Your Attention.
- MVP surface: web dashboard, responsive mobile companion, browser extension scaffold, API contract.
- Core entities: Profile, FocusArea, ConsumptionItem, DigitalDnaAnalysis, FeedRecommendation, Reflection, WorkerJob.
- Release gates: lint, typecheck, unit tests, production build, manual UI smoke.

## Phase 2 - Repo and platform foundation

- Dependency-free Node server in `server.mjs`.
- API namespace at `/api/v1`.
- Shared domain logic in `src/lib/domain.js`.
- JSON-backed per-user pilot store in `src/lib/store.js`.
- PWA manifest in `public/site.webmanifest`.

## Phase 3 - Core domain and onboarding

- Identity Builder supports desired identity, weekly intent, discovery level, focus areas and weights.
- Default pilot profile represents the PRD's creator/founder/student/growth audience.

## Phase 4 - Digital DNA data ingestion

- Demo consumption dataset is included.
- Users can add consumed sources in the dashboard.
- Browser extension capture is user-triggered and consent-gated.
- API supports append or replace scan data through `/api/v1/content-scan`.

## Phase 5 - Alignment score and dashboard

- Weighted score combines focus match, quality signal, blocked tags and discovery mode.
- Dashboard shows alignment, tracked minutes, drift minutes, risks and category minutes.

## Phase 6 - AI and recommendation features

- Feed simulator generates core, stretch and reduce lanes.
- Weekly AI reflection creates summary, insight, correction and next actions.
- Provider contract verifier maps timeout, bad shape and empty output to canonical error categories.

## Phase 7 - Pilot hardening

- Node unit tests cover scoring, DNA analysis, provider contract, worker transitions, API safety, persistence, privacy and extension manifest behavior.
- Accessibility basics: semantic controls, visible focus states, responsive layout and real labels.
- Security minimum: no secrets in repo, `/api/v1` validation with canonical error responses, provider verify gate, body limits, invalid JSON handling, static traversal guard, local user boundary and privacy controls.
