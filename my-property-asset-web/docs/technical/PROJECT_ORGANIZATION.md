# Project Organization — MyPropertyAsset Web Platform

**Companion to:** [`NG-002_Angular_Workspace_Architecture.md`](NG-002_Angular_Workspace_Architecture.md)
**Covers:** Application, Core, and Feature Organization; Business/Technical Domain Separation; Project Boundaries; Code Ownership.

## The Three-Axis Organization Model

This workspace organizes along three independent axes simultaneously — understanding which axis a question belongs to resolves most workspace-structure ambiguity before it starts:

| Axis | Organized by | Governed by |
|---|---|---|
| **Application axis** | Product (Public Website / Super Admin / Builder Portal) | NG-001 §4, ADR-009 |
| **Business domain axis** | A-007's Information Domains / A-007 §2.1's Working Modules, expressed as Feature projects within an application | NG-001 §7, `FEATURE_BOUNDARIES.md` |
| **Technical domain axis** | Core / Shared / Utility / Theme libraries, cutting across all three applications | This document, §6–7 below |

## 3. Application Organization

Three application projects, one per product (NG-001 §4 restated) — each an independently buildable, independently deployable Angular application, each with exactly one Shell (NG-001 §6).

## 4. Core Platform Organization

Per-application Core (NG-001 §8 restated): each application composes its own bootstrap sequence from shared primitives. Core is not itself a shared library — it is the application-specific *composition* of shared libraries into that application's bootstrap.

## 5. Feature Organization

Every feature named in `FEATURE_BOUNDARIES.md` is its own library project, scoped to exactly one application (no feature library is shared across applications — that would violate NG-001's application-isolation rationale). Feature projects depend on Core and Shared/Utility/Theme libraries; they never depend on each other (`DEPENDENCY_GUIDE.md`).

## 7. Business Domain Separation

Feature projects are named and bounded by A-007's Information Domains, not by arbitrary technical convenience — `builder-portal-project-unit-prep` exists because ID-07 (Project & Unit Information) exists as a business concept, not because "it seemed like a reasonable folder." This is a deliberate choice: it keeps the codebase's structure legible against the business architecture that justifies it, the same discipline this entire document series has practiced from A-004 onward.

## 8. Technical Domain Separation

Orthogonal to business domain: Core, Shared, Utility, and Theme libraries are organized by *technical role*, not business meaning — `util-formatting` has no business domain at all, it's a pure-function helper library usable by any feature in any application. See `LIBRARY_STRATEGY.md` for the full technical-domain taxonomy.

## 9. Project Boundaries

A project boundary is crossed only through its declared public API (an explicit export surface, not "whatever happens to be exported"). This is the concrete, project-level expression of NG-001's `DEPENDENCY_RULES.md` rule that features never import each other's internals — at the workspace level, "internals" means anything not in a project's declared public surface.

## 21. Code Ownership Strategy

| Project type | Conceptual owner |
|---|---|
| Public Website application + its features | Public Website team |
| Super Admin application + its features | Super Admin team |
| Builder Portal application + its features | Builder Portal team |
| Core / Shared / Utility / Theme libraries | Platform team (cross-application) — changes here require awareness of every consuming application, per NG-001's "shared never depends on apps, but apps all depend on shared" rule cutting both ways for review purposes |

This is a conceptual ownership model (who *should* review a change), not an org-chart requirement — the workspace doesn't assume how many actual teams exist, only that platform-wide libraries need broader review than a single feature does.
