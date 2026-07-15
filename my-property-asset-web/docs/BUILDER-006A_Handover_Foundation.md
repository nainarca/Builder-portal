# BUILDER-006A — Digital Property Handover Foundation

**Status:** Implemented (code-first, see `BUILDER-001_Builder_Dashboard.md`'s governance note — same basis applies here)
**Date:** 2026-07-15
**Scope:** The reusable workflow/stage engine and the `Handover` record that ties Project+Unit+Owner+Documents together — explicitly **not** the full handover system. Checklist, Inspection, Snag, Appointment, Digital Signature, Certificate, and Acceptance are all named "DO NOT IMPLEMENT" because they are future modules (BUILDER-006B+) that plug into the stage pipeline this task defines.

---

## 1. Two things resolved before implementation

**Route prefix conflict**, same resolution as every prior module: prompt asked for `/builder/handovers/*`; real mount is `/builder-portal`. **Resolved: `/builder-portal/handovers/*`**, added as a new top-level lazy `loadChildren` sibling to `projects`/`owners`/`documents`.

**Only 2 routes, and deliberately no create route** — `/handovers` and `/handovers/:id`, nothing else. Unlike every prior module, this isn't a "combine dashboard+list because fewer routes were named" situation: **handovers genuinely aren't manually created**. A handover is the natural consequence of a unit having an active owner assignment, so `HandoverStoreService` seeds one record per **active** `OwnerAssignment` from BUILDER-004 (7 today) rather than exposing a creation wizard. Dashboard and list still combine into one `HandoverWorkspacePageComponent` at `''`, continuing the resolution pattern BUILDER-003/004/005 established.

## 2. Architecture

**A fixed, ordered stage pipeline is the reusable engine** — `HANDOVER_STAGE_DEFINITIONS` (config, 8 entries): Initiated → Document Verification → Inspection → Snag Resolution → Appointment Scheduling → Digital Signature → Owner Acceptance → Completion. Every `Handover` carries one `HandoverStageStatus` (`completed`/`in-progress`/`upcoming`/`delayed`) per definition, in order. Only the first stage has guaranteed meaning (`initiated` is always `completed` once a handover exists); **stages 3–8 are explicitly inert placeholders** rendered exactly as whatever status is seeded — this is the literal shape of "workflow architecture future modules extend." BUILDER-006B+ will update their own stage's status; this module only visualizes it.

**Two independent status concepts, not one**, the same axis-separation pattern used since BUILDER-003: `currentStageId` (derived — the first non-completed stage) and `overallStatus` (`pending`/`in-progress`/`completed`/`delayed`, seeded per record rather than computed, since a real derivation rule belongs to whichever future module actually drives stage transitions).

**Document Summary is the one genuinely live, read-only cross-module integration** in an otherwise fully mock-seeded record: `DocumentSummaryPanelComponent` calls `DocumentStoreService.getByUnitId()` (built in BUILDER-005) directly, so it reflects whatever documents actually exist for that unit right now — consistent with how Documents' own Owner Visibility panel and Units' assigned-owner lookup were both live reads.

**No archive/restore, no bulk actions, no export, no create wizard** — a deliberate scope reduction: the prompt's own Handover List section names only Grid/Card view, search, filters, sort, pagination, and saved views, never bulk selection or export the way every earlier module's list section did. Handovers are lifecycle records tied 1:1 to an owner assignment, not freely creatable/archivable entities at this stage of the build-out.

**A new, purpose-built `MilestoneTrackerComponent`** (compact horizontal step indicator) rather than repurposing BUILDER-002's `StepperComponent` — that component bundles Back/Next navigation and body-content projection for wizards, which doesn't fit a pure read-only status display. `WorkflowTimelineComponent` (full vertical, detail page) and `MilestoneTrackerComponent` (compact horizontal, workspace/detail header) are the two visual densities of the same underlying `stages` array — the reusable "workflow visualization" pairing the prompt asks future modules to build on.

**Reused BUILDER-001's dashboard-kit a fourth time** (`KpiCardComponent` for the 4 workspace KPIs, `ChartWrapperComponent` donut for the status distribution).

**Two more small, additive back-links**: `ProjectSummaryRowComponent`'s "Pending handovers" count and `UnitSummaryRowComponent`'s "Handover" status now link to `/builder-portal/handovers?projectId=…`/`?unitId=…`, reusing the exact query-param-filter mechanism BUILDER-005 introduced. BUILDER-001's dashboard quick action `qa1` ("Review handovers," routeless since it was written) is finally wired to `/builder-portal/handovers`.

**CSS encapsulation fix applied proactively a fourth time**: `handovers/styles/_handovers.scss` registered globally in `src/styles.scss` before any component was written — confirmed clean on the first build.

**No new `shared/ui` primitives** — reuses `SelectComponent`, the `TableModule`-backed data-grid pattern, `ChartWrapperComponent`/`KpiCardComponent`, everything already on hand.

## 3. Folder structure

```
src/features/builder-portal/handovers/
├── handovers.routes.ts, index.ts
├── models/handover.model.ts        (Handover, HandoverStageDefinition/Status, HandoverActivityItem, etc.)
├── config/handovers.config.ts      (HANDOVER_STAGE_DEFINITIONS ×8, MOCK_HANDOVERS ×7 seeded 1:1 from
│                                     BUILDER-004's active OwnerAssignments — 2 completed, 1 in-progress,
│                                     1 delayed, 3 pending — table columns, saved views, sort options)
├── services/
│   ├── handover-store.service.ts       (query/getById/getByUnitId/getByProjectId; currentStageId() derives
│   │                                     the active stage from the stages array; no mutation methods —
│   │                                     there is nothing to create/update/archive in this foundation)
│   └── handover-list-state.service.ts  (search/filters/sort/page/viewMode/savedView; applyInitialFilter())
├── styles/_handovers.scss           (registered globally in src/styles.scss from the start)
├── pages/
│   ├── handover-workspace-page.*  ('' — KPIs, status donut, recent activity, card/table explorer)
│   └── handover-detail-page.*     (':id' — milestone tracker, summaries, workflow timeline, document
│                                    summary, audit timeline)
└── components/
    ├── shared/     HandoverCard, WorkflowCard (frame), StageBadge (current stage), HandoverStatusBadge
    │               (overall status), HandoverEmptyState, HandoverLoadingState
    ├── explorer/   HandoverDataGrid (p-table, no selection/bulk actions), HandoverCardGrid, ViewToggle,
    │               QuickFilters, AdvancedFilters, SavedViews
    ├── workflow/   WorkflowTimeline (full vertical), MilestoneTracker (compact horizontal), ProgressCard,
    │               TimelineCard (generic activity/audit list — used for both dashboard "Recent activity"
    │               and detail-page "Audit timeline", no separate wrapper needed for the latter)
    └── detail/     HandoverOverview (Project/Unit/Owner summary panels), DocumentSummaryPanel (live read,
                     see §2)
```

## 4. Routing

`handovers.routes.ts` (`HANDOVER_ROUTES`), lazy-loaded as a new top-level sibling of `projects`/`owners`/`documents`:

| Path | Component |
|---|---|
| `''` | `HandoverWorkspacePageComponent` |
| `:id` | `HandoverDetailPageComponent` |

New `RouteMetadata` constants spreading `BUILDER_PORTAL_METADATA`, gated by `id-09-handover-document:read` — the same resource Documents already uses (handovers and handover-documents share one permission concept in the platform's own RBAC matrix). A `ba-handovers` nav entry was added.

## 5. Workflow architecture (the reusable part)

`HANDOVER_STAGE_DEFINITIONS` is the single source of truth for stage order/labels/descriptions — every rendering component (`WorkflowTimelineComponent`, `MilestoneTrackerComponent`, `StageBadgeComponent`) looks stage metadata up from this one config array by `stageId`, never hard-codes stage labels itself. A future module adding real Inspection logic, for example, only needs to: (1) update the relevant `HandoverStageStatus.status` for a handover's `inspection` entry, and (2) add its own feature-specific detail behind that stage — the timeline/tracker/badges already render whatever status is there correctly, with zero changes to this module's code. This is the concrete mechanism behind "build a reusable enterprise workflow engine that future modules extend."

## 6. Dependencies

- `@shared/ui` — no additions; reuses `SelectComponent`, `TableModule` patterns already established.
- `builder-portal/components/cards`, `builder-portal/components/charts`, `builder-portal/models/dashboard.model` (BUILDER-001) — the fourth consumer of this dashboard-kit.
- `builder-portal/projects/services/project-store.service.ts` — read-only project list for the advanced-filter dropdown.
- `builder-portal/documents/services/document-store.service.ts` — read-only `getByUnitId()` for the live Document Summary panel.
- `builder-portal/owners/**`, `builder-portal/projects/units/**` — the seed source (`OwnerAssignment`) is read once at config-authoring time into `MOCK_HANDOVERS`; no runtime dependency on `OwnerStoreService`/`UnitStoreService` exists in this module's services (kept intentionally simple since this is a foundation, not a live-sync system).

**Not touched**: `src/features/super-admin/**`, any Supabase/API/backend code. Within Projects/Units, only the two additive query-param back-links named in §2 were touched.

## 7. Extension points

- BUILDER-006B (Inspection), 006C (Snag), 006D (Appointment), 006E (Digital Signature), 006F (Owner Acceptance/Completion) — each should update its own `HandoverStageStatus` entry via a new `HandoverStoreService` method (e.g., `updateStageStatus(handoverId, stageId, status)` — deliberately not built yet, since no future module exists to call it) and add its own dedicated detail-page section, without needing to touch `WorkflowTimelineComponent`/`MilestoneTrackerComponent`.
- `HandoverStoreService` currently has zero mutation methods (query/read only) — this is correct for a "foundation" but the very first thing BUILDER-006B should add is the stage-transition method described above.
- The Flutter Owner Mobile App would read a `Handover`'s current stage and overall progress directly off this same model to show the owner "where their handover stands" — the model was kept auth- and role-agnostic for exactly this reuse.
- `overallStatus`/`overallProgress` are seeded per mock record today; once real stage-transition logic exists (BUILDER-006B+), these should become computed (derived from `stages`) rather than stored — flagged here so a future session doesn't have to rediscover it.

## 8. Verification

- `npm run build` — succeeds, no TypeScript errors (fixed one `NG8113` unused-import warning: `DatePipe` imported but unused in `HandoverDataGridComponent`, removed). No new bundle-budget issues — the 2.4MB ceiling BUILDER-005 set still has headroom (actual: 2.13MB).
- `npm run lint` — all files pass.
- Confirmed via compiled build output (`dist/.../styles-*.css`) that `.handover-card` and other `.handover-*`/`.workflow-*`/`.milestone-tracker__*` classes are present as plain, unscoped selectors — the CSS-encapsulation fix held clean a fourth time.
- Not yet verified in a running browser session — recommend `npm start` and exercising `/builder-portal/handovers` (KPIs, status donut, card↔table toggle, filters), and `/builder-portal/handovers/:id` for a completed handover (`handover-001`, Rohan Mehta/unit-001), a delayed one (`handover-004`, Meera Pillai/unit-011), and an early one (`handover-007`, Arjun Malhotra/unit-012) to see the workflow timeline in three different states, plus the new Project/Unit back-links and the dashboard's "Review handovers" quick action.
