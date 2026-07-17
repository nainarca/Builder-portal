# UI-IMP-04 — Enterprise Detail Page Experience Implementation Report

| Field | Value |
|---|---|
| **Document ID** | UI-IMP-04 |
| **Batch** | Batch 4 — Enterprise Detail Page Experience |
| **Status** | **COMPLETE** |
| **Date** | 2026-07-17 |
| **Repository** | `my-property-asset-web` |
| **Prerequisite** | UI-IMP-01 … UI-IMP-03 — COMPLETE |
| **Source of truth** | `docs/design/UI_REBIRTH_01_PRODUCT_UX_BLUEPRINT.md` §5, §17, §19 #3/#8, §20 #1; P0.1 §2.7 / §2.8 |
| **Out of scope** | Forms, wizards, settings, list pages, dashboards, APIs, auth/RBAC, routing, services, CRUD logic |

---

## Summary

Batch 4 introduces a reusable **Enterprise Detail** framework (DS-07) and migrates the primary entity detail pages onto it. Two chrome patterns are now explicit and shared:

1. **Tabs** — non-sequential sub-domains (Projects: Overview / Buildings / Units / Documents / Owners)
2. **Stage Tracker** — sequential processes (Handovers: pipeline + expanded current stage; fake “Go to …” header links removed)

Aside width and avatar sizes use layout tokens (`--mpa-layout-aside-width`, `--mpa-avatar-size-*`) so Organization / Builder / Project / Unit details share one proportion system.

**Development build:** passes (`ng build --configuration=development`).

Presentation only — no business logic, API, auth, routing, or service changes.

---

## Reusable Patterns Implemented

| Blueprint rule | Implementation |
|---|---|
| §5 — Unified detail header | `app-enterprise-entity-hero` — title, status chip, facts, stats, one primary + overflow |
| §5 / §20 #1 — Real tabs for Projects | `pattern="tabs"` + Overview / Buildings / Units / Documents / Owners |
| §5 / §20 #1 — Stage Tracker for Handovers | `pattern="stage"` + `app-enterprise-stage-tracker`; workspace links demoted to action panel / overflow |
| §5 — One primary action | Edit (Projects) in hero; secondary/danger in overflow or action panel |
| §11 / §5 — Aside + avatar tokens | Shell aside = `var(--mpa-layout-aside-width)`; avatar rem hardcoded sizes → tokens |
| P0.1 §2.7 — Accessible tabs | Roving tabindex / `aria-selected`; phone uses select switcher |

---

## Components Created

| Deliverable alias | Selector | Role |
|---|---|---|
| EntityHero | `app-enterprise-entity-hero` | Record header |
| EntityStatusBadge | `app-entity-status-badge` | Semantic status chip alias |
| Detail shell | `app-enterprise-detail-shell` | Hero → tabs\|stage → main/aside |
| Detail tabs | `app-enterprise-detail-tabs` | In-page tab strip |
| StageTracker | `app-enterprise-stage-tracker` | Sequential pipeline + expanded stage |
| MetadataGrid | `app-enterprise-metadata-grid` | Fact / description grid |
| RelatedRecords | `app-enterprise-related-records` | Associated records list |
| AttachmentPanel | `app-enterprise-attachment-panel` | Documents / upload placeholder |
| QuickActions / ActionPanel | `app-enterprise-detail-action-panel`, `app-enterprise-quick-actions-panel` | Context + danger zone |
| SectionCard | `app-enterprise-detail-section` | Grouped section chrome |
| Detail loading | `app-enterprise-detail-loading` | Skeleton hero / cards / timeline / related |
| Detail empty | `app-enterprise-detail-empty` | no-related / documents / activity / financial / history |
| Overflow | `app-enterprise-detail-overflow-menu` | Secondary entity actions |

### Reused (not duplicated)

| Need | Existing |
|---|---|
| Summary / Information cards | `app-summary-card`, `app-information-card` (DS-03) |
| Timeline card | Shared `app-timeline-card` + feature workflow timelines |
| Status badge primitive | `app-status-badge` |
| Skeleton primitives | `app-skeleton-card`, `app-skeleton` |
| Empty states | `app-empty-no-data`, `app-empty-no-activity` |

---

## Pages Updated

| Page | Pattern | Key change |
|---|---|---|
| Project detail | **Tabs** | Entity hero + real tabs; buildings strip replaced by Buildings tab |
| Handover detail | **Stage** | Entity hero + stage tracker; six header “Go to” links removed |
| Organization detail | Simple shell | Shared main/aside shell; aside width tokenized |
| Builder detail | Simple shell | Same shell + invite banner in chrome slot |
| Unit detail | Simple shell | Shared main/aside layout |
| Building detail | Simple shell | Metadata grid overview |

**Not redesigned (intentional):** Owner / Document / IAM User / Communication detail (can adopt the same shell next); forms; wizards; settings.

---

## Files Modified

### Added

- `src/shared/ui/enterprise/detail/**` (models + components + `index.ts`)
- `docs/design/IMPLEMENTATION_REPORT_UI_IMP_04.md` (this file)

### Updated — framework export

- `src/shared/ui/enterprise/index.ts` — exports `detail`

### Updated — pages

- `projects/pages/project-detail-page.component.{ts,html}`
- `handovers/pages/handover-detail-page.component.{ts,html}`
- `organizations/pages/organization-detail-page.component.{ts,html}`
- `builders/pages/builder-detail-page.component.{ts,html}`
- `units/pages/unit-detail-page.component.{ts,html}`
- `buildings/pages/building-detail-page.component.{ts,html}`

### Updated — token alignment

- `organizations/styles/_organizations.scss` — aside `20rem` → `--mpa-layout-aside-width`
- `builders/styles/_builders.scss` — same
- `projects/styles/_projects.scss` — aside + avatar sizes → tokens
- `units/styles/_units.scss` — aside → token

### Unchanged (intentionally)

- Stores, list-state, invitation/activation services
- Routes and guards
- Archive/restore confirm + toast handlers (wired to presentation actions only)
- Handover stage workspace routes (still reachable via action panel / overflow)

---

## Accessibility Validation

| Check | Status |
|---|---|
| Entity hero landmark / aria-label | Applied |
| Status never color-only (badge label + icon) | Applied |
| Tablist `role="tablist"` / `aria-selected` / roving tabindex | Applied |
| Mobile tab select labelled | Applied |
| Stage tracker `role="list"` + `aria-current="step"` | Applied |
| Aside `role="complementary"` | Applied |
| Loading `aria-busy` on shell | Applied |
| Empty regions `role="status"` | Applied |
| Overflow menu Escape / outside click | Applied |

---

## Responsive Validation

| Breakpoint | Expected behavior |
|---|---|
| Desktop | Main + sticky aside (`--mpa-layout-aside-width`) |
| Laptop / tablet ≤1024 | Aside stacks below main |
| Phone ≤640 | Tabs → select switcher; stage connectors hide; hero actions wrap |

---

## Performance Observations

- No new chart or table libraries.
- Tab switching is signal-driven local state (no route reload).
- Stage tracker expand uses CSS opacity fade only.
- Related-record tabs reuse summary counts already on the project model — no extra fetches.

---

## Known Limitations

| Item | Notes |
|---|---|
| Project Documents / Owners tabs | Summary + deep-link to workspaces; not full embedded list grids yet |
| Handover stage click | Selects/expands stage in-page; workspace navigation remains via action panel / overflow (routes unchanged) |
| Feature headers (org/unit/builder/building) | Still feature-local chrome inside `detailHero`; progressive replacement with EntityHero is optional follow-on |
| Sticky first-column / master-detail | Master/Detail (P0.1 §2.8) not in this batch |
| Owner / Document detail | Not migrated in this batch |

---

## Remaining Work

| Item | Notes |
|---|---|
| Owner, Document, IAM User, Communication details | Adopt `app-enterprise-detail-shell` |
| Promote more feature headers fully onto EntityHero | Consistency polish |
| Embed list blueprint (§6) inside Project Buildings/Units tabs | When denser in-tab tables are needed |
| UI-IMP-05+ forms/wizards | Out of scope here |

---

## Verification Checklist

- [x] Development build succeeds
- [x] Shared detail package exported from `@shared/ui`
- [x] Project detail uses real tabs (not a single long scroll only)
- [x] Handover detail uses Stage Tracker (fake header links removed)
- [x] One primary action pattern on Project hero (Edit)
- [x] Aside width tokenized across org/builder/project/unit
- [x] Avatar sizes use `--mpa-avatar-size-*` on project avatars
- [x] No forms / wizards / settings redesigned
- [x] No API / auth / routing / service logic changes
- [ ] Manual keyboard pass on tabs + stage tracker
- [ ] Manual mobile tab-select QA
- [ ] Dark-mode / white-label spot check on hero + stage tracker

---

## STOP Boundary Honored

- Forms — not redesigned  
- Wizards — not redesigned  
- Settings — not redesigned  
- Only Enterprise Detail Page Experience completed  
