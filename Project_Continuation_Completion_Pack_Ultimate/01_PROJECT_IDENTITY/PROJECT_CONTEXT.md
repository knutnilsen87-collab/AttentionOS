# PROJECT_CONTEXT

## Short project history
The repo began as an empty GitHub repository with local prework documents in `AttentionOS_Prework_Filled(1).zip`. A first implementation pass created a local MVP, tests, docs and pushed commit `ad7bf6d`.

## Why the project is in-progress instead of fresh
It now contains code, docs, API routes, tests, PWA metadata and a browser extension scaffold. There are also untracked local input files and generated dependency leftovers that are intentionally not source-of-truth.

## Major milestones so far
- Prework package reviewed.
- Seven implementation phases defined.
- Dependency-free Node/static MVP implemented.
- API namespace `/api/v1` implemented.
- Tests and smoke checks passed.
- Initial commit pushed to GitHub.
- `status_bundle.txt` created.

## Major pauses/stoppages
Package-manager installation on Windows produced partial `node_modules` states and tar extraction errors. The project pivoted to no external runtime dependencies.

## People involved
Project owner/user: Knut Nilsen. Implementation assistant: Codex.

## Current owner/maintainer
Knut Nilsen.

## Important background context a new developer must know
Do not assume Next.js is active. The current implementation is plain Node plus static HTML/CSS/JS. `node_modules`, `.bad-node_modules*` and `.deps` are generated/failed installation artifacts and should not guide architecture decisions.
