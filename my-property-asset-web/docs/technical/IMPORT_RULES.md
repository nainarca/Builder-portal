# Import Rules — MyPropertyAsset Web Platform

**Companion to:** [`NG-008_Folder_Structure_Architecture.md`](NG-008_Folder_Structure_Architecture.md)
**Covers:** Import Rules, Circular Dependency Prevention.
**Note:** This document does not introduce new dependency *rules* — `DEPENDENCY_RULES.md` (NG-001) and `LIBRARY_DEPENDENCY_RULES.md` (NG-003) already state them, and `DEPENDENCY_GUIDE.md` (NG-002) already makes them mechanically enforceable via the Nx tag matrix. This document's sole job is the one thing those three didn't yet cover: **the physical import statement itself** — what path a `import` line is allowed to reference, once source code actually exists.

## 1. Import Rules

- **Every cross-project import goes through a project's public API path** (`tsconfig.base.json`'s mapped alias, e.g. `@my-property-asset-web/shared-data-access`), **never a relative path that reaches outside the current project** (e.g. `../../../libs/shared/data-access/src/lib/...`). A relative import cannot cross a project boundary — physically, structurally impossible once `tsconfig.base.json` and Nx's own module boundary lint rule are both in place — enforced by the same tag matrix as everything else in this section.
- **Within a project**, relative imports are normal and expected (`./project-list.component` importing `../models/project.model`) — this rule only governs imports that cross a `libs/<category>/<name>/` or `apps/<name>/` boundary.
- **A project's `src/index.ts` is the only file another project may import from.** Anything under `src/lib/` not re-exported from `index.ts` is invisible outside the project, by construction — this is the literal file-system enforcement of `PROJECT_ORGANIZATION.md` §9's "declared public API" rule, which until this document existed only as a stated convention.
- No import ever reaches into an `apps/` folder from a `libs/` folder, in either direction across applications, or from one feature into a sibling feature's `src/lib/` — each of these is additionally caught by the tag matrix (`DEPENDENCY_GUIDE.md` §22), so a violation fails the build, not just a code review.

## 2. Circular Dependency Prevention

- The tag matrix (`DEPENDENCY_GUIDE.md` §22) already makes most cycles structurally impossible: `type:util` depends on nothing in-workspace, `type:core`/`type:theme` depend only downward, `type:shared` depends only on `type:util`, `type:feature` never depends on another `type:feature`, and no `type:app` is depended upon by anything. A cycle would require at least one project to violate its own tag's allowed-dependency row — which is exactly what the tag matrix's CI-enforced check (NG-002 `DEPENDENCY_GUIDE.md` § Verification) rejects at merge time.
- The one category the tag matrix alone doesn't fully police is accidental same-category cycles (e.g. two `type:util` libraries importing each other) — this document's addition: **every `util-*` library is a leaf** by definition (§ Utility Folder Placement, main document §17) and must declare zero dependencies on any other workspace project, `util-*` included. A `util-*` library needing another `util-*` library's logic is a signal the two should be one library, not two that depend on each other.
- Nx's own dependency-graph command (`nx graph`) is the verification tool, run in CI per `QUALITY_GATES.md` — this document names it as the mechanism, consistent with `DEPENDENCY_GUIDE.md`'s own "checked automatically on every change" principle; it does not redesign CI itself.
