# Repository Architecture — MyPropertyAsset Web Platform

**Companion to:** [`NG-007_API_Data_Access_Architecture.md`](NG-007_API_Data_Access_Architecture.md)
**Resolves:** ADR-013 (Repository Pattern as mandatory data-access abstraction) — see main document §16.
**Covers:** Data Access Principles, Repository Pattern, Service Layer Responsibilities, Supabase Client Strategy, API Abstraction Layer.

## Data Domains — Scope Resolution (read first)

This prompt's "Data Domains" list includes **Properties, Loans, and Expenses**. These map directly to A-007 ID-13 (Owner Financial & Property Information) — the single Restricted-Financial domain this whole series has protected since NG-001 `ARCHITECTURE_PRINCIPLES.md`, and the exact domain NG-003 already refused to build a `property` library for. **No repository, query, mutation, or RPC pattern is designed in this document for Properties, Loans, or Expenses.** That data belongs exclusively to the Owner Mobile App's own Supabase integration, entirely outside this workspace. This is the second time this series has declined to fulfill part of an explicit prompt request outright (not merely reserved it) — same reasoning as NG-003, restated because the request recurred.

"Owners" is scoped narrowly to the touchpoints already in bounds: Owner Assignment (A-007 ID-08) and Invitation (ID-10) data — never owner financial/property detail.

## 1. Data Access Principles

- The Repository Pattern is the mandatory, sole interface between Feature/Core state (NG-005) and Supabase — no Feature, Service, or Component ever calls the Supabase client directly.
- Every repository method's async result crosses into Signal-based state at the exact boundary NG-005 `SIGNALS_STRATEGY.md` already defined — a repository returns a Promise/Observable at its own edge, converted to a Signal immediately by whichever Feature/Core service consumes it.
- **RLS remains the only real authorization enforcement** (NG-000 §14, NG-006 §22, restated once more because it's this platform's single most repeated — and most important — principle). Repositories never implement their own authorization logic; they query, and the backend decides what comes back.

## 2. Repository Pattern

One repository per in-scope Information Domain (A-007's 15 domains, minus ID-13) — Authentication, Organizations, Users, Builder Organizations, Projects, Units, Owner Assignment, Invitations, Documents, Notifications, Reports, Settings, Audit (concept-only, still gap-flagged), Search. Each repository's public interface is domain-shaped (`getProjectsForOrganization()`), never a raw table/column leak — a calling Feature never sees a Supabase table name, only a domain operation.

## 3. Service Layer Responsibilities

Sits between Feature components and Repositories, in NG-001's Application layer:

| Layer | Responsibility |
|---|---|
| Repository | *How* to get/send data — a thin, stateless wrapper around Supabase |
| Service | *What* to do with it, and *where* to hold it as state (NG-005's Feature/Core Signal ownership) |

Repository = stateless. Service (and the Signal it owns) = stateful. This distinction is never blurred — a repository that caches its own results would duplicate exactly the state NG-005 already assigns a single owner to.

## 4. Supabase Client Strategy

**One Supabase client instance per application** (not per Feature, not per repository) — injected via Core (alongside `shared-auth`, since the client is the session carrier). The client is never injected into a Feature or Component directly; only Repositories (Shared-tagged, per NG-002/NG-003's Nx tag matrix) touch it, mechanically enforced the same way every other boundary in this workspace already is.

## 5. API Abstraction Layer

"API" here means Supabase's own generated surface (PostgREST + RPC functions) — this platform never builds a hand-rolled backend API layer (NG-001 §1, restated). The Repository layer *is* the abstraction between that raw surface and the rest of the application — Feature/Service code depends on a repository's domain-shaped interface, never on PostgREST's own request/response shape.
