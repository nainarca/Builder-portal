# Performance Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-009_Performance_Scalability_Architecture.md`](NG-009_Performance_Scalability_Architecture.md)
**Covers:** Performance Principles, Core Web Vitals Targets, Change Detection Strategy, Rendering Strategy, SSR vs. CSR Considerations, Memory Management, Large Dataset Handling, Virtual Scrolling Strategy, Background Processing.

## 1. Performance Principles

- **Performance is a property of architecture already decided, made explicit here — not a new layer bolted on.** Lazy-loading (NG-004), Signal-first state with automatic, fine-grained change propagation (NG-005 ADR-004), narrow server-side queries with mandatory pagination (NG-007), and a three-application build-level split (NG-001 ADR-009) already do most of the work; this document's job is to state targets and close the remaining gaps (change detection strategy, rendering mode, large-dataset UI handling) no prior document had reason to decide.
- No premature optimization (`TECHNICAL_STANDARDS.md` §19, restated) — every technique in this document is justified by a named user-facing scenario (a slow list, a large bundle, a branding flash), never applied speculatively.
- Performance budgets (`BUNDLE_STRATEGY.md` §1) are enforced in CI, not aspirational — a budget a build can silently exceed is not a budget, consistent with `QUALITY_GATES.md`'s own "a failing check is a failing build" discipline.

## 3. Core Web Vitals Targets

| Metric | Target | Applies most directly to |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | Public Website (unauthenticated, first impression, SEO-relevant — §19 below) |
| INP (Interaction to Next Paint) | < 200ms | All three applications — a slow Super Admin/Builder Portal interaction is a productivity cost even without SEO stakes |
| CLS (Cumulative Layout Shift) | < 0.1 | All three applications — most concretely enforced by theme resolution completing *before* first paint (§ Theme Loading, `BUNDLE_STRATEGY.md` §9), so branding never shifts layout after content is visible |

These are Google's own published "good" thresholds, adopted as this platform's targets rather than invented — there is no reason to set a platform-specific bar looser than the industry-standard one for a commercial SaaS product.

## 17. Change Detection Strategy

**`OnPush` remains the default strategy for every component** (`TECHNICAL_STANDARDS.md` §19, restated and now made concrete): a component only re-renders when an `@Input()` reference changes, an event it handles fires, or a Signal it reads changes — never on an unrelated ancestor's change-detection cycle.

**New in this document — ADR-014, Zoneless Change Detection.** Because ADR-001 (Standalone Components) and ADR-004 (Signals) are both already decided, this platform has no architectural dependency on `zone.js`'s automatic dirty-checking: every state category has exactly one Signal owner (`STATE_OWNERSHIP.md`), and Signal writes already notify Angular's renderer directly, without needing `zone.js` to monkey-patch async APIs and guess when a re-render might be needed. Adopting zoneless change detection removes `zone.js` from the bundle entirely (a real, measurable bytes-on-the-wire saving, directly serving §3's LCP target) and removes an entire class of unnecessary change-detection cycles triggered by async work Angular never actually needed to re-render for. See main document §14 for the full ADR statement.

## 18. Rendering Strategy

Signal-driven, `OnPush`, zoneless (§17) rendering is the strategy for all three applications, uniformly — there is no application-specific rendering mode split at this layer (the split that does exist is at the *hosting* layer, §19). Every template renders from Signals read synchronously (`SIGNALS_STRATEGY.md`), never from a manually-triggered `detectChanges()` call — a component reaching for manual change-detection control is a signal its state isn't genuinely Signal-owned yet, not a technique to reach for routinely.

## 19. SSR vs. CSR Considerations

**New in this document — ADR-015, Hybrid Rendering by Application.** No prior document decided this; it is decided here because it is fundamentally a performance/SEO trade-off, not a state or routing concern.

| Application | Mode | Why |
|---|---|---|
| **Public Website** | **SSR + prerendering** (Angular SSR) | Unauthenticated, SEO-relevant (organic discovery is this product's actual acquisition channel, A-001/A-002), and the audience most likely to be on a slower connection/device — SSR directly improves LCP for exactly the visitors who benefit most, and prerendering serves the mostly-static marketing routes without a server round-trip at all |
| **Super Admin** | **CSR only** | Authenticated, behind login (`AUTHENTICATION_ARCHITECTURE.md` §1) — no SEO value, and SSR would need to somehow handle authenticated, Organization-scoped, per-session content server-side, adding real complexity for zero benefit to a small, trusted user population |
| **Builder Portal** | **CSR only** | Same reasoning as Super Admin — authenticated, no SEO surface, no justification for SSR's added deployment/hosting complexity |

This is a genuine, considered rejection of SSR for two of the three applications, not an oversight — consistent with this series' practice of stating rejections plainly (NG-004's rejected slug/subdomain URL scheme is the precedent).

## 22. Memory Management

- **Feature-scoped Signals are destroyed with their owning route-level injector** (`CACHE_STRATEGY.md` §Memory Management, restated) — this remains the primary memory-safety mechanism and this document introduces no exception to it.
- **Zoneless change detection (§17) has a secondary memory benefit**: without `zone.js` patching every async API, there is no risk of a zone-patched timer or subscription silently keeping a destroyed component's change-detection context alive longer than expected — a real, if second-order, class of leak this platform now avoids entirely rather than needing to defend against.
- Large in-memory collections (§23) are bounded by pagination by construction (NG-007 §11) — this document does not introduce a separate memory ceiling because the query layer already prevents an unbounded collection from ever being fetched in the first place.

## 23. Large Dataset Handling

**Server-side pagination (`SUPABASE_INTEGRATION.md` §11) is the primary and mandatory mechanism** — no repository method returns an unbounded result set, restated here specifically as a performance guarantee, not just a data-access one: the Angular application never holds more rows in memory than a single page contains. Client-side techniques (§24) operate *within* one already-bounded page; they are never a substitute for pagination, and never used to justify fetching a larger page "since we can scroll it anyway."

## 24. Virtual Scrolling Strategy

Used selectively, for the specific lists most likely to approach a page's row-count ceiling in practice: Builder Portal's Units list (a large Project can have many Units), Super Admin's Audit Log, and Super Admin's cross-Organization directories (Organizations, Users). Not applied platform-wide by default — a short list (Settings, most Dashboard widgets) gains nothing from virtual scrolling and the added complexity isn't justified there. The mechanism itself (Angular CDK's virtual scroll viewport) is an implementation detail this document does not select on the team's behalf, only the *where* it applies.

## 25. Background Processing

**No Web Worker or Service Worker is mandated by this document.** No prior business or technical document has identified CPU-heavy client-side work (no client-side report generation, no client-side image/document processing) or an offline requirement (`REALTIME_STRATEGY.md` §24 already ruled out offline-first) that would justify either mechanism's added complexity. Reserved, not designed: if a future feature genuinely needs sustained background computation (e.g., a large client-side export), a Web Worker boundary should be scoped by whichever document specifies that feature — this document does not pre-build a boundary for a requirement that doesn't exist yet, consistent with this series' "reserve only what's cheap, design only what's real" discipline.
