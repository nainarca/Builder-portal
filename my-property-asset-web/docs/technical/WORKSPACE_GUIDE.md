# Workspace Guide — MyPropertyAsset Web Platform

**Companion to:** [`NG-002_Angular_Workspace_Architecture.md`](NG-002_Angular_Workspace_Architecture.md)
**Covers:** Workspace Philosophy, Project Structure Principles, Workspace Naming Standards, Environment Organization, Configuration Organization, Workspace Scalability.

## 1. Workspace Philosophy

One workspace, three applications, one shared platform — not three separate repositories, not a monorepo-per-product. The workspace boundary matches NG-001's already-decided application boundary (ADR-009): everything that makes up "the Web Platform" lives here; the existing Flutter repository (`my_property_asset`) is a separate, untouched workspace entirely (NG-000 `REPOSITORY_STANDARDS.md` §33 restated).

## 2. Project Structure Principles

- Every application and every library is a **project** in the workspace sense — independently buildable, independently testable, with an explicit, declared set of allowed dependencies (not an implicit convention).
- A project's dependencies are **declared and machine-checkable**, not just documented — this is the specific requirement NG-001's `DEPENDENCY_RULES.md` left for this document to satisfy ("mechanically checkable... once NG-002 makes the concrete tooling decision," see `NG-002_Angular_Workspace_Architecture.md` §7 for that decision).
- No project is structured around a technical layer alone (e.g., no workspace-wide "components" project or "services" project) — every project has a clear business or technical *domain* identity (`PROJECT_ORGANIZATION.md`).

## 10. Workspace Naming Standards

| Element | Convention | Example |
|---|---|---|
| Application project name | `<product>` | `public-website`, `super-admin`, `builder-portal` |
| Shared/Core library name | `<domain>-<technical-role>` | `organization-context`, `rbac`, `data-access` |
| Feature library name (within an app) | `<app>-<feature>` | `builder-portal-project-unit-prep`, `super-admin-builder-onboarding` |
| Utility library name | `util-<purpose>` | `util-formatting`, `util-validation` |
| Theme library name | `theme-<purpose>` | `theme-tokens`, `theme-runtime` |

This extends, not replaces, NG-000 `CODING_STANDARDS.md` §5's kebab-case decision — project names are kebab-case by the same rule already governing files.

## 13. Environment Organization

Three environments (Dev, Staging, Production — NG-000 `TECHNICAL_STANDARDS.md` §22 restated), each with its own environment configuration file per application, resolved at build time for non-secret values and at runtime for Organization-scoped values (white-label configuration is explicitly **not** an environment concern — `LIBRARY_STRATEGY.md` §15).

## 14. Configuration Organization

Two distinct configuration tiers, never conflated:

| Tier | Contains | Resolved |
|---|---|---|
| Build-time / environment configuration | API endpoints, feature-flag defaults, environment identifiers | At build time, per NG-000 `TECHNICAL_STANDARDS.md` §21 |
| Runtime / Organization-scoped configuration | White-label branding, per-Organization feature toggles | At runtime, resolved during Shell bootstrap (NG-001 §14) |

## 23. Workspace Scalability

The workspace scales by adding projects, never by growing an existing project's internal complexity past its domain boundary. A new feature within an existing application is a new library project, not a growing folder inside an existing one — this is what keeps `DEPENDENCY_RULES.md`'s boundaries enforceable at scale rather than eroding as the codebase grows.
