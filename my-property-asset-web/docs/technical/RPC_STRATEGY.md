# RPC Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-007_API_Data_Access_Architecture.md`](NG-007_API_Data_Access_Architecture.md)
**Covers:** RPC Usage Strategy, Retry Strategy.

## 6. RPC Usage Strategy

A Repository calls an existing backend RPC function for any operation requiring atomicity beyond a single-table insert/update — it never composes multiple raw Supabase calls client-side to fake an atomic operation the backend should provide as one RPC instead. This mirrors a pattern already proven on the backend side (the my_property_asset project's own cross-row-invariant RPCs), reused as a principle here, not reinvented.

**The Support Access invocation mechanism (A-008 §7, ADR-008 candidate in `docs/adr/ADR_INDEX.md`) is exactly the kind of operation that should be an RPC once it's actually designed** — granting a time-boxed, audited elevation is a multi-step, atomicity-sensitive operation (create the grant record, log the audit event, set an expiry) that belongs behind one RPC call, not three separate client-issued statements. This document names it as the natural RPC candidate; it does not design the RPC itself, consistent with this document's own "no SQL, no implementation" constraint.

## 23. Retry Strategy

| Error type | Retry behavior |
|---|---|
| Transient network failure | Limited automatic retry with backoff, at the Repository boundary |
| Authorization denial (RLS rejection) | **Never automatically retried** — a denial is not a transient-failure pattern, it is a repeated unauthorized attempt if retried, and NG-006's Security Event Flow treats it as something to log, not something to quietly retry into eventually looking like it succeeded |
| Validation rejection (backend constraint violation) | Not retried — surfaced to the user as a correctable error, since retrying identical invalid input will fail identically |
