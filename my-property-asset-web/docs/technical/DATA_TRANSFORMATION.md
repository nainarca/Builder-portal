# Data Transformation — MyPropertyAsset Web Platform

**Companion to:** [`NG-007_API_Data_Access_Architecture.md`](NG-007_API_Data_Access_Architecture.md)
**Covers:** Data Mapping, DTO Philosophy, Validation Boundaries, Serialization Strategy, Error Propagation, Caching Integration, Performance Considerations, Future API Evolution, Technology Constraints.

## 18. Data Mapping

Every Repository maps a raw Supabase response into a `shared-models` (NG-001 §9) domain type before returning it — no raw Postgres row shape is ever allowed to leak into Feature or Component code. A `Project` type in `shared-models` mirrors A-007 ID-07's *business* shape, not whatever columns happen to exist in a table — this is the Angular-side expression of Information Domain boundaries, not a separate decision.

## 19. DTO Philosophy

Read DTOs and Write DTOs are **deliberately different types**, even for what looks like "the same" entity. A write payload excludes every server-computed field (`id`, `created_at`, derived rollups like Dashboard aggregates) — sending them back is meaningless at best, a data-integrity risk at worst. This asymmetry is intentional architecture, not an inconsistency a future document should "fix" by unifying the types.

## 20. Validation Boundaries

Client-side validation (Angular forms, filter/search inputs) is a UX convenience only. The backend's own constraints — already established across the business-architecture series and the backend's own IES documents — are the actual validation boundary. A Repository never assumes client-side validation was sufficient; a backend validation rejection is handled and propagated exactly like any other error (§22), never silently swallowed on the assumption "the form already checked this."

## 21. Serialization Strategy

JSON, matching Supabase's own PostgREST/RPC convention — not redesigned here, only confirmed as the wire format at a Repository's Supabase-facing edge. Everything past that edge works with `shared-models`' deserialized domain types, never raw JSON.

## 22. Error Propagation

Every Repository error flows to `infra-error-handling` (NG-003), consistent with NG-000 §11 and NG-006's Security Event Flow. An RLS denial is a **specific, distinctly-tagged case** of this general error flow — not folded into "generic network error" — because NG-006 already established that authorization failures must be logged loudly, not treated the same as a dropped connection.

## 26. Caching Integration

**Repositories do not cache.** They are stateless query/mutation wrappers. The Feature or Core Signal that *calls* a repository is what caches (NG-005's ownership model, restated as a hard boundary here) — a Repository holding its own cache would create exactly the "state owned in two places" problem NG-005 forbids. This is a precise, deliberately narrow boundary: Repository = stateless I/O. Signal = stateful cache. Never conflated, never blurred for convenience.

## 27. Performance Considerations

Narrow queries (`SUPABASE_INTEGRATION.md` §10) and mandatory pagination (§11) are this document's two concrete performance levers — both already stated, restated here only to confirm they're this section's answer, not a separate technique layered on top.

## 28. Future API Evolution

If the backend ever exposes something beyond pure PostgREST (a dedicated GraphQL layer, a custom REST facade), only the Repository layer's internals need to change. Feature, Service, and State code — which depend on a Repository's domain-shaped interface, never on PostgREST's own request/response shape — would be entirely unaffected. This is the concrete payoff of choosing the Repository Pattern at all (ADR-013), not a hypothetical benefit.

## 29. Technology Constraints

No Repository assumes a specific HTTP client or a particular Supabase SDK version's API surface — those are implementation details, deferred to whichever document actually writes the code (out of this document's scope entirely).
