# NG-012 — Quality Engineering & Testing Architecture

## Document Information

| Field | Value |
|---|---|
| Document ID | NG-012 |
| Name | Quality Engineering & Testing Architecture |
| Version | 1.0 |
| Status | Draft |
| Series | Technical Architecture (`docs/technical/`) |
| Depends On | NG-000–NG-011, A-001–A-009 |
| Previous Document | NG-011 — Build, Release & Deployment Architecture |
| Next Document | NG-013 — UI Design System Integration |
| Governing reference for | ADR-019 (Testing Pyramid & Coverage Architecture), ADR-020 (Accessibility Conformance Target), NG-013 UI Design System Integration, NG-014 Technical Architecture Review & Implementation Readiness, Future QA implementation, Cursor AI implementation |
| Last Updated | 2026-07-09 |

---

## Pre-Check Result

**Documents read as Source of Truth:** NG-000 through NG-011 in full (including `QUALITY_GATES.md` §24, §35, §36, `CODING_STANDARDS.md` §30, `AI_DEVELOPMENT_GUIDE.md`, `ERROR_CLASSIFICATION.md`, `ENVIRONMENT_STRATEGY.md`, `BUILD_STRATEGY.md`, `RELEASE_STRATEGY.md`, `DEPLOYMENT_STRATEGY.md`, `MONITORING_KPIS.md`, `SOURCE_TREE.md` §2's e2e-project placement), plus `ARCHITECTURE_INDEX.md` and `docs/adr/ADR_INDEX.md`. `MASTER_CONTEXT.md`/`PROJECT_FACTS.md` re-verified absent.

**Renumbering: none.** NG-011 announced NG-012 as "Testing Strategy"; this prompt's title, "Quality Engineering & Testing Architecture," is a title expansion consistent with the pattern already seen three times (NG-011 itself, and NG-014's earlier expansion) — not a renumbering. The governing-reference-for list (NG-013, NG-014) matches NG-011's announcement exactly.

**Filename collision — the third of this kind in the series, resolved the same way as the first two.** This prompt's Deliverables list requests a companion named `QUALITY_GATES.md`, which already exists as NG-000's companion file (`docs/technical/QUALITY_GATES.md`) — containing Testing Standards (§24), the merge-time Quality Gates (§35), and the Production Readiness Checklist (§36), all cited extensively by nearly every document since NG-000. Overwriting it would destroy load-bearing content. Resolved by naming the new file `TEST_QUALITY_GATES.md` instead, the identical resolution NG-003 applied to its `DEPENDENCY_RULES.md` collision (renamed to `LIBRARY_DEPENDENCY_RULES.md`) — rename the new file, never overwrite the old one.

**No Restricted-Financial conflict**, but the **fifth** restatement of the same absolute rule, now at the test-data and static-analysis layer: `TEST_DATA_MANAGEMENT.md` §21 confirms no test dataset anywhere contains synthetic Restricted-Financial content, and `TEST_AUTOMATION_STRATEGY.md` §24 adds a CI-enforced structural check confirming no `property`/`loan`/`expense` path exists under `libs/` — the concrete fulfillment of NG-008's own prediction that this exclusion would become "a literal grep" once code exists.

**No contradiction of prior architecture.** Every mechanism in this document elaborates an already-stated principle (`QUALITY_GATES.md`'s testing standards and merge gates, `AI_DEVELOPMENT_GUIDE.md`'s AI-code rules, `ENVIRONMENT_STRATEGY.md`'s tier structure) into full testing-architecture detail — the same "NG-000/earlier document sketches, later document elaborates" relationship NG-009 had to `TECHNICAL_STANDARDS.md` §19–20 and NG-011 had to §22.

---

## 1. Executive Summary

NG-012 defines how this platform proves its own architectural guarantees hold — translating a testing pyramid, numeric coverage floors, and a defect lifecycle out of principles this series has stated since NG-000 but never fully specified. Two new decisions: **ADR-019 (Testing Pyramid & Coverage Architecture)**, formalizing the pyramid shape and concrete coverage targets `QUALITY_GATES.md` §35 left unquantified, and **ADR-020 (Accessibility Conformance Target)**, setting WCAG 2.1 AA as this platform's first-ever accessibility bar. Five companion files carry the detail: `TESTING_STRATEGY.md`, `QUALITY_METRICS.md`, `TEST_DATA_MANAGEMENT.md`, `TEST_AUTOMATION_STRATEGY.md`, and `TEST_QUALITY_GATES.md` (renamed to avoid the filename collision above).

## 2. Quality Vision

A platform where every guarantee this documentation series has made — Organization isolation, the Restricted-Financial exclusion, RBAC boundaries, white-label correctness — is continuously, automatically proven, not merely documented. Quality here means a defect in any of those guarantees is caught by a machine before a human ever sees it in Production.

## 3. Quality Principles

See `TESTING_STRATEGY.md` §1. Quality is verified, not assumed; every test traces to a source-of-truth document; the Restricted-Financial exclusion is a CI-checkable claim, not an assumption resting on prior documents' say-so.

## 4. Testing Architecture

See `TESTING_STRATEGY.md` in full. A pyramid weighted toward Unit/Component tests, a deliberately smaller but non-negotiable Integration/RLS tier (100% of `PERMISSION_MATRIX.md` "None"/"Delegated" cells), and the fewest E2E tests, reserved for critical cross-product flows only.

## 5. Automation Strategy

See `TEST_AUTOMATION_STRATEGY.md` in full. Every tier runs in CI automatically, Nx-affected-aware; a failing test blocks its pipeline stage, never downgraded to a warning; AI-generated code is held to the identical bar as human-written code, with a CI-enforced requirement that permission-boundary code ship with its negative test in the same change.

## 6. Quality Gates

See `TEST_QUALITY_GATES.md` §29–30. `QUALITY_GATES.md` §35's seven-step gate is unchanged; this document quantifies its two previously-open criteria (coverage floors, 100%-of-matrix RLS coverage) and defines Release Readiness Criteria as the QA-gate-specific concretization of `RELEASE_STRATEGY.md` §19.

## 7. Test Environment Strategy

See `TEST_DATA_MANAGEMENT.md` §22. Unit/Component tests need no deployed environment; Integration/RLS tests run against the QA tier's real Supabase project; E2E against QA or Staging; UAT sign-off against the UAT tier; performance validation against Staging; no test of any kind runs against Production.

## 8. Test Data Strategy

See `TEST_DATA_MANAGEMENT.md` §19–21. Synthetic, seeded data only, never production data; at least two synthetic Organizations in every sub-Production tier's dataset, specifically to make Organization-isolation and white-label defects detectable; no Restricted-Financial-adjacent synthetic data anywhere, since no code path exists to represent it.

## 9. Coverage Targets

See `QUALITY_METRICS.md` §26. 90% domain/business logic, 85% Repository layer plus 100% of documented error-classification paths, 100% of `PERMISSION_MATRIX.md`'s "None"/"Delegated" cells (a completeness metric, not a percentage), no blanket target for UI-only presentational code.

## 10. Accessibility Strategy

See `QUALITY_METRICS.md` §14. WCAG 2.1 AA, platform-wide, no application exempted (ADR-020) — automated linting for the mechanically-checkable subset, manual keyboard/screen-reader spot-checks folded into UAT sign-off for what automation cannot catch.

## 11. Security Validation

See `QUALITY_METRICS.md` §16, `TEST_AUTOMATION_STRATEGY.md` §24. Dependency/vulnerability scanning every CI run; the RLS/RBAC negative-test suite treated as this platform's primary security testing mechanism, not merely a functional one; a CI-enforced structural check confirming the Restricted-Financial exclusion's physical absence.

## 12. Performance Validation

See `QUALITY_METRICS.md` §15. Verifies, does not redefine, `MONITORING_KPIS.md` §30's existing targets — bundle budgets checked at every Build Validation, Core Web Vitals checked via synthetic measurement at Staging before Production promotion, complementing NG-009's post-deployment Real User Monitoring.

## 13. Risks

- **Builder Projects backend dependency is now carried by 19 consecutive documents** (adds NG-012 — the Integration/RLS suite this document mandates at 100% matrix coverage applies uniformly to the still-undesigned Projects/Units backend domain's eventual permission rows, gated as always by `infra-feature-flags`).
- **The 90%/85% coverage floors and the WCAG 2.1 AA target are both new, numeric commitments with no implementation yet to validate them against** — reasonable, industry-consistent targets, but genuinely untested against this specific codebase's real constraints; NG-014 (Technical Architecture Review) is the natural place to revisit both once there's evidence.
- **Mutation testing's scoped adoption (RLS/RBAC suite only, `QUALITY_METRICS.md` §27) still adds real CI time** to this platform's single most heavily-weighted test tier — a deliberate cost this document accepts, but worth flagging as a concrete tradeoff, not a free addition.
- **No test automation tooling is selected** (`TEST_AUTOMATION_STRATEGY.md` throughout, per this document's own Quality Rules) — every mechanism here is framework-agnostic by design, meaning real implementation risk is deferred, not eliminated.

## 14. Assumptions

- A CI system capable of Nx-affected-aware test execution, per-tier environment targeting (`TEST_DATA_MANAGEMENT.md` §22), and structured test reporting (`QUALITY_METRICS.md` §33) is available — not selected here, assumed obtainable.
- At least two synthetic Organizations can be provisioned and maintained in every sub-Production environment tier without operational burden disproportionate to their testing value.

## 15. Constraints

- No test code, Playwright/Cypress/Jest test, script, or CI configuration is generated by this document (Quality Rules, restated) — every mechanism here is a specification for a future implementation to satisfy.
- This document does not select a test automation framework, accessibility scanning tool, mutation testing tool, or cross-browser automation vendor — each is named as a category of decision correctly deferred to implementation.

## 16. Architecture Decisions

**ADR-019: Testing Pyramid & Coverage Architecture — Accepted.** A pyramid weighted toward Unit and Component tests, a deliberately smaller but 100%-complete-against-`PERMISSION_MATRIX.md` Integration/RLS tier, and the fewest E2E tests reserved for critical cross-product flows; concrete coverage floors (90% domain logic, 85% Repository layer); mutation testing scoped specifically to the RLS/RBAC negative-test suite. Formalizes `QUALITY_GATES.md` §24/§35's already-stated but unquantified testing principles into a complete, numeric architecture — the same "principle stated early, formalized later" pattern ADR-013, ADR-016, and ADR-017 all followed. See `TESTING_STRATEGY.md` §3, `QUALITY_METRICS.md` §26–27.

**ADR-020: Accessibility Conformance Target (WCAG 2.1 AA) — Accepted.** Platform-wide, no application exempted. This is a genuinely new decision — no prior document in this series set an accessibility bar despite "Accessible" being a named Objective as early as this platform's technical governance — decided here because this is the first document whose actual job is testing/verification architecture, the natural place for a conformance target to also get its verification mechanism (automated linting plus UAT-folded manual checks) in the same place it's set. See `QUALITY_METRICS.md` §14.

## 17. Implementation Readiness Checklist

| Item | Status |
|---|---|
| Quality principles, testing philosophy, pyramid defined | ✅ §3–4, `TESTING_STRATEGY.md` §1–3 |
| Every named test type (Unit through UI, 13 total) strategy defined | ✅ `TESTING_STRATEGY.md` §4–13 |
| Accessibility, Performance, Security, Cross-Browser, Responsive validation defined | ✅ §10–12, `QUALITY_METRICS.md` §14–18 |
| Coverage targets, mutation testing, test reporting defined | ✅ §9, `QUALITY_METRICS.md` §26–27, §33 |
| White-label / Multi-Organization validation defined | ✅ §8, `TEST_DATA_MANAGEMENT.md` §19–20 |
| Test data management and environment strategy defined | ✅ §7–8, `TEST_DATA_MANAGEMENT.md` §21–22 |
| Test automation principles, static analysis, linting, AI-code validation defined | ✅ §5, `TEST_AUTOMATION_STRATEGY.md` |
| Quality gates quantified, release readiness, defect lifecycle, risk-based testing defined | ✅ §6, `TEST_QUALITY_GATES.md` §29–32 |
| ADR-019 and ADR-020 decided | ✅ §16 |
| Filename collision resolved, not overwritten | ✅ `TEST_QUALITY_GATES.md` header note |
| Diagrams produced | ✅ `diagrams/NG-012_Testing_Diagrams.md` (8 diagrams) |
| `ARCHITECTURE_INDEX.md` updated | ✅ |
| `docs/adr/ADR_INDEX.md` updated | ✅ |
| Formal sign-off | ⬜ Not yet performed by any document in this series (A-009's "not formally approved" finding still stands) |

## 18. Updated ARCHITECTURE_INDEX.md

See the actual `ARCHITECTURE_INDEX.md` update accompanying this document (registry row, repository-structure tree, Known Open Items, filename-collision note).

## 19. Updated ADR List

See the actual `docs/adr/ADR_INDEX.md` update accompanying this document (ADR-019 and ADR-020 added to Decided ADRs).

## 20. Review Checklist

| Item | Status |
|---|---|
| Every mechanism traced to an already-stated principle or explicitly minted as a new ADR | ✅ |
| No test code, framework config, or CI pipeline generated | ✅ |
| Filename collision caught and resolved before writing, not after | ✅ |
| Restricted-Financial exclusion consistency checked at the test-data and static-analysis layer | ✅ (`TEST_DATA_MANAGEMENT.md` §21, `TEST_AUTOMATION_STRATEGY.md` §24 — 5th restatement) |
| Title expansion checked against prior announcement | ✅ (Pre-Check Result) |

## 21. Approval Checklist

| Item | Status |
|---|---|
| Formal sign-off | ⬜ Not yet performed (consistent with every prior NG document) |
| Ready to govern NG-013 onward | ✅ Structurally, per §17 |
