# AttentionOS

Personal Attention Operating System for aligning digital consumption with user-defined goals.

## MVP Surface

- Web dashboard with Identity Builder, Digital DNA Scan, Alignment Score, Feed Simulator and Weekly Reflection.
- Responsive PWA companion via `public/site.webmanifest`.
- Browser extension scaffold in `extension/`.
- API contract under `/api/v1`.
- Shared scoring and provider-contract logic in `src/lib/domain.js`.

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
```

## Notes

The current build is a pilot-ready MVP scaffold. It has no external runtime dependencies and uses an in-memory demo store so the product workflow is testable before a managed database, auth provider and production queue are selected.
