# RxJS Guidelines — MyPropertyAsset Web Platform

**Companion to:** [`NG-005_State_Management_Strategy.md`](NG-005_State_Management_Strategy.md)
**Purpose:** Exactly where RxJS is retained in a Signal-first architecture (`SIGNALS_STRATEGY.md`), and — just as importantly — where it is explicitly not used, which is the concrete expression of this prompt's own "minimal RxJS complexity" objective.

## Where RxJS Is Retained

| Scenario | RxJS role | Resolves to |
|---|---|---|
| Initial async boundary of any Supabase query/RPC call | The Promise/Observable the call returns | Converted to a Signal (`toSignal()`) at the point it enters Feature/Core state — RxJS never persists past this boundary |
| Complex event composition (e.g., debounced search input, `search` utility library) | RxJS operators (`debounceTime`, `distinctUntilChanged`) are genuinely the right tool for shaping a rapid input stream | Converted to a Signal at the boundary of whichever Feature/component owns the resulting query state |
| Genuinely multi-event streams, if/when adopted | Supabase Realtime subscriptions — **not currently a requirement of this platform.** The backend's own Stage 4 Database Review (a separate, upstream document — `../../../my_property_asset/docs/ies/STAGE4_DATABASE_REVIEW.md`, referenced via `ARCHITECTURE_INDEX.md` §0) confirmed Realtime is configured for zero tables today. This guideline reserves RxJS's role for if that changes, not because it's needed now | Would convert to a Signal at each subscribing Feature's boundary, same pattern as above |

## Where RxJS Is Not Used

- **No `Subject` or `BehaviorSubject` is used as a substitute for a Signal-based service.** If a prior Angular codebase pattern would reach for a `BehaviorSubject` to hold "current Organization" or "current user," this architecture uses a Signal instead — this is the literal, checkable form of "minimal RxJS complexity," not just an aspiration.
- **No manual `combineLatest`/`merge` orchestration for values that are simply derived state** — `computed()` replaces this pattern entirely (`SIGNALS_STRATEGY.md`).
- **No RxJS-based global event bus.** NG-001 `FEATURE_BOUNDARIES.md`'s "Core-level event mechanism" (one of the three permitted cross-feature communication channels) is Signal-based, not an RxJS `Subject` — consistent with this document's Signal-first rule, and a concrete refinement of what NG-001 left as a conceptual channel without specifying its underlying primitive.

## The One-Sentence Rule

**RxJS handles the moment an async value arrives; Signals hold it once it's here.** Any code that finds itself holding a long-lived `Subscription` for something that isn't a genuinely ongoing stream (search-input shaping, or a future Realtime channel) has drifted from this guideline.
