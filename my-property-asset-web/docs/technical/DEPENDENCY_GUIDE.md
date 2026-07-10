# Dependency Guide — MyPropertyAsset Web Platform

**Companion to:** [`NG-002_Angular_Workspace_Architecture.md`](NG-002_Angular_Workspace_Architecture.md)
**Purpose:** Makes NG-001's `DEPENDENCY_RULES.md` mechanically enforceable at the workspace/tooling level — no new rule is introduced here, only the concrete mechanism for enforcing the rules NG-001 already set.

## 22. Dependency Rules — Enforcement Mechanism

NG-001 stated six hard dependency rules and noted they "specify the rule, not the enforcement mechanism... once NG-002... makes the concrete tooling decision." This document makes that decision (§7/§17 of the main document): **Nx-style project tagging and dependency-constraint enforcement.**

Every project in the workspace carries a **tag** identifying its category:

| Tag | Applies to | Allowed to depend on |
|---|---|---|
| `type:app` | The three application projects | `type:feature`, `type:core`, `type:shared`, `type:util`, `type:theme` |
| `type:feature` | Every feature library | `type:core`, `type:shared`, `type:util`, `type:theme` — **never another `type:feature`** |
| `type:core` | `shared-auth`, `shared-organization-context`, `shared-rbac` | `type:shared`, `type:util`, `type:theme` — **never `type:app` or `type:feature`** |
| `type:shared` | `shared-data-access`, `shared-models` | `type:util` only |
| `type:util` | `util-*` libraries | Nothing within the workspace (leaf dependencies only) |
| `type:theme` | `theme-tokens`, `theme-runtime`, `shared-ui` | `type:util` only |

A **scope tag** additionally marks which application a `type:feature` project belongs to (`scope:public-website`, `scope:super-admin`, `scope:builder-portal`) — a feature library may only be consumed by the application project carrying the matching scope tag, mechanically preventing a Builder Portal feature from ever being imported into Super Admin, even by accident.

This tag matrix is the literal, enforceable version of NG-001 `DEPENDENCY_RULES.md`'s six rules — every one of those rules maps onto a row or a scope constraint above:

| NG-001 Rule | Enforced by |
|---|---|
| No circular dependencies | Tooling's dependency-graph cycle detection |
| `shared-*` never depends on app/feature | `type:core`/`type:shared` rows above never list `type:app` or `type:feature` as allowed |
| Features never depend on sibling features | `type:feature` row explicitly excludes `type:feature` |
| Backend Integration never depends on Presentation | `type:shared`'s data-access library is `type:shared`, never `type:app`/`type:feature` — the direction is structurally impossible to reverse |
| Applications never depend on each other | No `type:app` row lists another `type:app` as allowed |
| Infrastructure is cross-cutting | Logging/error-handling/config libraries are tagged `type:util`, consumable by every other tag |

## Verification

This tag matrix is designed to be checked automatically on every change (a `QUALITY_GATES.md`-level CI step, per NG-000) — a project declaring a dependency its tag doesn't permit fails the build, not just the code review. This is what makes the boundary real rather than aspirational: the same distinction NG-000 §14 draws between RLS (real enforcement) and route guards (UX convenience) applies here between tag-enforced dependencies (real enforcement) and a README saying "please don't import across features" (convention, easily eroded).
