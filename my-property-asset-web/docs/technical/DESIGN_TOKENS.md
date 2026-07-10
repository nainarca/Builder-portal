# Design Tokens — MyPropertyAsset Web Platform

**Companion to:** [`NG-013_Frontend_Presentation_Architecture.md`](NG-013_Frontend_Presentation_Architecture.md)
**Covers:** Design Token Strategy, Typography Standards, Iconography Standards, Color System Strategy, Spacing System, Asset Presentation Strategy.

## 23. Design Token Strategy

Design tokens are the single source of visual truth for every Primitive and Composite component (`COMPONENT_ARCHITECTURE.md` §3) — a component never hard-codes a color, font size, spacing value, or icon reference (`LIBRARY_STRATEGY.md` §17, restated as this document's own governing rule for every token category below). Tokens are authored once in `theme-tokens` (`SOURCE_TREE.md` §3, NG-008) and consumed everywhere via PrimeNG's own token-based theming API (`THEME_ARCHITECTURE.md` §28) — this is the mechanism, named here for the first time in this series, that makes PrimeNG's adoption (ADR-005) compatible with runtime white-label theming (`LIBRARY_STRATEGY.md` §15's already-decided principle) rather than in tension with it: PrimeNG's theming API is built specifically to consume externally-supplied tokens rather than requiring a compile-time theme.

## 24. Typography Standards

A constrained type scale (a fixed set of size/weight/line-height combinations, not an open-ended range) — one font family platform-wide (`BUNDLE_STRATEGY.md` §12's self-hosted, subsetted font strategy, NG-009, restated), applied consistently across all three applications. White-label branding (`THEME_ARCHITECTURE.md` §29) does not extend to typography — an Organization's brand identity is expressed through color and logo (§26, `THEME_ARCHITECTURE.md` §29), never through a per-Organization font substitution, which would reintroduce exactly the font-loading performance cost `BUNDLE_STRATEGY.md` §12 deliberately avoided.

## 25. Iconography Standards

One shared icon set (`ASSET_STRUCTURE.md` §2, NG-009, restated), consumed exclusively through a `shared-ui` icon Composite — never a raw `<svg>` or third-party icon import inside Feature code, mirroring `COMPONENT_ARCHITECTURE.md` §30's PrimeNG boundary discipline applied to icons specifically. Icon color is always token-driven (§23), which is what lets an icon correctly re-color under white-label theming without needing a per-Organization icon variant.

## 26. Color System Strategy

A semantic color token layer sits between raw color values and every component: components reference tokens like `color-primary` or `color-danger`, never a raw hex value directly — this is what makes both white-label re-theming (`THEME_ARCHITECTURE.md` §29) and the AA-contrast guarantee (`DESIGN_SYSTEM_ARCHITECTURE.md` §21) hold simultaneously: a semantic token's *value* can change per Organization, but its contrast relationship to its paired surface token is verified once, at the token-authoring level, not re-verified per component per Organization. An Organization's brand color populates the `color-primary` family specifically; platform-critical semantic colors (`color-danger` for Critical-severity states, `ERROR_CLASSIFICATION.md` §3, NG-010) are **never** white-label-overridable — an Organization cannot brand its way into a less-visible error state, a deliberate constraint stated explicitly rather than left as an oversight a white-label configuration screen might otherwise allow.

## 27. Spacing System

A constrained numeric scale (a fixed step sequence, not arbitrary pixel values), shared by every Composite's internal layout and by the responsive breakpoint values `RESPONSIVE_STRATEGY.md` §17 uses — one spacing vocabulary serves both purposes rather than maintaining two parallel scales that could drift apart.

## 31. Asset Presentation Strategy

Restates `ASSET_STRUCTURE.md` (NG-009) as the placement/build-layer source of truth; this document's addition is purely about *usage*: an image or icon is always rendered through a Composite that already handles responsive sizing (`RESPONSIVE_STRATEGY.md` §17), lazy-loading below the fold (`BUNDLE_STRATEGY.md` §11), and the correct `alt`/ARIA treatment (`DESIGN_SYSTEM_ARCHITECTURE.md` §21) — a Feature never embeds a raw `<img>` tag with its own bespoke handling of these three concerns independently.
