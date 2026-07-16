# Version 1.0 Release Checklist

**Product:** MyPropertyAsset Web Platform (`my-property-asset-web`)  
**Version:** 1.0.0  
**Phase:** P17 – Production Hardening  
**Date:** 2026-07-16  
**Branch:** `feature/v1-production-readiness`

Status legend: `PASS` | `PARTIAL` | `FAIL` | `N/A` | `BLOCKED`

---

## Platform

| Item | Status | Owner | Priority | Verification Method |
|---|---|---|---|---|
| Angular 20 standalone app boots | PASS | Platform | P0 | `npm start` / production build |
| Lazy-loaded portal routes | PASS | Platform | P0 | Inspect `app.routes.ts` + network chunks |
| Environment tiers (dev/qa/staging/prod) | PARTIAL | Platform | P0 | Env files exist; share one Supabase project |
| App version SemVer `1.0.0` | PASS | Platform | P1 | `package.json` + `environment*.ts` |
| Feature flags defaults | PASS | Platform | P1 | `featureFlagDefaults` in environments |
| Maintenance mode flag | PASS | Platform | P1 | Settings + env flag `maintenance-mode` |
| Bundle budgets configured | PARTIAL | Platform | P2 | `angular.json`; initial bundle warns >1.45MB |
| Flutter owner app unchanged | PASS | Platform | P0 | No Flutter code in this repo |

## Database

| Item | Status | Owner | Priority | Verification Method |
|---|---|---|---|---|
| P6A foundation migration | PASS | Data | P0 | `*_p6a_b01a_*.sql` + verify script |
| P6B security migration | PASS | Data | P0 | `*_p6b_*.sql` + verify script |
| Builder org (B02) | PASS | Data | P0 | `*_p7_b02_*.sql` |
| Projects (B03) | PASS | Data | P0 | `*_p8_b03_*.sql` |
| Buildings (B04) | PASS | Data | P0 | `*_p9_b04_*.sql` |
| Project hierarchy (P9.1) | PASS | Data | P1 | `*_p91_b05_*.sql` |
| Units (B05 / P10) | FAIL | Data | P0 | No units create migration; B08 FKs require `builder_units` |
| Owner assignment (B06 / P11) | FAIL | Data | P0 | No owner-assignment migration; B08 FKs require assignments |
| Digital handover (B08) | BLOCKED | Data | P0 | Migration present; blocked by missing units/owners tables |
| Branding (B09) | PASS | Data | P0 | `*_p13_b09_*.sql` |
| Subscriptions (B10) | PASS | Data | P0 | `*_p15_b10_*.sql` |
| Communications (B11) | PASS | Data | P0 | `*_p14_b11_*.sql` |
| Platform management (B12) | PASS | Data | P0 | `*_p16_b12_*.sql` |
| Verify scripts for each batch | PASS | Data | P1 | `supabase/migrations/verify/*` |
| RLS on B02–B04 + security | PASS | Data | P0 | Policies in B02–B04 + P6B |
| RLS on B08–B12 | FAIL | Data | P0 | No RLS enable/policies in later batches |
| Rollback scripts | PARTIAL | Data | P1 | Forward-only migrations; rollback procedure documented in V1_ROLLBACK_GUIDE |

## Security

| Item | Status | Owner | Priority | Verification Method |
|---|---|---|---|---|
| Authenticated route guards | PASS | Security | P0 | `authenticatedGuard` on portals |
| Portal + authorization guards | PASS | Security | P0 | `portalGuard` + `authorizationGuard` |
| RBAC matrix Super Admin ops | PASS | Security | P0 | `id-06` super-admin only + P16 smoke |
| Builder org isolation (Angular) | PARTIAL | Security | P0 | Org context + permissions; live RLS incomplete |
| JWT validation (Supabase SDK) | PARTIAL | Security | P0 | SDK wired; repositories still in-memory |
| Invitation token handling | PARTIAL | Security | P0 | Token flows exist; confirm hashing/expiry in live SQL |
| Storage policies | PARTIAL | Security | P1 | Branding storage seed; full policy review pending |
| File upload security | PARTIAL | Security | P1 | Metadata-first uploads; no raw file gateway in V1 web |
| support-user resource depth | FAIL | Security | P1 | Portal entry without resource-level matrix grants |

## Authentication

| Item | Status | Owner | Priority | Verification Method |
|---|---|---|---|---|
| Sign-in / session shell | PASS | Auth | P0 | Authentication feature routes |
| Role-based portal routing | PASS | Auth | P0 | Guarded `/super-admin`, `/builder-portal` |
| Builder invitation accept path | PASS | Auth | P1 | Invitation redirect to auth flow |
| Owner invitation (Flutter) | N/A | Auth | P0 | Contract only; Flutter owns activation |

## Builder Portal

| Item | Status | Owner | Priority | Verification Method |
|---|---|---|---|---|
| Dashboard | PASS | Builder | P0 | Manual + unit coverage |
| Company / organization | PASS | Builder | P0 | P7 module |
| Projects / buildings / units UI | PASS | Builder | P0 | P8–P10 UI; units still mock-backed |
| Owner assignment UI | PASS | Builder | P0 | P11 UI; mock-backed |
| Documents | PASS | Builder | P1 | P12 docs module |
| Digital handover UI | PASS | Builder | P0 | P12A; SQL blocked until units/owners |
| Branding workspace | PASS | Builder | P0 | P13 |
| Communications hub | PASS | Builder | P0 | P14 |
| Subscription & billing | PASS | Builder | P0 | P15 |
| Plan enforcement hooks | PASS | Builder | P1 | Project/unit/doc/comms checks |

## Super Admin

| Item | Status | Owner | Priority | Verification Method |
|---|---|---|---|---|
| Platform dashboard live metrics | PASS | SA | P0 | P16 `PlatformMetricsService` |
| Builders lifecycle | PASS | SA | P0 | Activate/suspend/reactivate/soft-delete |
| Organizations / IAM | PASS | SA | P0 | Existing modules |
| Billing / plans | PASS | SA | P0 | P15 + billing routes |
| Branding oversight | PASS | SA | P1 | Reset/disable/restore |
| Operations (health/audit/comms) | PASS | SA | P0 | Operations routes |
| Support Center | PASS | SA | P1 | P16 tickets (in-memory) |
| Analytics | PASS | SA | P1 | P16 analytics placeholders for revenue |
| Platform settings | PASS | SA | P0 | Name, support, legal, flags, maintenance |

## Subscription

| Item | Status | Owner | Priority | Verification Method |
|---|---|---|---|---|
| Plan catalog | PASS | Commercial | P0 | Free Trial → Custom |
| Assign / renew / upgrade | PASS | Commercial | P0 | Repository + SA plan admin |
| Invoices / payments history | PASS | Commercial | P1 | UI + PDF placeholder |
| Payment gateway abstraction | PASS | Commercial | P0 | No live gateway (by design) |
| Limit enforcement | PASS | Commercial | P0 | Unit tests |

## Branding

| Item | Status | Owner | Priority | Verification Method |
|---|---|---|---|---|
| Builder branding editor | PASS | Brand | P0 | P13 |
| Flutter branding payload contract | PASS | Brand | P0 | Contract in branding service |
| SA branding studio + oversight | PASS | Brand | P1 | Studio + oversight page |
| Default / reset / disable | PASS | Brand | P1 | Repository methods + audit |

## Communication

| Item | Status | Owner | Priority | Verification Method |
|---|---|---|---|---|
| Builder create/publish | PASS | Comms | P0 | P14 |
| Audience targeting | PASS | Comms | P0 | Owner assignment reuse |
| Delivery / push contracts | PASS | Comms | P1 | Flutter contracts only |
| SA moderation disable/archive | PASS | Comms | P0 | Operations communications |

## Testing

| Item | Status | Owner | Priority | Verification Method |
|---|---|---|---|---|
| Unit tests (Karma/Jasmine) | PASS | QA | P0 | **77/77 SUCCESS** (2026-07-16) |
| Repository / service specs | PASS | QA | P0 | P13–P16 focused specs included |
| RBAC / permission specs | PASS | QA | P0 | P15/P16 permission smokes |
| Smoke checklists encoded | PASS | QA | P1 | P14–P16 smoke specs |
| Integration tests (live Supabase) | FAIL | QA | P0 | Not implemented |
| E2E browser workflow suite | FAIL | QA | P0 | Manual checklist only (see workflow validation) |
| Regression suite CI gate | PARTIAL | QA | P1 | Local `ng test` green; CI not verified in this phase |

## Deployment

| Item | Status | Owner | Priority | Verification Method |
|---|---|---|---|---|
| Production build | PASS | DevOps | P0 | `npm run build` succeeds |
| Deployment guide | PASS | DevOps | P0 | `V1_DEPLOYMENT_GUIDE.md` |
| Rollback guide | PASS | DevOps | P0 | `V1_ROLLBACK_GUIDE.md` |
| Backup strategy documented | PASS | DevOps | P1 | Deployment guide § Backup |
| Monitoring / logging checklist | PASS | DevOps | P1 | `V1_MONITORING_CHECKLIST.md` |
| Separate Supabase per env | FAIL | DevOps | P0 | All envs share one project URL |
| Error tracking (Sentry etc.) | FAIL | DevOps | P1 | Placeholder only in ops telemetry |

## Documentation

| Item | Status | Owner | Priority | Verification Method |
|---|---|---|---|---|
| Architecture summary | PASS | Docs | P0 | `V1_ARCHITECTURE_SUMMARY.md` |
| Module completion matrix | PASS | Docs | P0 | `V1_MODULE_COMPLETION_MATRIX.md` |
| API / DB inventories | PASS | Docs | P0 | Inventory docs |
| Admin / Builder guides | PASS | Docs | P1 | User guides |
| Release notes / limitations / roadmap | PASS | Docs | P0 | Release docs set |
| Executive report | PASS | Docs | P0 | `V1_EXECUTIVE_REPORT.md` |

## Demo Readiness

| Item | Status | Owner | Priority | Verification Method |
|---|---|---|---|---|
| Super Admin demo path | PASS | Product | P0 | Builders → Billing → Ops |
| Builder portal demo path | PASS | Product | P0 | Projects → Owners → Branding → Comms → Subscription |
| Mock data seed quality | PASS | Product | P1 | In-memory mocks across modules |
| Payment live checkout | N/A | Product | P2 | Abstraction only (V1 design) |

## Production Readiness

| Item | Status | Owner | Priority | Verification Method |
|---|---|---|---|---|
| Live repository → Supabase wiring | FAIL | Platform | P0 | Providers still `InMemory*` |
| Full migration apply on clean DB | BLOCKED | Data | P0 | Units/owners missing |
| RLS complete for commercial tables | FAIL | Security | P0 | B08–B12 gap |
| Perf validated under load | FAIL | Platform | P2 | No load test evidence |
| Go-live approval | BLOCKED | Leadership | P0 | See executive report |

---

## Sign-off

| Role | Name | Date | Decision |
|---|---|---|---|
| Engineering | | | |
| Security | | | |
| Product | | | |
| Release Manager | | | |

**Aggregate recommendation:** see [`V1_EXECUTIVE_REPORT.md`](./V1_EXECUTIVE_REPORT.md) — **NO-GO for production**; **GO for controlled demo / stakeholder review** with known limitations.
