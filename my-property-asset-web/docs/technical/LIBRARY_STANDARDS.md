# Library Standards — MyPropertyAsset Web Platform

**Companion to:** [`NG-003_Angular_Library_Architecture.md`](NG-003_Angular_Library_Architecture.md)
**Covers:** Package Naming Standards, Library Version Strategy, Library Ownership, Technology Constraints.

## Package Naming Standards

Extends NG-002 `WORKSPACE_GUIDE.md` §10 with the categories this document adds:

| Category | Pattern | Example |
|---|---|---|
| Infrastructure | `infra-<purpose>` | `infra-logging`, `infra-feature-flags` |
| Search (Utility) | `search` | *(single library, no further split needed at current scope)* |
| Per-app Feature (finer-grained) | `<app>-<capability>` | `builder-portal-projects`, `builder-portal-units` |

## Library Version Strategy

Every library in this workspace versions with the platform release as a whole (NG-000 ADR-007, Semantic Versioning) — there is no independent per-library version number, because these are internal workspace libraries, not independently published packages. If a library is ever extracted for independent publication (e.g., `shared-ui` becoming a standalone design-system package), it adopts its own SemVer line at that point — not designed further here.

## Library Ownership

Extends NG-002 `PROJECT_ORGANIZATION.md` §21: the new Infrastructure libraries (`infra-*`) are Platform-team-owned, same as Core/Shared/Utility/Theme — cross-cutting libraries are never owned by a single application team, because every application depends on them.

## Technology Constraints

- No library may assume a specific component architecture pattern (standalone vs. NgModule) — that decision belongs to NG-004 (Folder Structure), per ADR-001's redirection chain (NG-001 → NG-002 → NG-004), and this document does not pre-empt it a fourth time.
- No library may assume a specific state-management technology (Signals vs. RxJS-based) — ADR-004 remains NG-006's decision.
- `infra-feature-flags`'s actual flag-evaluation mechanism (a config service, a third-party tool, a simple boolean map) is not designed here — only its role (the concrete home for NG-000 §28's feature-toggle strategy) is established.
