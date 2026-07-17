# DS-05 — Enterprise Data Table & Data Experience Framework

| Field | Value |
|---|---|
| **Document ID** | DS-05 |
| **Status** | **IMPLEMENTED** |
| **Date** | 2026-07-17 |
| **Repository** | `my-property-asset-web` |
| **Depends on** | P0, P0.1, DS-01, DS-02, DS-03, DS-04 |
| **Out of scope** | Migrating Organizations, Builders, Projects, Buildings, Units, Owners, Users, Invitations, Subscriptions, Documents, Audit Logs, or any module redesign |

---

## Summary

Reusable **Enterprise Data Table & Data Experience** infrastructure under `src/shared/ui/enterprise/data-table/`, exported via `@shared/ui`. Presentation-only: no domain services, no list-state persistence, no module migrations. Every list page in the platform should eventually compose these shells/grids the same way.

---

## Architecture

```
app-enterprise-data-table-shell
├── app-enterprise-table-bulk-actions     (when selection > 0 — replaces toolbar, P0.1 §6.3)
├── app-enterprise-table-toolbar          (search, quick filters, saved searches, sort, view, density, columns, export)
├── app-enterprise-table-filter-bar       (active filter chips + clear all, P0.1 §6.2)
├── app-enterprise-table-advanced-filters (wraps app-filter-panel; host projects criteria)
├── table body region
│   ├── app-enterprise-table-loading      (skeleton | overlay | progress)
│   ├── app-enterprise-table-empty        (no-data | no-search | no-filter | permission | error)
│   ├── app-enterprise-table-grid         (optional declarative grid — single p-table)
│   └── [tableBody] projection            (custom p-table / card view from host)
└── app-enterprise-table-pagination       (row summary + app-pagination-wrapper, P0.1 §6.7)
```

**Declarative grid (recommended for new list pages):**

```
app-enterprise-data-table-shell
  └── app-enterprise-table-grid
        ├── column defs (sort, visibility, sticky, priority)
        ├── optional cellTemplates
        └── built-in row actions + selection + search highlight
```

**Search / filter flow:**

```
app-enterprise-table-search (debounced)
  → host list-state service filters rows
  → app-enterprise-search-highlight marks matches in cells
  → app-enterprise-table-filter-bar shows chips + result summary
```

**Export flow:**

```
app-enterprise-table-export / toolbar export button
  → runEnterpriseTableExport({ format, rows, columns })
  → CSV built-in; Excel / PDF / Print via registerEnterpriseTableExportHandler()
```

---

## Component Mapping

| DS-05 requirement | Selector |
|---|---|
| Full list shell | `app-enterprise-data-table-shell` |
| Declarative grid | `app-enterprise-table-grid` |
| Table toolbar | `app-enterprise-table-toolbar` |
| Global / instant search | `app-enterprise-table-search` |
| Search highlight | `app-enterprise-search-highlight` |
| Filter chips | `app-enterprise-table-filter-bar` |
| Quick filters | `app-enterprise-table-quick-filters` |
| Advanced filters panel | `app-enterprise-table-advanced-filters` |
| Bulk actions bar | `app-enterprise-table-bulk-actions` |
| Row actions + overflow | `app-enterprise-table-row-actions` |
| Column visibility / reorder | `app-enterprise-table-column-selector` |
| Density control | `app-enterprise-table-density-control` |
| Table / card toggle | `app-enterprise-table-view-toggle` |
| Pagination + summary | `app-enterprise-table-pagination` |
| Table empty states | `app-enterprise-table-empty` |
| Loading (skeleton / overlay / progress) | `app-enterprise-table-loading` |
| Export menu | `app-enterprise-table-export` |
| Expandable rows | `app-enterprise-table-expandable-row` |
| Status cell pill | `app-enterprise-table-status-cell` |
| Saved searches (placeholder) | `app-enterprise-table-saved-searches` |

---

## Files Created

| Path | Role |
|---|---|
| `enterprise/data-table/models/enterprise-table.models.ts` | Column, filter, bulk, export, pagination, saved-search types |
| `enterprise/data-table/utils/enterprise-table-export.util.ts` | CSV export + handler registry (Excel/PDF/Print extension points) |
| `enterprise/data-table/utils/enterprise-table-search.util.ts` | Instant search match + highlight segmentation |
| `enterprise/data-table/utils/enterprise-table-columns.util.ts` | Visibility, reorder, breakpoint column helpers |
| `enterprise/data-table/data-table-shell.component.ts` | Full data experience shell composer |
| `enterprise/data-table/table-grid.component.ts` | Declarative PrimeNG grid (single table instance) |
| `enterprise/data-table/table-toolbar.component.ts` | P0.1 §6.1 toolbar |
| `enterprise/data-table/table-search.component.ts` | Debounced search + highlight |
| `enterprise/data-table/table-filter-bar.component.ts` | Filter chips |
| `enterprise/data-table/table-filters.component.ts` | Quick + advanced filter wrappers |
| `enterprise/data-table/table-bulk-actions.component.ts` | Bulk selection bar |
| `enterprise/data-table/table-row-actions.component.ts` | Row icon + overflow menu |
| `enterprise/data-table/table-column-selector.component.ts` | Column visibility + reorder |
| `enterprise/data-table/table-density-control.component.ts` | Comfortable / compact |
| `enterprise/data-table/table-view-toggle.component.ts` | Table / card mode |
| `enterprise/data-table/table-pagination.component.ts` | Pagination + row summary |
| `enterprise/data-table/table-empty.component.ts` | Table-scoped empty states |
| `enterprise/data-table/table-loading.component.ts` | Skeleton / overlay / progress |
| `enterprise/data-table/table-export.component.ts` | Export format menu |
| `enterprise/data-table/table-expandable-row.component.ts` | Inline row expansion |
| `enterprise/data-table/table-status-cell.component.ts` | Status pill cell |
| `enterprise/data-table/table-saved-searches.component.ts` | Saved search placeholder UI |
| `enterprise/data-table/styles/enterprise-table.component.scss` | Token-driven table styling |
| `enterprise/data-table/index.ts` | Barrel |
| `docs/design/DS_05_ENTERPRISE_DATA_TABLE_FRAMEWORK.md` | This document |

## Files Updated

| Path | Change |
|---|---|
| `src/shared/ui/enterprise/index.ts` | `export * from './data-table'` |
| `src/shared/ui/primitives/table/table.component.ts` | Virtual scroll, resizable/reorderable column inputs, scrollHeight |
| `src/shared/ui/composites/data-display/sort-control.component.ts` | Accept `readonly SortOption[]` |

**Unchanged:** feature modules, routes, auth, RBAC, Supabase, Flutter.

---

## Extension Points

| Capability | How to extend |
|---|---|
| **Excel export** | `registerEnterpriseTableExportHandler('excel', handler)` before calling `runEnterpriseTableExport` |
| **PDF export** | `registerEnterpriseTableExportHandler('pdf', handler)` |
| **Print** | Default stub calls `window.print()`; override via registry |
| **Saved searches** | Host persists searches; pass `savedSearches` + handle `saveSearch` / `savedSearchSelect` outputs |
| **Virtual scrolling** | Set `virtualScrollConfig.enabled = true` on `app-enterprise-table-grid`; tune `itemSize` / `scrollHeight` |
| **Custom cells** | Pass `cellTemplates` map of `TemplateRef` keyed by column field, or project custom `[tableBody]` into shell |
| **Custom bulk / row actions** | Configure `EnterpriseTableBulkAction[]` / `EnterpriseTableRowAction[]`; project extra buttons via `[toolbarEnd]` or bulk bar content slot |
| **Column resize (PrimeNG)** | `resizableColumns` input on grid; CSS width tokens on `EnterpriseTableColumnDef.width` — PrimeNG 20 column-resize directives not exposed; host may add when PrimeNG API stabilises |
| **Business list state** | Feature `*-list-state.service.ts` remains host-owned (query, pagination, selection, persistence) |

---

## Accessibility Checklist

- [x] Table region exposes `role="region"` and configurable `aria-label`
- [x] Loading states use `role="status"` / `aria-busy` on table body
- [x] Filter bar announces changes via `aria-live="polite"` + result summary
- [x] Bulk bar uses `role="toolbar"` with selection count
- [x] Row overflow menu uses `role="menu"` / `menuitem`; Escape closes menus
- [x] Expandable row toggle exposes expand/collapse labels
- [x] Search field retains persistent label via `app-search-field` `ariaLabel`
- [x] Pagination uses `role="navigation"` with row summary text
- [x] Empty states use DS-03 empty components + `aria-live="polite"`
- [x] Focus-visible row highlight via `:focus-within` in table SCSS
- [x] Keyboard: Escape closes column selector, export, saved-search, and row-action menus

---

## Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| **Desktop** | Full toolbar (search, filters, sort, density, columns, export); full pagination controls |
| **Laptop** | Columns with `priority: 'laptop'` or higher hidden via `columnsForBreakpoint()` helper |
| **Tablet** | Toolbar wraps; horizontal scroll enabled on grid; sticky header on |
| **Mobile (≤640px)** | Toolbar stacks full-width; pagination condenses; row actions collapse to overflow only |

**Column priority:** `EnterpriseTableColumnDef.priority` — `'always' | 'desktop' | 'laptop' | 'tablet' | 'mobile'`. Host applies `columnsForBreakpoint()` when narrowing viewports.

**Horizontal scroll:** `responsive.enableHorizontalScroll` (default `true`) on grid.

**Sticky header:** CSS `position: sticky` on thead when `responsive.stickyHeader` (default `true`).

**Sticky first column:** `responsive.stickyFirstColumn` applies `.enterprise-table-grid__sticky-col` to first data column.

---

## Migration Strategy (future — not in DS-05)

1. **New list pages** adopt `app-enterprise-data-table-shell` + `app-enterprise-table-grid` first.
2. **Replace nested-table pattern** — remove duplicate `app-table-shell` + inner `p-table`; use single grid inside shell.
3. **Consolidate duplicated chrome** — replace per-feature `*-bulk-actions`, `*-column-selector`, `*-quick-filters` with enterprise equivalents; keep domain action IDs in host.
4. **List state services** — continue owning query/filter/pagination in feature services; shell/grid remain stateless presenters.
5. **Card view** — project `[cardView]` slot in shell when `viewMode === 'card'`; reuse existing card grids incrementally.
6. Do **not** dual-run module redesigns in the same change set as framework adoption.

**Target modules (when migrated):** Organizations, Builders, Projects, Buildings, Units, Owners, Users, Invitations, Subscriptions, Documents, Audit Logs.

---

## Verification Checklist

- [x] Framework lives under `src/shared/ui/enterprise/data-table/`
- [x] Exported via `@shared/ui` (`enterprise/index.ts`)
- [x] Standalone Angular components throughout
- [x] Composes DS-03 buttons, empty states, loading skeletons, status pills
- [x] Composes existing composites (`app-search-field`, `app-filter-panel`, `app-pagination-wrapper`, `app-table-toolbar`)
- [x] Design tokens only (`--mpa-*` CSS variables)
- [x] Dark mode / white-label compatible (inherits token theming)
- [x] PrimeNG compatible (`p-table`, `p-sortIcon`, selection checkboxes)
- [x] No feature module files modified
- [x] `npx ng build --configuration=development` passes
- [x] CSV export works via `exportCsv` / `runEnterpriseTableExport`
- [x] Virtual scroll architecture ready (`virtualScrollConfig` on grid)
- [x] Saved searches placeholder UI present (persistence host-owned)

---

## P0.1 §6 Coverage

| P0.1 section | DS-05 implementation |
|---|---|
| §6.1 Toolbar | `app-enterprise-table-toolbar` |
| §6.2 Filters | `app-enterprise-table-filter-bar`, quick/advanced wrappers |
| §6.3 Bulk Actions | `app-enterprise-table-bulk-actions` |
| §6.4 Row Actions | `app-enterprise-table-row-actions` |
| §6.5 Expandable Rows | `app-enterprise-table-expandable-row` |
| §6.6 Status Chips | `app-enterprise-table-status-cell` (`app-pill`) |
| §6.7 Pagination | `app-enterprise-table-pagination` |
| §6.8 Empty States | `app-enterprise-table-empty` |

---

## Usage Sketch (host module — not migrated in DS-05)

```html
<app-enterprise-data-table-shell
  [state]="listState.tableState()"
  [searchValue]="listState.search()"
  [filterChips]="listState.filterChips()"
  [selectedCount]="listState.selection().length"
  [bulkActions]="bulkActionDefs"
  [columns]="listState.columns()"
  [pagination]="listState.pagination()"
  [showEmpty]="listState.isEmpty()"
  [emptyVariant]="listState.emptyVariant()"
  (searchChange)="listState.setSearch($event)"
  (bulkAction)="listState.runBulkAction($event)"
  (clearSelection)="listState.clearSelection()"
  (columnsChange)="listState.setColumns($event)"
  (pageChange)="listState.onPage($event)"
>
  <app-enterprise-table-grid
    tableBody
    [rows]="listState.rows()"
    [columns]="listState.visibleColumns()"
    [loading]="listState.loading()"
    [selectable]="true"
    [searchQuery]="listState.search()"
    [rowActions]="rowActionDefs"
    (rowAction)="listState.onRowAction($event)"
  />
</app-enterprise-data-table-shell>
```

---

## Related Documents

- [P0 Enterprise Product Design System](./P0_ENTERPRISE_PRODUCT_DESIGN_SYSTEM.md)
- [P0.1 Enterprise Design System Architecture](./P0_1_ENTERPRISE_DESIGN_SYSTEM_ARCHITECTURE.md)
- [DS-01 Implementation Report](./DS_01_IMPLEMENTATION_REPORT.md)
- [DS-02 Implementation Report](./DS_02_IMPLEMENTATION_REPORT.md)
- [DS-03 Component Library Report](./DS_03_COMPONENT_LIBRARY_REPORT.md)
- [DS-04 Enterprise Form Framework](./DS_04_ENTERPRISE_FORM_FRAMEWORK.md)
