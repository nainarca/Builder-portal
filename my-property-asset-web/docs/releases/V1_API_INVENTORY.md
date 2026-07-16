# V1 API Inventory

Angular currently implements **contract-first / in-memory** APIs. Suggested REST shapes exist in feature contracts; live HTTP is not required for demo mode.

## Contract Sources

| Domain | Contract file |
|---|---|
| Subscription / Billing | `src/features/builder-portal/subscription/contracts/subscription-api.contracts.ts` |
| Platform / Super Admin | `src/features/super-admin/platform/contracts/platform-api.contracts.ts` |
| Branding → Flutter | Builder branding service Flutter payload helpers |
| Communications → Flutter | Delivery / push contracts in P14 module |

## Suggested Surface (future REST)

### Billing
- `GET /api/v1/billing/plans`
- `GET /api/v1/organizations/:orgId/subscription`
- `POST .../upgrade|renew|suspend|extend-trial`
- `GET/POST /api/v1/organizations/:orgId/invoices`
- `POST /api/v1/billing/payment-intents`

### Platform
- `GET /api/v1/platform/dashboard`
- `GET /api/v1/platform/builders`
- `POST /api/v1/platform/builders/:id/{activate|suspend|reactivate|soft-delete}`
- `GET /api/v1/platform/analytics`
- `GET /api/v1/platform/audit`
- `GET|PATCH /api/v1/platform/settings`
- `GET|POST /api/v1/platform/support/tickets`

### Builder Domain (existing services)
- Projects, buildings, units, owners, documents, handovers, branding, communications — service methods behind repositories.

## Flutter Contracts (web → owner app)

| Contract | Purpose |
|---|---|
| Branding payload | Colors, logos, company identity |
| Communication delivery | Notification fan-out placeholders |
| Owner invitation / activation | Tokenized property link |

## Status

| Area | Live HTTP | Contract | Notes |
|---|---|---|---|
| Auth (Supabase) | Partial | ✓ | SDK present |
| Business CRUD | No | ✓ | In-memory |
| Payment providers | No | ✓ | Abstraction only |
