# Signals Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-005_State_Management_Strategy.md`](NG-005_State_Management_Strategy.md)
**Resolves:** ADR-004 (Angular Signals) — Accepted by this document, see `NG-005_State_Management_Strategy.md` §18.

## The Decision

**Signals are the default for every state category in `STATE_OWNERSHIP.md` that is read more often than it changes and consumed synchronously by templates.** That covers the overwhelming majority of this platform's state: Organization Context, RBAC permission set, Theme, every Feature's loaded list/detail data, and all Dashboard aggregation. RxJS is not the default anywhere in this architecture — it is retained only where `RXJS_GUIDELINES.md` specifically says so.

## Why Signal-First (Not Just "Signals Are Available")

- **Synchronization is automatic by construction.** Because every state category has exactly one Signal-based owner (`STATE_OWNERSHIP.md`'s ownership rule), Angular's own change detection propagates updates without any manual pub/sub wiring — no `Subject` broadcasting to subscribers who might miss an emission, no manual `combineLatest` orchestration for values that are simply "the current state of X."
- **Memory management is automatic by construction.** A Feature's Signals live in its route-level injector and are garbage-collected when Angular destroys that injector (NG-004's lazy-loading boundary) — no explicit `unsubscribe()` discipline required, no risk of a forgotten subscription leaking a Feature's state past its route.
- **`computed()` is the mechanism for every derived value** — Dashboard aggregation (`STATE_OWNERSHIP.md` § Why Dashboard Is Never Its Own Fetch), permission-gated UI visibility (derived from the RBAC signal), theme-applied styling (derived from the Theme signal). A derived value is never separately fetched or separately stored; it is always computed from its sources.
- **`effect()` is used sparingly**, reserved for genuine side effects triggered by a state change (e.g., re-applying CSS custom properties when the Theme signal changes) — never as a substitute for `computed()`, and never as a way to manually keep two pieces of state "in sync" (if two things need to be in sync, one of them is derived, and `computed()` is the right tool, not an `effect()` that copies a value).

## Interop With Async Sources

Every Supabase call (query or RPC) begins as a Promise or Observable at its boundary and is converted to a Signal (via `toSignal()` or equivalent) at the exact point it enters a Feature's or Core service's owned state — RxJS is the interop layer for that boundary crossing, never the storage mechanism on the other side of it. `RXJS_GUIDELINES.md` details exactly which boundaries retain RxJS and why.
