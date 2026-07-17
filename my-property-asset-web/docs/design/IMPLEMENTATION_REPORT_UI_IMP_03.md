# UI-IMP-03 — Enterprise List Page Experience Implementation Report

| Field | Value |
|---|---|
| **Document ID** | UI-IMP-03 |
| **Batch** | Batch 3 — Enterprise List Page Experience |
| **Status** | **COMPLETE** |
| **Date** | 2026-07-17 |
| **Repository** | `my-property-asset-web` |
| **Prerequisite** | UI-IMP-01 (Foundation & Navigation), UI-IMP-02 (Dashboard Experience) — COMPLETE |
| **Source of truth** | `docs/design/UI_REBIRTH_01_PRODUCT_UX_BLUEPRINT.md` §4, §6, §17, §19 #1, §20 #4–5 |
| **Out of scope** | Detail pages, forms, dashboards, APIs, auth/RBAC, routing, services, search/filter business logic, Supabase |

---

## Summary

Batch 3 standardizes list pages on one reusable enterprise list framework (DS-05). Every migrated module now shares the same interaction model: **one primary action in the page header**, secondary actions in **overflow**, **filter chips** with clear-all, **bulk bar** replacing the toolbar when selection &gt; 0, and an explicit **portfolio vs directory** view-mode policy.

**Development build:** passes (`ng build --configuration=development`).

No business logic, API calls, auth, routing, or data models were changed — presentation wiring only.

---

## Enterprise Patterns Implemented

| Blueprint rule | Implementation |
|---|---|
| §6 / §20 #5 — Exactly one primary action | Create / Assign / Create user live in `app-enterprise-list-page-header` only |
| §6 — Import / Advanced filters demoted | Moved to `secondaryActions` → overflow menu |
| §6 / §20 #4 — View-mode policy | Portfolio (Projects, Units): table/card toggle. Directory (Orgs, Builders, Users, Owners): table-only. Buildings: card grid on shared shell (no data-grid yet) |
| §6 — Filter chips visible | `filterChips` + `app-enterprise-table-filter-bar` on all migrated pages |
| §6 — Bulk replaces toolbar | Existing DS-05 shell behavior retained when `selectedCount > 0` |
| §17 — View fade | Shell body cross-fade on view/content change |

### Documented view-mode policy (intentional)

| Entity type | Policy | Pages |
|---|---|---|
| Portfolio (visual identity) | Table + card toggle | Projects, Units |
| Directory (names/metadata) | Table only | Organizations, Builders, Users, Owners |
| Portfolio card-first (no table grid yet) | Card on shared shell | Buildings |

Organizations remaining table-only is **intentional** per blueprint §6 / §20 #4 — not a gap to fill by copying Projects.

---

## Reusable Components

### Created (this batch)

| Component / util | Selector / export | Role |
|---|---|---|
| List Page Header | `app-enterprise-list-page-header` | Title, description, breadcrumb/actions slots; one primary action |
| Overflow Menu | `app-enterprise-table-overflow-menu` | Secondary actions (Import, Advanced filters, …) |
| Filter chip helpers | `filterChip`, `collectFilterChips`, `showViewToggleForPolicy` | Presentation chip mapping + view policy |

### Reused (DS-05 — not duplicated)

| Deliverable alias | Existing component |
|---|---|
| EnterprisePageHeader | `EnterpriseListPageHeaderComponent` (new thin alias over form page header) |
| EnterpriseToolbar | `EnterpriseTableToolbarComponent` |
| EnterpriseDataTable | `EnterpriseDataTableShellComponent` + `EnterpriseTableGridComponent` |
| EnterpriseFilterPanel | `EnterpriseTableAdvancedFiltersComponent` + module advanced-filter panels |
| EnterpriseEmptyState | `EnterpriseTableEmptyComponent` (+ shared empty states) |
| BulkActionToolbar | `EnterpriseTableBulkActionsComponent` |
| StatusBadge | `EnterpriseTableStatusCellComponent` / module status badges |

### Framework updates

| File | Change |
|---|---|
| `data-table-shell.component.ts` | `secondaryActions`, `filterChips`, `resultSummary` wiring; view fade |
| `table-toolbar.component.ts` | Overflow for secondary actions |
| `table-empty.component.ts` | `archived` empty variant |
| `table-view-toggle.component.ts` | Visual polish |
| `enterprise-table.models.ts` | `EnterpriseTableSecondaryAction`, view-mode policy types, empty `archived` |
| `data-table/index.ts` | Exports list header, overflow, chip utils |
| `builder-portal-table.helpers.ts` / `super-admin-table.helpers.ts` | `mapActiveFilterChips` |

---

## Pages Updated

| Page | Portal | View policy | Primary action | Overflow |
|---|---|---|---|---|
| Projects | Builder | Portfolio (toggle) | Create project | Import, Advanced filters |
| Units | Builder | Portfolio (toggle) | Create unit | Import, Advanced filters |
| Buildings | Builder | Card on shell | Create building | — (Back in header toolbar) |
| Owners | Builder | Directory (table) | Assign owner | Advanced filters |
| Organizations | Super Admin | Directory (table) | Create organization | Import, Advanced filters |
| Builders | Super Admin | Directory (table) | Create builder | Import, Advanced filters |
| IAM Users | Super Admin | Directory (table) | Create user | Import, Advanced filters |

**Not redesigned (intentional):** detail pages, forms, dashboards, communications/documents/subscriptions/reports list surfaces (adopt the same shell in a follow-on pass).

---

## Files Modified

### Added

- `src/shared/ui/enterprise/data-table/list-page-header.component.ts`
- `src/shared/ui/enterprise/data-table/table-overflow-menu.component.ts`
- `src/shared/ui/enterprise/data-table/utils/enterprise-table-filter-chips.util.ts`
- `docs/design/IMPLEMENTATION_REPORT_UI_IMP_03.md` (this file)

### Updated — framework

- `src/shared/ui/enterprise/data-table/data-table-shell.component.ts`
- `src/shared/ui/enterprise/data-table/table-toolbar.component.ts`
- `src/shared/ui/enterprise/data-table/table-empty.component.ts`
- `src/shared/ui/enterprise/data-table/table-view-toggle.component.ts`
- `src/shared/ui/enterprise/data-table/models/enterprise-table.models.ts`
- `src/shared/ui/enterprise/data-table/index.ts`
- `src/features/builder-portal/utils/builder-portal-table.helpers.ts`
- `src/features/super-admin/utils/super-admin-table.helpers.ts`

### Updated — pages

- `src/features/builder-portal/projects/pages/project-list-page.component.{ts,html}`
- `src/features/builder-portal/projects/units/pages/unit-workspace-page.component.{ts,html}`
- `src/features/builder-portal/projects/buildings/pages/building-list-page.component.{ts,html}`
- `src/features/builder-portal/owners/pages/owner-workspace-page.component.{ts,html}`
- `src/features/super-admin/organizations/pages/organization-list-page.component.{ts,html}`
- `src/features/super-admin/builders/pages/builder-list-page.component.{ts,html}`
- `src/features/super-admin/iam/pages/users/iam-user-list-page.component.{ts,html}`

### Unchanged (intentionally)

- List state services, stores, query/filter/sort algorithms
- Routes, guards, auth, RBAC permission strings (still used on authorized buttons)
- Row CRUD handlers and API/mock data sources
- Detail / form / dashboard surfaces

---

## Accessibility Validation

| Check | Status |
|---|---|
| Table region `role="region"` + `aria-label` | Applied via shell |
| Loading `aria-busy` on table body | Applied |
| Empty states `role="status"` / `aria-live` | Applied (`app-enterprise-table-empty`) |
| Overflow menu keyboard operable | Applied (PrimeNG Menu + button trigger) |
| Filter chip remove + Clear all focusable | Applied via filter bar |
| Primary action in header (single focus landmark for create) | Applied |
| Screen-reader search placeholders | Retained per page |

Manual device/AT QA still recommended (see checklist).

---

## Responsive Validation

| Breakpoint | Expected behavior |
|---|---|
| Desktop | Full toolbar: search, quick filters, sort, columns, density, overflow |
| Laptop | Same anatomy; toolbar wraps via DS-05 flex rules |
| Tablet | Quick filters + overflow compress; chips wrap |
| Mobile | Search + overflow-first collapse; bulk bar stacks; table horizontal scroll / card view where enabled |

Primary-action demotion to overflow is what makes phone-width collapse viable (blueprint §6 / mobile note).

---

## Performance Observations

- No new heavy dependencies; overflow menu is a thin composition over existing button + PrimeNG Menu.
- Filter chips are computed from existing list-state signals — no extra network calls.
- View-mode fade is CSS-only (`opacity` keyframes on tokens).
- Buildings migration replaces a custom toolbar with the shared shell (one less one-off layout path).

---

## Known Limitations

| Item | Notes |
|---|---|
| Sticky first column | Framework hook / documented intent; full sticky-first-column behavior depends on PrimeNG table config per grid |
| Resizable columns | Framework-ready where `EnterpriseTableGrid` enables it; not every module grid opts in yet |
| Saved filters | Saved **views/searches** wired where list-state already supported them; full “saved filter” product UX remains framework + existing saved-view signals |
| Buildings table mode | Card-only on shell until a building data-grid exists |
| Owners workspace KPIs/charts | Left above the list (workspace context); list region only was standardized |
| Units tower/floor chrome | Left above the list; list shell standardized underneath |
| Confirmation dialogs for bulk | Still driven by existing list-state / dialog patterns — not redesigned |
| Import dialogs | Still framework placeholders where previously so |

---

## Remaining Work

| Item | Notes |
|---|---|
| Documents / Communications / Subscriptions / Reports / Floors / Tenants lists | Adopt same header + shell + chips + overflow pattern |
| Building data-grid + portfolio toggle | When a table grid exists, enable `showViewToggle` for Buildings |
| Sticky first column rollout | Opt-in per high-density directory grids |
| Responsive filter drawer | Advanced filters panel exists; dedicated mobile drawer polish optional |
| Permission-denied empty on lists | Shell supports `state='permission-denied'`; wire where modules expose permission gates |
| UI-IMP-04+ | Detail / form rebirth batches — **out of scope here** |

---

## Verification Checklist

- [x] Development build succeeds (`ng build --configuration=development`)
- [x] One primary action in list page header on migrated pages
- [x] Import / Advanced filters demoted to overflow (where previously top-level)
- [x] Filter chips + clear all wired on migrated pages
- [x] Bulk bar replaces toolbar when selection &gt; 0 (DS-05 shell)
- [x] Portfolio vs directory view-mode policy applied and documented
- [x] Organizations intentionally table-only (not “fixed” by adding cards)
- [x] Empty variants include no-data / no-search / no-filter / permission / archived
- [x] Skeleton loading retained via shell
- [x] No API / auth / routing / service logic changes
- [x] No detail page / form / dashboard redesign
- [ ] Manual keyboard pass on overflow + chip remove (device QA)
- [ ] Manual mobile toolbar collapse QA
- [ ] Visual dark-mode / white-label spot check on shell + chips

---

## STOP Boundary Honored

- Detail pages — not redesigned  
- Forms — not redesigned  
- Dashboard widgets — not redesigned  
- Only Enterprise List Page Experience completed  
