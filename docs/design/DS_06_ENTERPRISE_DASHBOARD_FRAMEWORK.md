# DS-06 — Enterprise Dashboard & Analytics Framework

| Field | Value |
|---|---|
| **Document ID** | DS-06 |
| **Status** | **IMPLEMENTED** |
| **Date** | 2026-07-17 |
| **Repository** | `my-property-asset-web` |
| **Depends on** | P0, P0.1, DS-01, DS-02, DS-03, DS-04, DS-05 |
| **Out of scope** | Super Admin / Builder / Project / Operations / Analytics business dashboards; API wiring; analytics logic; module migrations |

---

## Summary

Reusable **Enterprise Dashboard & Analytics** infrastructure under `src/shared/ui/enterprise/dashboard/`, exported via `@shared/ui`. Presentation-only: no domain services, no API calls, no module migrations. Every dashboard in the platform should eventually compose these shells, widgets, KPIs, charts, and activity panels the same way.

---

## Dashboard Architecture

```
app-enterprise-dashboard-shell          (P0.1 §2.2 — triage layout)
├── app-enterprise-dashboard-header     (context header + refresh + actions)
├── app-enterprise-dashboard-toolbar    (optional)
├── app-enterprise-dashboard-filters    (optional — analytics uses by default)
├── app-enterprise-dashboard-state      (loading | skeleton | empty | error | permission | maintenance)
│   ├── [kpiStrip]                      (3–5 KPI tiles, swipeable on mobile)
│   ├── [attentionZone]                 (warnings, insights, approvals)
│   ├── [activityZone] / [portfolioZone] / [mainContent]
│   └── [quickActions]                  (3–4 shortcuts)
└── app-enterprise-dashboard-footer     (optional)

app-enterprise-analytics-shell          (P0.1 §2.5 — chart-dominant layout)
└── wraps dashboard-shell with layoutMode="analytics" + filters enabled
```

**Grid composition:**

```
app-enterprise-dashboard-grid           (12-col responsive; 6-col tablet; 1-col mobile)
└── app-enterprise-dashboard-grid-item  (colspan / rowspan — resizable architecture ready)
    └── app-enterprise-dashboard-widget (header, toolbar, refresh, collapse, fullscreen-ready, footer)
        └── chart / KPI / activity / insight content
```

**Zone order is fixed** per P0.1 §2.2: header → KPI strip → attention → activity/portfolio → quick actions.

---

## Widget Architecture

```
app-enterprise-dashboard-widget
├── header (title, description, icon)
├── toolbar slot [widgetToolbar]
├── actions: refresh | collapse | fullscreen (extension point)
├── body (loading overlay when loading=true)
└── footer slot [widgetFooter]
```

| Capability | Input / output |
|---|---|
| Refresh | `refreshable`, `loading`, `(refresh)` |
| Collapse | `collapsible`, `collapsed`, `(collapsedChange)` |
| Fullscreen | `fullscreenCapable`, `(fullscreen)` — host implements overlay |
| Resizable grid | `EnterpriseDashboardGridItemConfig.colspan / rowspan` |

---

## Chart Architecture

```
app-enterprise-chart-wrapper
├── loading → app-enterprise-chart-loading
├── type switch:
│   ├── line / bar / area / pie / donut / stacked-bar / timeline / sparkline
│   └── empty state per chart when no data
├── optional data-table fallback toggle (P0.1 §2.5 / §9 a11y)
└── app-enterprise-chart-data-table
```

**Implementation:** Custom SVG + conic-gradient donut (no Chart.js / PrimeNG Chart). Token-driven categorical palette via `chartColor()` in `charts/utils/chart.utils.ts`.

**Chart config contract:**

```typescript
EnterpriseChartConfig {
  id, type, title, subtitle?, labels[], series[], emptyMessage?
}
```

Wrap charts in `app-analytics-card` (DS-03) for analytics layout padding per P0.1 §2.5.

---

## Component Inventory

### Layout

| Selector | Role |
|---|---|
| `app-enterprise-dashboard-shell` | Full dashboard composer |
| `app-enterprise-analytics-shell` | Analytics layout variant |
| `app-enterprise-dashboard-header` | Context header + refresh |
| `app-enterprise-dashboard-toolbar` | Secondary toolbar |
| `app-enterprise-dashboard-filters` | Filter/date-range bar |
| `app-enterprise-dashboard-footer` | Footer chrome |
| `app-enterprise-dashboard-grid` | Responsive 12-col grid |
| `app-enterprise-dashboard-grid-item` | Grid cell with colspan/rowspan |
| `app-enterprise-dashboard-section` | Section grouping |
| `app-enterprise-dashboard-kpi-strip` | KPI row (swipeable mobile) |
| `app-enterprise-dashboard-quick-actions` | Quick action zone wrapper |
| `app-enterprise-dashboard-widget` | Reusable widget container |
| `app-enterprise-dashboard-state` | Lifecycle state wrapper |

### KPI widgets

| Selector | Role |
|---|---|
| `app-enterprise-kpi-primary` | Primary metric card |
| `app-enterprise-kpi-comparison` | Value + comparison |
| `app-enterprise-kpi-trend` | Metric + sparkline |
| `app-enterprise-kpi-growth` | Growth rate KPI |
| `app-enterprise-kpi-financial` | Currency-formatted KPI |
| `app-enterprise-kpi-occupancy` | Occupancy + progress bar |
| `app-enterprise-kpi-progress` | Completion % KPI |
| `app-enterprise-kpi-status` | Health/status KPI |

Also reuses DS-03: `app-metric-card`, `app-kpi-*` aliases from `enterprise/kpi/`.

### Charts

| Selector | Role |
|---|---|
| `app-enterprise-chart-wrapper` | Type router + data table toggle |
| `app-enterprise-line-chart` | Line chart |
| `app-enterprise-bar-chart` | Bar chart |
| `app-enterprise-area-chart` | Area chart |
| `app-enterprise-pie-chart` | Pie (donut render) |
| `app-enterprise-donut-chart` | Donut chart |
| `app-enterprise-stacked-bar-chart` | Stacked bar |
| `app-enterprise-timeline-chart` | Timeline chart |
| `app-enterprise-sparkline-chart` | Mini sparkline |
| `app-enterprise-chart-empty` | Empty chart state |
| `app-enterprise-chart-loading` | Loading chart state |
| `app-enterprise-chart-data-table` | Accessible data fallback |
| `app-enterprise-chart-toolbar` | Chart header |
| `app-enterprise-chart-legend` | Series legend |

### Activity

| Selector | Role |
|---|---|
| `app-enterprise-recent-activity` | Recent activity list |
| `app-enterprise-dashboard-timeline` | Timeline (wraps `app-timeline-card`) |
| `app-enterprise-notifications-panel` | Notifications |
| `app-enterprise-tasks-panel` | Tasks list |
| `app-enterprise-pending-approvals` | Approval queue |
| `app-enterprise-upcoming-events` | Events list |

### Insights

| Selector | Role |
|---|---|
| `app-enterprise-dashboard-insight` | Single insight by kind |
| `app-enterprise-dashboard-insights` | Insight stack |
| `app-enterprise-health-indicator-panel` | Health indicators |

Reuses DS-03: `app-insight-card`, `app-warning-card`, `app-information-card`, alerts, `app-health-indicator`.

### Quick actions

| Selector | Role |
|---|---|
| `app-enterprise-quick-actions-bar` | Configurable action grid |
| `app-enterprise-pinned-actions` | Pinned subset |
| `app-enterprise-quick-action-create` | Create preset |
| `app-enterprise-quick-action-import` | Import preset |
| `app-enterprise-quick-action-export` | Export preset |
| `app-enterprise-quick-action-invite` | Invite preset |
| `app-enterprise-quick-action-view-reports` | Reports preset |

Reuses DS-03: `app-quick-action-card`.

### Dashboard states

| State | Component |
|---|---|
| Loading | `app-skeleton-dashboard` via `app-enterprise-dashboard-state` |
| Skeleton | same |
| No data | `app-empty-no-data` |
| Error | `app-error-alert` |
| Permission denied | `app-empty-permission-denied` |
| Maintenance | `app-empty-coming-soon` |

---

## Files Created

| Path | Role |
|---|---|
| `enterprise/dashboard/models/enterprise-dashboard.models.ts` | Dashboard, chart, KPI, activity types |
| `enterprise/dashboard/layout/dashboard-shell.component.ts` | Dashboard shell |
| `enterprise/dashboard/layout/analytics-shell.component.ts` | Analytics shell |
| `enterprise/dashboard/layout/dashboard-chrome.component.ts` | Header, toolbar, filters, footer |
| `enterprise/dashboard/layout/dashboard-grid.component.ts` | Grid, sections, KPI strip, quick-action zone |
| `enterprise/dashboard/layout/dashboard-widget.component.ts` | Widget container |
| `enterprise/dashboard/states/dashboard-state.component.ts` | Lifecycle states |
| `enterprise/dashboard/charts/*` | Chart family + utils + states |
| `enterprise/dashboard/styles/enterprise-dashboard-charts.component.scss` | Chart token styles |
| `enterprise/dashboard/kpi/dashboard-kpi.component.ts` | KPI variants |
| `enterprise/dashboard/activity/dashboard-activity.component.ts` | Activity panels |
| `enterprise/dashboard/insights/dashboard-insights.component.ts` | Insight components |
| `enterprise/dashboard/quick-actions/dashboard-quick-actions.component.ts` | Quick actions |
| `enterprise/dashboard/index.ts` | Barrel |
| `docs/design/DS_06_ENTERPRISE_DASHBOARD_FRAMEWORK.md` | This document |

## Files Updated

| Path | Change |
|---|---|
| `src/shared/ui/enterprise/index.ts` | `export * from './dashboard'` |

**Unchanged:** feature dashboards (`super-admin-dashboard`, `builder-dashboard`, etc.), routes, auth, Supabase, Flutter.

---

## Extension Points

| Capability | How to extend |
|---|---|
| **Fullscreen widget** | Handle `(fullscreen)` on widget; host renders modal/overlay |
| **Resizable widgets** | Grid `colspan`/`rowspan` + future drag-resize handler on `grid-item` |
| **Chart library swap** | Replace SVG internals in `charts/*`; keep `EnterpriseChartConfig` contract |
| **Widget registry** | Host maps `EnterpriseDashboardWidgetDefinition[]` to projected content |
| **Saved dashboard layouts** | Host persists widget visibility/order; framework renders slots only |
| **Analytics filters** | Project DS-04 date/range inputs into `[dashboardFilters]` |
| **Data tables in widgets** | Compose DS-05 `app-enterprise-data-table-shell` inside widget body |
| **Real-time refresh** | Host listens to signals/WebSocket; passes `state` + `loading` to shell/widget |

---

## Accessibility Checklist

- [x] Dashboard zones use `role="region"` with `aria-label`
- [x] KPI strip labeled; horizontal scroll on mobile with snap
- [x] Widget exposes `aria-label` from title; `aria-busy` when loading
- [x] Charts expose `role="img"` + title; SVG marked `aria-hidden`
- [x] Toggleable chart data-table fallback (P0.1 §2.5)
- [x] Legend uses `role="list"` / `listitem` — not color-only
- [x] Progress KPIs use `role="progressbar"` via `app-progress-status`
- [x] Health indicators expose health level to AT
- [x] Quick action cards are full keyboard targets with `aria-label`
- [x] Empty/error/permission states use DS-03 alert/empty components with live regions
- [x] Collapse/refresh/fullscreen buttons have explicit labels

---

## Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| **Large displays** | 12-col grid; KPI strip 3–5 across; 2-col activity/portfolio |
| **Desktop** | Full zone stack; full chart legend |
| **Laptop** | Grid remains 12-col; widgets wrap naturally |
| **Tablet (≤1024px)** | Grid becomes 6-col; charts stack |
| **Mobile (≤640px)** | Single column grid; KPI strip horizontal swipe; condensed widget chrome |

---

## Migration Strategy (future — not in DS-06)

1. **New dashboards** adopt `app-enterprise-dashboard-shell` first (Super Admin, Builder, etc.).
2. Replace `app-sa-*` / `app-bp-*` dashboard kit components with `app-enterprise-*` equivalents incrementally.
3. Move chart config from feature `DashboardChartConfig` to `EnterpriseChartConfig` (structurally identical).
4. Keep feature `dashboard-preferences.service.ts` and computed data in feature layer — framework stays stateless.
5. Analytics pages use `app-enterprise-analytics-shell` + `app-analytics-card` + `app-enterprise-chart-wrapper`.
6. Do **not** dual-run business dashboard redesigns in the same change set as framework adoption.

**Target modules (when migrated):** Super Admin Dashboard, Builder Dashboard, Project Dashboard, Operations Dashboard, Analytics Dashboard, future Tenant Dashboard.

---

## Verification Checklist

- [x] Framework lives under `src/shared/ui/enterprise/dashboard/`
- [x] Exported via `@shared/ui` (`enterprise/index.ts`)
- [x] Standalone Angular components throughout
- [x] Composes DS-03 cards, KPIs, empty states, loading, alerts, status
- [x] DS-04 form inputs composable in `[dashboardFilters]` projection
- [x] DS-05 data table composable in widget bodies
- [x] Design tokens only (`--mpa-*`)
- [x] Dark mode / white-label compatible
- [x] PrimeNG compatible (checkbox/spinner primitives where used)
- [x] No feature dashboard files modified
- [x] No API / analytics logic in framework
- [x] `npx ng build --configuration=development` passes

---

## Usage Sketch (host module — not migrated in DS-06)

```html
<app-enterprise-dashboard-shell
  title="Platform overview"
  [state]="dashboardState()"
  (refresh)="onRefresh()"
>
  <app-enterprise-dashboard-kpi-strip kpiStrip>
    <app-enterprise-kpi-primary label="Organizations" [value]="kpi.orgs" />
    <app-enterprise-kpi-trend label="Revenue" [value]="kpi.revenue" [sparklineValues]="kpi.revenueTrend" />
  </app-enterprise-dashboard-kpi-strip>

  <app-enterprise-dashboard-insights attentionZone [insights]="insights()" />

  <app-enterprise-dashboard-grid mainContent>
    <app-enterprise-dashboard-grid-item [config]="{ colspan: 2 }">
      <app-enterprise-dashboard-widget title="Usage" [refreshable]="true" (refresh)="refreshUsage()">
        <app-analytics-card title="Active users">
          <app-enterprise-chart-wrapper [config]="usageChart()" />
        </app-analytics-card>
      </app-enterprise-dashboard-widget>
    </app-enterprise-dashboard-grid-item>
  </app-enterprise-dashboard-grid>

  <app-enterprise-quick-actions-bar quickActions [actions]="quickActions()" (actionClick)="onQuickAction($event)" />
</app-enterprise-dashboard-shell>
```

---

## Related Documents

- [P0 Enterprise Product Design System](./P0_ENTERPRISE_PRODUCT_DESIGN_SYSTEM.md)
- [P0.1 Enterprise Design System Architecture](./P0_1_ENTERPRISE_DESIGN_SYSTEM_ARCHITECTURE.md)
- [DS-03 Component Library Report](./DS_03_COMPONENT_LIBRARY_REPORT.md)
- [DS-04 Enterprise Form Framework](./DS_04_ENTERPRISE_FORM_FRAMEWORK.md)
- [DS-05 Enterprise Data Table Framework](./DS_05_ENTERPRISE_DATA_TABLE_FRAMEWORK.md)
