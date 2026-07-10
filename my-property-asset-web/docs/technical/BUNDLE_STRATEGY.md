# Bundle Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-009_Performance_Scalability_Architecture.md`](NG-009_Performance_Scalability_Architecture.md)
**Covers:** Performance Budgets, Bundle Strategy, Code Splitting Strategy, Lazy Loading Strategy (restated), Route Preloading Strategy, Asset Loading Strategy, Theme Loading Strategy, White-label Asset Strategy, Image Optimization Strategy, Font Loading Strategy, CDN Strategy.

## 2. Performance Budgets

| Bundle | Budget (initial, gzipped) | Rationale |
|---|---|---|
| Public Website — initial | < 300 KB | SSR-served (`PERFORMANCE_STRATEGY.md` §19); the initial JS payload only needs to hydrate, not paint, so it can be the tightest budget on the platform |
| Super Admin — initial | < 500 KB | CSR, authenticated — no SEO pressure, but still bounded to keep first-login TTI reasonable |
| Builder Portal — initial | < 500 KB | Same reasoning as Super Admin |
| Any single lazy feature chunk | < 250 KB | Keeps a feature-boundary navigation (e.g. Projects → Units) fast regardless of how many features a session eventually visits |

Budgets are enforced by the build tool's own budget configuration (Angular CLI/Nx `budgets` in each application's build target) and are a `QUALITY_GATES.md` §35 CI gate — a build exceeding budget fails, it does not warn.

## 4. Bundle Strategy

One independent bundle per application (`ADR-009`, restated at the build-output level) — `dist/public-website/`, `dist/super-admin/`, `dist/builder-portal/`, each self-contained, none referencing another's chunks. Within each application's bundle: Core, Infrastructure, and Theme libraries are part of the initial/eager chunk (`LAZY_LOADING_STRATEGY.md` § What Is Never Lazy); every Feature library is its own separate chunk.

## 5. Code Splitting Strategy

Code splitting boundaries are **feature-library boundaries**, not manually inserted `import()` calls scattered through the code — because every Feature is already its own Nx project with its own route-level lazy import (`ROUTING_STRATEGY.md` §11), code splitting is a natural consequence of the workspace's existing project structure, not a separate technique layered on top. This is a direct payoff of NG-003's finer-grained library split: six independent Builder Portal chunks instead of one large "handover" bundle.

## 6. Lazy Loading Strategy (restated)

Fully specified in `LAZY_LOADING_STRATEGY.md` (NG-004) — this document adds nothing new to *what* is lazy, only confirms it from a performance-budget lens (§2 above) and adds Route Preloading (§7) as the one genuinely new refinement.

## 7. Route Preloading Strategy

**Selective preloading, not Angular's default `PreloadAllModules`-equivalent behavior.** Preloading every lazy chunk immediately after the initial route defeats the point of splitting them in the first place for a session that never visits most of them. Instead: a Feature is preloaded only when the currently-rendered screen's own navigation makes visiting it likely (e.g., once Builder Portal's Dashboard has rendered, preload `projects` and `units` in the background, since those are the two features a Dashboard visit almost always leads to next) — a **custom preloading strategy**, not the CLI's built-in all-or-nothing options. This document names the strategy and its rationale; the specific per-feature preload map is an implementation detail for whichever ticket builds routing.

## 8. Asset Loading Strategy

Shared assets (`ASSET_STRUCTURE.md` §1, `libs/shared/ui/src/assets/`) are content-hashed at build time and cached aggressively by the browser/CDN (§20) — since a hashed filename changes only when content changes, a long `max-age` cache header is safe and free of staleness risk. Application-specific assets follow the same hashing convention. Neither tier is ever loaded eagerly if it's only used by a route that hasn't loaded yet — an asset's loading tier follows its owning component's loading tier (§6), not a separate asset-specific eagerness rule.

## 9. Theme Loading Strategy

**Theme resolution is synchronous-feeling but genuinely async, and must complete before first meaningful paint — this is the direct mechanism behind `PERFORMANCE_STRATEGY.md` §3's CLS target.** `theme-runtime` resolves Organization-scoped branding as part of the Shell's bootstrap sequence (`AUTHENTICATION_ARCHITECTURE.md` §4: auth → Organization Context → RBAC → theme) — the Shell does not render its first visible content until theme resolution completes, specifically to prevent a "flash of default branding" that then shifts to the real Organization's branding a moment later (a real, visible CLS/UX defect this platform deliberately designs against). `theme-tokens`' default/fallback values are bundled eagerly (§4 — Theme is never lazy) so the *mechanism* is instant; only the Organization-specific *values* are the async part being awaited.

## 10. White-label Asset Strategy

An Organization's logo and other branding assets are fetched at runtime from Supabase Storage (`STORAGE_STRATEGY.md` §15, restated) — never bundled, never part of any budget in §2, since they are per-Organization data, not platform code. Performance treatment: a signed-URL image fetch is subject to the same lazy-and-cached treatment as any other content image (§11) once resolved, but the *resolution* itself is on the theme-loading critical path (§9) and should be requested as early as Organization Context resolves, not deferred until the relevant UI element scrolls into view — the one deliberate exception to §11's general lazy-image rule, because a branding logo is above-the-fold by definition.

## 11. Image Optimization Strategy

- Modern formats (WebP/AVIF with a fallback) for shared and application assets, served at the smallest dimension the layout actually needs (no full-resolution image downscaled by CSS).
- Below-the-fold content images load lazily (native `loading="lazy"`); above-the-fold images (hero imagery, white-label branding per §10) load eagerly, since deferring them would directly hurt the LCP target (§3).
- This document sets the strategy; it does not select a specific image-processing pipeline or CDN transformation service — an implementation choice deferred past this document's scope, consistent with `ASSET_STRUCTURE.md` §3's own deferral of the same question.

## 12. Font Loading Strategy

Self-hosted, subsetted web fonts (not a third-party font CDN, to avoid an extra DNS/connection cost and to keep white-label font choices — if ever supported — under this platform's own delivery control) loaded via `font-display: swap`, so text renders immediately in a fallback font rather than blocking on font download — directly protects the LCP target (§3) from being gated by font-loading latency.

## 20. CDN Strategy

**Static build output only** (JS/CSS/font/shared-image chunks from §4/§8) is CDN-distributed — this is the concrete mechanism behind `TECHNICAL_STANDARDS.md` §20's "static-build-plus-CDN hosting model." **Organization-scoped data and white-label assets are never CDN-cached** (`STORAGE_STRATEGY.md`'s signed-URL, bounded-expiry pattern is deliberately incompatible with long-lived CDN caching) — this is a hard boundary, not an oversight: CDN-caching a signed URL or an Organization's branding image at a shared edge node risks serving one Organization's private/branded content to a request that should have received another's, or serving a URL after its intended expiry. Static platform code is the only thing this platform puts behind a CDN.
