# Coding Standards — MyPropertyAsset Web Platform

**Companion to:** [`NG-000_Web_Platform_Technical_Governance.md`](NG-000_Web_Platform_Technical_Governance.md)
**Covers:** Naming Standards, Coding Standards, Documentation Standards (code-level), Code Review Standards.

## 5. Naming Standards

| Element | Convention | Example |
|---|---|---|
| Files | kebab-case | `builder-detail.component.ts` |
| Classes / Components / Services | PascalCase | `BuilderDetailComponent` |
| Variables / Functions | camelCase | `getBuilderStatus()` |
| Constants | UPPER_SNAKE_CASE | `MAX_INVITATION_EXPIRY_DAYS` |
| Angular file suffixes | `.component.ts`, `.service.ts`, `.guard.ts`, `.resolver.ts`, `.model.ts` | Standard Angular convention |

**This document formally adopts kebab-case as the platform's naming convention going forward**, for both code and future technical documentation. This does not retroactively rename the A-series' own historical inconsistency (hyphenated vs. underscore filenames, logged in `ARCHITECTURE_INDEX.md` §3) — that remains a business-documentation-only artifact, unrelated to code, and is not touched by this decision.

## 9. Coding Standards

- TypeScript strict mode is mandatory, platform-wide, no exceptions per-module.
- ESLint + Prettier enforced in CI — a failing lint is a failing build, not a warning.
- Angular style guide compliance (official Angular team guidance) as the default; any deviation requires an ADR.
- `any` is never used without an inline justification comment explaining why a precise type isn't available.
- Standalone components are the *provisional* default (pending NG-001's formal decision, tracked as ADR-001) — this document sets the expectation that *some* explicit, documented choice will be made, not which one.

## 10. Documentation Standards (code-level)

- Every service and non-trivial function carries a doc comment explaining *why*, not *what* (mirroring this whole documentation series' own established style — comments exist for non-obvious intent, not to restate the code).
- Every module maps back to an Information Domain (A-007) or a Working Module (A-007 §2.1, provisional) in its own README, so a future reader can trace code to business architecture without archaeology.
- Every deviation from an established pattern gets an ADR (§32 in the main document) — not a code comment alone.

## 30. Code Review Standards

- Every change merges via pull request; no direct commits to the protected main branch.
- A review checklist (traceable to `QUALITY_GATES.md`) is applied uniformly.
- **AI-generated code (from Cursor AI or any future tool) receives the same review rigor as human-written code — no exception, no fast lane.** This is stated explicitly because it is the one rule most likely to erode under delivery pressure; this document exists partly to make eroding it a visible governance violation, not a quiet judgment call.
- A reviewer verifies not just correctness but **traceability**: does this change correspond to an approved business-architecture item (A-001–A-009) or an approved technical decision (this document, or a future NG-00X)? Code with no traceable origin is a governance flag, not just a style nitpick.
