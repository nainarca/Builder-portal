# Library Dependency Rules — MyPropertyAsset Web Platform

**Companion to:** [`NG-003_Angular_Library_Architecture.md`](NG-003_Angular_Library_Architecture.md)
**Naming note:** this prompt's deliverables list asked for a file named `DEPENDENCY_RULES.md` — that name already exists (created by NG-001, covering the five-layer model). This file is named `LIBRARY_DEPENDENCY_RULES.md` instead, to avoid overwriting NG-001's document. See `NG-003_Angular_Library_Architecture.md`'s Pre-Check Result for the full note.

## Package Dependency Rules

The Nx tag matrix from NG-002 `DEPENDENCY_GUIDE.md` governs every library in `LIBRARY_CATALOG.md` unchanged — this document adds no new dependency direction, only maps the newly-named libraries onto the existing categories:

| New library | Tag | Allowed to depend on (per NG-002's existing matrix) |
|---|---|---|
| `builder-portal-projects`, `builder-portal-units`, `builder-portal-documents`, `builder-portal-invitations`, `*-dashboard`, `*-reports`, `super-admin-users`, `super-admin-audit`, `*-settings` | `type:feature` | Core, Shared, Utility, Theme — never a sibling feature |
| `search` | `type:util` | Nothing within the workspace (leaf) |
| `infra-logging`, `infra-error-handling`, `infra-config`, `infra-caching`, `infra-feature-flags` | `type:util` (Infrastructure is util-category, cross-cutting) | Nothing within the workspace (leaf) — every other category may depend on Infrastructure, per NG-001 §5's cross-cutting rule |

## Circular Dependency Prevention

Unchanged from NG-001/NG-002: mechanically prevented by the same Nx tag-matrix cycle detection, not a new mechanism. The finer-grained split (Projects vs. Units vs. Documents vs. Invitations, all `type:feature, scope:builder-portal`) increases the *number* of sibling-import temptations within Builder Portal specifically — worth naming as a slightly elevated risk (§ Risks in the main document) precisely because there are now four adjacent feature libraries instead of two, all forbidden from importing each other directly.

## Cross Library Communication

Unchanged from NG-001 `FEATURE_BOUNDARIES.md`'s three channels (Core services, routing, Core-level events) — the finer-grained Builder Portal libraries make this rule *more* load-bearing, not different: e.g., the Documents library completing an upload and the Invitations library needing to know a unit's documents are ready now legitimately need one of the three channels, where the old combined "Handover" feature would have had that as an internal implementation detail.
