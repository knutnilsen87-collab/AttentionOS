# 06 Domain Logic Review

## Main File
`src/lib/domain.js`

## Core Functions
| Function | Purpose |
|---|---|
| `profileTagWeights` | Converts focus areas/passions into tag weights |
| `scoreContentItem` | Scores one consumption item |
| `analyzeDigitalDna` | Computes score, minutes, risks and sorted items |
| `generateFeedSimulation` | Creates core/stretch/reduce feed lanes |
| `createWeeklyReflection` | Creates summary, insight, correction and next actions |
| `canTransitionJob` | Validates worker state transitions |
| `verifyProviderContract` | Maps provider response to canonical categories |

## Review Priorities
1. Validate scoring formula with product owner.
2. Decide if blocked tags should always zero-score content.
3. Decide whether `qualitySignal` is user-input, model-input or platform-derived.
4. Confirm threshold values: aligned >= 65, high >= 80, drift < 35.
5. Review whether discovery mode should boost unmapped content.

## Known Limitations
- Rules are deterministic and hand-authored.
- No model-backed classification.
- No calibration against real user data.
- No per-user learned preferences.
- No explainability beyond matched/drift tags.

## Test Coverage
Current tests cover:
- Focus content scores above drift content.
- Digital DNA analysis calculates minutes/risks.
- Provider contract error categories.
- Worker transitions.

## Missing Tests
- Discovery level behavior.
- Blocked tag scoring edge cases.
- Empty consumption lists.
- Multiple profiles.
- Reflection output for no drift/high score cases.
