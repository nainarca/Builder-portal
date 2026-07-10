# Routing Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-004_Angular_Routing_Architecture.md`](NG-004_Angular_Routing_Architecture.md)
**Covers:** Routing Principles, Application Entry Points, Layout Boundaries, Shell Routing, Lazy Loading Strategy, Feature Route Boundaries, Nested Routing Strategy, Maintenance Mode Routing.

## 1. Routing Principles

- Every route belongs to exactly one application (ADR-009) — there is no route that spans applications, because there is no shared Router instance across three separately-deployed apps.
- **Cross-application navigation is a hard browser navigation, never an Angular Router call.** The Login Gateway (A-004 PW-09) redirecting from Public Website into Super Admin or Builder Portal is a full page load to a different origin/subdomain, not `router.navigate()` — because Angular's Router cannot navigate somewhere its own bundle doesn't know about. This is the first routing-architecture consequence of ADR-009 that no prior document had to state explicitly.
- Route structure mirrors the finer-grained feature library structure from NG-003 `LIBRARY_CATALOG.md`, not the older four-feature grouping — a route exists because a feature library exists, one-to-one.
- No route, anywhere in this platform, resolves to a screen touching Restricted-Financial data (NG-003's Property refusal, restated as a routing-level guarantee: there is no `/property/:id/loan` route in this codebase because there is no such library to route to).

## 2. Application Entry Points

| Application | Entry route | Precondition |
|---|---|---|
| Public Website | `/` | None |
| Super Admin | `/login` → `/dashboard` | Supabase Auth session; Super Admin role |
| Builder Portal | `/login` → `/dashboard` | Supabase Auth session; Builder-type Organization membership |

## 9. Layout Boundaries

Two layout shapes, matching NG-001 §12 (`diagrams/NG-001_Architecture_Diagrams.md` §6): Public Website's header/footer layout (no route ever escapes it) and the sidebar+topbar+content-outlet shape shared by Super Admin and Builder Portal (every authenticated route renders inside it). A route never changes layout mid-navigation within an app — layout is a property of the application, not of an individual route.

## 10. Shell Routing

Each application's Shell owns the root route and every top-level route beneath it (NG-001 §6). Bootstrap sequencing (auth → Organization Context → RBAC → theme, for the two authenticated apps) completes *before* the Shell resolves its first child route — a route guard concept (§14 of the main document), not implementation.

## 11. Lazy Loading Strategy

Every feature (per NG-003's finer-grained library catalog) lazy-loads as its own route-level chunk — restated from NG-001 §16/§27, now mapped onto concrete routes: `builder-portal-projects`, `builder-portal-units`, `builder-portal-documents`, and `builder-portal-invitations` are each an independent lazy chunk, not one combined "handover" bundle, so a Builder Administrator who only ever works Projects never downloads the Invitations feature's code until they navigate there. Core, Shared, Infrastructure, and Theme libraries are never lazy — they're needed before the Shell can render at all.

## 12. Feature Route Boundaries

A feature's routes are only reachable through its own top-level route segment (`/projects/**`, `/invitations/**`) — no feature route is nested inside a sibling feature's route tree, mirroring NG-003 `LIBRARY_DEPENDENCY_RULES.md`'s "no sibling feature imports" rule at the URL level too.

## 13. Nested Routing Strategy

Nesting is used only where A-005's own navigation hierarchy already established real depth (`NAVIGATION_HIERARCHY.md`, Builder Portal's Projects → Units path) — `/projects/:projectId/units/:unitId`. Shallow sections (Reports, Notifications, Settings, Monitoring, Audit) stay single-level, matching A-005 §11's own rule that breadcrumbs (and by extension, deep nesting) are reserved for three-or-more levels of real depth, not applied uniformly.

## 25. Maintenance Mode Routing

A platform-wide maintenance state (not previously named in any prior document) is reserved as a routing concept here: each application's Shell can resolve to a maintenance placeholder before attempting auth/Organization/RBAC resolution, gated by `infra-feature-flags` (NG-003) — the same mechanism already doing double duty for the Builder-Projects-dependency toggle. Not designed further than this reservation; genuinely new scope, flagged per this series' standing practice for unbacked items.
