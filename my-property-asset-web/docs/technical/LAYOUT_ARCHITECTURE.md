# Layout Architecture — MyPropertyAsset Web Platform

**Companion to:** [`NG-013_Frontend_Presentation_Architecture.md`](NG-013_Frontend_Presentation_Architecture.md)
**Covers:** Layout Architecture, Application Shell Presentation, Navigation Presentation, Dashboard Presentation.

## 6. Layout Architecture

Two layout shapes, restated from `ROUTING_STRATEGY.md` §9 (NG-004) and now given their presentation-layer detail: Public Website's header/footer layout, and the sidebar+topbar+content-outlet shape shared by Super Admin and Builder Portal. Both are Composite-tier compositions (`COMPONENT_ARCHITECTURE.md` §3) living in each application's own Shell (`SOURCE_TREE.md` §2, NG-008) — never in `shared-ui` itself, since a layout is a property of *which application* renders it, the same reasoning NG-008 already gave for placing layout code with the Shell rather than as a reusable cross-application component.

## 7. Application Shell Presentation

The Shell renders progressively through its own bootstrap sequence (`AUTHENTICATION_ARCHITECTURE.md` §4): a minimal, theme-independent loading state first (`COMPONENT_ARCHITECTURE.md` §14), then the resolved theme applied (`BUNDLE_STRATEGY.md` §9) before any authenticated content paints — this ordering exists specifically to satisfy `PERFORMANCE_STRATEGY.md` §3's CLS target by construction, not as a separate presentation decision layered on top of an already-decided bootstrap sequence.

## 8. Navigation Presentation

Implements A-005's already-decided navigation vocabulary (Global/Local/Context/Action Navigation, Primary/Secondary Nav, Breadcrumb Strategy) as concrete Composite-tier components — this document does not redesign navigation structure (A-005's job) or route mapping (`ROUTING_STRATEGY.md`'s job), only how each already-defined navigation concept renders. Menu item visibility reads the same resolved RBAC permission-set Signal `AUTHORIZATION_ARCHITECTURE.md` §21 already established (never a second, independently-maintained visibility check) — restated here because Navigation Presentation is exactly the layer where that rule is enforced in practice.

## 9. Dashboard Presentation

A Dashboard screen composes Composite-tier "metric card" and "summary panel" components, each bound to a `computed()` Signal (`STATE_OWNERSHIP.md` § Why Dashboard Is Never Its Own Fetch, restated) — a Dashboard component never triggers its own data fetch, only renders whatever its owning Feature's Signals already derive. This is the presentation-layer guarantee that makes NG-005's state-architecture rule visible in the UI: if a Dashboard component ever needed a loading spinner of its own (§14 in `COMPONENT_ARCHITECTURE.md`) independent of the Feature data it's built from, that would be a signal the `computed()` rule was violated somewhere upstream, not a normal Dashboard behavior.
