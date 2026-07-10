# Dependency Rules — MyPropertyAsset Web Platform

**Companion to:** [`NG-001_Angular_Enterprise_Architecture.md`](NG-001_Angular_Enterprise_Architecture.md)
**Purpose:** The complete, non-negotiable dependency direction rules for the workspace — extends NG-000 `TECHNICAL_STANDARDS.md` §3–4 with the application/feature layer this document adds.

## The Full Dependency Graph (allowed directions only)

```
Application (Public Website / Super Admin / Builder Portal)
        ↓ depends on
Feature (isolated per application, no sibling imports)
        ↓ depends on
Core (app-level singleton services)
        ↓ depends on
Shared (shared-ui, shared-auth, shared-rbac, shared-organization-context,
        shared-data-access, shared-models — workspace-wide)
        ↓ depends on
Infrastructure (cross-cutting: logging, error handling, config — NG-000 §11–13, §22)
        ↓ depends on
Backend Integration (Supabase client — the only layer touching the network)
```

## Hard Rules

1. **No circular dependencies**, anywhere in this graph — enforced by CI lint rule (a `QUALITY_GATES.md` concern, not designed further here), not just code review discipline.
2. **`shared-*` libraries never depend on any application or feature.** A shared library that needs to know which app it's running in has a design flaw, not a legitimate use case.
3. **Features never depend on sibling features**, within or across applications (`FEATURE_BOUNDARIES.md`).
4. **`Backend Integration` never depends on `Presentation`.** A Supabase data-access wrapper has no business importing a component.
5. **Applications never depend on each other.** Public Website, Super Admin, and Builder Portal share code only through `shared-*` — never by one app importing from another app's source.
6. **`Infrastructure` is cross-cutting, not sequential** — every layer above it may depend on it directly (logging, error handling, and configuration are needed everywhere, not funneled through Shared first). This is the one deliberate exception to strict linear layering, and it is exactly the exception NG-000 itself anticipated (`TECHNICAL_STANDARDS.md` §3's four-layer model plus this document's addition of Infrastructure as a cross-cutting fifth).

## Reconciliation with NG-000

NG-000's `TECHNICAL_STANDARDS.md` §3 defined four layers: Presentation → Application → Domain → Data Access. This document's five-layer treatment (Presentation → Application → Domain → Infrastructure → Backend Integration) does not contradict that — "Backend Integration" here is NG-000's "Data Access" layer, named more specifically for this document's purposes, and "Infrastructure" is a new, explicitly cross-cutting addition, not a fifth sequential step. NG-000 takes precedence per this document's own governing instruction; nothing here overrides it, only elaborates it.

## Verification

Every dependency rule above is meant to be **mechanically checkable** (e.g., via an Nx-style module-boundary lint rule or equivalent) once NG-002 (Workspace & Project Structure) makes the concrete tooling decision — this document specifies the rule, not the enforcement mechanism, consistent with its own scope (no folders, no tooling configuration).
