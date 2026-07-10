# Quality Metrics — MyPropertyAsset Web Platform

**Companion to:** [`NG-012_Quality_Engineering_Testing_Architecture.md`](NG-012_Quality_Engineering_Testing_Architecture.md)
**Covers:** Accessibility Testing Strategy, Performance Testing Strategy, Security Testing Strategy, Cross-Browser Testing Strategy, Responsive Testing Strategy, Code Coverage Targets, Mutation Testing Considerations, Test Reporting.

## 14. Accessibility Testing Strategy

**New in this document — ADR-020 (main document §16): WCAG 2.1 Level AA is this platform's accessibility conformance target, platform-wide, no application exempted.** No prior document in this series has set an accessibility bar; this document sets one because "Accessible" is a named Objective of this very prompt and a commercial enterprise SaaS product without one is a real, avoidable gap. Verification is two-tier: automated accessibility linting (axe-core-equivalent, integrated into Component-tier tests, §5 in `TESTING_STRATEGY.md`) catches the mechanically-checkable subset (contrast ratios, ARIA attributes, focus order); manual keyboard-navigation and screen-reader spot-checks (part of UAT sign-off, §8) catch what automated tooling structurally cannot. Public Website carries the highest stakes here (unauthenticated, public-facing, `PERFORMANCE_STRATEGY.md` §19) but the target applies identically to Super Admin and Builder Portal — an internal enterprise tool is not held to a lower accessibility bar than a marketing site.

## 15. Performance Testing Strategy

Verifies the targets `MONITORING_KPIS.md` §30 (NG-009) already set — this document does not invent new performance targets, it defines how the existing ones get checked before Production, not only observed after. Bundle-size budgets (`BUNDLE_STRATEGY.md` §2) are checked at Build Validation (`BUILD_STRATEGY.md` §18, NG-011) — a CI-time, every-build check. Core Web Vitals targets are checked via synthetic/lab measurement at the Staging tier (`ENVIRONMENT_STRATEGY.md` §11) before Production promotion, complementing (not replacing) the Real User Monitoring `MONITORING_KPIS.md` §29 already established for post-deployment observation.

## 16. Security Testing Strategy

Elaborates `QUALITY_GATES.md` §35's existing gate ("no critical or high-severity security finding open") into what actually produces that finding: static dependency/vulnerability scanning (§24 in `TEST_AUTOMATION_STRATEGY.md`) at every CI run, and the Integration-tier RLS/RBAC negative-test suite (§6 in `TESTING_STRATEGY.md`) as this platform's primary *security* testing mechanism, not merely a functional-correctness one — an RLS negative test failing is simultaneously a functional defect and a security finding, and this document treats it as both, consistent with `TECHNICAL_STANDARDS.md` §11's "an attempt is itself worth knowing about" framing extended to test failures specifically.

## 17. Cross-Browser Testing Strategy

Automated Component and E2E tests (§5, §7 in `TESTING_STRATEGY.md`) run against the current stable release of every browser engine this platform commits to supporting (Chromium, Firefox, WebKit) — a defect that only reproduces on one engine is still a defect, not a lower-priority one, given this platform's commercial SaaS audience cannot be assumed to standardize on one browser. This document names the requirement; it does not select the specific cross-browser automation tooling (an implementation choice, consistent with this series' consistent deferral of vendor/tool selection).

## 18. Responsive Testing Strategy

Component and E2E tests (§5, §7) run against a defined set of viewport breakpoints (mobile, tablet, desktop — the specific pixel breakpoints are a design-system, not architecture, decision, correctly deferred to NG-013 UI Design System Integration) — "Mobile Friendly" was a named Objective as far back as NG-009, and this document is where that objective gets a verification mechanism rather than remaining an unchecked aspiration.

## 26. Code Coverage Targets

| Code category | Target | Rationale |
|---|---|---|
| Domain/business logic (validators, `computed()` derivations) | 90% line coverage | `QUALITY_GATES.md` §35's "not a blanket percentage" principle, restated with the concrete number that principle was missing — this is the code category the principle explicitly singled out for a real bar |
| Repository layer (`shared-data-access`) | 85% line coverage, 100% of documented error-classification paths (`ERROR_CLASSIFICATION.md`) | Every named error category (`ERROR_CLASSIFICATION.md` §4) must have at least one covering test, regardless of aggregate percentage |
| RLS/RBAC integration tests | 100% of `PERMISSION_MATRIX.md` "None"/"Delegated" cells | Not a percentage-of-code metric at all — a completeness metric against the matrix itself, restated once more as this document's own coverage target for the single most important tier |
| UI-only code (presentation, no business logic) | No blanket target | `QUALITY_GATES.md` §35, restated: UI-only code is not held to the same bar as validators/business rules — coverage here comes from Component/E2E tests targeting behavior, not a line-coverage percentage pursued for its own sake |

**Coverage percentage is a floor, never a target pursued for its own sake** — a test written only to move a coverage number without asserting a real behavior is worse than no test, since it creates false confidence. This document sets numeric floors specifically to make `QUALITY_GATES.md` §35's "coverage threshold met" checkable, not to encourage coverage-chasing.

## 27. Mutation Testing Considerations

**Not adopted platform-wide** — no prior document has identified a need broad enough to justify mutation testing's real cost (significantly longer CI runs) across the whole codebase. **Scoped adoption, specifically for the RLS/RBAC negative-test suite (§6 in `TESTING_STRATEGY.md`)**: because that suite is this platform's single most important testing requirement, mutation testing there verifies the negative tests actually fail when the underlying permission logic is broken, not merely that they currently pass — a negative test that would still pass against a deliberately-broken permission check is a false sense of security this document specifically wants caught, given how much weight `QUALITY_GATES.md` §24 and this document both place on that one suite. This is a deliberately narrow, justified exception to "not adopted platform-wide," not a contradiction of it.

## 33. Test Reporting

Every test run (CI-time and post-deployment smoke, `DEPLOYMENT_STRATEGY.md` §20) produces a structured report — pass/fail per test, coverage delta (§26), and for the Integration/RLS suite specifically, an explicit per-`PERMISSION_MATRIX.md`-cell result, so a reviewer can confirm completeness against the matrix directly rather than trusting an aggregate pass count. Test reports are retained with the same correlation-ID-adjacent traceability discipline `LOGGING_STANDARDS.md` §22 (NG-010) established for production logs — a failing test's report links back to the commit and, where applicable, the architecture document section it was meant to verify (`CODING_STANDARDS.md` §30's traceability requirement, extended from code review into test reporting).
