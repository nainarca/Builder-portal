# State Ownership — MyPropertyAsset Web Platform

**Companion to:** [`NG-005_State_Management_Strategy.md`](NG-005_State_Management_Strategy.md)
**Purpose:** Every state category this prompt named, mapped to exactly one owner — no state exists in two places at once, extending A-007/A-008's "reference, don't duplicate" principle from data into runtime state.

## State Ownership Rules

- Every piece of state has exactly one owner: a Core service, a Feature's own state, or a component. Never two.
- **Global/Core state** (Auth, Organization Context, RBAC, Theme) lives in Core-tagged Signal-based services (NG-001/NG-003's Core category), injected wherever needed, never re-created per feature.
- **Feature state** lives within that feature's own route-level injector scope, destroyed when its route is navigated away from — a direct consequence of NG-004's lazy-loading boundaries, not a new mechanism.
- **Component state** (form inputs, UI toggles) stays in the component unless genuinely needed by more than one consumer — lifting state to a shared service "just in case" is exactly the premature abstraction NG-000's Enterprise Design Principles already warn against.

## Ownership Map

| State category | Owner | Scope | Lifecycle |
|---|---|---|---|
| Public Website | Component state only (form inputs) | Component | Component-scoped |
| Super Admin Portal | Composition of Core + its own Feature states below | App | App session |
| Builder Portal | Composition of Core + its own Feature states below | App | App session |
| Shared Platform | Core services | Workspace-wide | App session |
| Authentication | `shared-auth` (Core) | Global (per app) | App session, survives navigation |
| Organization Context | `shared-organization-context` (Core) — the session's own Organization only | Global (per app) | App session |
| Organizations (Super Admin's cross-Org browsing) | Feature (`super-admin` Tenancy) | Feature | Feature-scoped — a *list/browse* concern, not "my context," so it does not belong in Core |
| RBAC / permission set | `shared-rbac` (Core), derived from `PERMISSION_MATRIX.md` | Global (per app) | App session |
| Notifications | Feature (Communication) for full detail; a thin unread-count Signal is exposed to Core/Shell for the Global Navigation badge | Feature (detail) + Core (count only) | Feature-scoped detail, Core-visible summary |
| Profile | Reserved — no screen exists yet (A-005 NAV-BA-10 gap, still unbuilt) | *(unassigned)* | *(unassigned)* |
| Projects | Feature (`builder-portal-projects`) | Feature | Feature-scoped; gated by `infra-feature-flags` — **12th consecutive document depending on the undesigned Builder Projects backend domain** |
| Units | Feature (`builder-portal-units`) | Feature | Same gating as Projects |
| Documents | Feature (`builder-portal-documents`) | Feature | Feature-scoped |
| Invitations | Feature (`builder-portal-invitations`) | Feature | Feature-scoped |
| Dashboard | Feature (`*-dashboard`, per app) — **always `computed()` from other Feature signals, never independently fetched or stored** | Feature | Feature-scoped, recomputed reactively |
| Search | Utility (`search`, NG-003) | Ephemeral, component/feature-local | Destroyed with the view that owns the search box |
| Settings | Feature, per app (`*-settings`) | Feature | Feature-scoped |
| Theme | `theme-runtime` (Theme category) | Global (per app) | App session, re-resolved on Organization Context change |
| Future Tenant | Reserved, not designed | *(unassigned)* | *(unassigned)* |

## Why Dashboard Is Never Its Own Fetch

This is the single most consequential ownership rule in this document: a Dashboard aggregation (SA-02, BA-02) is `computed()` from whatever Feature signals already hold the underlying data — never a parallel `dashboard.fetch()` that queries Supabase independently for numbers the Projects/Units/Invitations features already have in memory. This is A-007 ID-12's "derived, not stored" business rule, now made an actual, checkable state-architecture constraint rather than a documentation-only aspiration.
