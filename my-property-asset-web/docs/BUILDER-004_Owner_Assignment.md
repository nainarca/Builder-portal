# BUILDER-004 — Owner Assignment & Customer Management Foundation

**Status:** Implemented (code-first, see `BUILDER-001_Builder_Dashboard.md`'s governance note — same basis applies here)
**Date:** 2026-07-15
**Scope:** Customer/CRM domain for the Builder Portal — a flat, cross-project owner registry, unit assignment, and pre-activation invitation lifecycle. No authentication user creation, no owner login, no Flutter API, no real invitation email delivery, no document upload, no digital handover, no snag management.

---

## 1. Two things resolved before implementation (same categories as BUILDER-002/003)

**Route prefix conflict**, same resolution as every prior module: prompt asked for `/builder/owners/*`; real mount is `/builder-portal`. **Resolved: `/builder-portal/owners/*`**, added as a new top-level lazy `loadChildren` sibling to `projects` in `BUILDER_PORTAL_ROUTES` — Owners is a flat, cross-project CRM registry (matching its Salesforce/HubSpot reference framing and its flat `/builder/owners/:id` route shape), not nested under Projects/Units the way Units was genuinely project-scoped.

**Only 4 routes requested**, same pattern as BUILDER-003: no separate list path. **Resolved: the Owner Dashboard (assignment/invitation summary, pending/activated counts, recent assignments) and the Owner Assignment List (enterprise grid) are combined into one `OwnerWorkspacePageComponent`** at `''`. `assign` is its own dedicated route — an assignment wizard, not a generic "create," reflecting the domain language that you assign an owner to a unit rather than create a customer record in isolation.

## 2. Architecture

**Two related entities, not one CRUD table.** `Owner` (customer identity — name/email/phone/address/`activationStatus`) is completely decoupled from `AuthUser` and never creates one, per the prompt's explicit business rule: owner accounts only exist after invitation acceptance, which is itself a future module. `OwnerAssignment` is the separate unit-linkage entity, carrying an embedded `Invitation` (`pending → accepted/expired/cancelled`, with `resendCount`/`remindersSent` counters). Both live in one `OwnerStoreService`, joined into an `OwnerListItem` (`{ owner, assignment? }`) for the grid — a relationship-centric list rather than a flat table of owner fields, matching the prompt's explicit "not a simple CRUD module" framing.

**No Unit/Project mutation.** Assigning an owner never writes to `UnitStoreService` or `ProjectStoreService` — both stay exactly as BUILDER-002/003 left them. The only integration is read-only lookups (unit/project names for display, an available-units query for the assignment wizard) plus one small additive enhancement: `UnitSummaryRowComponent` gained optional `ownerName`/`ownerId` inputs — when an assignment exists for a unit, its Detail page (which now injects `OwnerStoreService`) passes the real owner name as a `routerLink` to their profile, replacing the previous plain "Assigned"/"Unassigned" text. Same category of change as BUILDER-003's Project Detail back-link — additive, not a redesign of the consuming component.

**Reused BUILDER-001's dashboard-kit a second time**: `KpiCardComponent` for the 4 workspace KPIs and `ChartWrapperComponent` (donut) for the invitation-status breakdown — the same components BUILDER-002's Project Workspace already consumed, confirming the kit generalizes across a third, unrelated domain.

**Reused BUILDER-002/003's CRUD-module pattern mechanically** for list/detail/form (list-state/form-state services, `UiDialogService.confirm()`, toasts on every mutation). No new `shared/ui` primitives were needed — `SelectComponent`, `CheckboxComponent`, `InputTextComponent`, `StepperComponent` (all from BUILDER-002) and `ModalShellComponent` (existed since before BUILDER-002, first real use in this series) covered every need.

**Reassign / Remove assignment are dialog-driven, not routes** — the routing spec only lists 4 paths. "Reassign" opens `app-modal-shell` with a project→unit cascading select (marks the old assignment `reassigned`, creates a new `active` one via the same `createAssignment` path); "Remove assignment" is a `UiDialogService.confirm()` call (marks `removed`, resets the owner's `activationStatus` to `not-invited`). Resend/Cancel invitation and Send reminder are real mock-state mutations (increment `resendCount`/`remindersSent`, extend `expiresAt`, or set `status: 'cancelled'`) — the same "real within the mock sandbox" treatment BUILDER-002/003 gave archive/restore, not an inert placeholder button.

**CSS encapsulation lesson applied from the start a second time**: `owners/styles/_owners.scss` was registered globally in `src/styles.scss` before any component was written. Confirmed clean on the first build — no fixup pass, no new SCSS budget warnings.

**Navigation and dashboard integration**: added `ba-owners` to `BUILDER_PORTAL_NAVIGATION`, gated by the already-existing `id-08-owner-assignment-prospect:read` permission (no new RBAC resource needed — confirmed present in `permission-matrix.registry.ts` from the platform's original permission matrix). Wired BUILDER-001's dashboard quick action `qa3` ("Manage owners," previously routeless with a "coming soon" description) to `/builder-portal/owners`, the same pattern BUILDER-002 used for `qa2` ("View projects").

## 3. Folder structure

```
src/features/builder-portal/owners/
├── owners.routes.ts, index.ts
├── models/owner.model.ts          (Owner, OwnerAssignment, Invitation, OwnerListItem, OwnerAssignmentFormModel, etc.)
├── config/owners.config.ts        (MOCK_OWNERS ×10, MOCK_ASSIGNMENTS ×8 seeded against real Unit ids from
│                                    proj-001/proj-002, table columns, saved views, filter/sort options)
├── services/
│   ├── owner-store.service.ts             (owners+assignments signals; query/getById/create/update/archive/
│   │                                        restore/bulk*; createAssignment/reassign/removeAssignment;
│   │                                        resendInvitation/cancelInvitation/sendReminder; getAvailableUnits())
│   ├── owner-list-state.service.ts        (search/filters/sort/page/viewMode/selection/columns/savedView)
│   ├── owner-form-state.service.ts        (profile edit — mirrors ProjectFormStateService/UnitFormStateService)
│   └── owner-assignment-form-state.service.ts  (assignment wizard — owner-mode/project/unit/notes validation)
├── guards/owner-unsaved-changes.guard.ts  (checks either form-state service, whichever is active)
├── styles/_owners.scss                    (registered globally in src/styles.scss from the start)
├── pages/
│   ├── owner-workspace-page.*  ('' — combined dashboard + enterprise grid)
│   ├── owner-assign-page.*     ('assign' — wizard, canDeactivate)
│   ├── owner-edit-page.*       (':id/edit' — profile-only edit, canDeactivate)
│   └── owner-detail-page.*     (':id' — profile, invitation center, reassign/remove dialogs)
└── components/
    ├── shared/     OwnerCard, CustomerAvatar (initials-based), AssignmentCard, InvitationBadge,
    │               OwnerStatusBadge (activation status), CustomerHeader, OwnerEmptyState, OwnerLoadingState
    ├── list/       OwnerDataGrid, OwnerCardGrid, OwnerViewToggle, OwnerQuickFilters, OwnerAdvancedFilters,
    │               OwnerColumnSelector, OwnerSavedViews, OwnerBulkActions
    ├── workspace/  AssignmentSummaryWidget (list-style breakdown, reused for the Assignment Summary section),
    │               RecentAssignmentsWidget
    ├── detail/     OwnerOverview (contact info + assigned unit/project), CustomerTimeline (activity),
    │               InvitationCenter (status/preview/resend/reminder/cancel), OwnerDocumentPlaceholder,
    │               OwnerHandoverPlaceholder
    └── form/       OwnerProfileForm (flat form, no wizard — profile fields only),
                     OwnerAssignmentWizard (hosts <app-stepper>: Owner → Unit → Invitation preview → Review)
```

## 4. Routing

`owners.routes.ts` (`OWNER_ROUTES`), lazy-loaded as a new top-level sibling of `projects` in `builder-portal.routes.ts`:

| Path | Component | Guard |
|---|---|---|
| `''` | `OwnerWorkspacePageComponent` | — |
| `assign` | `OwnerAssignPageComponent` | `ownerUnsavedChangesGuard` |
| `:id` | `OwnerDetailPageComponent` | — |
| `:id/edit` | `OwnerEditPageComponent` | `ownerUnsavedChangesGuard` |

New `RouteMetadata` constants in `route-metadata.constants.ts` (`BUILDER_PORTAL_OWNERS_METADATA`, `..._OWNER_ASSIGN_METADATA`, `..._OWNER_DETAIL_METADATA`, `..._OWNER_EDIT_METADATA`), spreading `BUILDER_PORTAL_METADATA`, gated by `id-08-owner-assignment-prospect` (`:read` view, `:contribute`/`:full` assign/edit).

## 5. Components

All standalone, `ChangeDetectionStrategy.OnPush`, Angular 20 signal APIs, no RxJS in components beyond the standard `toSignal(route.paramMap...)` reads, no reactive forms.

## 6. Owner Assignment domain model

See `models/owner.model.ts`. `Owner` covers identity and contact info plus `activationStatus: 'not-invited' | 'invited' | 'activated'` — a status that only this module ever writes, and only in response to assignment/invitation lifecycle events (never in response to a real login, since no auth integration exists here). `OwnerAssignment` links a specific `unitId`/`projectId` to an owner, carrying `status: 'active' | 'reassigned' | 'removed'` and an embedded `Invitation` (`status: 'not-sent' | 'pending' | 'accepted' | 'expired' | 'cancelled'`, `resendCount`, `remindersSent`) plus a per-assignment `activity` timeline. Mock data: 10 owners (7 with an active assignment across varied invitation states — 2 pending, 3 accepted, 1 expired, 1 cancelled; 1 with a `removed` historical assignment; 2 pure prospects with no assignment at all), seeded against real `Unit` records from `proj-001`/`proj-002` (the only projects BUILDER-003 seeded units for).

## 7. Dependencies

- `@core/rbac` — `HasPermissionDirective` gates the Edit-profile action, reusing the already-defined `id-08-owner-assignment-prospect` resource.
- `@shared/ui` — no additions this task; reuses everything BUILDER-002 added plus `ModalShellComponent` (its first real consumer in this series) for the Reassign dialog.
- `builder-portal/components/cards`, `builder-portal/components/charts`, `builder-portal/models/dashboard.model` (BUILDER-001) — `KpiCardComponent`/`ChartWrapperComponent`/`DashboardKpiItem`/`DashboardChartConfig` reused directly, the third consumer of this dashboard-kit after BUILDER-002's and this module's own workspace.
- `builder-portal/projects/services/project-store.service.ts`, `builder-portal/projects/units/services/unit-store.service.ts` — read-only lookups for project/unit names and the available-units query; never mutated.
- `builder-portal/projects/styles/_projects.scss` — `.proj-placeholder-panel` reused verbatim for `OwnerDocumentPlaceholderComponent`/`OwnerHandoverPlaceholderComponent`.

**Not touched**: `src/features/super-admin/**`, any Supabase/API/backend code, any real authentication flow. Within `builder-portal/projects/units/`, only the additive `UnitSummaryRowComponent` enhancement and its one consuming page were touched (§2) — no other Unit file's behavior changed.

## 8. Future extension points

- Swap `OwnerStoreService`'s in-memory arrays for a real Supabase-backed repository once a backend domain exists — `createAssignment`/`reassign`/`removeAssignment`/`resendInvitation`/`cancelInvitation`/`sendReminder` are already the right method shapes for that swap.
- The activation boundary this module stops at (`Invitation.status === 'accepted'`) is exactly where a future Invitation/Activation module would take over — creating the real Supabase auth user and flipping `Owner.activationStatus` to `'activated'` for real, rather than as a mock-store side effect.
- `OwnerDocumentPlaceholderComponent`/`OwnerHandoverPlaceholderComponent` are scaffold-only, ready for real document storage and the digital handover workflow respectively.
- The Flutter Owner Mobile App (named explicitly in the prompt's Objective) would consume the same `Owner`/`OwnerAssignment` shape once a real backend exists — the model was deliberately kept auth-agnostic for exactly this reuse.
- `InvitationCenterComponent`'s "preview" is a static templated string today; a real email-template system would replace just that panel, not the surrounding resend/reminder/cancel action wiring.

## 9. Verification

- `npm run build` — succeeds, no TypeScript errors (only the same pre-existing Super Admin SCSS budget warnings BUILDER-001/002/003 already produce; no new warnings from this module).
- `npm run lint` — all files pass (fixed one `@angular-eslint/no-output-native` error during development: `InvitationCenterComponent`'s `cancel` output collided with the native DOM `cancel` event, renamed to `cancelInvitation`).
- Confirmed via compiled build output (`dist/.../styles-*.css`) that `.owner-card` and other `.owner-*`/`.customer-*`/`.assignment-*`/`.invitation-*` classes are present as plain, unscoped selectors — the CSS-encapsulation fix held clean on the first build again.
- Not yet verified in a running browser session — recommend `npm start` and exercising `/builder-portal/owners` (workspace: KPI row, invitation-status donut, assignment summary, recent assignments, card↔table toggle, filters, bulk archive), `/builder-portal/owners/assign` (wizard: new/existing owner → project/unit cascading select → invitation preview → review), `/builder-portal/owners/:id` (profile, invitation resend/reminder/cancel, reassign/remove dialogs), the new `ba-owners` nav item, the dashboard's "Manage owners" quick action, and a Unit Detail page for `unit-002`/`unit-001`/etc. to confirm the new owner-name back-link.
