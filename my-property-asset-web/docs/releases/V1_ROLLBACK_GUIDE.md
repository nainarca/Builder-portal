# V1 Rollback Guide

## Application Rollback

1. Redeploy previous git tag / previous `dist` artifact.  
2. Confirm environment file for that tag still matches backend.  
3. Invalidate CDN cache if used.  
4. Smoke auth + portals.

## Database Rollback

Migrations are **forward-only**. Prefer:

1. **Point-in-time restore** of Postgres to pre-release timestamp.  
2. If only the last batch must reverse and is empty of critical data, use a controlled DROP under change ticket (not automated).  
3. Never delete `audit_logs` rows as part of rollback.

## Feature Flag Rollback

1. Super Admin → Platform Settings → disable risky flags.  
2. Enable `maintenance-mode` if needed with user-facing message.

## Communication Plan

| Severity | Action |
|---|---|
| Sev-1 outage | Maintenance mode + rollback app + status update |
| Sev-2 data | PITR restore + freeze writes |
| Sev-3 UX | Hotfix branch or flag disable |

## Decision Log

Record: incident ID, tag rolled back from/to, DB restore used (Y/N), approver.
