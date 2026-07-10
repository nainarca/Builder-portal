# Design System Architecture — MyPropertyAsset Web Platform

**Companion to:** [`NG-013_Frontend_Presentation_Architecture.md`](NG-013_Frontend_Presentation_Architecture.md)
**Covers:** Frontend Presentation Principles, Design System Philosophy, Accessibility (WCAG) Strategy, Keyboard Navigation Standards, Future Design Evolution.

## 1. Frontend Presentation Principles

- **Presentation consumes state, it never owns it** — every component reads Signals (`SIGNALS_STRATEGY.md`, ADR-004) and renders; a component holding its own copy of Feature or Core state would duplicate exactly what `STATE_OWNERSHIP.md` already forbids. This document designs *how things look and compose*, never *where data lives* — that boundary is already settled and this document does not reopen it.
- **Consistency is structural, not a style guide people remember to follow** — the same three-tier component classification (`COMPONENT_ARCHITECTURE.md` §3), the same design tokens (`DESIGN_TOKENS.md`), and the same `shared-ui` boundary (`LIBRARY_STRATEGY.md` §6) apply identically across all three applications; a Builder Portal button and a Super Admin button are the same component, not two components that happen to look similar.
- **Accessible and white-label-ready by construction, not by retrofit** — both are properties of the token/theme architecture (§21 below, `THEME_ARCHITECTURE.md`), not a checklist applied after a component is built.

## 2. Design System Philosophy

This platform adopts a **thin design system built on top of PrimeNG** (`COMPONENT_ARCHITECTURE.md` §30, ADR-005), not a from-scratch component library. The design system's job is narrower than "build every component" — it is the layer that (a) constrains PrimeNG's own surface to this platform's actual needs, (b) supplies the design tokens (`DESIGN_TOKENS.md`) that make white-label theming possible, and (c) composes PrimeNG primitives into the platform-specific patterns (`COMPONENT_ARCHITECTURE.md` §10–16's Form/Table/Dialog/etc. standards) that recur across Feature libraries. This is a deliberately smaller scope than a typical greenfield design system, chosen because building a full component library from scratch would duplicate work PrimeNG already does well, and this series has consistently avoided reinventing what an already-adopted dependency (Supabase, Nx) already provides.

## 21. Accessibility (WCAG) Strategy

**WCAG 2.1 Level AA (ADR-020, NG-012) is enforced at the design-system layer, not left to each Feature to individually satisfy.** Every token (`DESIGN_TOKENS.md` §26's Color System) is authored to meet AA contrast ratios by construction — a Feature composing tokens correctly cannot produce a contrast failure, because the failure would have to originate in the token itself, which is centrally authored and centrally tested (`QUALITY_METRICS.md` §14, NG-012). Every `shared-ui`-wrapped PrimeNG component carries correct ARIA semantics once, at the wrapping layer (`COMPONENT_ARCHITECTURE.md` §30) — a Feature consuming `shared-ui`'s `Button` never re-derives its own ARIA attributes, the same "single implementation, never reimplemented per app" discipline this series has applied to authentication, RBAC, and error handling now applied to accessibility.

## 22. Keyboard Navigation Standards

Every interactive element reachable by keyboard alone, in a logical, predictable tab order matching visual reading order — verified automatically where mechanically checkable and manually spot-checked during UAT sign-off (`QUALITY_METRICS.md` §14, restated). Focus state is a token-driven visual property (`DESIGN_TOKENS.md`), never removed via a blanket `outline: none` — a common accessibility regression this document names explicitly as forbidden, not merely discouraged. Modal/Dialog components (`COMPONENT_ARCHITECTURE.md` §12) trap focus while open and restore it to the triggering element on close, consistent with standard accessible-dialog behavior.

## 35. Future Design Evolution

- **A second PrimeNG preset or a fully custom theme** could be adopted later without restructuring the design system — because Feature code only ever touches `shared-ui` and design tokens (`COMPONENT_ARCHITECTURE.md` §30), never PrimeNG directly, a preset change is isolated to `theme-tokens`/`theme-runtime` (`THEME_ARCHITECTURE.md`).
- **RTL and i18n** (`THEME_ARCHITECTURE.md` §32–33), if ever activated, extend this design system without redesigning it — token-driven spacing and PrimeNG's own RTL support are the anticipated mechanism, reserved not designed, consistent with this series' treatment of every other reserved item (i18n's own library boundary, `LOCALIZATION_STRUCTURE.md`, NG-008).
- **A dedicated design-system documentation site (Storybook or equivalent)** is a plausible future investment as `shared-ui`'s catalog grows, but is not decided here — an implementation/tooling choice this document defers, consistent with this series' consistent deferral of vendor selection.
