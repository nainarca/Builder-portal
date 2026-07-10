# NG-013 — Frontend Presentation Architecture

## Document Information

| Field | Value |
|---|---|
| Document ID | NG-013 |
| Name | Frontend Presentation Architecture |
| Version | 1.0 |
| Status | Draft |
| Series | Technical Architecture (`docs/technical/`) |
| Depends On | NG-000–NG-012, A-001–A-009 |
| Previous Document | NG-012 — Quality Engineering & Testing Architecture |
| Next Document | NG-014 — Technical Architecture Review & Implementation Readiness |
| Governing reference for | ADR-005 (PrimeNG Design System — closed), ADR-021 (Component Classification Model), NG-014 Technical Architecture Review & Implementation Readiness, Future UI implementation, Cursor AI implementation |
| Last Updated | 2026-07-09 |

---

## Pre-Check Result

**Documents read as Source of Truth:** NG-000 through NG-012 in full (including `LIBRARY_STRATEGY.md` §6, §15–16, `SCSS_STRUCTURE.md`, `ASSET_STRUCTURE.md`, `LOCALIZATION_STRUCTURE.md`, `DEPENDENCY_GUIDE.md` §22, `AUTHORIZATION_ARCHITECTURE.md` §21, `STATE_OWNERSHIP.md`, `SIGNALS_STRATEGY.md`, `ERROR_HANDLING_GUIDELINES.md`, `OBSERVABILITY_STRATEGY.md`, `PERFORMANCE_STRATEGY.md`, `BUNDLE_STRATEGY.md`, `QUALITY_METRICS.md` §14), plus `ARCHITECTURE_INDEX.md` and `docs/adr/ADR_INDEX.md`. `MASTER_CONTEXT.md`/`PROJECT_FACTS.md` re-verified absent.

**Title change, flagged and resolved.** NG-012 announced NG-013 as "UI Design System Integration"; this prompt's title is "Frontend Presentation Architecture" — a more substantial change than the word-additions seen at NG-011/NG-012, but not a renumbering: NG-014 remains the next document exactly as announced, and this prompt's own 36-item Define list (component/layout/theme/responsive/accessibility/tokens/i18n/RTL/animation, not merely a design-system catalog) confirms the broader title is the more accurate description of what this document actually covers — treated as a scope-clarifying rename, consistent with the series' standing rule to trust the current prompt's own text over a prior announcement.

**No filename collision.** All six requested companion filenames (`DESIGN_SYSTEM_ARCHITECTURE.md`, `COMPONENT_ARCHITECTURE.md`, `LAYOUT_ARCHITECTURE.md`, `THEME_ARCHITECTURE.md`, `DESIGN_TOKENS.md`, `RESPONSIVE_STRATEGY.md`) were checked against `ARCHITECTURE_INDEX.md` §3's existing file list before writing — none collide. Confirmed explicitly given this series has now had three such collisions; a clean check is worth stating, not just assumed.

**ADR-005 closed — a long-anticipated slot, not a fresh decision invented here.** `docs/adr/ADR_INDEX.md` has carried ADR-005 (PrimeNG Design System) as "Not drafted, anticipated trigger: UI-001 Design System" since NG-000. No document literally named "UI-001" ever arrived — this document, under its own NG-013 numbering, is functionally that trigger (its own Define list names "PrimeNG Integration Strategy" explicitly, item 30). ADR-005 is decided here, with this redirect stated plainly rather than left for a future document to notice.

**Sixth restatement of the Restricted-Financial exclusion.** No component, token, or presentation pattern exists in this document for Properties, Loans, or Expenses — restated briefly (`COMPONENT_ARCHITECTURE.md` has no such Composite because no Feature exists to need one) rather than at length, consistent with how briefly NG-011 and NG-012 each needed to restate it once their own scope didn't directly implicate the domain.

**No contradiction of prior architecture.** This document's mechanisms are additive: PrimeNG's adoption is scoped through the exact same "raw dependency, wrapped once, consumed everywhere else through the wrapper" shape ADR-013 already established for Supabase, and the token/theme architecture completes (does not redesign) `LIBRARY_STRATEGY.md` §15's already-reserved `theme-tokens`/`theme-runtime` boundaries.

---

## 1. Executive Summary

NG-013 defines how this platform looks and how that look becomes reusable, accessible, and white-label-ready by construction. It closes **ADR-005 (PrimeNG Design System)** — a slot open since this series' very first prompt — adopting PrimeNG as the platform's component library, consumed exclusively through `shared-ui`, the same wrapped-boundary shape this series already used for Supabase (ADR-013). A second decision, **ADR-021 (Component Classification Model)**, adopts a deliberately simpler three-tier classification (Primitive/Composite/Feature) over full Atomic Design, sized to what this platform's dependency rules actually need rather than a heavier methodology borrowed wholesale. Six companion files carry the detail: `DESIGN_SYSTEM_ARCHITECTURE.md`, `COMPONENT_ARCHITECTURE.md`, `LAYOUT_ARCHITECTURE.md`, `THEME_ARCHITECTURE.md`, `DESIGN_TOKENS.md`, and `RESPONSIVE_STRATEGY.md`.

## 2. Presentation Principles

See `DESIGN_SYSTEM_ARCHITECTURE.md` §1. Presentation consumes state, never owns it; consistency is structural (one component, one token set, across all three applications), not a style guide; accessible and white-label-ready by construction, not by retrofit.

## 3. Design System Architecture

See `DESIGN_SYSTEM_ARCHITECTURE.md` §2, `COMPONENT_ARCHITECTURE.md` §3–5. A thin design system over PrimeNG; a three-tier component classification (ADR-021) chosen deliberately over full Atomic Design, since PrimeNG already supplies the atoms/molecules granularity a from-scratch classification would otherwise need to re-derive.

## 4. Component Architecture

See `COMPONENT_ARCHITECTURE.md` in full. Strictly one-directional hierarchy (Feature → Composite → Primitive → tokens/PrimeNG), no lateral dependencies; concrete standards for Form, Table, Dialog, Notification, Loading, Empty State, and Error Presentation, each implementing an already-decided upstream principle (NG-005 through NG-010) as a component pattern rather than inventing new behavior.

## 5. Layout Architecture

See `LAYOUT_ARCHITECTURE.md` in full. Two layout shapes (restated from `ROUTING_STRATEGY.md` §9), living in each application's own Shell, never in `shared-ui`; Navigation Presentation reads the same single RBAC permission Signal as route guards; Dashboard Presentation is `computed()`-only, never its own fetch.

## 6. Responsive Strategy

See `RESPONSIVE_STRATEGY.md` in full. One token-driven breakpoint system, one responsive component per concept (never device-specific component trees); Mobile is fully responsive, not feature-reduced; Tablet is a genuine third tier (collapsible sidebar), not an interpolation; Desktop is the authoring reference, not functionally privileged.

## 7. Accessibility Strategy

See `DESIGN_SYSTEM_ARCHITECTURE.md` §21–22. WCAG 2.1 AA (ADR-020, NG-012) enforced at the token and `shared-ui` wrapping layer, not left to individual Features; full keyboard navigation with a forbidden-outright rule against removing focus indicators; motion respects `prefers-reduced-motion` (`COMPONENT_ARCHITECTURE.md` §34).

## 8. Theme Architecture

See `THEME_ARCHITECTURE.md` §28. `theme-tokens`/`theme-runtime` (reserved since NG-002) given their full design here: Organization tokens resolved during Shell bootstrap, applied via PrimeNG's token-based theming API, fully runtime-driven — no rebuild ever required to onboard a new Organization's branding.

## 9. White-label Presentation

See `THEME_ARCHITECTURE.md` §29. A deliberately narrow, bounded white-label surface — primary color, logo, and a reserved future accent color, nothing else — with platform-critical semantic colors (`color-danger`) explicitly non-overridable, so an Organization's branding can never degrade error visibility or accessibility.

## 10. PrimeNG Integration

See `COMPONENT_ARCHITECTURE.md` §30. PrimeNG consumed exclusively by `shared-ui`, mechanically enforced by the same Nx tag matrix (`DEPENDENCY_GUIDE.md` §22) that already enforces the Repository Pattern's Supabase boundary — the identical "wrapped once, consumed everywhere else through the wrapper" shape, applied to UI.

## 11. UX Standards

See `COMPONENT_ARCHITECTURE.md` §10–16, §34, `DESIGN_TOKENS.md` §23–27. Consistent Form/Table/Dialog/Notification/Loading/Empty-State/Error-Presentation patterns across every application; a single semantic color/typography/spacing/icon token vocabulary; functional-only motion.

## 12. Risks

- **Builder Projects backend dependency is now carried by 20 consecutive documents** (adds NG-013 — the Form/Table/Dashboard presentation patterns this document specifies apply uniformly to the still-undesigned Projects/Units backend domain's eventual screens, gated as always by `infra-feature-flags`).
- **PrimeNG's specific theming-API surface (which token format it consumes, which version's theming model) is assumed compatible with a fully runtime-driven, per-Organization theme** — a reasonable assumption given PrimeNG's own stated design direction, but unverified against a real implementation; NG-014 (Technical Architecture Review) is the natural place to confirm it once implementation begins.
- **The three-tier classification (ADR-021) is new and unvalidated at scale** — reasonable for this platform's current ~30-project scope, but a design system with significantly more Composite-tier components than anticipated could reveal a need for finer-grained sub-classification later.
- **No Figma or visual design source exists** (explicitly out of this document's scope, Quality Rules) — every token value and component pattern here is structurally specified, not visually specified; real implementation will require a design source this document does not provide.

## 13. Assumptions

- PrimeNG's theming API supports fully runtime-supplied token values (not merely compile-time preset selection) — the load-bearing assumption behind `THEME_ARCHITECTURE.md` §28's entire mechanism.
- A font-subsetting and self-hosting pipeline (`BUNDLE_STRATEGY.md` §12, NG-009) is available to support `DESIGN_TOKENS.md` §24's typography strategy.

## 14. Constraints

- No Angular component, HTML, CSS, SCSS, PrimeNG implementation code, Figma design, or UI mockup is generated by this document (Quality Rules, restated) — every pattern here is a structural specification for a future implementation and a future visual-design pass to satisfy together.
- This document does not select PrimeNG's specific preset/theme starting point, a font family, or specific token numeric values — each is named as a category of decision correctly deferred to implementation or a design pass.

## 15. Architecture Decisions

**ADR-005: PrimeNG Design System — Accepted.** PrimeNG is this platform's component library, consumed exclusively by `shared-ui` — no Feature or Core library ever imports from PrimeNG directly, mechanically enforced by the Nx tag matrix. Closes a slot anticipated since A-001 and never picked up by any prior document (its originally-anticipated trigger, "UI-001 Design System," never arrived as its own prompt — this document, under NG-013's own numbering, is functionally that trigger, and the redirect is stated here explicitly). See `COMPONENT_ARCHITECTURE.md` §30.

**ADR-021: Component Classification Model — Accepted.** A three-tier classification — Primitive (wrapped PrimeNG), Composite (platform-specific reusable patterns), Feature (business-specific, non-reused) — adopted over full Atomic Design, because PrimeNG already supplies an atoms/molecules-equivalent layer that a from-scratch five-tier classification would otherwise duplicate. Warrants an ADR under `REPOSITORY_STANDARDS.md` §32's own criteria (affects every component ever built, hard to reverse once hundreds of components exist against it). See `COMPONENT_ARCHITECTURE.md` §3, §5.

## 16. Implementation Readiness Checklist

| Item | Status |
|---|---|
| Presentation principles, design system philosophy defined | ✅ §2–3, `DESIGN_SYSTEM_ARCHITECTURE.md` §1–2 |
| Component classification, hierarchy, and all 7 named standards defined | ✅ §4, `COMPONENT_ARCHITECTURE.md` |
| Layout, Shell, Navigation, Dashboard presentation defined | ✅ §5, `LAYOUT_ARCHITECTURE.md` |
| Responsive strategy (mobile/tablet/desktop) defined | ✅ §6, `RESPONSIVE_STRATEGY.md` |
| Accessibility and keyboard navigation standards defined, tied to ADR-020 | ✅ §7, `DESIGN_SYSTEM_ARCHITECTURE.md` §21–22 |
| Design tokens (typography, icon, color, spacing, assets) defined | ✅ §11, `DESIGN_TOKENS.md` |
| Theme architecture and bounded white-label surface defined | ✅ §8–9, `THEME_ARCHITECTURE.md` |
| PrimeNG integration boundary defined, tag-matrix enforced | ✅ §10, `COMPONENT_ARCHITECTURE.md` §30 |
| i18n and RTL explicitly reserved, not designed further | ✅ `THEME_ARCHITECTURE.md` §32–33 |
| ADR-005 and ADR-021 decided | ✅ §15 |
| Diagrams produced | ✅ `diagrams/NG-013_Presentation_Diagrams.md` (8 diagrams) |
| `ARCHITECTURE_INDEX.md` updated | ✅ |
| `docs/adr/ADR_INDEX.md` updated | ✅ |
| Formal sign-off | ⬜ Not yet performed by any document in this series (A-009's "not formally approved" finding still stands) |

## 17. Updated ARCHITECTURE_INDEX.md

See the actual `ARCHITECTURE_INDEX.md` update accompanying this document (registry row, repository-structure tree, Known Open Items, title-change note).

## 18. Updated ADR List

See the actual `docs/adr/ADR_INDEX.md` update accompanying this document (ADR-005 moved from Anticipated to Decided; ADR-021 added).

## 19. Review Checklist

| Item | Status |
|---|---|
| Every mechanism traced to an already-decided prior document or explicitly minted as a new ADR | ✅ |
| No component, HTML, CSS, SCSS, PrimeNG code, or design mockup generated | ✅ |
| Filename collision check performed proactively, confirmed clean | ✅ (Pre-Check Result) |
| Restricted-Financial exclusion consistency checked (6th restatement) | ✅ (Pre-Check Result) |
| Title change checked against prior announcement, resolved as scope-clarifying not a renumbering | ✅ (Pre-Check Result) |
| PrimeNG boundary consistency checked against ADR-013's Repository Pattern shape | ✅ (`COMPONENT_ARCHITECTURE.md` §30) |

## 20. Approval Checklist

| Item | Status |
|---|---|
| Formal sign-off | ⬜ Not yet performed (consistent with every prior NG document) |
| Ready to govern NG-014 | ✅ Structurally, per §16 |
