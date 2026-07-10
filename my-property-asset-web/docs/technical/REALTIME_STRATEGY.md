# Realtime Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-007_API_Data_Access_Architecture.md`](NG-007_API_Data_Access_Architecture.md)
**Covers:** Realtime Strategy, Offline Strategy, Synchronization Strategy.

## 14. Realtime Strategy

**Reserved, not active.** The backend's own Stage 4 Database Review (cited previously in NG-005 `RXJS_GUIDELINES.md`) confirmed Supabase Realtime is configured for zero tables today. This document's Realtime Strategy is therefore a pattern held in reserve, not a live design: if adopted, a Realtime subscription would live inside a Repository (Shared-tagged, same as every other Supabase touchpoint), converted to a Signal at the same `toSignal()`-equivalent boundary as any other async source (NG-005 §Interop With Async Sources) — never bypassing that boundary just because the source happens to be a stream instead of a one-shot query.

## 24. Offline Strategy

**Intentionally minimal — not full offline-first.** No prior document (business or technical) has ever required offline-first operation; building one now would be a significantly larger undertaking than anything this series has scoped. This platform's actual offline behavior: graceful degradation only — a clear "you're offline" state, no queued-mutation/background-sync design. Stated explicitly as a deliberate scope boundary, not an oversight, so a future document doesn't mistake the absence of offline design for an unaddressed gap.

## 25. Synchronization Strategy

Restates NG-005 `CACHE_STRATEGY.md`'s Refresh Strategy: explicit invalidation on mutation, no background polling by default. This document's specific contribution: synchronization happens **at the Repository/Service boundary** — a mutation's Repository call, on success, signals its owning Feature's Service to invalidate the relevant cache entry. There is no separate, independent "sync service" anywhere in this architecture; synchronization is a property of the mutation path, not a standalone subsystem.
