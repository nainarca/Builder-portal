# Source Tree — MyPropertyAsset Web Platform

**Companion to:** [`NG-008_Folder_Structure_Architecture.md`](NG-008_Folder_Structure_Architecture.md)
**Covers:** Workspace Root Structure, Application Source Tree, Library Source Tree, Generated Code Placement, Build Folder Placement.

## 1. Workspace Root Structure

```
my-property-asset-web/
├── apps/                     — the three application projects + their e2e projects (§2)
├── libs/                     — every Core/Shared/Feature/Utility/Theme/Infrastructure library (§3)
├── docs/                     — this documentation series itself (A-series, NG-series, ADRs) — already exists
├── tools/                    — Nx workspace generators/scripts, not application code (see NAMING_STANDARDS.md § Scripts)
├── nx.json                   — Nx workspace configuration; carries the tag-matrix constraints (DEPENDENCY_GUIDE.md §22)
├── tsconfig.base.json         — workspace-wide path mappings, one entry per library's public API
├── package.json
└── .github/ (or equivalent)  — CI pipeline definitions (QUALITY_GATES.md)
```

**Rationale:** `apps/` and `libs/` as top-level siblings is the direct physical expression of NG-001's Application/Library split (ADR-009) — an application project can never accidentally "contain" a library, because they are not nested inside each other at all.

## 2. Application Source Tree

One folder per application under `apps/`, plus one `-e2e` folder per application (Testing Folder Placement, §18 of the main document) — never combined into a single shared e2e project, since ADR-009 already makes the three applications independently deployable and independently testable.

```
apps/
├── public-website/
│   └── src/
│       ├── app/
│       │   ├── app.ts                     — Shell (NG-001 §6), root routes only
│       │   ├── app.routes.ts              — Public Website's own route table (ROUTING_STRATEGY.md)
│       │   └── core/                      — this app's Core composition (§5 of main document — no auth here, per AUTHENTICATION_ARCHITECTURE.md §1)
│       ├── assets/                        — app-specific, non-shared assets only (ASSET_STRUCTURE.md)
│       ├── environments/                  — this app's environment files (§16 of main document)
│       ├── styles/                        — app-level SCSS entry point (SCSS_STRUCTURE.md)
│       ├── index.html
│       └── main.ts
├── public-website-e2e/
├── super-admin/
│   └── src/
│       ├── app/
│       │   ├── app.ts
│       │   ├── app.routes.ts
│       │   └── core/                      — auth → Organization Context → RBAC bootstrap sequence (AUTHENTICATION_ARCHITECTURE.md §4)
│       ├── assets/
│       ├── environments/
│       ├── styles/
│       ├── index.html
│       └── main.ts
├── super-admin-e2e/
├── builder-portal/
│   └── src/  (same shape as super-admin/src)
└── builder-portal-e2e/
```

**No `app.module.ts` anywhere in this tree.** Per ADR-001 (§32 of the main document), every application bootstraps via `bootstrapApplication()` against a standalone root component — there is no NgModule to place, so no NgModule-shaped folder exists in this tree at all. This is a direct, physical consequence of ADR-001, not a separate naming choice.

## 3. Library Source Tree

`libs/` is organized by **technical category first, project second** — matching `LIBRARY_STRATEGY.md` §6's four categories plus Feature and Infrastructure, so a reader (or Cursor AI, per NG-000 `AI_DEVELOPMENT_GUIDE.md`) can answer "what kind of library is this" from the path alone, before ever opening a file.

```
libs/
├── core/
│   ├── auth/                          — project: shared-auth
│   ├── organization-context/          — project: shared-organization-context
│   └── rbac/                          — project: shared-rbac
│
├── shared/
│   ├── data-access/                   — project: shared-data-access (NG-007's Repository layer lives here — one sub-path per Information Domain, see §6 of main document)
│   ├── models/                        — project: shared-models
│   └── ui/                            — project: shared-ui
│
├── util/
│   ├── formatting/                    — project: util-formatting (reserved boundary — LIBRARY_STRATEGY.md §6, not yet populated)
│   ├── validation/                    — project: util-validation (reserved boundary, same status)
│   └── search/                        — project: search (A-007 SEARCH_ARCHITECTURE.md)
│
├── theme/
│   ├── tokens/                        — project: theme-tokens
│   └── runtime/                       — project: theme-runtime
│
├── infra/
│   ├── logging/                       — project: infra-logging
│   ├── error-handling/                — project: infra-error-handling
│   ├── config/                        — project: infra-config
│   ├── caching/                       — project: infra-caching
│   └── feature-flags/                 — project: infra-feature-flags
│
└── feature/
    ├── public-website/
    │   └── marketing-conversion/       — project: public-website-marketing-conversion
    │
    ├── super-admin/
    │   ├── builder-onboarding/         — project: super-admin-builder-onboarding
    │   ├── tenancy-branding/           — project: super-admin-tenancy-branding
    │   ├── commercial/                 — project: super-admin-commercial
    │   ├── operations/                 — project: super-admin-operations
    │   ├── audit/                      — project: super-admin-audit (no backing A-003A story — inherits A-004 §14's gap flag)
    │   ├── users/                      — project: super-admin-users (no backing A-003A story — same gap flag)
    │   ├── dashboard/                  — project: super-admin-dashboard (computed()-only, STATE_OWNERSHIP.md § Why Dashboard Is Never Its Own Fetch)
    │   ├── settings/                   — project: super-admin-settings
    │   └── communication/              — project: super-admin-communication (naming resolved — see § Communication Naming below)
    │
    └── builder-portal/
        ├── projects/                   — project: builder-portal-projects (backend-dependent — 15th consecutive document carrying this gap, see main document §14 Risks)
        ├── units/                      — project: builder-portal-units (same dependency)
        ├── documents/                  — project: builder-portal-documents
        ├── invitations/                — project: builder-portal-invitations
        ├── reporting/                  — project: builder-portal-reports
        ├── dashboard/                  — project: builder-portal-dashboard (computed()-only, same rule as Super Admin's)
        ├── settings/                   — project: builder-portal-settings
        └── communication/              — project: builder-portal-communication
```

**No `property/`, `loans/`, or `expenses/` folder exists anywhere in this tree, under any category.** This is the physical, folder-level restatement of NG-003's Property refusal and NG-007's Data Domains refusal — the absence itself is the architectural guarantee, not merely a note about one.

### Communication Naming — resolved here

`LIBRARY_CATALOG.md` #10 named the Notification feature `communication` generically, noting "one per app." That was accurate at the library-catalog level but under-specified for a physical folder — this document is where a name actually has to resolve to one path. Applying `WORKSPACE_GUIDE.md` §10's `<app>-<feature>` convention (the same convention already used for every other per-app feature) resolves it cleanly: `super-admin-communication` and `builder-portal-communication`, two distinct projects, not one library instantiated twice. Public Website has no Communication feature at all (`FEATURE_BOUNDARIES.md` — it needs no in-app notification surface).

### Internal library shape (every category alike)

```
<category>/<name>/
├── src/
│   ├── index.ts              — the library's ONLY public export surface (PROJECT_ORGANIZATION.md §9)
│   └── lib/                  — everything else; never imported from outside via a deep path
├── project.json               — Nx project config; carries this project's tag(s) (DEPENDENCY_GUIDE.md §22)
├── tsconfig.lib.json
└── README.md                  — maps this library back to its Information Domain/Working Module (CODING_STANDARDS.md §10)
```

A `type:feature` library's `src/lib/` additionally contains a `<feature>.routes.ts` (lazy-loaded route table, LAZY_LOADING_STRATEGY.md) — never a `<feature>.module.ts` (ADR-001, restated from §2 above).

## 4. Generated Code Placement

Two legitimate sources of generated code in this workspace, both isolated so they are never hand-edited and never mistaken for authored code:

| Source | Placement | Notes |
|---|---|---|
| Nx build output | `dist/` (workspace root, git-ignored) | Never committed — this is compiled output, not source |
| Supabase-generated TypeScript types (if the team adopts `supabase gen types`, a tooling choice this document does not mandate) | `libs/shared/models/src/lib/generated/` | Reserved sub-path only — `shared-models` already owns the domain-type boundary (`APPLICATION_ARCHITECTURE.md`), so *if* generated types are ever adopted, they belong inside the library that already owns types, isolated in their own sub-path, never hand-edited, never the same file as the hand-authored domain types `DATA_TRANSFORMATION.md` §18 requires |

No other generated-code source is anticipated by any prior document in this series.

## 5. Build Folder Placement

`dist/<app-or-lib-name>/`, one output folder per project, mirroring the `apps/`/`libs/` source structure exactly — this is Nx's own default and this document does not deviate from it. `dist/` is git-ignored workspace-wide (`REPOSITORY_STANDARDS.md` §6 restated for this specific artifact).
