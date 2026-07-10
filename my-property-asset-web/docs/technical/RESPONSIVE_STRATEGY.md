# Responsive Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-013_Frontend_Presentation_Architecture.md`](NG-013_Frontend_Presentation_Architecture.md)
**Covers:** Responsive Design Strategy, Mobile Web Strategy, Tablet Strategy, Desktop Strategy.

## 17. Responsive Design Strategy

A single, token-driven breakpoint system (`DESIGN_TOKENS.md` §27's Spacing System shares its scale with breakpoint values) applied uniformly across all three applications — no application defines its own breakpoints. Layout responds via CSS (fluid grids, container queries where a Composite's internal layout depends on its container rather than the viewport) rather than serving different component trees per device class — this platform builds one responsive component, never a `MobileProjectList` and a `DesktopProjectList` as separate components, consistent with `COMPONENT_ARCHITECTURE.md` §3's classification not having a device axis at all.

## 18. Mobile Web Strategy

**"Mobile Friendly," not "mobile-first" or a dedicated mobile app** — restated from `PERFORMANCE_STRATEGY.md` §2's Objectives (NG-009): this platform's mobile web experience is a fully responsive rendering of the same application, not a reduced feature set. Public Website carries the highest mobile-traffic likelihood (unauthenticated, SEO-driven, `PERFORMANCE_STRATEGY.md` §19) and is where mobile responsiveness is most performance-critical; Super Admin and Builder Portal are used on mobile less often in practice but are held to the identical responsive standard — this document does not create a lesser mobile bar for the authenticated applications.

## 19. Tablet Strategy

Tablet is treated as its own breakpoint tier (§17), not merely an interpolation between mobile and desktop layouts — specifically because this platform's sidebar+topbar layout (`LAYOUT_ARCHITECTURE.md` §6) has a genuine tablet-specific behavior (a collapsible rather than persistent sidebar) that neither the mobile nor desktop layout needs. This is named explicitly because it is the one place this platform's responsive strategy isn't simply "the same layout, smaller," and deserves to be stated as a deliberate design decision rather than left implicit in a breakpoint table alone.

## 20. Desktop Strategy

The reference layout every Composite is designed against first (`LAYOUT_ARCHITECTURE.md` §6's persistent sidebar+topbar shape) — given this platform's Super Admin and Builder Portal audiences are operational, data-dense tools most likely used on a desktop-class device day-to-day, even though both remain fully responsive (§18). Desktop is not privileged in terms of *functionality* (nothing is desktop-only) — only in terms of which viewport a Composite's layout is authored against first, before being adapted down.
