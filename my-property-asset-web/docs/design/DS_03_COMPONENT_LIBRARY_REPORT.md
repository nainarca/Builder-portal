# DS-03 — Enterprise Component Library Report

| Field | Value |
|---|---|
| **Document ID** | DS-03 |
| **Status** | **IMPLEMENTED** |
| **Date** | 2026-07-17 |
| **Repository** | `my-property-asset-web` |
| **Depends on** | DS-01 Shell, DS-02 Sidebar, P0 / P0.1 |
| **Out of scope** | Dashboard redesign, form redesign, table redesign, module-specific UI, business logic |

---

## Summary

Delivered a reusable **Enterprise Component Library** under `src/shared/ui/enterprise/`, exported via `@shared/ui`. Components are standalone, theme-token driven, PrimeNG-compatible, and presentation-only. Existing shared primitives/composites are composed — not duplicated — so pages can migrate gradually without redesigning business screens.

---

## Component Inventory

### 1. Buttons
| Selector | Purpose |
|---|---|
| `app-enterprise-button` | Variant map: primary / secondary / outline / danger / success / ghost / text / icon |
| `app-primary-button` … `app-icon-button` | Semantic aliases |
| `app-loading-button` | Forced loading state |
| `app-split-button` | Primary + menu (PrimeNG SplitButton) |
| `app-permission-button` | Hides when PermissionService denies (UI gating only) |

### 2. Cards
| Selector | P0.1 mapping |
|---|---|
| `app-metric-card` | §3.1 Metric |
| `app-summary-card` | Summary block |
| `app-status-card` | §3.6 Status |
| `app-insight-card` | §3.2 Insight |
| `app-information-card` | Information |
| `app-warning-card` | §3.5 Warning |
| `app-enterprise-action-card` | §3.3 Action |
| `app-timeline-card` | §3.4 Timeline |
| `app-quick-action-card` | §3.8 Quick Action |
| `app-analytics-card` | Analytics container |

### 3. KPI Widgets
`app-kpi-revenue`, `app-kpi-projects`, `app-kpi-units`, `app-kpi-owners`, `app-kpi-revenue-trend`, `app-kpi-completion`, `app-kpi-pending`, `app-kpi-alerts`, `app-kpi-widget`

### 4. Status
`app-enterprise-badge`, `app-enterprise-chip`, `app-pill`, `app-progress-status`, `app-health-indicator`, `app-enterprise-tag` (+ existing `app-status-badge`)

### 5. Avatars
`app-enterprise-avatar`, `app-user-avatar`, `app-builder-avatar`, `app-organization-avatar`, `app-project-avatar`, `app-group-avatar`

### 6. Empty States
`app-empty-no-data`, `app-empty-no-search-results`, `app-empty-permission-denied`, `app-empty-coming-soon`, `app-empty-no-organization`, `app-empty-no-project`

### 7. Loading
`app-skeleton-card`, `app-skeleton-table`, `app-skeleton-form`, `app-skeleton-dashboard`, `app-enterprise-loading-overlay`, `app-enterprise-spinner`

### 8. Alerts
`app-enterprise-alert`, `app-success-alert`, `app-warning-alert`, `app-information-alert`, `app-error-alert`, `app-inline-alert`, `app-enterprise-toast-wrapper`

### 9. Dialogs
`app-confirmation-dialog-host`, `app-delete-dialog`, `app-approval-dialog`, `app-information-dialog`, `app-side-drawer`, `app-preview-dialog` + `EnterpriseDialogService`

### 10. Section
`app-enterprise-section-header`, `app-section-divider`, `app-sticky-action-bar`, `app-enterprise-page-title`, `app-enterprise-page-description`, `app-enterprise-toolbar`

---

## Component Hierarchy

```
@shared/ui
├── primitives/          (PrimeNG wrappers — existing)
├── composites/          (page/dialog/feedback/cards — existing)
└── enterprise/          (DS-03 semantic library)
    ├── buttons → primitives/button (+ SplitButton, PermissionService)
    ├── cards → composites/cards/card
    ├── kpi → metric-card
    ├── status → badge/chip/tag/status-badge
    ├── avatars → new
    ├── empty-states → composites/feedback
    ├── loading → skeleton/spinner/loading-overlay
    ├── alerts → message/inline-message/toast-wrapper
    ├── dialogs → dialog/drawer/modal shells + UiDialogService
    └── section → page title/subtitle/toolbar/section-header
```

---

## Files Created

- `src/shared/ui/enterprise/**` (models, buttons, cards, kpi, status, avatars, empty-states, loading, alerts, dialogs, section, index)
- `docs/design/DS_03_COMPONENT_LIBRARY_REPORT.md`

## Files Updated

- `src/shared/ui/index.ts` — exports `enterprise`

## Files Unchanged (intentionally)

- Feature dashboards, forms, tables, routes, auth, RBAC rules, Supabase, Flutter

---

## Usage Guidelines

```ts
import {
  MetricCardComponent,
  PrimaryButtonComponent,
  KpiProjectsComponent,
  EmptyNoProjectComponent,
} from '@shared/ui';
```

```html
<app-primary-button label="Save" (clicked)="onSave($event)" />
<app-kpi-projects value="24" trend="up" trendLabel="+3" />
<app-empty-no-project (action)="createProject()" />
```

Rules:
1. Prefer `enterprise/*` selectors for new UI chrome.
2. Never invent page-local button/card/empty variants.
3. Semantic status colors only for meaning (P0 §7); brand accent for primary actions only.
4. Permission button gates visibility only — do not embed business rules.

---

## Accessibility Checklist

- [x] Buttons expose labels / `aria-label` for icon-only
- [x] Metric trends combine icon + text (not color alone)
- [x] Warning card includes accessible “Warning” text
- [x] Progress status uses `role="progressbar"` + valuemin/max/now
- [x] Health indicator pairs dot + labeled badge
- [x] Avatars use `role="img"` + name label
- [x] Empty / loading states use status regions
- [x] Dialogs reuse existing focus-trapping shells
- [x] Sticky action bar is a labeled region

---

## Responsive Checklist

- [x] Metric/KPI cards use flexible min-width grids
- [x] Status facts grid collapses via `auto-fit`
- [x] Quick action cards fill available width
- [x] Sticky action bar wraps actions on narrow viewports
- [x] Skeleton dashboard uses responsive CSS grids
- [x] Tokens (`--mpa-spacing-*`, colors) support theme / white-label / dark mode via existing theme layer

---

## Future Extension Strategy

1. **Migrate feature KPI/avatar copies** onto `app-kpi-*` / `app-*-avatar` (no redesign — swap selectors).
2. **Chart series** for Analytics Card body (separate chart family from P0.1 §9).
3. **Storybook / visual catalog** for enterprise selectors.
4. **Deprecate duplicate feature-local empty states** once pages adopt `app-empty-*`.
5. **Do not** add module-specific props (project IDs, handover stages) into this library.

---

## Verification

```bash
npx ng build --configuration=development
```

- [ ] Build succeeds
- [ ] Manual smoke: import a few enterprise selectors in a sandbox page (optional)

---

## STOP

DS-03 stops at the reusable Enterprise Component Library. No business pages were redesigned.
