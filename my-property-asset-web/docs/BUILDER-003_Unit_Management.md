# BUILDER-003 — Unit Management Foundation

**Status:** Implemented (code-first, see `BUILDER-001_Builder_Dashboard.md`'s governance note — same basis applies here)
**Date:** 2026-07-15
**Scope:** Full Unit Management module, nested under a specific Project — combined dashboard + enterprise list workspace, detail page, create/edit wizard, tower/floor construction visualization. No Owner Assignment/Documents CRUD/Handover/Snag/Appointments, no Supabase mutations, no business APIs (placeholder/summary widgets only).

---

## 1. Two things resolved before implementation

**Route prefix conflict**, same category as BUILDER-002. The governing prompt asked for routes at `/builder/projects/:projectId/units/*`. **Resolved: `/builder-portal/projects/:id/units/*`**, added as a new lazy `loadChildren` entry inside the existing `PROJECT_ROUTES` array, alongside its `''`/`list`/`create`/`:id`/`:id/edit` siblings — Units are a child domain of Projects, not a sibling top-level route.

**Only 4 routes requested, not 5.** Unlike Projects (which split `''` workspace and `list` grid into two routes), the prompt's routing section lists only `units`, `units/create`, `units/:unitId`, `units/:unitId/edit` — no separate list path. **Resolved: the Unit Dashboard content (tower/floor selectors, quick statistics, construction visualization) and the Unit List content (enterprise grid) are combined into one `UnitWorkspacePageComponent`** at the `''` path, rather than force-fitting a `list` route the prompt didn't ask for.

## 2. Architecture

Reuses BUILDER-002's proven CRUD-module pattern almost mechanically (store/list-state/form-state services, unsaved-changes guard via `UiDialogService.confirm()`, toasts on mutation, `StepperComponent`/`SelectComponent`/`CheckboxComponent` from `shared/ui`) — no new `shared/ui` primitives were needed this time; everything BUILDER-002 added (`SelectComponent`, `CheckboxComponent`, `DatePickerComponent`, `StepperComponent`) was reused as-is.

**Two deliberate architecture decisions specific to this module:**

1. **Explicit `projectId` scoping, not ActivatedRoute-in-service magic.** `UnitStoreService` is `providedIn: 'root'` and holds every unit for every project in one signal, but every query/mutation takes `projectId` as an explicit parameter rather than reading it from an injected `ActivatedRoute` inside the service — a root-provided service's injected `ActivatedRoute` resolves to the *root* route, not the deepest active one, which would silently break project-scoping. `UnitListStateService` (also root-provided) exposes `setProjectId(id)`, called by the workspace/create/edit/detail pages on init; changing project id resets search/filters/selection so Angular's default route-reuse (same component instance across a `:id` change) can't leak stale filters between two different projects' unit lists.
2. **Tower/Block and Floor are lightweight lookup data, not their own CRUD domain.** A `Tower` record (`id`, `projectId`, `name`, `totalFloors`) exists purely to organize, filter, and select units — no tower/floor create-edit UI. This matches the prompt's own framing: "Tower / Block Organization" and "Floor Visualization" are organizational *views of units*, not a new business entity.

**CSS encapsulation lesson (BUILDER-002 §1) applied proactively this time**, not discovered after the fact: `units/styles/_units.scss` was registered globally in `src/styles.scss` from the very first commit of this module, so every nested child component (badges, cards, grid tiles) renders correctly without a separate fix-up pass.

## 3. Folder structure

```
src/features/builder-portal/projects/units/
├── units.routes.ts, index.ts
├── models/unit.model.ts             (Unit, Tower, UnitFormModel, UnitListQuery/Result, UnitSavedView, etc.)
├── config/units.config.ts           (MOCK_TOWERS ×3, MOCK_UNITS ×14 seeded across proj-001/proj-002 only,
│                                      table columns, saved views, status/stage/type filter + sort options)
├── services/
│   ├── unit-store.service.ts        (query/getById/create/update/archive/restore/bulk*, getTowers/getFloors —
│   │                                  every method takes projectId explicitly, see §2.1)
│   ├── unit-list-state.service.ts   (search/filters/sort/page/viewMode/selection/columns/savedView, adds
│   │                                  setProjectId + towerFilter/floorFilter beyond Project's shape)
│   └── unit-form-state.service.ts   (model/dirty/saving/autosave/errors/validate — per-component provided,
│                                      mirrors ProjectFormStateService exactly)
├── guards/unit-unsaved-changes.guard.ts
├── styles/_units.scss               (registered globally in src/styles.scss from the start, see §2)
├── pages/
│   ├── unit-workspace-page.*   ('' — combined dashboard + enterprise grid, project-scoped via parent :id)
│   ├── unit-create-page.*      ('create' — wizard, canDeactivate)
│   ├── unit-edit-page.*        (':unitId/edit' — wizard, canDeactivate)
│   └── unit-detail-page.*      (':unitId')
└── components/
    ├── shared/     UnitCard, UnitHeader, UnitBadge (type/configuration chip), UnitStatusBadge (sales status),
    │               UnitConstructionBadge (construction stage), TowerCard, FloorCard, UnitAvatar,
    │               UnitEmptyState, UnitLoadingState
    ├── list/       UnitDataGrid (p-table), UnitCardGrid, UnitViewToggle, UnitQuickFilters,
    │               UnitAdvancedFilters (tower/floor/type/stage selects), UnitColumnSelector,
    │               UnitSavedViews, UnitBulkActions
    ├── workspace/  TowerFloorSelector, UnitQuickStats (reuses BUILDER-001's KpiCardComponent),
    │               TowerOverview (grid of TowerCards with per-tower avg progress/sold count),
    │               UnitGridVisualization (floor-plan-style status-tile grid, grouped by floor descending)
    ├── detail/     UnitOverview, UnitTimeline (milestones), UnitSummaryRow (Owner/Documents/Handover/Snag/
    │               Appointments placeholder counts), UnitGalleryPlaceholder, UnitDrawingPlaceholder
    └── form/       UnitForm (hosts <app-stepper>: Basics → Tower & Floor → Construction & Status → Review,
                     reuses the exact jump-to-first-invalid-step pattern from ProjectFormComponent)
```

## 4. Routing

`units.routes.ts` (`UNIT_ROUTES`), lazy-loaded from `projects.routes.ts` as a new entry: `{ path: ':id/units', loadChildren: () => import('./units/units.routes').then(m => m.UNIT_ROUTES) }`.

| Path (relative to `/builder-portal/projects/:id/units`) | Component | Guard |
|---|---|---|
| `''` | `UnitWorkspacePageComponent` | — |
| `create` | `UnitCreatePageComponent` | `unitUnsavedChangesGuard` |
| `:unitId` | `UnitDetailPageComponent` | — |
| `:unitId/edit` | `UnitEditPageComponent` | `unitUnsavedChangesGuard` |

Project id is read via `route.parent.paramMap` in every unit page (the `:id/units` segment is the immediate parent `ActivatedRoute` node — the same multi-segment-path-in-one-route-config pattern `PROJECT_ROUTES`'s own `:id/edit` entry already uses). New `RouteMetadata` constants added to `src/core/constants/route-metadata.constants.ts` (`BUILDER_PORTAL_UNITS_METADATA`, `..._UNIT_CREATE_METADATA`, `..._UNIT_DETAIL_METADATA`, `..._UNIT_EDIT_METADATA`), spreading `BUILDER_PORTAL_PROJECTS_METADATA`, gated by the same `id-07-project-unit` permission resource already used for Projects (confirmed in `permission-matrix.registry.ts` as literally "Projects & Units" combined — no new permission resource needed).

**Back-links wired from Project Detail** (the only edits to BUILDER-002's own files, both additive): `ProjectSummaryRowComponent`'s "Units" placeholder count is now a real `routerLink` to the project's Units workspace (previously plain text, since the route didn't exist yet); `ProjectHeaderComponent` gained a "View units" button alongside its existing Back/Edit actions.

## 5. Components

All standalone, `ChangeDetectionStrategy.OnPush`, Angular 20 signal APIs (`input()`/`output()`/`computed()`), no RxJS in components (only in the two `toSignal(route.paramMap...)` reads per page, matching BUILDER-002's own precedent), no reactive forms.

## 6. Unit domain model

See `models/unit.model.ts`. `Unit` covers identity (`unitNumber`, `code`), placement (`towerId`/`towerName`/`floorNumber`), classification (`unitType`: apartment/villa/studio/penthouse/commercial/retail; `configuration`: free-text e.g. "2BHK"), size (`areaSqft`), and **two independent status axes** — `status: UnitStatus` (available/reserved/sold/blocked — the sales/allocation axis) and `constructionStage: UnitConstructionStage` (not-started → foundation → structure → finishing → ready-for-handover → handed-over — the construction-progress axis), plus `progress` (0–100%), `milestones` (construction timeline), and `summary: UnitSummaryPlaceholders` — explicitly placeholder-only (owner-assigned boolean, document count, handover status, open-snag count, upcoming-appointment count), no real linked entities, per the "DO NOT IMPLEMENT" scope boundary. `Tower` is a separate, minimal lookup record (`id`/`projectId`/`name`/`totalFloors`) — not a CRUD entity.

Mock data: 3 towers, 14 units, seeded only against `proj-001` (Horizon Towers, 2 towers) and `proj-002` (Skyline Residences, 1 tower) out of the 8 projects BUILDER-002 seeded. Every other project genuinely has zero units, exercising `UnitEmptyStateComponent` for real rather than being faked everywhere.

## 7. Dependencies

- `@core/organization-context`, `@core/rbac` — same gating pattern as Projects (`HasPermissionDirective` on Edit actions).
- `@shared/ui` — no additions this task; reuses everything BUILDER-002 added (`SelectComponent`, `CheckboxComponent`, `DatePickerComponent`, `StepperComponent`) plus the pre-existing table/data-display/dialog/feedback composites.
- `builder-portal/components/cards` (BUILDER-001) — `KpiCardComponent` reused directly by `UnitQuickStatsComponent`, the same "future module" reuse path BUILDER-001 was built to support.
- `builder-portal/models/dashboard.model` — `DashboardKpiItem` reused for quick statistics rather than redefined.
- `builder-portal/projects/services/project-store.service.ts` — `ProjectStoreService.getById()` resolves the parent project's name for the breadcrumb bar; the only cross-domain read (Units → Projects), never the reverse.
- `builder-portal/projects/styles/_projects.scss` — `.proj-placeholder-panel` reused verbatim for `UnitGalleryPlaceholderComponent`/`UnitDrawingPlaceholderComponent` rather than duplicating an identical class under a new name.

**Not touched**: `src/features/super-admin/**`, any Supabase/API/backend code. Within `builder-portal/projects/`, only the two additive back-link edits named in §4 were made — no existing Project component's core behavior changed.

## 8. Future extension points

- Swap `UnitStoreService`'s in-memory array for a real Supabase-backed repository once the Builder Projects/Units backend domain exists — the explicit-`projectId`-parameter shape (§2 decision 1) is already the right contract for a real scoped query.
- `UnitSummaryRowComponent`'s five placeholder counts become real cross-links once Owner Assignment/Documents/Handover/Snag/Appointments modules exist — same pattern as `ProjectSummaryRowComponent`, and the same place a future module should look first.
- `UnitGalleryPlaceholderComponent`/`UnitDrawingPlaceholderComponent` are scaffold-only, ready for media storage and CAD/drawing-viewer integration respectively.
- `UnitGridVisualizationComponent`'s floor-plan-style tile grid is a generic, reusable visual pattern (group-by-floor, status-colored tiles) — worth considering for promotion to `shared/ui` if a future module (e.g. a cross-project portfolio view) needs the same visualization outside a single project's context.
- Tower/Floor currently has no create/edit UI by design (§2 decision 2); if a future requirement needs builders to define towers themselves rather than relying on seed/import data, that's a new, small CRUD surface layered on top of the existing `Tower` model — not a redesign.

## 9. Verification

- `npm run build` — succeeds, no TypeScript errors (only the same pre-existing Super Admin SCSS budget warnings BUILDER-001/002 already produce; no new budget warnings from this module, confirming the proactive global-styles registration worked).
- `npm run lint` — all files pass.
- Confirmed via compiled build output (`dist/.../styles-*.css`) that `.unit-card` and other `.unit-*` classes are present as plain, unscoped selectors (no `_ngcontent` attribute) — the CSS-encapsulation lesson held from the first commit, no rebuild cycle needed this time.
- Not yet verified in a running browser session — recommend `npm start` and exercising `/builder-portal/projects/proj-001/units` (workspace: tower/floor selector, quick stats, tower overview, construction visualization, card↔table toggle, filters, bulk archive), `/builder-portal/projects/proj-001/units/create` (wizard), `/builder-portal/projects/proj-001/units/unit-001` (detail), and `/builder-portal/projects/proj-003/units` (real empty state, zero seeded units) before considering this fully done.
