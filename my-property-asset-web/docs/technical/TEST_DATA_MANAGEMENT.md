# Test Data Management — MyPropertyAsset Web Platform

**Companion to:** [`NG-012_Quality_Engineering_Testing_Architecture.md`](NG-012_Quality_Engineering_Testing_Architecture.md)
**Covers:** White-label Validation Strategy, Multi-Organization Validation, Test Data Management, Test Environment Strategy.

## 19. White-label Validation Strategy

Elaborates `QUALITY_GATES.md` §36's Production Readiness Checklist item ("white-label configuration tested for at least one non-default Organization") into a concrete, repeatable check: automated Component/E2E tests (§5, §7 in `TESTING_STRATEGY.md`) run against **at least two** synthetic Organizations with deliberately different branding (`theme-runtime`, NG-009 §9) — never just one non-default Organization, since a single alternate Organization can't distinguish "branding is genuinely data-driven" from "branding is hard-coded to this one specific test Organization by coincidence." Any component rendering a hard-coded color, logo, or copy string where an Organization-scoped token should appear is a defect this check exists specifically to catch.

## 20. Multi-Organization Validation

The Integration-tier RLS negative-test suite (§6 in `TESTING_STRATEGY.md`) is run with **at least two synthetic Organizations present simultaneously in the test dataset** — proving not just that a denied request is denied, but that a request scoped to Organization A never returns, leaks into, or is influenced by Organization B's data, the concrete verification of `TECHNICAL_STANDARDS.md` §18's Multi-Tenant Principle ("no shared service, cache, or store ever holds more than one Organization's data at a time"). This is this platform's single highest-value test category, given how much of this entire documentation series' absolute-rule weight sits on Organization isolation holding in practice, not just in principle.

## 21. Test Data Management

- **Synthetic, seeded data only — never a copy of production data**, in any environment tier (`TECHNICAL_STANDARDS.md` §22's "Organization-isolation testing never risks real tenant data," restated as a hard rule for test data specifically, not just environment provisioning generally).
- Every environment tier below Production (`ENVIRONMENT_STRATEGY.md` §7, NG-011) maintains its own seeded dataset, including **at least two synthetic Organizations** (§20) and, where a feature is gated behind `infra-feature-flags` (the Builder Projects backend dependency, still undesigned), synthetic data for whichever backend surface a feature flag currently exposes.
- **No test dataset, anywhere, in any environment, contains Restricted-Financial content or a synthetic Property/Loan/Expense record** — because no code path in this workspace touches that domain (NG-003, NG-007, NG-008, NG-010's four prior restatements), there is nothing for test data to represent for it; this document confirms the absence rather than leaving it unaddressed, the fifth layer of the same running rule.
- Test data is refreshed/reset between test runs where a test's correctness depends on a known starting state (most Integration-tier tests) — never accumulated indefinitely in a way that could let one test's leftover data mask another test's isolation defect.

## 22. Test Environment Strategy

| Test tier | Runs against | Reference |
|---|---|---|
| Unit, Component (§4–5, `TESTING_STRATEGY.md`) | No deployed environment — in-memory, CI-executor only | `BUILD_STRATEGY.md` §16 |
| Integration/RLS (§6) | QA tier's real Supabase project | `ENVIRONMENT_STRATEGY.md` §9 |
| E2E (§7) | QA or Staging tier | `ENVIRONMENT_STRATEGY.md` §9, §11 |
| UAT sign-off (§8) | UAT tier | `ENVIRONMENT_STRATEGY.md` §10 |
| Performance validation (`QUALITY_METRICS.md` §15) | Staging tier | `ENVIRONMENT_STRATEGY.md` §11 |
| Smoke/Sanity (§10–11) | Whichever tier just received a deployment | `DEPLOYMENT_STRATEGY.md` §20 |

No test of any kind runs against the Production environment tier — this document adds no exception to `TESTING_STRATEGY.md` §7's rule, restated here specifically because Test Environment Strategy is exactly the section a reader might otherwise expect one.
