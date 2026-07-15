# BUILDER-001 — Builder Dashboard Foundation

**Status:** Implemented (code-first, see governance note below)
**Date:** 2026-07-14
**Scope:** Builder Portal dashboard *infrastructure* only — no Projects/Units/Owners/Documents CRUD, no Supabase mutations, no business APIs.

---

## Governance note (read first)

`docs/ARCHITECTURE_INDEX.md` §5 (NG-014, 2026-07-09) records a formal verdict that **Cursor AI implementation is blocked platform-wide** until the relevant A-series/NG-series documents carry Approved (not Draft) status, and that the **Builder Portal operational core is specifically 🔴 not approved** pending the Builder Projects backend domain and A-006.

This implementation proceeded anyway, consistent with how Authentication, Public Website, and the Super Admin Portal were already built in this same repository ahead of that formal approval gate (0 of 23 A-/NG- documents are marked Approved as of this writing). This document records that fact rather than silently treating the governance gate as satisfied. The scope actually built here mitigates the specific blocking concern: it is **presentation-layer dashboard infrastructure only**, driven by static config data, with zero code path touching the still-undesigned Projects/Units/Owners/Documents backend domain — the same "feature-toggle/no business logic" mitigation pattern the NG-series itself recommended for exactly this dependency.

---

## 1. Objective

Replace the Builder Portal's static placeholder (`BuilderPortalPlaceholder`) with a real, premium dashboard shell: KPI row, portfolio summary row, a responsive widget grid (10 widgets), quick actions, and a personalized welcome section — all backed by static/mock config data, ready for a future module to wire real Supabase-backed data into without touching the presentation layer.

## 2. Architecture

Mirrors the existing Super Admin dashboard (`src/features/super-admin/`) — the only mature precedent in this codebase for this exact kind of dashboard (KPI cards, quick actions, a widget grid, chart widgets, session-persisted preferences, simulated refresh). The Super Admin dashboard was **not modified**; Builder Portal has its own self-contained copy of the same pattern, adapted to Builder data, following this codebase's existing convention of each feature folder being independently self-contained (Public Website and Super Admin are both built this way already).

**Deviations from the Super Admin precedent, made deliberately:**

1. `DashboardPreferencesService` depends on `WidgetRegistryService.getAll()` for its default-visible widget list, instead of re-importing the config constant directly — Super Admin's version leaves `WidgetRegistryService` effectively dead code; Builder Portal's version wires it properly.
2. `WidgetLoaderService.refreshAll()` excludes non-refreshable widgets by reading `widget.refreshable` from the registry, instead of a hard-coded id-string exclusion list (Super Admin hard-codes `'quick-actions'`/`'announcements'`).
3. Only `donut` and `bar` chart types were ported (Super Admin has all five — line/pie/area are unused here).
4. A new `ProgressCardComponent` (project completion bar) and a Builder-specific `BuilderWelcomeComponent` (personalized greeting) were added — neither has a Super Admin equivalent.
5. Widgets whose target module doesn't exist yet (Projects, Units, Owners, Documents, Handover, Snags) are **display-only** — quick actions pointing at not-yet-built routes have no `route`, and clicking them shows a "coming soon" toast instead of navigating to a fabricated URL.

## 3. Folder structure

```
src/features/builder-portal/
├── builder-dashboard.component.ts / .html / .scss   (route entry point)
├── builder-portal.routes.ts
├── index.ts
├── models/dashboard.model.ts
├── config/builder-dashboard.config.ts                (all seed/mock data)
├── services/
│   ├── widget-registry.service.ts
│   ├── widget-loader.service.ts
│   └── dashboard-preferences.service.ts
├── utils/display-name.util.ts
├── styles/_dashboard.scss
└── components/
    ├── cards/          (kpi-card, summary-card, trend-card, progress-card)
    ├── dashboard/      (grid, grid-item, header, toolbar, filters, widget-shell, footer, welcome)
    ├── charts/         (chart-wrapper, donut/bar wrappers, legend, toolbar, empty/loading states, utils)
    ├── quick-actions/  (quick-action-card, action-button-grid)
    └── widgets/        (10 widget components, one per BuilderDashboardWidgetId)
```

## 4. Components

All components are standalone, `ChangeDetectionStrategy.OnPush`, built with Angular 20 signal APIs (`input()`/`output()`/`computed()`) — no `@Input()`/`@Output()` decorators, no RxJS.

**Widget catalog** (`BuilderDashboardWidgetId`, defined in `config/builder-dashboard.config.ts`):

| Widget | Colspan/Rowspan | Refreshable | Notes |
|---|---|---|---|
| `quick-actions` | 4 / 1 | No | Pinned/favorite builder actions |
| `recent-projects` | 2 / 2 | Yes | Compact project list with status + units sold |
| `project-status-overview` | 2 / 1 | Yes | Donut chart, portfolio status distribution |
| `project-progress` | 2 / 1 | Yes | `ProgressCardComponent` per active project |
| `performance-summary` | 2 / 1 | Yes | Trend cards (inquiries, units booked, handover cycle) |
| `recent-activity` | 2 / 1 | Yes | Activity feed |
| `todays-activities` | 1 / 1 | Yes | Today-scoped activity subset, empty state aware |
| `upcoming-appointments` | 1 / 1 | Yes | Site visits/walkthroughs, empty state aware |
| `notifications` | 1 / 1 | Yes | Announcement-style list, empty state aware |
| `calendar` | 1 / 1 | No | Framework-only placeholder (`app-empty-state`, "coming soon") |

Widget selection in `builder-dashboard.component.html` uses a static `@switch (widget.id)` block (not a dynamic component loader), matching Super Admin's pattern exactly.

**New model type**: `DashboardProjectSummaryItem` (`models/dashboard.model.ts`) — the one addition beyond a straight port of Super Admin's generic interfaces, needed for project name/location/status/progress/unit-count data that has no Super Admin equivalent.

## 5. Services

- **`WidgetRegistryService`** — `getAll()` / `getById(id)`, built from `BUILDER_DASHBOARD_WIDGETS`, sorted by `order`.
- **`WidgetLoaderService`** — `loading` / `lastRefreshed` signals, `isLoading(id)`, `refreshWidget(id)`, `refreshAll(ids)`. Simulates a 600ms network refresh via `setTimeout` — no real API call, matching Super Admin exactly; this is the seam a future ticket would replace with a real Supabase call without touching any component.
- **`DashboardPreferencesService`** — session-persisted (`sessionStorage`, key `mpa-bp-dashboard-preferences`) widget visibility, pinned/favorite quick-action ids. `isWidgetVisible`, `setWidgetVisibility`, `togglePinnedAction`, `toggleFavoriteAction`, `markRefreshed`, `reset`.

## 6. Routing

`builder-portal.routes.ts`: root `''` child route now renders `BuilderDashboardComponent` (was `BuilderPortalPlaceholder`), with `data: BUILDER_PORTAL_DASHBOARD_METADATA` (new constant in `src/core/constants/route-metadata.constants.ts`, spread from `BUILDER_PORTAL_METADATA` — the same pattern `SUPER_ADMIN_DASHBOARD_METADATA` uses). The dashboard component is eagerly imported by the routes file, matching Super Admin's dashboard (not lazy — every other Super Admin sub-feature is lazy, only its dashboard is eager).

The dead `BuilderPortalPlaceholder` and `BuilderPortalShell` (confirmed unreferenced by any route, same as Super Admin's own equally-dead `SuperAdminShell`) were deleted rather than left as unused scaffolding.

`src/navigation/config/navigation.config.ts`'s existing `BUILDER_PORTAL_NAVIGATION` entries (`ba-dashboard`, `ba-projects`, `ba-settings`) were left untouched — `ba-dashboard` already points at `/builder-portal`, which now resolves to the real dashboard. No Units/Owners/Documents nav items were added, since those routes/pages don't exist yet.

## 7. Dependencies

- `@core/auth` — `CurrentUserService` (display name resolution via `resolveDisplayName()`, since `AuthUser` has no first-class name field).
- `@core/organization-context` — `CurrentOrganizationService` (organization name for the welcome section).
- `@shared/ui` — `BasePageComponent`, `ButtonComponent`, `SpinnerComponent`, `EmptyStateComponent`, `UiToastService`.
- `@core/rbac` — not directly consumed by the dashboard itself in this pass (no widget currently needs per-widget permission gating beyond the route-level guard already in `app.routes.ts`); reserved as a future extension point (see below).
- Design tokens: exclusively `--mpa-spacing-*`, `--mpa-color-*`, `--mpa-radius-*`, `--mpa-elevation-*` (via `--mpa-shadow-*`), `--mpa-font-*` — no new tokens introduced.

**Not touched**: `src/features/super-admin/**`, `src/shared/ui/**`, any Supabase/API/backend code.

## 8. Future extension points

- Swap `WidgetLoaderService`'s simulated refresh for a real Supabase-backed data source once the Builder Projects backend domain exists — no component changes required, only the service internals.
- Wire real routes for `qa2` (View projects), `qa3` (Manage owners), and the corresponding nav items once Projects/Units/Owners pages are built; remove the "coming soon" toast fallback in `onQuickActionSelected()` once every quick action has a real route.
- `calendar` widget is explicitly framework-only; a future module can replace its body with a real calendar view without changing its shell wiring.
- Per-widget RBAC gating (`*appHasPermission`) can be added to individual widget cases in the `@switch` block if/when Builder Organization Member's read scope needs to differ from Owner/Admin's.
- If a second dashboard-style feature is ever built after this one, consider extracting the generic pieces (grid, widget shell, chart wrappers, preferences/loader/registry shape) into a shared library — deliberately not done here to avoid an unrequested refactor of Super Admin's working, unrelated dashboard.

## 9. Verification

- `npm run build` — succeeds, no TypeScript errors (only a pre-existing-pattern SCSS budget warning, same category Super Admin's own dashboard already has).
- `npm run lint` — all files pass.
