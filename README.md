# AttentionOS

Personal Attention Operating System for aligning digital consumption with user-defined goals.

## MVP Surface

- Web dashboard with Identity Builder, Digital DNA Scan, Alignment Score, Feed Simulator, Weekly Reflection and Privacy controls.
- Responsive PWA companion via `public/site.webmanifest`.
- Consent-gated browser extension capture scaffold in `extension/`.
- API contract under `/api/v1`.
- Shared scoring and provider-contract logic in `src/lib/domain.js`.
- Persistent per-user pilot store at `data/attentionos-store.json` by default.

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Verify

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Runtime Configuration

- `PORT`: optional, defaults to `3000`.
- `ATTENTIONOS_STORE_PATH`: optional, defaults to `data/attentionos-store.json`.
- `ATTENTIONOS_MAX_BODY_BYTES`: optional, defaults to `131072`.

## Key Docs

- `docs/IMPLEMENTATION_PHASES.md`
- `docs/API_CONTRACT.md`
- `docs/DATA_MODEL.md`
- `docs/QA_RELEASE_GATE.md`
- `docs/LOCAL_SETUP.md`

## API Examples

```bash
curl http://localhost:3000/api/v1/health
curl http://localhost:3000/api/v1/alignment
curl http://localhost:3000/api/v1/feed-simulator
curl http://localhost:3000/api/v1/privacy
```

## Notes

The current build is a local pilot-ready MVP scaffold. It has no external runtime dependencies, uses a JSON-backed per-user pilot store, and includes consent/export/delete controls. A hosted production release still needs a deliberate hosting and privacy review.
