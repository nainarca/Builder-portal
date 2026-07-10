# Architecture Principles — MyPropertyAsset Web Platform

**Companion to:** [`NG-001_Angular_Enterprise_Architecture.md`](NG-001_Angular_Enterprise_Architecture.md)
**Purpose:** The Angular-specific elaboration of NG-000's technical principles — nothing here contradicts `TECHNICAL_STANDARDS.md`; everything here makes it concrete for this specific frontend.

## Core Principles

| Principle | Elaboration |
|---|---|
| Enterprise Grade | Three independently deployable applications (§ Application Boundaries), not one monolith with route-level guarding |
| Modular | Every feature is an isolated library; no feature imports a sibling feature directly (`DEPENDENCY_RULES.md`) |
| Scalable | New products (Tenant Platform, future) are added as new apps in the same workspace, never by modifying an existing app |
| Maintainable | Layer boundaries (Presentation → Application → Domain → Backend Integration, plus cross-cutting Infrastructure) are the same shape in every app |
| White-label Ready | Theming is runtime, Organization-scoped configuration — never a build-time per-tenant artifact |
| Multi-Organization Ready | Organization Context is a single Core-layer service per app, never re-derived ad hoc per feature |
| Secure | Every architectural boundary is a build-level or RLS-level boundary, never a route-guard-only boundary (NG-000 §14 restated, made structural here) |
| Extensible | Shared/Core libraries have zero dependency on any app or feature — safe to add a fourth app without touching the first three |
| Testable | Layer separation means domain/business logic is testable without a rendered component or a live Supabase connection |
| Suitable for long-term SaaS evolution | The 3-app boundary already matches A-005 §8's Role Based Navigation finding that no product ever shares a navigation surface with another — this document's structure is not a new idea, it's the code-level consequence of a business-architecture finding four documents old |

## The One Property Worth Stating Plainly

**The web platform's codebase contains zero code path that can ever touch Restricted-Financial data (A-007 ID-13, A-008's absolute rule).** That data belongs entirely to the existing Flutter Owner Mobile App. This isn't an access-control decision this platform has to get right — it's a category of data that structurally does not exist in this repository at all. Defense in depth, taken to its logical conclusion: the strongest protection against leaking data you're not supposed to see is never having a code path that could reach it in the first place.

## Principle Provenance

Every principle above traces to a specific prior document — this file introduces no new business rule, only its Angular-architectural consequence:

| Principle | Source |
|---|---|
| App-per-product boundary | A-005 §8 Role Based Navigation |
| Organization Context as single Core service | A-007 §2 (Organization scope is the platform's primary information boundary), A-008 §2 |
| RLS as the real security boundary, guards as UX | NG-000 `TECHNICAL_STANDARDS.md` §14 |
| Cache keys must include Organization ID | NG-000 `TECHNICAL_STANDARDS.md` §18, §21 |
| Feature isolation, no sibling imports | NG-000 `TECHNICAL_STANDARDS.md` §4 |
