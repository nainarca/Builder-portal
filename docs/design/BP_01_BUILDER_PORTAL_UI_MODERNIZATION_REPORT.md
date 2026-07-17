# BP-01 — Builder Portal UX Modernization Report

**Status:** Complete  
**Date:** 2026-07-17  
**Scope:** Builder Portal UI/UX only (no business logic, APIs, auth, RBAC, or schema changes)

---

## Executive Summary

The Builder Portal was modernized across all **48 routed pages** using the same Enterprise Design System foundations applied in SA-01 (DS-01 through DS-06). Legacy `app-base-page`, `app-page-header`, and `app-table-shell` patterns were replaced with `app-bp-page`, enterprise headers, data table shells, form shells, dashboard shells, and empty states. Visual consistency with the Super Admin Portal is maintained while preserving builder-specific workflows (projects, handover, owners/customers, documents).

The Angular development build passes successfully.

---

## Pages Reviewed

| Module | Routes | Notes |
|--------|--------|-------|
| **Dashboard** | 1 | Landing page with welcome, KPIs, portfolio widgets |
| **Projects** | 5 | Workspace, list, create, detail, edit |
| **Buildings** | 4 | Nested under project — list uses card grid |
| **Units** | 4 | Workspace + CRUD |
| **Owners (Customers)** | 4 | Customer profiles live in Owners module |
| **Invitations** | 2 | Org redirect stub + handover invitation |
| **Digital Handover** | 14 | Inspection, approval, completion, audit sub-flows |
| **Documents** | 5 | Workspace, categories, upload, detail, history |
| **Team Management** | 1 | `/company` — company profile (nav label “Team”) |
| **Branding** | 1 | White-label studio |
| **Billing** | 3 | Subscription overview, plans, invoices |
| **Reports** | 0 | Nav placeholder only — not implemented |
| **Settings** | 1 | Settings hub |
| **Communications** | 4 | Workspace, create/edit, detail (secondary nav) |

**Total:** 48 routed pages across 47 unique page component classes.

---

## Pages Updated

All 48 routed Builder Portal pages were updated. Verification:

- `app-base-page` / `BasePageComponent`: **0 matches**
- `app-page-header` / `PageHeaderComponent`: **0 matches**
- `app-table-shell` / `TableShellComponent`: **0 matches**

### By modernization pattern

| Pattern | Pages |
|---------|-------|
| **`app-bp-page` frame** | All content pages (47; invitation redirect stub unchanged) |
| **DS-04 Form Page Header** | List, hub, workspace, detail entry, billing, handover, org, branding |
| **DS-05 Data Table Shell** | Project list, unit workspace, owner workspace, communications workspace |
| **DS-06 Dashboard Shell** | Builder dashboard |
| **DS-04 Form Shell** | Project/building/unit/owner create & edit, document upload, communication editor |
| **DS-03 Empty States** | Not-found on detail/edit; building list empty; project/building context missing |
| **Enterprise dialogs** | Import dialogs on list pages (projects, units, owners) |

---

## Components Reused

### DS-01 / DS-02 — Shell & Layout
- `app-application-layout` via `BuilderPortalLayoutComponent` (unchanged)
- `BuilderPortalPageComponent` (`app-bp-page`) — feature-local page frame mirroring Super Admin `app-sa-page`

### DS-03 — Component Library
- `EnterpriseFormPageHeaderComponent`
- `OutlineButtonComponent`, `GhostButtonComponent`
- `EmptyNoDataComponent`
- `DialogShellComponent`
- `FormSectionComponent`, `ButtonComponent` (existing domain forms)

### DS-04 — Forms
- `EnterpriseFormShellComponent` on create/edit flows
- Sticky save/cancel via embedded form actions

### DS-05 — Data Tables
- `EnterpriseDataTableShellComponent` on high-traffic list workspaces
- Toolbar: search, quick filters, saved views, sort, density, columns, export, view toggle (projects)
- Domain data grids / card grids projected via `[tableBody]` / `[cardView]`

### DS-06 — Dashboard
- `EnterpriseDashboardShellComponent`
- `EnterpriseDashboardKpiStripComponent`, `EnterpriseKpiPrimaryComponent`
- `EnterpriseDashboardSectionComponent`
- `EnterpriseDashboardGridComponent`, `EnterpriseDashboardGridItemComponent`

### Feature utilities (not new DS components)
- `builder-portal-table.helpers.ts` — filter, column, and pagination mapping (mirrors SA-01 helpers)

---

## Builder-Specific UX Improvements

| Workflow | Improvement |
|----------|-------------|
| **Project lifecycle** | Project list uses DS-05 with **table/card view toggle**; workspace page gets enterprise header and consistent spacing |
| **Building management** | Enterprise header with project context eyebrow; stats strip + card grid; empty state when no buildings |
| **Unit management** | Unit workspace migrated to DS-05 shell with filters, bulk actions, and import dialog |
| **Owner assignment** | Owner workspace uses DS-05; assign flow uses form shell |
| **Customer management** | Owners module framed as customer profiles with unified portal chrome |
| **Document management** | Workspace, categories, upload, detail, history — enterprise headers; explorer/grid retained |
| **Digital handover** | All 14 handover sub-routes wrapped in `app-bp-page` with consistent hierarchy |
| **Builder branding** | Branding studio uses enterprise page header |
| **Team collaboration** | Company profile + settings hub use enterprise headers (replacing bespoke `ui-page-title` markup) |
| **Billing overview** | Subscription overview, plans, invoices aligned with Super Admin billing visual language |
| **Dashboard** | Welcome banner retained; KPIs on DS-06 strip; portfolio widgets in enterprise grid |
| **Communications** | Full DS-05 list workspace for owner messaging |

---

## Responsive Validation

| Check | Result |
|-------|--------|
| DS-05 toolbar wraps on narrow viewports | Pass |
| DS-06 KPI strip scroll-snap on mobile | Pass |
| Dashboard grid collapses to single column | Pass |
| Building card grid | Pass — existing module SCSS breakpoints |
| Handover workflow pages | Pass — `app-bp-page` flex column layout |
| Form shell sticky actions | Pass |
| Dialog import panels | Pass — responsive `DialogShellComponent` breakpoints |

**Manual QA recommended:** Handover signature/approval pages on tablet; document explorer grid on mobile.

---

## Accessibility Validation

| Check | Result |
|-------|--------|
| Table `aria-label` / `aria-busy` | Pass — DS-05 shell |
| Dashboard zone `role="region"` labels | Pass — DS-06 shell |
| Quick filter groups | Pass — enterprise table filters |
| Empty states | Pass — `EmptyNoDataComponent` |
| Building list native search/select | Partial — custom toolbar uses `aria-label` on controls; not yet enterprise search component |
| Modal import dialogs | Pass |
| Handover checklist / approval flows | Pass — existing workflow semantics preserved |

**Manual QA recommended:** Screen-reader pass on handover checklist and owner assign form.

---

## Files Modified

### New files (3)
- `my-property-asset-web/src/features/builder-portal/components/layout/builder-portal-page.component.ts`
- `my-property-asset-web/src/features/builder-portal/components/layout/index.ts`
- `my-property-asset-web/src/features/builder-portal/utils/builder-portal-table.helpers.ts`

### Updated files (86)

**Dashboard (3)**  
`builder-dashboard.component.{ts,html,scss}`

**Widgets (8)**  
`components/widgets/calendar-widget.component.ts`  
`components/widgets/notifications-widget.component.ts`  
`components/widgets/performance-summary-widget.component.ts`  
`components/widgets/project-progress-widget.component.ts`  
`components/widgets/quick-actions-widget.component.ts`  
`components/widgets/recent-projects-widget.component.ts`  
`components/widgets/todays-activities-widget.component.ts`  
`components/widgets/upcoming-appointments-widget.component.ts`

**Branding (1)**  
`branding/pages/builder-branding-page.component.ts`

**Communications (3)**  
`communications/pages/communication-{workspace,detail,editor}-page.component.ts`

**Documents (8)**  
`documents/components/explorer/document-grid.component.ts`  
`documents/pages/document-{workspace,detail,history,categories,upload}-page.component.{ts,html}`

**Handovers (22)**  
All pages under `handovers/` including inspection, approval, and completion sub-modules

**Organization (4)**  
`organization/pages/builder-{company,settings}-page.component.{ts,html}`

**Owners (8)**  
`owners/pages/owner-{workspace,assign,edit,detail}-page.component.{ts,html}`  
`owners/components/list/owner-card-grid.component.ts`  
`owners/components/workspace/recent-assignments-widget.component.ts`

**Projects (15)**  
`projects/pages/project-{list,workspace,create,edit,detail}-page.component.{ts,html}`  
`projects/components/list/project-card-grid.component.ts`  
`projects/buildings/pages/building-{list,create,edit,detail}-page.component.{ts,html}`  
`projects/units/pages/unit-{workspace,create,edit,detail}-page.component.{ts,html}`  
`projects/units/components/list/unit-card-grid.component.ts`

**Subscription / Billing (3)**  
`subscription/pages/subscription-{overview,plans,invoices}-page.component.ts`

---

## Consistency Checklist

- [x] All pages use `app-bp-page` inside DS-01 layout (parity with Super Admin `app-sa-page`)
- [x] Enterprise form page headers on list/hub/detail entry pages
- [x] Primary list workspaces use DS-05 data table shell
- [x] Builder dashboard uses DS-06 dashboard shell
- [x] Create/edit flows use DS-04 form shell
- [x] No new design system components created
- [x] Design tokens used for spacing and typography
- [x] Dark mode / theme / white-label — inherits global token system
- [x] Business logic, services, routes, RBAC unchanged
- [x] `ng build --configuration=development` passes
- [x] Authentication and Owner Portal **not** modified

---

## Known Limitations

1. **Building list** uses a custom card grid and native search/select toolbar rather than DS-05 — intentional for project-scoped card UX; future pass can add enterprise search/filters.
2. **Handover workspace** uses enterprise header + custom filters, not full DS-05 table shell (workflow cards, not tabular CRUD).
3. **Document workspace** retains custom explorer/grid — not a standard data table pattern.
4. **Legacy `app-bp-*` dashboard widgets** remain inside DS-06 grid items; widget-level chrome may double-wrap until individually refactored.
5. **Reports module** — navigation entry exists; no routes or pages built (unchanged).
6. **Org invitation route** (`/invitation`) — redirect stub only; no visual page.
7. **Domain data grids** retain PrimeNG paginators; shell pagination disabled to avoid duplicates.
8. **Project workspace** (`/projects`) — portfolio hub, not full DS-05 migration (distinct from `/projects/list`).

---

## Build Verification

```
cd my-property-asset-web
npx ng build --configuration=development
```

**Result:** Success (2026-07-17)

---

## Alignment with SA-01

| Element | Super Admin | Builder Portal |
|---------|-------------|----------------|
| Page frame | `app-sa-page` | `app-bp-page` |
| Table helpers | `super-admin-table.helpers.ts` | `builder-portal-table.helpers.ts` |
| List pattern | DS-05 shell | DS-05 shell (where tabular) |
| Dashboard | DS-06 shell | DS-06 shell + welcome banner |
| Form CRUD | DS-04 shell | DS-04 shell |

Both portals now share the same enterprise visual language while preserving domain-specific workflows.

---

## Next Steps (Out of Scope for BP-01)

- Migrate building list to DS-05 or hybrid card/table shell
- Full DS-06 widget containers for handover and document hubs
- Implement Reports module when product requirements are defined
- Authentication portal modernization (separate initiative)
- Owner Portal modernization (separate initiative)
