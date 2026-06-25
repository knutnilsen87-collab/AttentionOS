# DECISION_LOG

| Decision | Date | Why it was made | Alternatives considered | Consequences now | Still valid |
|---|---|---|---|---|---|
| Use dependency-free Node/static MVP | 2026-06-24 | npm/Next install became unstable locally | Continue with Next.js, wait for npm cleanup | App runs with plain Node and no external deps | yes |
| Use `status_bundle.txt` as single source of truth | 2026-06-24 | Needed continuity and truthful status | Scatter status across docs | One operative state file exists | yes |
| Keep untracked prework/assets out of initial commit | 2026-06-24 | Avoid committing source/input clutter | Commit everything | Repo contains implementation only | yes |
| Fill continuation pack in repo root | 2026-06-25 | User requested filled pack in root | Keep zip external | Handoff docs live with project | yes |
