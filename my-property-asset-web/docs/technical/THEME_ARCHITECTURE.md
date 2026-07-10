# Theme Architecture — MyPropertyAsset Web Platform

**Companion to:** [`NG-013_Frontend_Presentation_Architecture.md`](NG-013_Frontend_Presentation_Architecture.md)
**Covers:** Theme Architecture, White-label Branding Strategy, Internationalization (i18n) Presentation, RTL Readiness Considerations.

## 28. Theme Architecture

`theme-tokens` (the data contract) and `theme-runtime` (the resolution/application mechanism) — both already reserved as library boundaries by `LIBRARY_STRATEGY.md` §15 (NG-002) — are given their full presentation-layer design here for the first time. `theme-runtime` resolves an Organization's token values during Shell bootstrap (`AUTHENTICATION_ARCHITECTURE.md` §4) and applies them via PrimeNG's token-based theming API (`DESIGN_TOKENS.md` §23) — concretely, by supplying resolved values to whatever mechanism PrimeNG's theming layer consumes (CSS custom properties, in practice, though this document does not mandate the specific technical mechanism, consistent with its own no-CSS/no-implementation Quality Rules). A theme is therefore fully data-driven at runtime — no application rebuild is ever required to onboard a new Organization's branding, restating `TECHNICAL_STANDARDS.md` §17's principle with its now-complete mechanism named.

## 29. White-label Branding Strategy

An Organization's brand identity is expressed through exactly three token categories: primary color (`DESIGN_TOKENS.md` §26), logo (`ASSET_STRUCTURE.md` §1, NG-009's runtime-fetched, signed-URL Organization asset), and — where a future document scopes it — a secondary/accent color. **Nothing else is white-label-configurable**: not typography (`DESIGN_TOKENS.md` §24), not spacing (§27), not platform-critical semantic colors (§26's `color-danger` exception), and not layout structure (`LAYOUT_ARCHITECTURE.md` §6) — a deliberately narrow surface, chosen because a wider one would let an Organization's configuration degrade accessibility (§21 in `DESIGN_SYSTEM_ARCHITECTURE.md`) or platform usability in ways this document is not willing to leave possible. Every white-label validation test (`TEST_DATA_MANAGEMENT.md` §19, NG-012) verifies against this exact, bounded surface.

## 32. Internationalization (i18n) Presentation

**Reserved, not designed — consistent with `LOCALIZATION_STRUCTURE.md`'s (NG-008) own explicit deferral**, restated here at the presentation layer: no component in this design system currently supports locale-switching, and no prior document has scoped multi-language support as an actual requirement. This document's only addition: *if* i18n is ever activated, locale-sensitive presentation (date/number formatting, pluralization) would be a Composite-tier concern layered on top of the existing token/component architecture, not a parallel presentation system — the three-tier classification (`COMPONENT_ARCHITECTURE.md` §3) and token strategy (`DESIGN_TOKENS.md`) would not need to change shape to accommodate it.

## 33. RTL Readiness Considerations

**Reserved, not designed.** No prior document has scoped a right-to-left locale as a requirement. Named here only because doing so costs nothing now and avoids a disruptive retrofit later, consistent with this series' treatment of every other cheap-to-reserve item: if RTL is ever required, PrimeNG's own RTL support plus token-driven, logical-property-based spacing (§27, already numeric-scale-based rather than directional-value-based) is the anticipated mechanism — a reservation, not a design.
