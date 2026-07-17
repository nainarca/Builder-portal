# UI-IMP-01 — Foundation & Navigation Implementation Report

| Field | Value |
|---|---|
| **Document ID** | UI-IMP-01 |
| **Batch** | Batch 1 — Foundation & Navigation |
| **Status** | **COMPLETE** |
| **Date** | 2026-07-17 |
| **Repository** | `my-property-asset-web` |
| **Source of truth** | `docs/design/UI_REBIRTH_01_PRODUCT_UX_BLUEPRINT.md` (UI-REBIRTH-01 Phase 0) |
| **Out of scope** | Dashboards, forms, business pages, auth/RBAC, routing, Supabase, APIs |

---

## Summary

Batch 1 establishes the visual and interaction foundation every later screen inherits. No feature pages, dashboards, or forms were redesigned. Navigation presentation and shell chrome were aligned to the approved UI Rebirth Phase 0 rules: nothing decorative in the nav tree, a real workspace switcher, design-token layout primitives, and Header regions matching P0.1 §1.1 (workspace · search · notifications · user menu).

**Development build:** passes (`ng build --configuration=development`).

---

## Design Decisions Applied

| Blueprint rule | Implementation |
|---|---|
| §2 / §19 #1 — Nothing in navigation is decorative | Removed Builder Portal sidebar children **Buildings** / **Units** that routed to the same URL as **Projects** |
| §2 / §19 #2 — Real workspace switcher | Sidebar workspace control now hosts `app-organization-selector` (`variant="sidebar"`); click opens the shared switch panel |
| §5 / §19 #8–#9 — System avatar + aside tokens | Added `--mpa-avatar-size-*` and `--mpa-layout-aside-width` for platform-wide reuse |
| §16 — Token enforcement in shell chrome | Replaced one-off rem/hex values in shell + organization selector styles with `--mpa-*` tokens |
| P0.1 §1.1 Header anatomy | Header = leading workspace · center global search · trailing notifications + nav + user menu |
| P0.1 §1.6 Content focus | Main content landmark focuses on route change (`preventScroll`) |
| §17 Motion (shell) | Search / notification / workspace panels use named duration + easing tokens |

---

## Components Updated

| Component | Change |
|---|---|
| `ApplicationLayoutComponent` | Search/notifications pass-through; content host; optional shell loading overlay |
| `ShellHeaderComponent` | Exposes global search + notification toggles |
| `HeaderPlaceholderComponent` | Restructured to leading / center / trailing regions |
| `SidebarWorkspaceIndicatorComponent` | Real switcher (wraps organization selector) |
| `OrganizationSelectorComponent` | `variant` + `compact` inputs; sidebar presentation; tokenized SCSS |
| `EnterpriseSidebarComponent` | Avatar / control sizes use layout tokens |
| `ShellBreadcrumbComponent` | Quiet wayfinding spacing aligned to content width |
| `ShellPageToolbarComponent` | Region padding, content max-width, responsive action wrap |
| `ShellContentAreaComponent` | `role="main"`, focus on `NavigationEnd` |
| `WorkspaceHeaderComponent` | Tokenized region spacing |
| `PageContainerComponent` | Unchanged API; content width still via `--mpa-layout-content-max-width` |

## Components Created

| Component | Selector | Role |
|---|---|---|
| Shell Global Search | `app-shell-global-search` | Header search trigger + ⌘K / Ctrl+K panel (chrome foundation) |
| Shell Notification Area | `app-shell-notification-area` | Header notification center affordance (empty state) |

---

## Pages Updated

**None.** Feature / dashboard / form pages were intentionally not touched.

Shell consumers (Super Admin, Builder Portal, Authenticated layouts) inherit the foundation automatically via `app-application-layout`.

---

## Files Modified

### Added

- `src/layouts/enterprise-shell/shell-global-search/*`
- `src/layouts/enterprise-shell/shell-notification-area/*`
- `src/theme/scss/utilities/_content-grid.scss`
- `docs/design/IMPLEMENTATION_REPORT_UI_IMP_01.md` (this file)

### Updated

- `src/theme/scss/tokens/_layout.scss` — aside, avatar, search, region, content-grid tokens
- `src/theme/scss/utilities/_index.scss`
- `src/navigation/config/navigation.config.ts` — remove decorative Projects children
- `src/navigation/models/navigation.model.ts` — clarify `activeMatch` intent
- `src/core/organization-context/components/organization-selector/*`
- `src/layouts/components/header-placeholder/*`
- `src/layouts/components/page-container/page-container.component.scss`
- `src/layouts/enterprise-shell/application-layout/*`
- `src/layouts/enterprise-shell/shell-header/*`
- `src/layouts/enterprise-shell/shell-breadcrumb/*`
- `src/layouts/enterprise-shell/shell-page-toolbar/*`
- `src/layouts/enterprise-shell/shell-content-area/*`
- `src/layouts/enterprise-shell/workspace-header/*`
- `src/layouts/enterprise-shell/enterprise-sidebar/enterprise-sidebar.component.scss`
- `src/layouts/enterprise-shell/sidebar-workspace-indicator/*`
- `src/layouts/enterprise-shell/index.ts`

### Unchanged (intentionally)

- All feature page templates and business logic
- Auth, authorization, RBAC, guards, resolvers, services, signals ownership
- Route definitions (`*.routes.ts`)
- Supabase / database / GraphQL / API contracts
- Dashboard, form, and detail page compositions

---

## UX Improvements Applied

1. **Navigation honesty** — Projects no longer shows fake Buildings/Units nesting.
2. **Workspace switcher works in the sidebar** — same switch behavior as the header control.
3. **Header hierarchy** — search is centered and quiet until focused; notifications and user menu sit as equal trailing icon-weight chrome.
4. **Keyboard discovery** — ⌘K / Ctrl+K opens global search; Escape closes search and notification panels.
5. **Theme-ready shell** — spacing, elevation, radius, motion, and chrome colors use design tokens (light/dark compatible).
6. **Responsive shell** — tablet/phone collapse search to icon; org switcher truncates; mobile menu button retained.
7. **Content foundation** — max width, page padding, opt-in `.mpa-content-grid` utility for later batches.
8. **Loading overlay slot** — `loading` / `loadingLabel` inputs on `app-application-layout` for shell-level waits without page redesign.
9. **Accessibility** — main landmark, focus rings, expanded/haspopup ARIA on chrome controls, route-change focus to content.

---

## Screenshots Before / After

Not captured in this batch (no automated visual harness run). Manual verification checklist below covers the same acceptance points.

---

## Verification Checklist

- [x] Development build succeeds
- [x] No route files modified
- [x] No auth / RBAC / service contract changes
- [x] Decorative Projects → Buildings / Units nesting removed from nav config
- [x] Sidebar workspace control opens organization switch panel when multi-org
- [x] Header shows workspace · search · notifications · user navigation regions
- [x] ⌘K / Ctrl+K toggles global search panel
- [x] Shell SCSS uses `--mpa-*` tokens (no new hard-coded hex in touched shell files)
- [x] Dark-mode chrome variables remain theme-driven (`--mpa-layout-header-bg`, etc.)
- [ ] Manual: desktop Builder Portal — confirm Projects has no nested Buildings/Units
- [ ] Manual: multi-org user — switch workspace from sidebar and from header
- [ ] Manual: tablet (640–1023) — sidebar icon rail + search icon collapse
- [ ] Manual: phone — menu overlay still opens; search icon available

---

## Remaining Work (not this batch)

| Item | Target batch / phase |
|---|---|
| Command palette record jump (search results → destinations) | UI-REBIRTH Phase 3 |
| Live notification feed wiring | Later (backend-dependent — **STOP** if it requires API/schema) |
| Builder dashboard four-zone collapse | Batch 2+ / Phase 1 |
| Project Detail tabs + Handover Stage Tracker | Phase 1 |
| Projects toolbar one-primary-action | Phase 1 |
| Feature SCSS one-off rem purge (e.g. organizations) | Phase 0 continuation / Phase 2 |
| Super Admin exception-first dashboard shape | Phase 2 |
| Analytics destination | Phase 3 |
| White-label certificate surface | Phase 4 |

---

## Known Issues

1. **Global search is chrome-only** — panel accepts input but does not yet resolve records/pages (explicitly deferred; full palette is Phase 3).
2. **Notification area is empty-state only** — unread badge reserved (`unreadCount` signal at 0); no event source wired (would require notification API — out of scope).
3. **Header and sidebar both expose workspace switchers** — intentional per blueprint (persistent identity + real control); both reuse the same selector logic.

---

## Next Recommended Batch

**UI-IMP-02 — Demo-Critical Surfaces (Phase 1)**  
Without touching business logic: collapse Builder dashboard to four zones; unify Project Detail (real tabs) and Handover Detail (Stage Tracker) presentation; enforce one primary action on list toolbars.

---

## Stop Conditions Encountered

None. This batch stayed within allowed UI/presentation changes. Live notification data and command-palette entity search were **not** implemented because they would require product/API decisions beyond foundation chrome.
