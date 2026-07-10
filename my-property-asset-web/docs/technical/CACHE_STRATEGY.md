# Cache Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-005_State_Management_Strategy.md`](NG-005_State_Management_Strategy.md)
**Covers:** Cache Strategy, State Synchronization, Persistence Strategy, Refresh Strategy, Optimistic Update Strategy, Error Recovery, Memory Management.

## Server State vs. Client State

Server state — anything sourced from Supabase (Organizations, Projects, Units, Documents, Invitations) — is **cached, not owned**. The database remains the single source of truth (NG-001 §5's Backend Integration layer, restated); every Signal holding this data is a cache with a defined staleness policy below, never assumed authoritative if a conflict with the server arises. Client state (form inputs, filter/search text, UI toggles, navigation state) has no server equivalent and is genuinely, permanently client-owned.

## Cache Strategy

**Every cache key that is Organization-scoped includes the Organization ID, without exception** — this is NG-001 §16 and NG-003 `LIBRARY_CATALOG.md` #26's rule, restated here specifically for Signal-based caches rather than left as a general principle: a `builder-portal-projects` list Signal is keyed by the session's Organization ID, so a session change (however rare, given ADR-011's single-Organization-per-session Builder Portal model) can never serve stale data from a different Organization's cache entry.

## State Synchronization

Single-tab is the only supported scope for V1 — no cross-tab synchronization (BroadcastChannel or equivalent) is designed, since no prior document has required it. **Within a tab, synchronization is automatic by construction** (`SIGNALS_STRATEGY.md`'s core argument) — this is worth restating here specifically as a *cache* property: there is no separate "sync the cache with the UI" step, because the UI *is* a template reading the same Signal the cache lives in.

## Persistence Strategy

| State | Persists via | Notes |
|---|---|---|
| Auth session | Supabase Auth's own existing session persistence | Not redesigned |
| Organization Context | Re-resolved at every bootstrap, not independently cached | Guarantees a stale Organization is never shown after a membership change |
| Feature data (Projects, Units, etc.) | Not persisted across a full reload — re-fetched fresh | Correctness over speed, consistent with this series' Organization-isolation caution |
| UI preferences (filter/sort choices) | May persist to `localStorage` as a pure convenience | Not a data-integrity concern — losing a sort preference on a new device is fine |
| White-label theme | Re-resolved from Organization Context at every bootstrap, never cached beyond the session | Ensures a branding change is never shown stale — directly serves NG-001 §13's runtime-theming principle |

## Refresh Strategy

Explicit invalidation on mutation is primary (creating/updating/deleting a Project invalidates that Feature's own cache entry, nothing else's) — background polling is not used by default, since no prior document has established a real-time requirement that would justify its cost. A manual refresh action is always available to the user as the fallback.

## Optimistic Update Strategy

Used selectively, for low-risk, high-frequency actions only (e.g., marking a notification read). **Never used for anything touching the still-undesigned Builder Projects backend domain, and never for any RLS/RBAC-sensitive mutation** — this platform has consistently chosen correctness over perceived speed for Organization-isolation-sensitive operations (A-004 §12, A-008 throughout), and optimistic updates are exactly the kind of technique that can make a denied mutation *look* like it briefly succeeded. Not worth the risk here.

## Error Recovery

A failed mutation reverts any optimistic change (where one was attempted) and surfaces through `infra-error-handling` (NG-003) — the state-management-specific instance of NG-000 §11's rule that Organization-isolation violations must fail loudly and log, never silently.

## Memory Management

Feature-scoped Signals are destroyed when Angular destroys their owning route-level injector (NG-004's lazy-loading boundaries) — this happens automatically, with no manual cleanup required for the common case, which is itself one of the clearest practical arguments for keeping state genuinely Feature-scoped rather than globalizing it "to be safe."
