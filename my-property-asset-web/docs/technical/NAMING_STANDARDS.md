# Naming Standards — MyPropertyAsset Web Platform

**Companion to:** [`NG-008_Folder_Structure_Architecture.md`](NG-008_Folder_Structure_Architecture.md)
**Covers:** Naming Conventions (folder/project level — extends `CODING_STANDARDS.md` §5's file/code-level table, does not restate it).

## Folder & Project Naming

| Element | Convention | Example | Source |
|---|---|---|---|
| Category folder (`libs/` first level) | lowercase, singular | `libs/core/`, `libs/util/`, `libs/theme/`, `libs/infra/`, `libs/shared/`, `libs/feature/` | New — this document |
| Feature sub-grouping (`libs/feature/` second level) | matches application project name exactly | `libs/feature/builder-portal/` | New — this document, mirrors `WORKSPACE_GUIDE.md` §10's app names |
| Library folder name (leaf) | the project's name with its category prefix stripped | `libs/core/auth/` for project `shared-auth`; `libs/feature/builder-portal/projects/` for project `builder-portal-projects` | New — this document |
| Application folder name | matches `WORKSPACE_GUIDE.md` §10 exactly | `apps/public-website/`, `apps/super-admin/`, `apps/builder-portal/` | `WORKSPACE_GUIDE.md` §10 |
| E2E project folder | `<app>-e2e` | `apps/builder-portal-e2e/` | New — this document |
| Route file | `<feature>.routes.ts` | `projects.routes.ts` | New — this document, consequence of ADR-001 (§32) |
| Public API barrel | always `index.ts`, never `public-api.ts` or any other name | `libs/core/auth/src/index.ts` | New — this document, for consistency across all ~30 projects |

## Why the folder path and the project name legitimately differ

`libs/core/auth/`'s project is named `shared-auth`, not `core-auth` or `auth`. This is intentional, not an inconsistency: the **folder path** communicates technical category (where a reader looks to understand "what kind of thing is this"), while the **project name** (`WORKSPACE_GUIDE.md` §10's `<domain>-<technical-role>` convention, already established by NG-002) communicates the project's own identity for tooling purposes (imports, `nx graph`, CI output, `tsconfig.base.json` aliases). Forcing them to be identical would mean either the folder structure loses its category-grouping value, or every project name would need a `core-`/`util-`/`theme-` prefix that NG-002 never asked for and that would collide with the `shared-*` prefix already in wide use. This document keeps both conventions, each doing the job it's actually good at, rather than collapsing them into one and losing something either way.

## Naming Rules Carried Forward Unchanged

- Files: kebab-case (`CODING_STANDARDS.md` §5) — applies identically inside every folder this document defines.
- Classes/Components/Services: PascalCase — unaffected by folder placement.
- Project names overall: kebab-case (`WORKSPACE_GUIDE.md` §10) — this document's project-name examples above are all consistent with that rule; nothing here introduces an exception.
