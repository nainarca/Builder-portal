# Lazy Loading Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-004_Angular_Routing_Architecture.md`](NG-004_Angular_Routing_Architecture.md)
**Purpose:** The full lazy-loading boundary map — restates and completes NG-001 §16/§27 and `ROUTING_STRATEGY.md` §11 at the level of a dedicated reference, mapping every route zone to its loading behavior.

## Loading Tiers

| Tier | Loaded | Contains |
|---|---|---|
| **Eager** | Immediately, before first render | Shell, Core (`shared-auth`, `shared-organization-context`, `shared-rbac`), Infrastructure (`infra-logging`, `infra-error-handling`, `infra-config`, `infra-feature-flags`), Theme (`shared-ui`, `theme-tokens`, `theme-runtime`) |
| **Lazy, per route** | On first navigation to that route | Every Feature library (NG-003's finer-grained catalog) |
| **Lazy, deferred further** | Not on first navigation to the parent route — only on the specific nested action | Rarely used in this platform given how shallow most nesting is (`ROUTING_STRATEGY.md` §13); the one candidate is `/projects/:id/units/:unitId/assign` (Owner Assignment), which could defer loading until the Assign action is actually opened rather than whenever Unit Detail loads — a genuine optimization opportunity, not a requirement, flagged here rather than mandated |

## Per-Application Lazy Boundaries

**Public Website** — every route (`/features`, `/pricing`, etc.) is its own lazy chunk; the marketing content is small enough that this is more about clean code-splitting than a real performance necessity, but it costs nothing to apply consistently.

**Super Admin** — `builders`, `organizations`, `users`, `monitoring`, `audit`, `settings` each lazy-load independently. A Super Admin session that only ever reviews Builder registrations never downloads the Audit feature's code.

**Builder Portal** — the finer split from NG-003 pays off most here: `projects`, `units`, `documents`, `invitations`, `reports`, `settings` are six independent chunks (not the old four-feature grouping's larger bundles) — a Builder Administrator working purely in Projects/Units never loads Documents or Invitations code until they navigate there.

## Interaction with Feature Flags

`infra-feature-flags` (NG-003) is Eager (every application needs to evaluate flags before deciding what to render), but the code it *gates* — most importantly, the Builder Projects backend-dependent content within `builder-portal-projects`/`builder-portal-units` — remains Lazy and, while toggled off, may not even need to load its full implementation, only enough to render a "coming soon" placeholder. This is the loading-strategy expression of the same feature-toggle mitigation named in every Builder-Projects-dependent document since NG-000.

## What Is Never Lazy

Core, Infrastructure, and Theme libraries are never lazy, without exception — a route that hasn't loaded yet may not exist in the bundle, but auth, Organization Context, RBAC, logging, error handling, and theming must always be present, because the Shell itself depends on them before any route resolves at all (`ROUTING_STRATEGY.md` §10).
