# API Contract

Base path: `/api/v1`

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Service status and request id |
| GET | `/session` | Read current local session/user context |
| POST | `/session` | Set local pilot user id |
| GET | `/profile` | Read current pilot profile |
| PATCH | `/profile` | Update identity, focus areas, passions, blocked tags or discovery level |
| GET | `/content-scan` | Read consumption items and latest analysis |
| POST | `/content-scan` | Append or replace consumed content and recompute analysis |
| GET | `/alignment` | Read current Attention Alignment analysis |
| GET | `/feed-simulator` | Read simulated feed lanes |
| GET | `/reflection` | Read weekly reflection |
| GET | `/privacy` | Read consent/capture/retention settings |
| PATCH | `/privacy` | Update consent/capture/retention settings |
| GET | `/export` | Export local user data |
| DELETE | `/user-data` | Reset/delete local user data |
| POST | `/provider/verify` | Verify provider response contract |
| GET | `/jobs` | Read worker jobs |
| POST | `/jobs` | Queue a pilot job |

## Error Shape

```json
{
  "error": {
    "code": "validation_error",
    "message": "Human-readable error.",
    "request_id": "req-..."
  }
}
```

## Security / Data Rules

- Extension capture with `source: "extension_capture"` requires `privacy.consentGranted` and `privacy.captureEnabled`.
- Request bodies above `ATTENTIONOS_MAX_BODY_BYTES` return `413 body_too_large`.
- Malformed JSON returns `400 invalid_json`.
- Pilot user context comes from `x-attentionos-user` or the `aos_user` local session cookie.

## Provider Error Categories

- `provider_connection_error`: provider timeout or connectivity failure.
- `provider_contract_error`: missing or malformed required response fields.
- `provider_processing_error`: provider returned no usable output.
