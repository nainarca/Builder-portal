# Component Architecture — MyPropertyAsset Web Platform

**Companion to:** [`NG-013_Frontend_Presentation_Architecture.md`](NG-013_Frontend_Presentation_Architecture.md)
**Covers:** Component Classification, Component Hierarchy, Atomic Design Considerations, Form/Table/Dialog/Notification/Loading/Empty State/Error Presentation Standards, PrimeNG Integration Strategy, Animation & Motion Guidelines.

## 3. Component Classification

**New in this document — ADR-021 (main document §15): a three-tier classification, not full Atomic Design.**

| Tier | What it is | Lives in |
|---|---|---|
| **Primitive** | A directly-wrapped PrimeNG component (Button, Input, Table primitive) with this platform's tokens applied and ARIA defaults confirmed | `shared-ui` |
| **Composite** | A platform-specific pattern composed from Primitives, reused across Features (`COMPONENT_ARCHITECTURE.md` §10–16's Form/Table/Dialog/etc. standards) | `shared-ui` |
| **Feature** | A component specific to one Feature's business purpose, composed from Primitives and Composites, never reused across Feature boundaries | The owning Feature library (`FEATURE_BOUNDARIES.md`) |

## 4. Component Hierarchy

Strictly one-directional, mirroring `TECHNICAL_STANDARDS.md` §3's layering: Feature components depend on Composite and Primitive components; Composite components depend only on Primitive components (never on another Composite, avoiding the same "no lateral dependency" problem `FEATURE_BOUNDARIES.md` already forbids between Features); Primitive components depend only on design tokens (`DESIGN_TOKENS.md`) and PrimeNG itself. No component, at any tier, imports a sibling Feature's component — the presentation-layer restatement of `FEATURE_BOUNDARIES.md`'s isolation rule.

## 5. Atomic Design Considerations

Full Atomic Design (atoms/molecules/organisms/templates/pages) was considered and **not adopted** — PrimeNG already supplies a mature atoms-and-molecules layer, so re-deriving that same granularity in this platform's own classification would duplicate PrimeNG's own internal structure without adding a decision this platform actually needs to make. The three-tier model (§3) keeps only the distinctions that matter for *this* platform's dependency rules (what's shared vs. Feature-owned, what touches PrimeNG directly vs. what doesn't) — a deliberately simpler classification than Atomic Design's five, not a lesser one.

## 10. Form Standards

Every form is built from Composite-tier form field components (`shared-ui`), each pairing a PrimeNG input Primitive with a label, validation-error slot (`ERROR_HANDLING_GUIDELINES.md` §9, NG-010 — inline, field-level, immediate), and consistent spacing (`DESIGN_TOKENS.md` §27). No Feature builds its own label/error/spacing pattern independently — every form in every application looks and behaves identically at this structural level, differing only in which fields a specific business form needs.

## 11. Table Standards

A Composite-tier Table component wraps PrimeNG's table Primitive with this platform's standard pagination, sorting, and filtering affordances — the presentation-layer counterpart to `SUPABASE_INTEGRATION.md` §11–13's mandatory server-side pagination/filtering/sorting (NG-007): the Table component's UI controls exist specifically to drive those server-side parameters, never to locally paginate/filter/sort an already-fetched, unbounded dataset. Virtual scrolling (`PERFORMANCE_STRATEGY.md` §24, NG-009) is a Table-component configuration option for the specific lists NG-009 already identified (Units, Audit Log, cross-Organization directories), not a separate component.

## 12. Dialog Standards

A Composite-tier Dialog component wraps PrimeNG's dialog Primitive with this platform's standard header/footer/action-button layout and the focus-trap/restore behavior `DESIGN_SYSTEM_ARCHITECTURE.md` §22 requires. Used for confirmation prompts, focused single-record forms, and Support Access invocation (A-008 §7) — never for a flow that genuinely needs its own route (a Dialog is a UI pattern for a focused, short-lived interaction, not a substitute for `ROUTING_STRATEGY.md`'s routing model).

## 13. Notification Standards

Implements `OBSERVABILITY_STRATEGY.md` §26's Error Notification Strategy (NG-010) as a concrete component pattern: a toast Composite for Medium-severity, non-blocking notices; a blocking in-context Composite (inline or banner) for High-severity failures; a persistent, non-auto-dismissing Composite for Critical-severity Security Events. This document supplies the component; NG-010 already supplied the severity-to-treatment mapping — no new decision is made here, only the presentation-layer implementation of an already-decided strategy.

## 14. Loading Experience Standards

A Composite-tier loading indicator communicates state at three granularities: a component-level skeleton/spinner for a single Feature's data still resolving, a route-level loading state for a lazy chunk still downloading (`LAZY_LOADING_STRATEGY.md`, NG-004), and the Shell-level bootstrap sequence's own loading state (`AUTHENTICATION_ARCHITECTURE.md` §4) — the one that matters most for `PERFORMANCE_STRATEGY.md` §3's CLS target, since it is the loading state theme resolution (`BUNDLE_STRATEGY.md` §9, NG-009) sits behind. No component blocks on a spinner longer than necessary — a Signal already resolved (`SIGNALS_STRATEGY.md`) renders immediately, never an artificial minimum-loading-time delay.

## 15. Empty State Standards

A Composite-tier Empty State component is shown whenever a paginated list (`SUPABASE_INTEGRATION.md` §11) returns zero rows — distinguishing, at minimum, "nothing exists yet" (with a call-to-action, where the user has permission to create one, per `PERMISSION_MATRIX.md`) from "no results match your filter" (with a clear-filters action) — these are different user situations requiring different guidance, never collapsed into one generic "no data" message.

## 16. Error Presentation Standards

Implements `ERROR_HANDLING_GUIDELINES.md` §5's User-Friendly Error Strategy (NG-010) as concrete components: field-level inline errors (§10 above) for Validation-category errors, the Notification components (§13) for Network/Data/System-category errors, and a dedicated full-section Error State Composite (distinct from Empty State, §15 — a failure, not an absence) for a Feature that cannot render at all. No component ever renders a raw technical error (`ERROR_HANDLING_GUIDELINES.md` §6) — every Error Presentation component consumes only the authored, category-level message NG-010 already defined.

## 30. PrimeNG Integration Strategy

**New in this document — closes ADR-005 (main document §15), the anticipated ADR named as far back as A-001 and never picked up by any prior document.** PrimeNG is adopted as this platform's component library, consumed **only** by `shared-ui` (Primitive tier, §3) — no Feature library, and no Core library, ever imports from PrimeNG directly. This mirrors ADR-013's Repository Pattern shape exactly: just as only Shared-tagged Repositories touch the Supabase client, only `shared-ui` touches PrimeNG, and the Nx tag matrix (`DEPENDENCY_GUIDE.md` §22) is extended to enforce this identically — a Feature importing `primeng/*` directly is a tag-matrix violation, the same class of build-time failure as a Feature importing another Feature's internals. This is a deliberate, load-bearing consistency: the platform now has exactly one shape for "raw external dependency, wrapped once, consumed everywhere else through the wrapper," applied to data (Supabase), and now to UI (PrimeNG).

## 34. Animation & Motion Guidelines

Motion is functional, not decorative — used only to communicate state change (a Dialog opening, a Notification entering/exiting, §12–13) or provide loading feedback (§14), never as a standalone visual flourish. Every animation respects `prefers-reduced-motion` (an actual, mechanically-checkable extension of `DESIGN_SYSTEM_ARCHITECTURE.md` §21's WCAG 2.1 AA commitment — motion-triggered vestibular discomfort is a real accessibility concern, not a cosmetic one) — a user with that preference set sees the same state changes with instant transitions instead of animated ones, never a degraded or missing experience.
