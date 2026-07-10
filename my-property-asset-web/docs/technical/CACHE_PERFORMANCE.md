# Cache Performance — MyPropertyAsset Web Platform

**Companion to:** [`NG-009_Performance_Scalability_Architecture.md`](NG-009_Performance_Scalability_Architecture.md)
**Covers:** API Performance Strategy, State Performance Strategy, Cache Performance Strategy, Realtime Subscription Strategy, Browser Storage Strategy.
**Note:** `CACHE_STRATEGY.md` (NG-005) already defines cache *ownership and correctness* rules (Organization-scoped keys, explicit invalidation, no optimistic updates for sensitive mutations). This document adds the *performance* lens on top — it does not redefine ownership or correctness, and defers to `CACHE_STRATEGY.md` wherever the two could appear to overlap.

## 13. API Performance Strategy

- **Narrow queries and mandatory pagination** (`SUPABASE_INTEGRATION.md` §10–11) remain the two primary levers, restated here as the performance-critical-path items they are — every additional column or unbounded row fetched is latency and payload size a user waits on.
- **No repository call for Properties, Loans, or Expenses exists to optimize** — the same Restricted-Financial exclusion (NG-003, NG-007, NG-008) has a performance-scope consequence too: this document does not need to (and does not) design any performance handling for that data, because no code path touching it exists in this workspace at all.
- **Request de-duplication**: two components in the same view requesting the same Feature's data within the same render cycle read the same Signal (`STATE_OWNERSHIP.md`'s single-owner rule) — there is no scenario in this architecture where the same query fires twice for the same view, because there is exactly one place that data is fetched and cached per Feature.
- **RPC calls** (`RPC_STRATEGY.md` §6) are used specifically because they collapse a multi-step, multi-round-trip client sequence into one network call — named here as a direct latency benefit, not just an atomicity one.

## 14. State Performance Strategy

Signal-based, fine-grained reactivity (`SIGNALS_STRATEGY.md`) is itself the performance strategy for state: because `computed()` values only recompute when their actual dependencies change (not on every change-detection cycle, especially now zoneless — `PERFORMANCE_STRATEGY.md` §17), a Dashboard aggregating five Feature signals recomputes only the specific aggregate affected by whichever signal actually changed, never the whole aggregation on every render pass. This document introduces no new mechanism here — it names why the existing one (ADR-004) already performs well.

## 15. Cache Performance Strategy

- Every cache read is synchronous, in-memory Signal access (`CACHE_STRATEGY.md`'s "cache is not owned" model) — there is no cache-lookup latency to optimize on the read path; the only latency is the original fetch, already addressed by §13.
- **Cache warm-up is deliberately not used** — no prefetch-on-app-start for data a session may never need (consistent with `PERFORMANCE_STRATEGY.md` §1's no-premature-optimization principle and `CACHE_STRATEGY.md`'s Refresh Strategy). The one exception is Route Preloading (`BUNDLE_STRATEGY.md` §7), which preloads *code*, not *data* — a preloaded Feature chunk still fetches its own data fresh the moment it actually renders, never before.
- Cache invalidation remains explicit-on-mutation only (`CACHE_STRATEGY.md` §Refresh Strategy) — this document adds no background revalidation/polling mechanism, since one was never justified by a real-time requirement in any prior document.

## 16. Realtime Subscription Strategy

**Realtime remains reserved, not active** (`REALTIME_STRATEGY.md` §14, restated) — this document's contribution is the performance posture *if and when* it is adopted: a subscription is scoped to exactly the Feature/route currently active, opened when that Feature's route-level injector is created and closed when it's destroyed (the same lifecycle as any other Feature-scoped Signal, `CACHE_STRATEGY.md` § Memory Management) — never a workspace-wide or Organization-wide subscription kept open for the life of a session regardless of what's currently visible. This prevents Realtime, if adopted, from becoming an unbounded background cost that scales with how long a session has been open rather than with what the user is actually looking at.

## 21. Browser Storage Strategy

| Storage | Used for | Not used for |
|---|---|---|
| `localStorage` | UI preferences only (filter/sort choices, `CACHE_STRATEGY.md` §Persistence Strategy) — genuinely small, non-sensitive, convenience data | Any Organization-scoped or Restricted-Financial data, ever, under any circumstance (`TECHNICAL_STANDARDS.md` §14's "no client-side state store may ever hold Restricted-Financial data... even transiently" applies to browser storage explicitly, not just in-memory state) |
| `sessionStorage` | Not used by default | — |
| `IndexedDB` | Reserved only, not designed — would only become relevant if a future document scopes genuine offline support, which `REALTIME_STRATEGY.md` §24 has already ruled out for this platform's current scope | Any current feature |
| Cookies | Supabase Auth's own session mechanism only, not a separate application-level cookie store | — |

Browser storage is intentionally the smallest, least-relied-upon layer in this platform's whole performance/state picture — nearly everything durable lives in Supabase and is re-fetched fresh per `CACHE_STRATEGY.md`'s "correctness over speed" Persistence Strategy, and this document does not introduce a reason to change that balance.
