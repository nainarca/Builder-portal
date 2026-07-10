# Test Quality Gates — MyPropertyAsset Web Platform

**Companion to:** [`NG-012_Quality_Engineering_Testing_Architecture.md`](NG-012_Quality_Engineering_Testing_Architecture.md)
**Covers:** Quality Gates (elaborated), Release Readiness Criteria, Defect Lifecycle, Risk-Based Testing.
**Filename note — third collision of this kind in the series:** this prompt's own Deliverables list requested this file be named `QUALITY_GATES.md`, which already exists as NG-000's companion (`docs/technical/QUALITY_GATES.md`, covering Testing Standards §24, the merge-time Quality Gates §35, and the Production Readiness Checklist §36 — cited by nearly every document since). Overwriting it would destroy content this entire series depends on. Named `TEST_QUALITY_GATES.md` instead, the same resolution NG-003 used for its `DEPENDENCY_RULES.md`/`LIBRARY_DEPENDENCY_RULES.md` collision — renaming the new file, never overwriting the old one.

## 29. Quality Gates (elaborated)

`QUALITY_GATES.md` §35's seven-step merge gate is unchanged as this platform's baseline. This document adds the concrete pass/fail criteria for the two steps that document left most open:

| §35 step | This document's concrete criterion |
|---|---|
| "Unit test suite passes, coverage threshold met" | `QUALITY_METRICS.md` §26's numeric floors — 90% domain logic, 85% Repository layer |
| "RLS/RBAC integration tests pass, including the negative-test requirement" | 100% of `PERMISSION_MATRIX.md` "None"/"Delegated" cells covered (`TESTING_STRATEGY.md` §6), mutation-tested (`QUALITY_METRICS.md` §27) |

Every other §35 step (lint, type-check, no open critical/high security finding, ADR-for-new-pattern, independent review) is unchanged — this document does not redesign them, only confirms they remain in force alongside the two now-quantified ones above.

## 30. Release Readiness Criteria

A release candidate is ready for UAT sign-off (`ENVIRONMENT_STRATEGY.md` §10, NG-011) only once it has passed every §29 gate **and** the tier-appropriate subset of `TESTING_STRATEGY.md`'s pyramid for whatever it changed (a Public Website-only change does not need Builder Portal's E2E suite re-run, consistent with `TEST_AUTOMATION_STRATEGY.md` §23's affected-aware principle). Release Readiness Criteria are the testing-architecture half of `RELEASE_STRATEGY.md` §19's Release Validation (NG-011) — that document defined the promotion-gate structure; this document defines what "passes" concretely means at the QA gate specifically, before UAT's human judgment takes over.

## 31. Defect Lifecycle

1. **Detected** — by an automated gate (§29), a UAT reviewer (§8 in `TESTING_STRATEGY.md`), or a post-deployment signal (`MONITORING_KPIS.md`, `OBSERVABILITY_STRATEGY.md`).
2. **Classified** — using the exact same Severity/Category taxonomy `ERROR_CLASSIFICATION.md` (NG-010) already established for runtime errors, reused here rather than inventing a parallel defect-severity scheme; a Critical-severity defect (an Organization-isolation or Restricted-Financial-adjacent finding) escalates identically to a Critical Security Event (`OBSERVABILITY_STRATEGY.md` §27).
3. **Fixed** — a new commit, never a patch to an already-built artifact (`BUILD_STRATEGY.md` §24's immutability restated for defect fixes specifically).
4. **Verified** — the fix's own change includes the regression test that would have caught it (§9 in `TESTING_STRATEGY.md`'s Regression Testing Strategy, restated as a per-defect requirement, not just a general suite property) — a defect fixed without a corresponding new or corrected test is not considered closed.
5. **Closed** — only once the fix has passed every gate a normal change would (§29) and, for a Production-discovered defect, once the Hotfix Workflow's sanity check (§11 in `TESTING_STRATEGY.md`) confirms the fix in the live environment.

## 32. Risk-Based Testing

Testing effort is not distributed evenly across this platform's surface area — it is weighted toward the areas this entire series has already identified as highest-stakes: the Organization-isolation and RLS/RBAC boundary (§6, §20 — the largest, most mutation-tested, most mandatory-coverage suite on the platform), the Restricted-Financial exclusion's structural absence (`TEST_AUTOMATION_STRATEGY.md` §24's static check), and white-label/multi-Organization correctness (`TEST_DATA_MANAGEMENT.md` §19–20). Lower-risk surface area (presentational-only UI, `QUALITY_METRICS.md` §26's "no blanket target" category) receives proportionally lighter automated coverage and leans more on Component/E2E behavioral tests than on a coverage percentage — this is a deliberate allocation of finite testing effort toward what this series has spent eleven prior documents establishing actually matters, not an oversight in the areas that receive less.
