# Test Automation Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-012_Quality_Engineering_Testing_Architecture.md`](NG-012_Quality_Engineering_Testing_Architecture.md)
**Covers:** Test Automation Principles, Static Analysis Strategy, Linting Standards, AI-Generated Code Validation.

## 23. Test Automation Principles

- **Every test in every tier (`TESTING_STRATEGY.md` §3's pyramid) runs in CI, automatically, on every applicable trigger** (`BUILD_STRATEGY.md` §16, NG-011) — no test tier depends on a human remembering to run it locally first. A test that only runs manually is not yet part of this platform's quality architecture, regardless of how well-written it is.
- **A failing test blocks the pipeline stage it belongs to** (`QUALITY_GATES.md` §35, restated) — never downgraded to a warning, never skipped with an inline suppression, consistent with `CODING_STANDARDS.md` §9's "a failing lint is a failing build" principle extended to every automated check this document defines.
- Test automation is Nx-affected-aware (`BUILD_STRATEGY.md` §16's per-application CI, restated for tests specifically) — a Public Website-only change runs Public Website's tests, not the full platform suite, keeping CI feedback time proportional to what actually changed.

## 24. Static Analysis Strategy

Beyond linting (§25) and type-checking (`QUALITY_GATES.md` §35, unchanged): dependency/vulnerability scanning runs on every CI execution (the concrete mechanism behind `QUALITY_METRICS.md` §16's Security Testing Strategy), and — **new in this document** — a structural check confirming no `property`, `loan`, or `expense` path exists anywhere under `libs/` (`SOURCE_TREE.md` §3, NG-008's own prediction that this would become "a literal grep" once code exists). This is the concrete implementation of `TESTING_STRATEGY.md` §1's claim that the Restricted-Financial exclusion is verifiable, not merely asserted — static analysis is where that verification actually runs, on every single CI execution, not just at architecture-review time.

## 25. Linting Standards

ESLint + Prettier, enforced in CI, a failing lint is a failing build (`CODING_STANDARDS.md` §9, unchanged, restated as this document's own automation-layer confirmation of an already-decided rule). This document adds one addition: lint rules include the Nx tag-matrix dependency-constraint check (`DEPENDENCY_GUIDE.md` §22, NG-002) and the Import Rules boundary check (`IMPORT_RULES.md`, NG-008) as first-class lint failures, not a separate CI step — a project importing across a forbidden tag boundary fails in the same place, the same way, as a straightforward syntax lint violation.

## 28. AI-Generated Code Validation

**Elaborates `AI_DEVELOPMENT_GUIDE.md`'s already-stated rules (NG-000) into this document's testing-architecture terms — not a new policy, the concrete verification mechanism for an existing one.** Cursor AI-generated code is subject to every gate in this document identically to human-written code (`CODING_STANDARDS.md` §30, `AI_DEVELOPMENT_GUIDE.md` § Review Process, both restated) — no reduced coverage target (§26 in `QUALITY_METRICS.md`), no exemption from the Integration/RLS suite (§6 in `TESTING_STRATEGY.md`). This document's specific addition: **AI-generated code touching a permission boundary must include its corresponding negative test in the same change** (`AI_DEVELOPMENT_GUIDE.md`'s Code Generation Rules, restated as a CI-enforceable gate here rather than a written expectation alone) — a PR introducing a new RLS-sensitive Repository method without a paired negative test fails automatically, regardless of who or what authored the surrounding code, closing the gap between "this is expected" (NG-000) and "this is mechanically checked" (this document).
