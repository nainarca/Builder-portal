# UI-IMP-02 — Dashboard Experience Implementation Report

| Field | Value |
|---|---|
| **Document ID** | UI-IMP-02 |
| **Batch** | Batch 2 — Dashboard Experience |
| **Status** | **COMPLETE** |
| **Date** | 2026-07-17 |
| **Repository** | `my-property-asset-web` |
| **Prerequisite** | UI-IMP-01 (Foundation & Navigation) — COMPLETE |
| **Source of truth** | `docs/design/UI_REBIRTH_01_PRODUCT_UX_BLUEPRINT.md` §3, §11, §19 #5–6, §20 #2 / #9, Phase 1 |
| **Out of scope** | List pages, detail pages, forms, APIs, auth/RBAC, routing, services, metric calculations |

---

## Summary

Both primary portal dashboards now follow the approved **four-zone triage layout** (KPI strip → Attention → Activity → Quick actions) on the shared DS-06 enterprise dashboard framework. Account-status card walls (branding / communication / subscription) were removed from the Builder operational dashboard and reduced to a single Settings-bound account-health line. Super Admin uses an **exception-first** rhythm distinct from the Builder Portal’s operational rhythm.

**Development build:** passes (`ng build --configuration=development`).

---

## Dashboard Components Created

| Component | Selector | Role |
|---|---|---|
| Attention List | `app-enterprise-dashboard-attention-list` | Zone 2 attention / exceptions + “You’re all caught up” empty |
| Account Health | `app-enterprise-dashboard-account-health` | One-line Settings link (not a card zone) |
| Empty — No Activity | `app-empty-no-activity` | Activity empty state |
| Empty — No Analytics | `app-empty-no-analytics` | Analytics empty state |
| Empty — No Dashboard Access | `app-empty-no-dashboard-access` | Permission empty state |

## Dashboard Components Updated

| Component | Change |
|---|---|
| `EnterpriseDashboardShellComponent` | `rhythm` (`operational` \| `exception`); welcome + account-health projection slots |
| `EnterpriseRecentActivityComponent` | Empty-state when no items |
| `EnterpriseDashboardKpiStripComponent` | Removed `::ng-deep` mobile snap selector |
| `MetricCardComponent` styles | Interactive hover using tokens |
| Empty-states index | Exports new dashboard empties; restored `EmptyNoProjectComponent` |

## Widgets Updated

| Widget / surface | Change |
|---|---|
| Builder quick-actions / recent-activity / recent-projects / status / progress | Kept; composed into four-zone layout (no longer a 9–10 widget wall) |
| Super Admin platform-status / system-health / recent-activity / announcements / quick-actions | Kept; composed into exception-first four-zone layout |
| Builder branding / communication / subscription summary cards | **Removed from dashboard presentation** (data remains available in Settings destinations) |
| Super Admin usage / org / summary / donut widget wall | **Removed from home dashboard presentation** (charts remain available as module destinations / future Analytics) |

## Pages Updated

| Page | Rhythm | Zones |
|---|---|---|
| Builder Portal home (`BuilderDashboardComponent`) | `operational` | Welcome · Account health · KPI · Attention · Activity/portfolio · Quick actions |
| Super Admin home (`SuperAdminDashboardComponent`) | `exception` | KPI · Exceptions attention · Activity/health · Quick actions |

**Not redesigned (intentional):** settings / billing / branding / ops module dashboards, list/detail/form pages.

---

## Files Modified

### Added

- `src/shared/ui/enterprise/dashboard/attention/dashboard-attention.component.ts`
- `docs/design/IMPLEMENTATION_REPORT_UI_IMP_02.md` (this file)

### Updated

- `src/shared/ui/enterprise/dashboard/layout/dashboard-shell.component.ts`
- `src/shared/ui/enterprise/dashboard/layout/dashboard-grid.component.ts`
- `src/shared/ui/enterprise/dashboard/activity/dashboard-activity.component.ts`
- `src/shared/ui/enterprise/dashboard/models/enterprise-dashboard.models.ts`
- `src/shared/ui/enterprise/dashboard/index.ts`
- `src/shared/ui/enterprise/styles/metric-card.component.scss`
- `src/shared/ui/enterprise/empty-states/enterprise-empty-states.component.ts`
- `src/shared/ui/enterprise/empty-states/index.ts`
- `src/features/builder-portal/builder-dashboard.component.{ts,html,scss}`
- `src/features/builder-portal/config/builder-dashboard.config.ts` (header copy only)
- `src/features/builder-portal/styles/_dashboard.scss` (welcome spacing tokens)
- `src/features/super-admin/super-admin-dashboard.component.{ts,html,scss}`
- `src/features/super-admin/config/super-admin-dashboard.config.ts` (header copy only)

### Unchanged (intentionally)

- Dashboard preferences / widget-loader **services** (still used for refresh)
- Metric calculation sources (`ProjectStoreService`, `PlatformMetricsService`, etc.)
- Routes, guards, auth, RBAC, Supabase
- Feature list / detail / form pages

---

## UX Improvements Applied

1. **Four-zone ceiling** — KPI, Attention, Activity, Quick actions only (UI-REBIRTH §3).
2. **Account-status cards removed** from Builder daily dashboard; replaced with one Settings line (§3 / §20 #2).
3. **Quiet-day attention empty** — “You’re all caught up” when nothing needs intervention.
4. **Portal rhythms differ** — Builder `operational`, Super Admin `exception` (§3 / §11).
5. **Super Admin attention is exception-driven** — support queue, suspended/trial builders, degraded services — not a second KPI strip.
6. **KPI hover states** — token-driven interactive feedback.
7. **Dashboard empty vocabulary** — no activity / no analytics / no dashboard access.
8. **Loading** — existing shell refreshing + widget loading overlays retained; skeleton via `app-enterprise-dashboard-state` when `state='loading'`.
9. **Welcome + workspace context** — Builder welcome retained as shell projection; org name remains visible.
10. **Quick actions** — pinned/favorite actions remain in Zone 4 (not competing inside a widget wall).

---

## Responsive Validation

| Breakpoint | Expected behavior |
|---|---|
| Desktop / ultra-wide | 12-col activity grid; KPI auto-fit strip |
| Laptop | Same zones; grid compresses via DS-06 rules |
| Tablet (≤1024) | Activity grid → 6 columns |
| Mobile (≤640) | Activity items full-width; filters wrap; attention actions stack |

Manual checklist items remain for device QA (see below).

---

## Accessibility Validation

| Check | Status |
|---|---|
| Zone `role="region"` + aria-labels on shell zones | Applied |
| Attention list keyboard-focusable actions | Applied (`mpa-focus-visible`) |
| KPI trend ARIA labels (existing metric card) | Retained |
| Empty attention announced via `role="status"` | Applied |
| Account health `role="status"` | Applied |
| Screen-reader friendly empty activity | Applied via `app-empty-no-activity` |

---

## Performance Observations

- Home dashboards render fewer widget instances (Builder ~4 activity widgets vs previous ~9–10; SA ~4 vs ~11), reducing DOM and refresh fan-out.
- Refresh-all now targets only visible zone widgets (presentation orchestration only — same loader service).
- No new chart libraries; existing SVG chart widgets reused where kept.

---

## Remaining Dashboard Work

| Item | Notes |
|---|---|
| Module dashboards (Ops / Billing / Branding / Settings) | Adopt four-zone shell when those surfaces are batched |
| Dedicated Analytics destination | UI-REBIRTH Phase 3 / §8 — not this batch |
| Live attention from handover/snag services | Would require new data wiring — **STOP** if API/schema needed; current attention uses existing presentation sources |
| Command-palette jump into attention items | Phase 3 |
| Project-scoped dashboard page | Layout support exists via DS-06 shell; no separate Project Dashboard route redesigned here |

---

## Verification Checklist

- [x] Development build succeeds
- [x] No list / detail / form page redesign
- [x] No auth / RBAC / routing / service contract changes
- [x] Builder dashboard: branding / communication / subscription card sections removed
- [x] Builder dashboard: four zones present
- [x] Super Admin dashboard: exception attention (not trend KPI strip)
- [x] Super Admin rhythm distinct from Builder
- [x] Account health one-liner links to Settings
- [x] Empty attention state copy available
- [ ] Manual: Builder quiet day → catch-up attention state (force empty attention in fixture if needed)
- [ ] Manual: Super Admin with open support tickets → exception row + Support CTA
- [ ] Manual: tablet / mobile zone stacking
- [ ] Manual: dark mode KPI + attention surfaces

---

## Known Issues

1. Builder attention currently includes static summary-config items (handovers/snags) plus live project stats — presentation-only; not a new metrics API.
2. Module dashboards still use older compositions until a later batch.
3. Full Analytics destination remains unimplemented (by blueprint design).

---

## Next Recommended Batch

**UI-IMP-03 — Detail & Stage Patterns (Phase 1 continued)**  
Project Detail real tabs; Handover Stage Tracker; one primary action on list toolbars — still presentation-only.
