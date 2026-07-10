---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | NG-000 |
| **Document Name** | Web Platform Technical Governance |
| **Project** | MyPropertyAsset Web Platform |
| **Version** | 1.0 |
| **Status** | Draft |
| **Prepared By** | Enterprise Architecture Team (Enterprise Solution Architect / Enterprise Technical Architect / Angular Architect / Security Architect / DevOps Architect / SaaS Platform Architect) |
| **Target AI** | Claude AI (Opus / Sonnet) |
| **Created Date** | 2026-07-09 |
| **Last Updated** | 2026-07-09 |
| **Dependencies** | A-001 through A-009 |
| **Referenced Documents** | Every document in `docs/architecture/`; `ARCHITECTURE_INDEX.md`; `docs/adr/ADR_INDEX.md` |
| **Previous Document** | A-009 Business Architecture Review & Gap Analysis |
| **Next Document** | NG-001 Angular Enterprise Architecture |
| **Related ADR** | ADR-006 (Branching Strategy), ADR-007 (Versioning Strategy) — both decided by this document, see §13 |
| **Revision History** | v1.0 — 2026-07-09 — Initial draft |
| **Approval Status** | Pending approval |

**Companion documents:** [`TECHNICAL_STANDARDS.md`](TECHNICAL_STANDARDS.md), [`CODING_STANDARDS.md`](CODING_STANDARDS.md), [`AI_DEVELOPMENT_GUIDE.md`](AI_DEVELOPMENT_GUIDE.md), [`QUALITY_GATES.md`](QUALITY_GATES.md), [`REPOSITORY_STANDARDS.md`](REPOSITORY_STANDARDS.md), [`diagrams/NG-000_Technical_Governance_Diagrams.md`](diagrams/NG-000_Technical_Governance_Diagrams.md).

**Repository note:** this is the first document in the series stored under `docs/technical/` rather than `docs/architecture/` — the split between business architecture (A-series) and technical architecture (NG-series and beyond) is now structural, not just numbering.

---

# NG-000 — Web Platform Technical Governance

## Pre-Check Result

A-001 through A-005, A-007, A-008, and A-009 were read in full (A-006 still does not exist, per every prior finding since A-007). `MASTER_CONTEXT.md` and `PROJECT_FACTS.md` remain confirmed absent, per A-009's own verification. **One real conflict was found and is reported here rather than silently resolved**: this prompt's Mandatory Pre-Check requires verifying "Business Architecture has been approved" — but A-009, completed immediately prior to this document, found that **zero of the eight existing business-architecture documents have completed their Approval Checklist**, and A-009's own verdict was explicitly split (🟡 for Public Website/Super Admin, 🔴 for the Builder Portal core), not a blanket approval. This document proceeds anyway, for a specific reason: NG-000 governs *engineering practice* (coding standards, branching, security principles, AI collaboration rules) — none of which depends on whether the Builder Projects backend domain exists or whether a human has yet clicked "approved" on a Draft document. Every principle in this document is written to be true regardless of which business features are eventually built. Where a rule in this document depends on approval status specifically (e.g., `QUALITY_GATES.md`'s Production Readiness Checklist), that dependency is stated explicitly, not assumed away.

---

## 1. Executive Summary

NG-000 establishes the technical constitution for the MyPropertyAsset Web Platform — the mandatory standards every future technical document, and every line of implementation, must follow. It covers thirty-six governance areas across architecture, coding, security, testing, release, and AI-tool collaboration, delivered as this main document plus five companions. It makes explicit what this entire documentation series has already been practicing (traceability, gap-flagging over silent assumption, human approval as a non-negotiable gate) and turns those practices into binding rules rather than emergent habits.

## 2. Technical Vision

Build the Web Platform the same way its architecture has been documented: additively, traceably, and honestly about what isn't finished yet. No technical shortcut should be able to quietly undo what nine business-architecture documents worth of careful boundary-drawing (Organization isolation, Restricted-Financial's absolute protection, Builder Portal's non-ERP scope) established — this document exists to make that structurally true in code, not just true on paper.

## 3. Technical Governance Principles

The 36 required topics are organized across this document and its five companions:

| Topic group | Location |
|---|---|
| Architecture, Design, Layering, Dependency, Error Handling, Logging, Monitoring, Security, Auth(entication/orization), White-label, Multi-Tenant, Performance, Scalability, Configuration, Environment, Build (items 1–4, 11–23) | [`TECHNICAL_STANDARDS.md`](TECHNICAL_STANDARDS.md) |
| Naming, Coding, code-level Documentation, Code Review (items 5, 9, 10, 30) | [`CODING_STANDARDS.md`](CODING_STANDARDS.md) |
| Versioning, Source Control, Branching, Release, Backward Compatibility, Deprecation, Feature Toggles, Technical Debt, Architectural Decision Process, Repository Standards, Documentation Governance (items 6–8, 25–28, 31–34) | [`REPOSITORY_STANDARDS.md`](REPOSITORY_STANDARDS.md) |
| Testing Standards, Quality Gates, Production Readiness Checklist (items 24, 35, 36) | [`QUALITY_GATES.md`](QUALITY_GATES.md) |
| AI Development Governance (item 29 + full section) | [`AI_DEVELOPMENT_GUIDE.md`](AI_DEVELOPMENT_GUIDE.md) |

## 4. Development Standards

See `TECHNICAL_STANDARDS.md` §1–4 (architecture/design/layering/dependency). The single rule worth restating here because every future NG document depends on it: **every business-architecture boundary is a technical constraint, enforced server-side first.** Angular route guards are UX, not security.

## 5. Coding Standards

See `CODING_STANDARDS.md` in full. Headline decision: kebab-case adopted platform-wide for code and future technical documentation (§5 of that document) — a genuinely new, binding decision this document makes, not inherited from the A-series.

## 6. Repository Standards

See `REPOSITORY_STANDARDS.md` in full. Headline decisions: trunk-based development with short-lived feature branches (ADR-006, §13 below), Semantic Versioning for releases (ADR-007, §13 below), a single dedicated Angular workspace repository kept separate from the existing Flutter repo.

## 7. AI Collaboration Standards

See `AI_DEVELOPMENT_GUIDE.md` in full. Headline rule, worth stating in the main document because it is this document's most self-aware finding: **per this guide's own Approval Process, Cursor AI cannot yet implement anything from A-001–A-009, because none of them are approved.** This is not a new restriction invented here — it is what "Draft" has meant this entire series — but NG-000 is the first document to state the implementation-side consequence explicitly.

## 8. Security Standards

See `TECHNICAL_STANDARDS.md` §14–16 (Security, Authentication, Authorization Principles). Headline rule: `PERMISSION_MATRIX.md` (A-008) is the single source of truth for authorization; RLS enforces it; the Angular app reflects it, never invents a parallel version of it.

## 9. Performance Standards

See `TECHNICAL_STANDARDS.md` §19–20 (Performance, Scalability Principles).

## 10. Documentation Standards

See `CODING_STANDARDS.md` §10 and `REPOSITORY_STANDARDS.md` §34. The A-series/NG-series system itself **is** the documentation standard, formalized rather than reinvented.

## 11. Release Standards

See `REPOSITORY_STANDARDS.md` §25–28. Headline mechanism: **feature toggles are how this document operationalizes A-009's split verdict** — Builder Portal work can proceed behind a toggle without either blocking on, or prematurely shipping ahead of, the Builder Projects backend domain.

## 12. Review Process

See `CODING_STANDARDS.md` §30 and `QUALITY_GATES.md` §35. AI-generated code receives identical review rigor to human-written code — stated as a standing rule specifically because it is the rule most likely to erode under delivery pressure.

## 13. Architecture Governance

Technical decisions are recorded as ADRs, using the process the A-series already established (`REPOSITORY_STANDARDS.md` §32). **This document mints two real ADRs**, both Accepted, both decided directly by NG-000 rather than deferred:

| ADR ID | Title | Status | Decided By |
|---|---|---|---|
| ADR-006 | Branching Strategy: Trunk-Based Development | **Accepted** | NG-000, 2026-07-09 |
| ADR-007 | Versioning Strategy: Semantic Versioning for releases | **Accepted** | NG-000, 2026-07-09 |

The five ADR slots anticipated since A-001 (Angular Standalone Components, Supabase Authentication, White-label Architecture, Angular Signals, PrimeNG Design System) remain **not drafted** — they belong to NG-001 and later documents, not this one, and this document does not pre-empt them.

## 14. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| This document establishes governance while zero prior documents are approved | A literal reading could freeze all forward progress | Resolved explicitly (§ Pre-Check Result): governance itself doesn't require approved features to exist; only *implementation from* a specific document does |
| The Builder Projects backend domain gap (7-for-7 through A-008, now A-009) is inherited again here as the reason feature toggles are needed at all | If the domain is never commissioned, toggled-off code accumulates indefinitely rather than resolving | `REPOSITORY_STANDARDS.md` §28/§31 ties every toggle to an explicit resolution condition, not an open-ended flag |
| Kebab-case and trunk-based/SemVer decisions (new in this document) could conflict with a not-yet-written NG-001's own Angular-specific conventions | Minor rework if NG-001 needs a different pattern | These are process/repo-level decisions, not Angular-code-shape decisions — low collision risk, but flagged |

## 15. Assumptions

- A human will run the Approval Checklists this document (and every prior one) still has open — this document does not assume that has silently happened.
- Cursor AI (and any future implementation tool) will actually respect the "approved documents only" rule rather than being pointed at Draft content under time pressure — a process assumption, not a technical guarantee this document can enforce by itself.
- The existing Flutter Owner Mobile App's team is not blocked by, or required to adopt, any standard in this document — it governs the Web Platform only, per A-001 §8's original scoping.

## 16. Constraints

No Angular code, folder structure, components, services, APIs, SQL, UI design, or database schema appears anywhere in this document or its companions (explicit Quality Rule, respected throughout). Every principle here is deliberately implementation-agnostic enough to survive NG-001's actual technical decisions without needing revision.

## 17. Future Evolution

This document is the parent every NG-00X document (Angular Architecture, Workspace, Routing, State Management, Shared Libraries, Auth, API Strategy, Error Handling, Performance) inherits from. Each of those will narrow one of this document's principles into an actual technical design, the same way A-002 through A-009 each narrowed something A-001 first raised. Expect this document to gain, not lose, cross-references as that happens — it should never need to be rewritten to accommodate them, only extended.

## 18. Updated ARCHITECTURE_INDEX.md

See `../../ARCHITECTURE_INDEX.md` — updated with the NG-000 entry, the new `docs/technical/` structure, and ADR-006/ADR-007's promotion from anticipated to accepted.

## 19. Updated ADR List

**Required and completed** — see §13 above and `docs/adr/ADR_INDEX.md`, updated with ADR-006 and ADR-007 as the series' first two genuinely decided (not merely anticipated) ADRs.

## 20. Review Checklist

- [ ] The Pre-Check Result's handling of "Business Architecture has been approved" (proceeding despite A-009's split, not-yet-approved verdict) accepted as correct, or redirected
- [ ] ADR-006 (trunk-based) and ADR-007 (SemVer) reviewed and confirmed as the right calls, or revised
- [ ] Feature-toggle-as-operationalization-of-A-009 (§11) confirmed as the intended mechanism for proceeding on Builder Portal work
- [ ] AI Development Guide's "nothing is implementable yet" finding (§7) acknowledged as a real, current constraint, not a hypothetical

## 21. Approval Checklist

- [ ] Reviewed by Enterprise/Technical Architect
- [ ] Reviewed by Security Architect
- [ ] Reviewed by DevOps Architect
- [ ] Status updated from Draft to Approved in `ARCHITECTURE_INDEX.md`
- [ ] NG-001 (Angular Enterprise Architecture) authorized to begin, scoped per A-009 §14's split verdict
