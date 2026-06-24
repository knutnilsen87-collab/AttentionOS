# API Contract

Base path: `/api/v1`

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Service status and request id |
| GET | `/profile` | Read current pilot profile |
| PATCH | `/profile` | Update identity, focus areas, passions, blocked tags or discovery level |
| GET | `/content-scan` | Read consumption items and latest analysis |
| POST | `/content-scan` | Append or replace consumed content and recompute analysis |
| GET | `/alignment` | Read current Attention Alignment analysis |
| GET | `/feed-simulator` | Read simulated feed lanes |
| GET | `/reflection` | Read weekly reflection |
| POST | `/provider/verify` | Verify provider response contract |
| GET | `/jobs` | Read worker jobs |
| POST | `/jobs` | Queue a pilot job |

## Error Shape

```json
{
  "error": {
    "code": "validation_error",
    "details": {}
  }
}
```

## Provider Error Categories

- `provider_connection_error`: provider timeout or connectivity failure.
- `provider_contract_error`: missing or malformed required response fields.
- `provider_processing_error`: provider returned no usable output.
