# Library Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-002_Angular_Workspace_Architecture.md`](NG-002_Angular_Workspace_Architecture.md)
**Covers:** Shared Library Strategy, Library Naming Standards (detail beyond `WORKSPACE_GUIDE.md`'s table), Shared Asset Organization, Theme Organization, Internationalization Organization.

## 6. Shared Library Strategy — the Technical Domain Taxonomy

NG-001 established six `shared-*` libraries as one flat tier. This document organizes them (and adds two new categories NG-001 didn't need to name yet) into four technical-domain categories:

| Category | Purpose | Libraries |
|---|---|---|
| **Core** | Cross-cutting platform concerns every authenticated application needs | `shared-auth`, `shared-organization-context`, `shared-rbac` (all three named by NG-001) |
| **Shared (domain-shaped)** | Libraries whose shape mirrors a business domain (A-007), reused because more than one application touches that domain | `shared-data-access`, `shared-models` (both named by NG-001) |
| **Utility** | Pure, business-agnostic helper functions — **new category, not named by NG-001**, reserved here because every workspace this size accumulates genuinely domain-free helpers (formatting, validation primitives) and giving them a home now prevents them from being smuggled into a feature or a Core library later | `util-*` (no specific libraries named yet — reserved boundary only) |
| **Theme** | Runtime, Organization-scoped white-label presentation — **new category, not named by NG-001**, but directly required by NG-001 §13's principle that theming must be runtime-resolved, not build-time | `theme-tokens` (the data contract for a theme), `theme-runtime` (the resolution/application mechanism) — both reserved boundaries only; actual content is UI-001's job |

`shared-ui` (NG-001's sixth library) sits partially across Core and Theme — it is the Design System *component* library (structure/behavior, Core-like in that every app needs it) that *consumes* Theme libraries' tokens (data) rather than owning them. This split (components vs. tokens) is what makes white-label actually runtime-swappable: a component never hard-codes a color, it reads a token.

## 11. Library Naming Standards (detail)

Every library name declares its category as a prefix or is unambiguous from context (`shared-*`, `util-*`, `theme-*`, or an application-prefixed feature name like `builder-portal-*`) — a workspace-wide lint rule can therefore verify a library's declared dependencies match what its name-category is allowed to depend on (`DEPENDENCY_GUIDE.md`), without needing a human to remember the rule each time.

## 12. Shared Asset Organization

Static assets (images, icons, fonts) used by more than one application live in a shared assets library, not duplicated per application. Organization-specific white-label assets (a Builder's logo, for instance) are **not** workspace assets at all — they are Organization-scoped data (A-007 ID-04), fetched at runtime from Supabase Storage, never bundled into the Angular build. This is the same runtime-vs-build-time distinction as `WORKSPACE_GUIDE.md` §14, applied to assets specifically.

## 15. Theme Organization

Reserved as its own library category (above) specifically because NG-001 §13 already established the *principle* (runtime, Organization-scoped, never build-time) — this document's contribution is giving that principle a concrete project boundary (`theme-tokens`, `theme-runtime`) so UI-001 has somewhere to put the actual mechanism when it's designed, rather than needing to invent the boundary itself.

## 16. Internationalization Organization

**No prior document — not A-001 through A-009, not NG-000, not NG-001 — has ever named internationalization as a platform requirement.** This document reserves an `i18n` library boundary (within the Theme/Core organizational space, since locale is conceptually similar to theme: a runtime-resolved presentation concern) purely because doing so costs nothing now and avoids a much more disruptive retrofit later if it does become a requirement — but this is a reserved placeholder, not a designed feature, and no future document should treat its existence here as evidence that multi-language support was ever actually scoped. Flagged explicitly, consistent with this series' treatment of every previously unbacked item (e.g., NG-001's "Partner Portal").
