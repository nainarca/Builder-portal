# DS-02 — Enterprise Sidebar Navigation Implementation Report

| Field | Value |
|---|---|
| **Document ID** | DS-02 |
| **Status** | **IMPLEMENTED** |
| **Date** | 2026-07-16 |
| **Repository** | `my-property-asset-web` |
| **Depends on** | DS-01 Enterprise Application Shell |
| **References** | P0, P0.1 §1.2 / §4.1–4.2, `DS_01_IMPLEMENTATION_REPORT.md` |
| **Out of scope** | Routing changes, permission model changes, auth/RBAC/DB, page/dashboard/form redesign |

---

## Summary

Replaced the DS-01 sidebar placeholder chrome with a reusable **Enterprise Sidebar** shared by Super Admin and Builder Portal. Navigation remains permission-filtered against existing routes. Collapse is now an **icon-only rail** with **hover expansion**, labeled **navigation groups**, **nested items (max 2 levels)**, a **workspace indicator**, and **Favorites / Recent placeholders**.

---

## Navigation Components Created

| Component | Selector | Role |
|---|---|---|
| Enterprise Sidebar | `app-enterprise-sidebar` | Desktop sidebar shell (collapse, hover expand, profile) |
| Workspace Indicator | `app-sidebar-workspace-indicator` | Current workspace / org mark + label |

## Navigation Components Updated

| Component | Change |
|---|---|
| `app-shell-sidebar` | Now hosts `app-enterprise-sidebar` (DS-01 contract kept) |
| `app-nav-list` | Nested children (level 2), compact icon-rail mode, `activeMatch`, expand control |
| `app-sidebar-navigation` | Passes `compact` into nav-list |
| `app-favorites-navigation` | Empty-state placeholder copy |
| `app-recent-items-navigation` | Empty-state placeholder copy |
| `app-context-navigation` / `app-secondary-navigation` | Render only when context-aware items exist |

---

## Files Modified / Added

### Added

- `src/layouts/enterprise-shell/enterprise-sidebar/*`
- `src/layouts/enterprise-shell/sidebar-workspace-indicator/*`
- `docs/design/DS_02_IMPLEMENTATION_REPORT.md`

### Updated

- `src/layouts/enterprise-shell/shell-sidebar/*`
- `src/layouts/enterprise-shell/index.ts`
- `src/navigation/config/navigation.config.ts` — grouped SA/BP menus
- `src/navigation/config/index.ts`
- `src/navigation/models/navigation.model.ts` — `metadata.activeMatch`
- `src/navigation/components/nav-list/*`
- `src/navigation/components/sidebar-navigation/*`
- `src/navigation/components/favorites-navigation/*`
- `src/navigation/components/recent-items-navigation/*`
- `src/navigation/components/context-navigation/*`
- `src/navigation/components/secondary-navigation/*`

### Unchanged (intentionally)

- Route definitions (`*.routes.ts`)
- Permission keys / RBAC evaluation logic
- Auth, Supabase, Flutter, page feature content
- Mobile drawer / overlay (still used ≤1023px)

---

## Navigation Structure

### Super Admin (grouped)

| Group | Items | Route |
|---|---|---|
| Overview | Dashboard | `/super-admin` |
| Overview | Analytics | `/super-admin/analytics` |
| Directory | Organizations | `/super-admin/organizations` |
| Directory | Builders | `/super-admin/builders` |
| Directory | Identity & Access | `/super-admin/iam/users` |
| Branding | Branding | `/super-admin/branding` |
| Branding | Branding Oversight | `/super-admin/branding-oversight` |
| Platform | Platform Settings | `/super-admin/settings` |
| Platform | Operations | `/super-admin/operations` |
| Platform | Billing | `/super-admin/billing` |
| Platform | Support | `/super-admin/support` |

Secondary (workspace header): Support (permission-gated).

### Builder Portal (grouped + nesting)

| Group | Items | Route / notes |
|---|---|---|
| Overview | Dashboard | `/builder-portal` |
| Portfolio | Projects → Buildings, Units | Projects `/builder-portal/projects`; Buildings/Units nest (level 2), entry via projects; `activeMatch` highlights `/buildings` / `/units` deep links |
| Portfolio | Owners | `/builder-portal/owners` |
| Handover | Invitations | `/builder-portal/invitation` |
| Handover | Digital Handover | `/builder-portal/handovers` |
| Handover | Documents | `/builder-portal/documents` |
| Workspace | Branding | `/builder-portal/branding` |
| Workspace | Team | `/builder-portal/company` (label only; route unchanged) |
| Workspace | Billing | `/builder-portal/subscription` (label only; route unchanged) |
| Workspace | Reports | **Static placeholder** (no dedicated route yet — not invented) |
| Workspace | Settings | `/builder-portal/settings` |

Secondary (workspace header): Communications (existing route, permission-gated).

---

## Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| Desktop (≥1024px) | Full sidebar; pin collapse → icon rail; hover expands labels temporarily |
| Tablet (640–1023px) | Defaults to icon-only rail on first paint; hover expand available; same pin toggle |
| Phone (≤1023px host hide) | Desktop sidebar hidden; existing header hamburger + drawer/overlay unchanged |

Collapse animation uses existing `--mpa-transition-normal` width transition.

---

## Accessibility

- Sidebar is a `role="navigation"` landmark with portal `aria-label`
- Collapse control exposes `aria-expanded` / `aria-pressed` / descriptive `aria-label`
- Active items set `aria-current="page"`
- Nested submenu toggle uses `aria-expanded` + `aria-controls`
- Icon-rail items keep `title` tooltips for labels
- Focus-visible rings retained on links and controls
- Favorites / Recent placeholders use labeled regions

---

## Future Extension Points

| Extension | How |
|---|---|
| Favorites persistence | Fill `favorites` section in nav config / store; placeholder UI already swaps to `app-nav-list` |
| Recent pages tracking | Same for `recentItems` |
| Record-level context menus | Populate `contextNav` from detail resolvers (sibling Units, etc.) |
| Dedicated Buildings/Units top-level routes | Add routes later; swap child `route` / drop `activeMatch` — no shell change |
| Reports route | Give `ba-reports` a real `route` when BA-11 ships |
| Pin preference persistence | Persist `NavigationStateService.sidebarCollapsed` to session/local storage |
| Support Console / Ops | Reuse `app-enterprise-sidebar` via Application Layout + new nav configuration |

---

## Verification Checklist

- [x] Standalone Angular components
- [x] Shared by Super Admin + Builder Portal via DS-01 `app-shell-sidebar`
- [x] Max two navigation levels (Projects → Buildings/Units)
- [x] Navigation groups + section headers
- [x] Icon-rail collapse + hover expansion
- [x] Active indicator (accent + `aria-current`)
- [x] Permission-aware filtering unchanged (`PermissionService.hasAllPermissions`)
- [x] Favorites / Recent placeholders
- [x] Context-aware secondary menus (when configured)
- [x] No route / permission / auth / page content redesign
- [ ] Manual smoke: SA + BP desktop collapse/hover, tablet rail, mobile drawer
- [ ] Build: `npx ng build --configuration=development`

---

## STOP

DS-02 stops at Enterprise Sidebar navigation. Dashboards, forms, and page content are unchanged.
