# Data Model

## Profile

- `id`: stable user or workspace id.
- `identity`: desired future identity.
- `weeklyIntent`: current attention intent.
- `discoveryLevel`: 0-100 exploration setting.
- `focusAreas`: weighted areas with canonical tags.
- `passions`: user-owned interests that should be protected.
- `blockedTags`: drift categories to downrank.

## ConsumptionItem

- `id`: source id.
- `title`: human-readable source title.
- `platform`: source platform.
- `minutes`: tracked attention time.
- `tags`: normalized content tags.
- `qualitySignal`: 0-1 user or system quality estimate.

## DigitalDnaAnalysis

- `attentionScore`: weighted 0-100 alignment score.
- `totalMinutes`: all tracked minutes.
- `alignedMinutes`: minutes with score >= 65.
- `driftMinutes`: minutes tagged as drift or low alignment.
- `categoryMinutes`: minutes by canonical tag.
- `risks`: pilot warnings.
- `items`: scored content items.

## WorkerJob

Allowed states:

- `queued`
- `running`
- `succeeded`
- `failed`
- `retry_scheduled`
- `blocked_contract_mismatch`

Allowed transitions are defined in `src/lib/domain.js`.

## PrivacySettings

- `consentGranted`: whether the user consents to approved page-context capture.
- `captureEnabled`: whether extension capture is currently active.
- `allowedFields`: capture fields allowed by the current policy.
- `retentionDays`: local pilot retention value.
- `updatedAt`: last privacy settings update timestamp.

## Persistence

The local pilot store is JSON-backed by default at `data/attentionos-store.json`.
Set `ATTENTIONOS_STORE_PATH` to move it to a durable mounted volume for staging.
