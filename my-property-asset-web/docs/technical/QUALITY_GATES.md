# Quality Gates — MyPropertyAsset Web Platform

**Companion to:** [`NG-000_Web_Platform_Technical_Governance.md`](NG-000_Web_Platform_Technical_Governance.md)
**Covers:** Testing Standards, Quality Gates, Production Readiness Checklist.

## 24. Testing Standards

| Test type | Scope | Source of truth for what to test |
|---|---|---|
| Unit tests | Domain/business logic (validators, computed values) | A-003A's Acceptance Criteria — every Given/When/Then scenario is a candidate test case, traced directly, not reinvented |
| Integration tests | RLS/RBAC boundary enforcement | `PERMISSION_MATRIX.md` (A-008) — every "None" cell is a required negative test (proving access is actually denied, not just unrequested) |
| End-to-end tests | Critical cross-product flows | A-002's Business Flow (e.g., Builder Registration → Approval → Project/Unit → Invitation → Owner Acceptance) |

**The single most important testing requirement this document establishes**: for every one of `PERMISSION_MATRIX.md`'s "None" or "Delegated" cells, there must be an automated test proving the denial actually holds at the RLS layer — not merely that the UI doesn't offer the action. A permission matrix that exists only in documentation and application-layer conditionals is not enforcement; the test suite is what makes it real.

## 35. Quality Gates

A change cannot merge unless, in order:

1. Lint passes (zero errors, warnings reviewed).
2. Type-check passes (strict mode, zero `any` without justification).
3. Unit test suite passes, coverage threshold met for domain/business logic specifically (not a blanket percentage across all code — UI-only code is not held to the same bar as validators/business rules).
4. RLS/RBAC integration tests pass — including the negative-test requirement above.
5. No critical or high-severity security finding is open.
6. Any new architectural pattern has a corresponding ADR (§32 of the main document) — a quality gate failure, not just a documentation nicety.
7. Code review approved by at least one reviewer who is not the change's author (including for AI-generated changes — `CODING_STANDARDS.md` §30).

## 36. Production Readiness Checklist

- [ ] Organization isolation verified in a production-like environment, not just unit-tested in isolation.
- [ ] Restricted-Financial access-path tested end-to-end to confirm zero leakage to any non-owning role, including Super Admin with an active Support Access grant.
- [ ] Support Access audit trail verified functional — an invocation is genuinely recoverable after the fact, not just theoretically logged.
- [ ] White-label configuration tested for at least one non-default Organization, not only the platform's own reference branding.
- [ ] Monitoring and alerting live for both business-level (A-007 ID-06) and technical/APM-level signals.
- [ ] Every quality gate above has passed for the release candidate, with no manually-overridden failures.
- [ ] The specific feature being released has a traceable origin in an **approved** (not merely Draft) business-architecture document — per A-009's own finding that no document is yet formally approved, **this checklist item cannot be satisfied for any feature today**, and is the concrete mechanism by which this document enforces A-009's split verdict rather than merely restating it.
