# Supabase Integration — MyPropertyAsset Web Platform

**Companion to:** [`NG-007_API_Data_Access_Architecture.md`](NG-007_API_Data_Access_Architecture.md)
**Covers:** CRUD Strategy, Read Model Strategy, Write Model Strategy, Query Optimization, Pagination Strategy, Filtering Strategy, Sorting Strategy.

## 7. CRUD Strategy

CRUD operations map directly onto `PERMISSION_MATRIX.md`'s existing vocabulary (Full = full CRUD, Operate = Create/Read/Update no Delete, Contribute = Create/Read only, Read = read-only, etc.) — the same rule `RBAC_INTEGRATION.md` already established (one permission vocabulary, never a parallel one), now applied to the specific operations a Repository exposes. Delete semantics (soft vs. hard) are whatever the backend actually implements — not a client-side decision this document invents.

## 8. Read Model Strategy

A read model is shaped for what the UI needs, which may mean a repository requests joined/related data in one call rather than forcing the Feature to compose multiple round trips — but it is always mapped into a `shared-models` (NG-001 §9) domain type before it leaves the Repository, never left in Supabase's raw response shape.

## 9. Write Model Strategy

A write model is shaped for what a mutation needs to send — **deliberately not required to be the same type as its corresponding read model.** A write payload never includes server-computed fields (`id`, `created_at`, derived rollups) — sending them back would be meaningless at best and a data-integrity risk at worst. This asymmetry is a stated rule (`DATA_TRANSFORMATION.md` § DTO Philosophy elaborates further), not an inconsistency.

## 10. Query Optimization

Repositories request only the fields/relations a Feature actually needs — no default `select('*')` pattern. This extends NG-005's fine-grained-reactivity performance principle from the state layer into the query layer: fetch narrow, cache narrow (in the owning Feature's Signal), recompute narrow.

## 11. Pagination Strategy

Every list-returning repository method accepts a pagination parameter by default — none returns an unbounded result set. The specific mechanism (cursor vs. offset) is an implementation detail, not decided here; the *principle* that pagination is never optional is the architectural commitment.

## 12. Filtering Strategy

Filter parameters are passed **into** a repository's read method and applied server-side — never applied client-side against an already-fetched, unfiltered dataset. Filtering client-side after a full fetch would both defeat pagination and risk having fetched data the user's RLS scope shouldn't have returned unfiltered in the first place. Ties directly to A-007 `SEARCH_ARCHITECTURE.md` and the `search` utility library (NG-003) for how filter/query state itself is shaped before it reaches a repository.

## 13. Sorting Strategy

Same rule as Filtering — sort parameters are passed into the repository call, resolved server-side, never re-sorted client-side against a partial page of results (which would produce a locally-correct but globally-wrong order once pagination is involved).
