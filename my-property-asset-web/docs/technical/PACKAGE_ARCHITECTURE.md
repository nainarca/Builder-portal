# Package Architecture — MyPropertyAsset Web Platform

**Companion to:** [`NG-003_Angular_Library_Architecture.md`](NG-003_Angular_Library_Architecture.md)
**Covers:** Package Boundaries, Library Responsibilities, Internal vs. Public Libraries, Plugin Architecture, Extension Strategy.

## Package Boundaries

Every library in `LIBRARY_CATALOG.md` has exactly one of five category tags (from NG-002 `DEPENDENCY_GUIDE.md`, unchanged): `type:core`, `type:shared`, `type:util`, `type:theme`, `type:feature` (further scoped by application for the last). A package's boundary is its declared public export surface — nothing else about its internals is reachable by any consumer, mechanically enforced via the Nx tag matrix (ADR-010).

## Library Responsibilities (by category)

| Category | Responsibility | Never responsible for |
|---|---|---|
| Core | Cross-cutting platform concerns every authenticated app needs (auth session, Organization context, RBAC) | Business logic specific to one feature |
| Shared | Domain-shaped data access mirroring A-007's Information Domains | UI rendering |
| Utility | Pure, business-agnostic helper logic (formatting, search-query shaping, validation primitives) | Anything that reads Organization Context or makes a network call |
| Infrastructure | Logging, error handling, configuration, caching, feature flags — needed everywhere, owned by nothing business-specific | Business rules of any kind |
| Theme | Runtime, Organization-scoped presentation tokens and their application | Component logic beyond applying a token |
| Feature | One business capability, scoped to one application | Anything another feature needs — that need routes through Core/Shared/Utility/Theme instead |

## Internal vs. Public Libraries

"Public" here means *workspace-public* (has a declared export surface consumed by more than its own application), not npm-published. Every Core/Shared/Utility/Theme library is Public by definition — that's the entire reason it isn't a Feature library. Every Feature library is Internal by default (consumed only by its own application's Shell/routing) unless a specific, documented reason promotes part of it — and no Feature library has been promoted by this document.

## Plugin Architecture / Extension Strategy

A new capability "plugs in" to this workspace by declaring the correct tags and consuming existing Core/Shared/Utility/Theme libraries — it never requires modifying an existing library to special-case it. This is the concrete library-level expression of NG-001 §14's scalability claim and NG-002's Future Expansion Model: `infra-feature-flags` (`LIBRARY_CATALOG.md` #27) is the literal mechanism a new, not-yet-backend-ready feature uses to plug in disabled, rather than waiting to exist until its dependency resolves.
