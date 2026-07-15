# BUILDER-002 — Project Management Foundation

**Status:** Implemented (code-first, see `BUILDER-001_Builder_Dashboard.md`'s governance note — same basis applies here)
**Date:** 2026-07-14
**Scope:** Full Project Management module for the Builder Portal — dashboard/workspace, enterprise list (card + table), detail page, create/edit wizard, visualization. No Units/Owners/Documents/Handover/Snag/Appointments CRUD, no Supabase mutations, no business APIs (placeholder/summary widgets only).

---

## 1. Two things resolved before implementation

**Route prefix conflict.** The governing prompt asked for routes at `/builder/projects/*`. The Builder Portal is actually mounted at `/builder-portal` (`app.routes.ts`, `APP_ROUTES.builderPortal = 'builder-portal'`), guarded by `authenticatedGuard`/`portalGuard`/`authorizationGuard` and wrapped in `BuilderPortalLayoutComponent`. Building routes literally at `/builder/projects/*` would have created a disconnected, unguarded, unlaid-out route tree — not an integration. **Resolved: all Project routes live at `/builder-portal/projects/*`**, added as a lazy `loadChildren` child of `BUILDER_PORTAL_ROUTES`, matching Super Admin's `organizations`/`builders` pattern exactly. `navigation.config.ts`'s `ba-projects` entry (previously a placeholder pointing at `/builder-portal`) and the dashboard's `qa2` "View projects" quick action (previously routeless) were both updated to point here.

**A pre-existing CSS encapsulation bug, found and fixed for this module's own code.** Angular's per-component style encapsulation means a shared SCSS partial `@use`d only by page-level components (e.g. `_organizations.scss`, only imported by `organization-list-page.component.scss`/`organization-detail-page.component.scss`) does **not** reach the many nested sub-components (avatars, badges, cards, data-grid rows, etc.) that render those classes but declare no `styleUrl` of their own — verified directly in the compiled build output (`.org-avatar[_ngcontent-%COMP%]` is scoped to the *page* component's content-ID, which never appears on `OrganizationAvatarComponent`'s own unscoped, `ViewEncapsulation.None` elements). This is a real, unnoticed defect across the Super Admin `organizations`/`builders` modules and BUILDER-001's dashboard-kit, which this task's code was directly mirroring/reusing. **Fixed for this task's own code** by registering `builder-portal/styles/dashboard` and `builder-portal/projects/styles/projects` as **global** styles in `src/styles.scss` (the same mechanism `shared/ui/styles` already uses, which is why shared primitives always render correctly) — confirmed in the compiled `styles.css` that `.proj-avatar`/`.bp-kpi-card` etc. now appear as plain, unscoped selectors. Per-component redundant local `@use` statements were removed from `builder-dashboard.component.scss` and every Projects page `.scss` (now globally covered). **Not fixed**: Super Admin's `organizations`/`builders` modules themselves — out of scope for this task ("do not modify unrelated modules"); flagged here and in `ARCHITECTURE_INDEX.md` for whoever owns that area.

## 2. Architecture

Two-part reuse strategy:

1. **The Project Workspace page (`''` route) reuses BUILDER-001's dashboard-kit directly** (`KpiCardComponent`, `SummaryCardComponent`, `ProgressCardComponent`, `DashboardGridComponent`/`GridItemComponent`/`WidgetShellComponent`/`HeaderComponent`/`FooterComponent`, `QuickActionsWidgetComponent`, `RecentActivityWidgetComponent`, `CalendarWidgetComponent`, and the generic `ChartWrapperComponent`), composed with new Project-specific widgets (recent/favorite project card grids, a dynamically-computed construction-stage donut chart, a "needs attention" lowest-progress list). This is exactly the "future module" reuse BUILDER-001 was built to support — no second dashboard-kit was built.
2. **Everything else (list, detail, forms) mirrors Super Admin's `organizations`/`builders` CRUD pattern**: page + component-per-concern + list-state service + form-state service + unsaved-changes guard + in-memory mock store, adapted to the construction-project domain. Kept feature-local (not promoted to `shared/`), matching the established convention that each CRUD feature owns its own copy of this pattern rather than sharing one.

**New, purely-additive `shared/ui` infrastructure** (nothing existing was modified, only added to):
- Primitives: `SelectComponent` (`primeng/select`), `CheckboxComponent` (`primeng/checkbox`), `DatePickerComponent` (`primeng/datepicker`) — none existed before; needed for filters, column config, and the project form.
- Composite: `StepperComponent` (`shared/ui/composites/forms/stepper.component.ts`) — a presentation-only step header + Next/Back footer + content-projection body. No wizard/stepper existed anywhere in this codebase before (confirmed by a full-repo search). Per-step form content is owned and switched by `ProjectFormComponent` itself via `@switch` on the active step index, keeping the Stepper generic for any future multi-step flow.

**Mock data / no backend**, identical contract to `OrganizationAdminStoreService`: `ProjectStoreService.create/update/archive/restore/bulkArchive/bulkRestore` genuinely mutate an in-memory `signal<Project[]>` seeded from `MOCK_PROJECTS` (10 records); page refresh resets to seed data. Toasts were added on create/update/archive/restore (`UiToastService`) — a small, deliberate improvement over the organizations precedent's silent-navigation-only feedback.

## 3. Folder structure

```
src/features/builder-portal/projects/
├── projects.routes.ts, index.ts
├── models/project.model.ts          (Project, ProjectFormModel, ProjectListQuery/Result, ProjectSavedView, etc.)
├── config/projects.config.ts        (MOCK_PROJECTS ×10, table columns, saved views, filter/sort options,
│                                      workspace KPIs/quick-actions/activities reusing dashboard.model types)
├── services/
│   ├── project-store.service.ts         (query/getById/create/update/archive/restore/bulk*, org-scoped via
│   │                                      CurrentOrganizationService)
│   ├── project-list-state.service.ts    (search/filters/sort/page/viewMode/selection/columns/savedView/
│   │                                      favorites, sessionStorage-persisted)
│   └── project-form-state.service.ts    (model/dirty/saving/autosave/errors/validate — per-component provided)
├── guards/project-unsaved-changes.guard.ts
├── styles/_projects.scss                (now registered globally, see §1)
├── pages/
│   ├── project-workspace-page.*   ('' — Project Dashboard, reuses BUILDER-001 dashboard-kit)
│   ├── project-list-page.*        ('list' — enterprise grid, card/table toggle)
│   ├── project-create-page.*      ('create' — wizard, canDeactivate)
│   ├── project-edit-page.*        (':id/edit' — wizard, canDeactivate)
│   └── project-detail-page.*      (':id')
└── components/
    ├── shared/   ProjectCard, ProjectHeader, ProjectStatusBadge, ProjectHealthBadge, ProjectAvatar,
    │             ProjectEmptyState, ProjectLoadingState
    ├── list/     ProjectDataGrid (p-table), ProjectCardGrid, ProjectViewToggle, ProjectQuickFilters,
    │             ProjectAdvancedFilters, ProjectColumnSelector, ProjectSavedViews, ProjectBulkActions
    ├── detail/   ProjectOverview, ProjectLocationCard, ProjectTimeline (milestones), ProjectSummaryRow
    │             (Units/Owners/Documents/Handover/Snag/Appointments — placeholder counts only),
    │             ProjectMapPlaceholder, ProjectGalleryPlaceholder
    └── form/     ProjectForm (hosts <app-stepper> across Basics → Location & Timeline → Construction &
                  Health → Review, jumps to the first invalid step on submit)
```

## 4. Routing

`projects.routes.ts` (`PROJECT_ROUTES`), lazy-loaded from `builder-portal.routes.ts` as `{ path: 'projects', loadChildren: () => import('./projects/projects.routes').then(m => m.PROJECT_ROUTES) }`:

| Path | Component | Guard |
|---|---|---|
| `''` | `ProjectWorkspacePageComponent` | — |
| `list` | `ProjectListPageComponent` | — |
| `create` | `ProjectCreatePageComponent` | `projectUnsavedChangesGuard` |
| `:id` | `ProjectDetailPageComponent` | — |
| `:id/edit` | `ProjectEditPageComponent` | `projectUnsavedChangesGuard` |

New `RouteMetadata` constants in `src/core/constants/route-metadata.constants.ts` (`BUILDER_PORTAL_PROJECTS_METADATA`, `..._LIST_METADATA`, `..._PROJECT_CREATE_METADATA`, `..._DETAIL_METADATA`, `..._EDIT_METADATA`), each spreading `BUILDER_PORTAL_METADATA`. Gated by `id-07-project-unit:read` (view) and `:contribute` (create/edit) — per `permission-matrix.registry.ts`, `builder-org-owner`/`builder-org-admin` hold `full`, `builder-org-member` holds `contribute`.

## 5. Components

All standalone, `ChangeDetectionStrategy.OnPush`, Angular 20 signal APIs (`input()`/`output()`/`computed()`), no RxJS, no reactive forms (hand-rolled signal-based form state, matching the `organizations`/`builders`/`iam` precedent).

## 6. Project domain model

See `models/project.model.ts`. `Project` covers identity (name/code/description), organization scope, `ProjectStatus` (reused from `../../models/dashboard.model` — same concept as BUILDER-001's dashboard widget, not redefined), `ConstructionStage` (6-stage pipeline: land-acquisition → foundation → structure → finishing → handover → completed), `ProjectHealth` (on-track/at-risk/delayed), `location`, `milestones` (construction timeline), and `summary: ProjectSummaryCounts` — explicitly placeholder-only counters (units/owners/documents/pending-handovers/open-snags/upcoming-appointments) with no real linked entities, per the "DO NOT IMPLEMENT" scope boundary.

## 7. Dependencies

- `@core/organization-context` — `CurrentOrganizationService` scopes new projects to the active builder organization.
- `@core/rbac` — `HasPermissionDirective`, `AuthorizedButtonComponent` gate Create/Edit actions.
- `@shared/ui` — existing composites/primitives plus this task's additions (`SelectComponent`, `CheckboxComponent`, `DatePickerComponent`, `StepperComponent`).
- `builder-portal/components/*` (BUILDER-001) — dashboard-kit reused by the workspace page (see §2).
- `builder-portal/models/dashboard.model` — `ProjectStatus`, `DashboardActivityItem`, `DashboardQuickActionItem`, `DashboardKpiItem`, `DashboardSummaryItem`, `DashboardChartConfig` reused directly rather than redefined.

**Not touched**: `src/features/super-admin/**`, any existing `shared/ui` file (only additions), any Supabase/API/backend code.

## 8. Future extension points

- Swap `ProjectStoreService`'s in-memory array for a real Supabase-backed repository once the Builder Projects backend domain exists — the service's public method signatures (`query`/`create`/`update`/`archive`/`restore`) are already the right shape for that swap.
- `ProjectSummaryRowComponent`'s six placeholder counts become real cross-links once Units/Owners/Documents/Handover/Snag/Appointments modules exist.
- `ProjectMapPlaceholderComponent`/`ProjectGalleryPlaceholderComponent` are scaffold-only, ready for a map provider and media storage integration respectively.
- The generic `StepperComponent`, `SelectComponent`, `CheckboxComponent`, `DatePickerComponent` added to `shared/ui` in this task are available to any future wizard/filter/form work (Units, Owners, Documents, etc.) without rebuilding them a second time.
- The bulk-actions bar / saved-views selector / column-config picker / card-table view toggle built here are feature-local by design (matching convention); if a fourth CRUD module needs the same toolkit, that's the point to promote them into `shared/ui` rather than duplicating a fourth time.
- The CSS-encapsulation fix (§1) should be applied to Super Admin's `organizations`/`builders` modules too whenever that area is next touched — flagged, not fixed here.

## 9. Verification

- `npm run build` — succeeds, no TypeScript errors (only pre-existing Super Admin SCSS budget warnings).
- `npm run lint` — all files pass (fixed 5 `label-has-associated-control` accessibility errors surfaced by the new `app-select`/`app-checkbox` primitives during development).
- Confirmed via compiled build output (`dist/.../styles-*.css`) that `.proj-*`/`.bp-*` classes are now present as global, unscoped selectors — the encapsulation fix is real, not just theoretical.
- Not yet verified in a running browser session (no dev server was interactively driven in this session) — recommend `npm start` and exercising `/builder-portal/projects` (workspace), `/builder-portal/projects/list` (card↔table, filters, bulk actions), `/builder-portal/projects/create` (wizard), and `/builder-portal/projects/:id` before considering this fully done.
