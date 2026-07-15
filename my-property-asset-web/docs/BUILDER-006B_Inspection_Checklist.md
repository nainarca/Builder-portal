# BUILDER-006B — Inspection & Handover Checklist Workflow

**Status:** Implemented (code-first, see `BUILDER-001_Builder_Dashboard.md`'s governance note — same basis applies here)
**Date:** 2026-07-15
**Scope:** The Inspection/Checklist sub-workflow nested under a specific handover's `inspection` stage — construction/electrical/plumbing/civil/safety checklists, mandatory/optional item tracking, inspector notes, and a computed readiness (Go/No-Go) summary. Snag Management, Digital Signatures, Owner Acceptance, and Certificate Generation are all named "DO NOT IMPLEMENT" because they are future modules (BUILDER-006C+).

---

## 1. Two things resolved before implementation

**Route prefix + param name**, same resolution basis as every prior module: prompt asked for `/builder/handovers/:handoverId/inspection` + `/builder/handovers/:handoverId/checklist`. Real mount is `/builder-portal`, and BUILDER-006A's existing handover-detail route already uses the param name `:id`, not `:handoverId` — resolved to `/builder-portal/handovers/:id/inspection` and `/builder-portal/handovers/:id/checklist`. Added as two new flat sibling entries in the existing `HANDOVER_ROUTES` array (lazy via `loadComponent`), not as `children` under the existing `:id` leaf route — that route has no router-outlet today and converting it would touch working BUILDER-006A code. Angular's default `pathMatch: 'prefix'` on a childless leaf route means `:id` (1 segment) and `:id/inspection`/`:id/checklist` (2 segments) never collide.

**Route-count vs. feature-list tension, resolved the established way**: the prompt's IMPLEMENT section reads like a single sprawling feature (Inspection Dashboard + Checklist Templates + Execution + Results + Readiness Summary), but ROUTING names only 2 paths. Read the routing section as authoritative (same rule since BUILDER-003/004): **`/inspection` = per-handover overview** (KPI stats, readiness card, one `InspectionCard` per checklist category, recent activity, quick actions) and **`/checklist` = the single execution page**, containing all categories as collapsible sections with their items, inspector notes, and an attachments placeholder. A category-scoped deep link from the overview page uses `?category=construction`, read once in the checklist page's constructor to scroll to that category — reusing the query-param-filter mechanism BUILDER-005/006A introduced.

## 2. Architecture

**Config vs. instance, same pattern as `HANDOVER_STAGE_DEFINITIONS`**: `INSPECTION_CATEGORY_DEFINITIONS` (5 entries — Construction/Electrical/Plumbing/Civil/Safety, each a template with section/item blueprints; `custom` is structurally supported by the type but has no default template and is not seeded) is the "Template Library"; `MOCK_INSPECTIONS` instantiates one `Inspection` per (handover × category) = 35 records, varied per handover's existing BUILDER-006A demo state so all 5 result values (Passed / Passed with Remarks / Failed / Pending / Blocked) appear somewhere in the mock set — `handover-003` (genuinely mid-inspection) alone demonstrates 4 of them across its 5 categories.

**Real mutations, not placeholders**: item status/remarks toggling and inspector notes are the module's core interactive purpose (the prompt's own business rule — "a handover cannot proceed until mandatory inspections and checklist items are completed"), so `InspectionStoreService.updateItemStatus()`/`updateInspectorNotes()` are genuine `signal.update()` mutations, matching the established "real within the mock sandbox" rule. Only **Attachments** stays a static placeholder (explicitly future scope, same treatment as Documents' `PreviewPlaceholderComponent`).

**Closes BUILDER-006A's own flagged gap**: `HandoverStoreService` gains its first real mutation method, `updateStageStatus(handoverId, stageId, status)`, and `overallStatus`/`overallProgress` are now recomputed from the full `stages` array after any stage update — exactly what 006A's own extension-points section said should happen first. `InspectionStoreService` calls it after every item mutation: any inspection `failed`/`blocked` → `inspection` stage `delayed`; all mandatory categories `passed`/`passed-with-remarks` → `completed`; otherwise → `in-progress`. This is the one piece of "business logic" implemented, and it's the literal mechanism the prompt's own readiness rule requires — everything genuinely out of scope (Snag/Signature/Acceptance/Certificate) is untouched.

**`HandoverReadiness` is computed, never stored** — `ReadinessService.getReadiness(handoverId)` derives Documents Ready (from `DocumentStoreService.getByUnitId()`), Owner Assigned (from `OwnerStoreService.getAssignmentByUnitId()`), Checklist Status and Inspection Status (from `InspectionStoreService` + the handover's own `inspection` stage), and an Overall Readiness / Go-No-Go verdict — applying the lesson 006A flagged about `overallStatus` originally being seeded when it should have been derived.

**New `TextareaComponent` primitive** (`shared/ui/primitives/textarea/`) — confirmed no wrapped textarea existed anywhere in `shared/ui` (only `InputTextComponent` for single-line). Built to the same shape as `InputTextComponent` (signal-based value/rows/placeholder/disabled inputs, no ControlValueAccessor), wrapping PrimeNG's `Textarea` directive (`primeng/textarea`), registered in `primitives/index.ts`.

**New feature-local `ChecklistSectionComponent`** (collapsible) — confirmed no Accordion/Panel composite exists in `shared/ui` to reuse. Built as a lightweight signal-based expand/collapse, kept local to `handovers/inspection/components/`, consistent with `WorkflowCardComponent`/`FormSectionComponent` both being local, non-promoted section wrappers elsewhere in this codebase.

**Reuse over new-build wherever an equivalent exists**: `KpiCardComponent` (dashboard-kit, 5th consumer) for stats; `ProgressCardComponent`'s `.progress-card__bar`/`.progress-card__bar-fill` classes for completion bars (reused directly on `InspectionCardComponent`, not re-implemented); `TimelineCardComponent` for recent activity; `WorkflowCardComponent` as the frame around each checklist category. New: `InspectionCard`, `InspectionStatusBadge` (a distinct 5-value status set from `HandoverStatusBadgeComponent`'s 4-value one), `ReadinessCard` (Go/No-Go).

**CSS fix applied proactively a fifth time, following the established per-partial convention**: new `handovers/inspection/styles/_inspection.scss`, registered as its own top-level `@use` line in `src/styles.scss` — matching the actual precedent (Units, nested under Projects in routing, still got its own top-level line rather than being chained through `_projects.scss`), so Inspection follows the same rule despite being nested under Handovers. Confirmed clean on the first build via compiled CSS grep.

**No CanDeactivate guard** — checklist mutations save immediately per-toggle (like Documents' approve/reject, Owners' cancel-invitation), not a multi-field draft-then-save form.

**No new nav entry, no new RBAC resource** — Inspection/Checklist is reached only via the handover detail page (same "nested domains don't get top-level nav" rule Units already established), and reuses the existing `id-09-handover-document` permission resource for both new route-metadata constants.

**One additive touch to existing BUILDER-006A code**: `handover-detail-page.component.html` gained a "Go to Inspection & Checklist" link near the header, and a `ReadinessCard` was surfaced in its aside column next to the existing progress card — everything else on that page is unchanged.

## 3. Folder structure

```
src/features/builder-portal/handovers/inspection/
├── models/inspection.model.ts       (InspectionCategory, ChecklistItem/Section, Inspection, HandoverReadiness)
├── config/inspection.config.ts      (INSPECTION_CATEGORY_DEFINITIONS ×5 template blueprints, MOCK_INSPECTIONS ×35)
├── services/
│   ├── inspection.util.ts              (deriveInspectionResult — pure function, shared by config seeding and
│   │                                     the store's mutation recompute)
│   ├── inspection-store.service.ts     (getByHandoverId/getById, updateItemStatus(), updateInspectorNotes()
│   │                                     — real mutations, calls handoverStore.updateStageStatus() after each)
│   └── readiness.service.ts            (getReadiness(handoverId) — pure computed read, no stored state)
├── styles/_inspection.scss          (registered globally, own top-level line)
├── pages/
│   ├── inspection-overview-page.*   (:id/inspection — KPIs, readiness card, category grid, activity)
│   └── checklist-execution-page.*   (:id/checklist — collapsible category sections, items, notes, attachments)
└── components/
    ├── shared/    InspectionCard, InspectionStatusBadge, InspectionEmptyState, InspectionLoadingState
    ├── overview/  ReadinessCard (Go/No-Go), InspectionCategoryGrid
    └── checklist/ ChecklistSectionComponent (collapsible), ChecklistItemComponent (mandatory/optional
                   indicator, pass/fail/n-a control + remarks), InspectorNotesPanel (uses new TextareaComponent),
                   AttachmentsPlaceholder (static, mirrors Documents' PreviewPlaceholderComponent pattern)
```

`HandoverStoreService` (BUILDER-006A) gained one new method (`updateStageStatus`) plus internal recomputation of `overallStatus`/`overallProgress` — no new file, edited in place.

## 4. Routing

Two new sibling entries appended to the existing `HANDOVER_ROUTES` array in `handovers.routes.ts` (additive — existing `''` and `':id'` entries untouched):

| Path | Component | Load |
|---|---|---|
| `:id/inspection` | `InspectionOverviewPageComponent` | `loadComponent` |
| `:id/checklist` | `ChecklistExecutionPageComponent` | `loadComponent` |

New `RouteMetadata` constants spreading `BUILDER_PORTAL_HANDOVER_DETAIL_METADATA`: `BUILDER_PORTAL_HANDOVER_INSPECTION_METADATA` (title "Inspection"), `BUILDER_PORTAL_HANDOVER_CHECKLIST_METADATA` (title "Checklist") — both keep the `id-09-handover-document:read` permission.

## 5. Workflow architecture (how this ties into BUILDER-006A's engine)

Each of the 5 checklist categories maps to one `Inspection` record scoped to a handover. When any checklist item's status changes, `InspectionStoreService` recomputes that category's `result`/`completionPercent` (via the shared `deriveInspectionResult` pure function), then re-evaluates the handover's `inspection` stage across all of that handover's categories and calls `HandoverStoreService.updateStageStatus()`. That method updates the specific stage entry and recomputes the handover's `overallStatus`/`overallProgress` from the complete stage array — the exact extension point BUILDER-006A's own docs called out as "the very first thing BUILDER-006B should add." A future BUILDER-006C (Snag) would follow the identical pattern for the `snag-resolution` stage.

## 6. Dependencies

- `@shared/ui` — one addition: `TextareaComponent` primitive (Inspector Notes).
- `builder-portal/components/cards`, `builder-portal/models/dashboard.model` (BUILDER-001) — the 5th consumer of the dashboard-kit (`KpiCardComponent`).
- `handovers/services/handover-store.service.ts` (BUILDER-006A) — edited in place to add `updateStageStatus`.
- `handovers/components/workflow` (BUILDER-006A) — `TimelineCardComponent` reused for recent activity; `handovers/components/shared` — `WorkflowCardComponent` reused as the category frame.
- `documents/services/document-store.service.ts` (BUILDER-005) — read-only `getByUnitId()` for Documents Ready in `ReadinessService`.
- `owners/services/owner-store.service.ts` (BUILDER-004) — read-only `getAssignmentByUnitId()` for Owner Assigned in `ReadinessService`.

**Not touched**: `src/features/super-admin/**`, any Supabase/API/backend code. Within Handovers, only the additive header link + `ReadinessCard` insertion on the existing detail page were touched.

## 7. Extension points

- BUILDER-006C (Snag), 006D (Appointment), 006E (Digital Signature), 006F (Owner Acceptance/Completion) — each should follow the pattern established here: its own store method that mutates its own domain data, then a call to `HandoverStoreService.updateStageStatus()` for its own stage. `HandoverStoreService` now has one real mutation method as a template for the rest.
- `InspectionStoreService` doesn't yet expose a way to manually mark an inspection `blocked` (it's only a seeded demo state today) — a future module dealing with external blockers (e.g. utility connection pending) could add that as a real mutation.
- The Owner Mobile App would read `ReadinessService.getReadiness()`'s output directly to show an owner "how close their unit is to handover" — kept auth- and role-agnostic for exactly this reuse, same reasoning as 006A's `Handover` model.
- `custom` is a structurally supported `InspectionCategory` with no seeded template — a future "Custom Checklist" builder UI could let a builder admin define one, but that's a real CRUD feature, not part of this foundation.

## 8. Verification

- `npm run build` — succeeds, no TypeScript errors. Initial bundle: 2.14 MB (within the 2.4 MB ceiling BUILDER-005 set, comfortable headroom remains).
- `npm run lint` — all files pass.
- Confirmed via compiled build output (`dist/.../styles-*.css`) that `.insp-card`, `.checklist-item`, `.checklist-section__header`, `.readiness-card__banner` and other new classes are present as plain, unscoped selectors — the CSS-encapsulation fix held clean a fifth time.
- `ng serve` confirmed reachable (HTTP 200) for `/builder-portal/handovers/handover-003/inspection`, `/builder-portal/handovers/handover-004/checklist?category=electrical`, and `/builder-portal/handovers/handover-001`. Interactive behavior (toggling a checklist item and confirming the handover's `inspection` stage/`overallStatus` updates live, and the query-param deep-link scroll) was not exercised in an actual browser session in this pass — recommend `npm start` and manually verifying: `handover-001` (all categories passed, readiness = Ready/Go), `handover-003` (mixed states — Construction passed, Electrical partial, Plumbing blocked, Civil failed, Safety not started) with a live item toggle, and `handover-004`'s checklist with `?category=electrical` to confirm the scroll-to-category deep link.
