# Testing Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-012_Quality_Engineering_Testing_Architecture.md`](NG-012_Quality_Engineering_Testing_Architecture.md)
**Covers:** Quality Engineering Principles, Testing Philosophy, Testing Pyramid, Unit/Component/Integration/E2E/UAT/Regression/Smoke/Sanity/API/UI Testing Strategy.
**Note on scope relative to NG-000:** `QUALITY_GATES.md` (NG-000) already established a three-row Testing Standards table (Unit/Integration/E2E) and the single most-repeated testing requirement in this series — every `PERMISSION_MATRIX.md` "None" cell needs a negative RLS test. This document does not redecide either; it is the document whose specific job is elaborating that sketch into a full testing architecture, the same relationship NG-011 had to NG-000's three-tier environment sketch.

## 1. Quality Engineering Principles

- **Quality is verified, not assumed** — every architectural guarantee this series has made (Organization isolation, the Restricted-Financial exclusion, RBAC boundaries) is only real to the extent a test proves it holds; an undocumented assumption and an untested one are the same risk (`QUALITY_GATES.md` §24, restated as this document's first principle).
- **Tests trace to source-of-truth documents, never invented independently** — a unit test traces to an A-003A Acceptance Criterion, an integration test traces to a `PERMISSION_MATRIX.md` cell, an E2E test traces to an A-002 Business Flow step. A test with no traceable origin is a governance flag, the same standard `CODING_STANDARDS.md` §30 already applies to code.
- **A test suite that passes without exercising the Restricted-Financial exclusion is passing, not proving the exclusion holds** — this document treats "prove the absence of a code path" (no Properties/Loans/Expenses repository, route, or component exists to test) as itself a verifiable, CI-checkable claim (§24 in `TEST_AUTOMATION_STRATEGY.md`), not an assumption resting on four prior documents' say-so alone.

## 2. Testing Philosophy

Shift-left: a defect is cheapest to catch at the layer closest to where it originates (a type error at compile time, a business-rule violation at unit-test time, an RLS gap at integration-test time) — this document's whole structure (§3's pyramid shape) is an expression of that philosophy, not a separate belief stated alongside it. Tests are a specification the codebase must satisfy, not a retrofit written after code "looks done."

## 3. Testing Pyramid

**New in this document — ADR-019 (main document §16) formalizes this shape.**

```
        /\
       /E2E\          Fewest — critical cross-product flows only (§7)
      /------\
     /  Integ. \      RLS/RBAC boundary + API contract (§6, §12)
    /------------\
   / Unit + Compon.\  Most — business logic, components (§4–5)
  /------------------\
```

Heavily weighted toward Unit and Component tests (fast, cheap, precise failure localization), a deliberately smaller Integration layer (necessary because RLS/RBAC enforcement can only be proven against a real backend, never mocked away — `QUALITY_GATES.md` §24's own reasoning), and the fewest E2E tests (slow, expensive, reserved for flows whose value is specifically that multiple layers work together, not for anything a lower layer could prove alone).

## 4. Unit Testing Strategy

Scope: business/domain logic — validators, `computed()` derivations (`SIGNALS_STRATEGY.md`), pure utility functions (`util-*`). Source of truth for *what* to test: every A-003A Given/When/Then scenario is a candidate test case, traced directly (`QUALITY_GATES.md` §24, restated). Unit tests never touch a real Supabase instance — a Repository's own logic is tested with its Supabase call mocked at the boundary, never the reverse (mocking business logic and testing the network call, which would test nothing this platform actually needs proven at this layer).

## 5. Component Testing Strategy

Scope: a single Angular component's rendering and interaction behavior in isolation (`OnPush`/zoneless reactivity, `PERFORMANCE_STRATEGY.md` §17 — a component test is exactly where a regression in fine-grained reactivity would first surface). Component tests stub their inputs and Signal dependencies rather than mounting a full Feature — a component test that requires a real Repository call is scoped wrong and belongs at the Integration layer instead (§6).

## 6. Integration Testing Strategy

**The single most important tier in this platform's entire testing architecture, restated from `QUALITY_GATES.md` §24 as this document's own central claim, not a secondary one.** Every `PERMISSION_MATRIX.md` "None" or "Delegated" cell requires an automated test proving the denial holds at the real RLS layer — run against the QA environment tier's actual Supabase project (`ENVIRONMENT_STRATEGY.md` §9, NG-011), never a mocked RLS response, since a mocked "denied" response proves nothing about whether the backend itself actually denies it. Integration tests are also where API contract correctness (`SUPABASE_INTEGRATION.md`, NG-007) and Repository-layer error classification (`ERROR_CLASSIFICATION.md`, NG-010) are proven against real responses.

## 7. End-to-End Testing Strategy

Reserved for critical cross-product flows only — A-002's own named example (Builder Registration → Approval → Project/Unit → Invitation → Owner Acceptance, `QUALITY_GATES.md` §24 restated) is the template for what qualifies: a flow spanning more than one application (`ADR-009`) or more than one Feature boundary, where the thing actually being proven is that the handoffs work, not any single screen's internal correctness (already proven at lower tiers). E2E tests run against the QA or Staging environment tier (`ENVIRONMENT_STRATEGY.md` §9, §11), never against Production.

## 8. User Acceptance Testing Strategy

**Not a separate automated test suite — this is the human sign-off already defined as the UAT environment tier's gate** (`ENVIRONMENT_STRATEGY.md` §10, `RELEASE_STRATEGY.md` §30, NG-011). This document's addition: UAT sign-off is checked against the same source-of-truth documents automated tests trace to (A-002 Business Flow, A-003A Acceptance Criteria) — a human UAT reviewer is confirming the *experience* matches what was specified, not independently inventing new acceptance criteria a lower test tier should have caught instead.

## 9. Regression Testing Strategy

The full automated suite (Unit through Integration, §4–6) re-runs on every CI execution (`BUILD_STRATEGY.md` §16, NG-011) — there is no separate, periodically-run "regression suite" distinct from the suite that gates every merge, because a suite that only sometimes runs is exactly the mechanism that lets a regression slip through between runs. E2E tests (§7) run at merge-time and before each gated environment promotion (`ENVIRONMENT_STRATEGY.md` §7), not on every commit, given their cost.

## 10. Smoke Testing Strategy

The automated post-deployment check already defined in `DEPLOYMENT_STRATEGY.md` §20 (NG-011) — Shell bootstrap succeeds, a basic RLS-backed read succeeds — is this platform's smoke test, restated here as this document's own testing-architecture term for the same mechanism, not a second, separately-designed check.

## 11. Sanity Testing Strategy

A narrow, fast-running subset of the Integration suite (§6) — the specific RLS/RBAC boundaries most central to a given change — run immediately after a Hotfix deployment (`RELEASE_STRATEGY.md` §15) before the full regression suite completes, to catch an obviously-wrong fix within seconds rather than waiting for the complete pipeline. Distinct from Smoke Testing (§10, confirms the app runs at all) by confirming a *specific* fix behaves correctly, not that the platform is generally alive.

## 12. API Testing Strategy

Every Repository method (`REPOSITORY_ARCHITECTURE.md`, NG-007) has a corresponding Integration-tier test (§6) proving its contract: correct data shape on success, correct error classification (`ERROR_CLASSIFICATION.md`, NG-010) on every failure mode named in `RPC_STRATEGY.md` §23's retry table. No repository ships without at least one success-path and one RLS-denial-path test — this is the API-layer-specific instance of §6's central claim, not a separate requirement invented here.

## 13. UI Testing Strategy

Component-tier tests (§5) cover individual component behavior; a smaller set of UI-focused E2E tests (§7) cover that a Feature's screens compose correctly end-to-end for its critical path only (matching A-004's own screen inventory for the flow in question) — UI Testing is not a separate tier in the pyramid (§3), it is the name for the combination of §5 and the UI-relevant slice of §7, stated together here since the prompt's own Define list names it as a distinct concern worth an explicit answer.
