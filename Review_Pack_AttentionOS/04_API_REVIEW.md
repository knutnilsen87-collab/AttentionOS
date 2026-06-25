# 04 API Review

## Base Path
`/api/v1`

## Implemented Endpoints
| Method | Path | Status | Notes |
|---|---|---|---|
| GET | `/health` | implemented | Returns service/version/request id |
| GET | `/session` | implemented | Reads local session/user context |
| POST | `/session` | implemented | Sets local pilot user id |
| GET | `/profile` | implemented | Reads current per-user profile |
| PATCH | `/profile` | implemented | Applies normalized profile patch |
| GET | `/content-scan` | implemented | Returns consumption and analysis |
| POST | `/content-scan` | implemented | Append/replace consumed items |
| GET | `/alignment` | implemented | Returns latest analysis |
| GET | `/feed-simulator` | implemented | Returns feed lanes and analysis |
| GET | `/reflection` | implemented | Returns weekly reflection |
| GET | `/privacy` | implemented | Reads consent/capture/retention |
| PATCH | `/privacy` | implemented | Updates consent/capture/retention |
| GET | `/export` | implemented | Exports local user data |
| DELETE | `/user-data` | implemented | Deletes/resets local user data |
| POST | `/provider/verify` | implemented | Verifies provider response contract |
| GET | `/jobs` | implemented | Reads per-user jobs |
| POST | `/jobs` | implemented | Queues demo job |
| POST | `/jobs/transition` | implemented | Validates state transition |

## API Strengths
- Clear namespace.
- JSON responses.
- Basic validation for content items and job type.
- Provider contract logic is tested.

## API Concerns
- Production auth is not implemented.
- Production authorization model is not implemented.
- No rate limiting.
- JSON pilot storage is not a production database.
- Hosted staging smoke has not run.

## Review Checklist
- Confirm all endpoints required for local MVP are present.
- Decide when local sessions should be replaced by production auth.
- Decide whether JSON storage is enough for first hosted pilot.
- Add request ID propagation to every response.
- Add rate limiting before public deployment.
