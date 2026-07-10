---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | NG-002 |
| **Document Name** | Angular Workspace & Project Architecture |
| **Project** | MyPropertyAsset Web Platform |
| **Version** | 1.0 |
| **Status** | Draft |
| **Prepared By** | Enterprise Architecture Team |
| **Target AI** | Claude AI (Opus / Sonnet) |
| **Created Date** | 2026-07-09 |
| **Last Updated** | 2026-07-09 |
| **Dependencies** | NG-000, NG-001, A-001 through A-009 |
| **Referenced Documents** | All prior A-series and NG-series documents; `ARCHITECTURE_INDEX.md`; `docs/adr/ADR_INDEX.md` |
| **Previous Document** | NG-001 Angular Enterprise Architecture |
| **Next Document** | NG-003 Library & Package Architecture *(renumbered — see Pre-Check Result)* |
| **Related ADR** | ADR-001 (Angular Standalone Components) redirected here from NG-002 per NG-001's own note; ADR-010 (Workspace Tooling: Nx) — decided by this document, see §7 |
| **Revision History** | v1.0 — 2026-07-09 — Initial draft |
| **Approval Status** | Pending approval |

**Companion documents:** [`WORKSPACE_GUIDE.md`](WORKSPACE_GUIDE.md), [`PROJECT_ORGANIZATION.md`](PROJECT_ORGANIZATION.md), [`LIBRARY_STRATEGY.md`](LIBRARY_STRATEGY.md), [`DEPENDENCY_GUIDE.md`](DEPENDENCY_GUIDE.md), [`diagrams/NG-002_Workspace_Diagrams.md`](diagrams/NG-002_Workspace_Diagrams.md).

---

# NG-002 — Angular Workspace & Project Architecture

## Pre-Check Result

NG-000 (takes precedence) and NG-001 (defines the architecture this document organizes) were read in full and are not contradicted below — this document elaborates NG-001's six shared libraries into a technical-domain taxonomy (`LIBRARY_STRATEGY.md`) and resolves NG-001 `DEPENDENCY_RULES.md`'s deferred "concrete tooling decision" (`DEPENDENCY_GUIDE.md`), but does not revisit the three-application boundary (ADR-009) or the five-layer model. A-001 through A-005, A-007, A-008, A-009 were read; A-006 remains absent. `MASTER_CONTEXT.md`/`PROJECT_FACTS.md` remain absent.

**Two items noted, not blocking:**

1. **This prompt's own "governing reference for" list renumbers the NG series** relative to what NG-000 and NG-001 both anticipated — two new documents (NG-003 Library & Package Architecture, NG-004 Folder Structure) are inserted ahead of what NG-000/NG-001 called "NG-003 Routing Strategy," pushing Routing, State Management, Authentication, API Strategy, Error Handling, and Performance each back by one slot (to NG-005 through NG-010). This is a reasonable refinement, not a conflict — folder structure genuinely warrants its own document at this level of detail — and is reflected in `ARCHITECTURE_INDEX.md`'s updated sequence (§16) rather than left as a silent discrepancy.
2. **Internationalization** (item 16) has no backing in any prior document, exactly like NG-001's "Partner Portal" — reserved as a placeholder library boundary (`LIBRARY_STRATEGY.md` §16), not designed as a feature.

---

## 1. Executive Summary

NG-002 organizes NG-001's architecture into a concrete workspace: one Nx-managed monorepo, three application projects, feature libraries organized by business domain (A-007), and platform libraries organized by technical domain (Core / Shared / Utility / Theme — a refinement of NG-001's flat six-library "Shared Platform"). It resolves the one open item NG-001 explicitly deferred here: how dependency rules become mechanically enforced, not just documented. No folder name, file name, route, component, or service appears anywhere in this document.

## 2. Workspace Vision

A workspace where the boundaries this whole series has argued for — application isolation, feature isolation, Organization isolation — are enforceable by tooling on every commit, not maintained by developer discipline alone. This is the same trajectory the business-architecture series followed with RLS (a policy is only real once something enforces it): NG-001 stated the dependency rules, this document makes them mechanically real.

## 3. Workspace Principles

See [`WORKSPACE_GUIDE.md`](WORKSPACE_GUIDE.md) §1–2 in full.

## 4. Project Organization

See [`PROJECT_ORGANIZATION.md`](PROJECT_ORGANIZATION.md) in full — the three-axis model (Application / Business Domain / Technical Domain) is this document's central organizing idea.

## 5. Domain Organization

Business domain separation (feature libraries named and bounded by A-007's Information Domains) and technical domain separation (Core/Shared/Utility/Theme) are deliberately orthogonal — see `PROJECT_ORGANIZATION.md` §7–8. A feature library's *name* tells you which business capability it serves; its *tag* tells you what it's allowed to depend on. Neither axis substitutes for the other.

## 6. Shared Platform Strategy

See [`LIBRARY_STRATEGY.md`](LIBRARY_STRATEGY.md) §6 — NG-001's six shared libraries organized into Core, Shared, Utility, and Theme, with Utility and Theme as new categories this document introduces (reserved boundaries, not new designed features).

## 7. Library Strategy

See `LIBRARY_STRATEGY.md` in full. **This document decides the workspace tooling question NG-001 left open: Nx**, chosen specifically because Nx's project-tagging and dependency-constraint system is the most direct mechanical implementation of NG-001 `DEPENDENCY_RULES.md`'s six hard rules, and because a declarative, machine-readable project graph is exactly what makes NG-000 `AI_DEVELOPMENT_GUIDE.md`'s promise — that Cursor AI generates code only within approved architectural boundaries — actually checkable rather than aspirational. Recorded as **ADR-010**.

## 8. Dependency Rules

See [`DEPENDENCY_GUIDE.md`](DEPENDENCY_GUIDE.md) in full — the tag matrix that makes NG-001's six rules enforceable, with an explicit rule-by-rule mapping showing nothing new was invented, only made checkable.

## 9. Build Organization

Each application builds independently (NG-001's three-app boundary means three separate build outputs, not one bundle with lazy chunks pretending to be separate apps). Shared/Core/Utility/Theme libraries build as intermediate artifacts consumed by application builds, never shipped standalone. Build-time type-checking and lint (NG-000 `TECHNICAL_STANDARDS.md` §23) apply per-project, so a Utility library's type error fails fast without needing a full application build to surface it.

## 10. Documentation Organization

Every project (application, feature, or platform library) documents its own purpose and its position in the three-axis model (`PROJECT_ORGANIZATION.md`) in a project-level README — extending NG-000 `CODING_STANDARDS.md` §10's "every module maps back to an Information Domain or Working Module" rule from a per-service granularity down to a per-project one.

## 11. Workspace Governance

The tag matrix (`DEPENDENCY_GUIDE.md`) is itself a governed artifact — changing what a tag is allowed to depend on is an architectural decision requiring an ADR (NG-000 `REPOSITORY_STANDARDS.md` §32), not a configuration tweak made in passing during a feature PR.

## 12. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Nx adds tooling complexity beyond a bare Angular CLI workspace | Steeper onboarding for anyone unfamiliar with Nx | Justified by the AI-collaboration and enforcement benefits (§7) — accepted trade-off, recorded in ADR-010 |
| The Core/Shared/Utility/Theme taxonomy is new (not in NG-001) and could be read as silently redesigning NG-001's shared-platform model | Confusion about what's authoritative | `LIBRARY_STRATEGY.md` §6 states explicitly this is an elaboration (categorizing NG-001's six libraries), not a replacement — all six original names are preserved unchanged |
| Builder Portal feature libraries (Project & Unit Preparation) still depend on the undesigned Builder Projects backend domain — 9th consecutive document | The workspace boundary for this feature is real and buildable; its content is not | Same feature-toggle mitigation as NG-001, now expressed as: the `type:feature, scope:builder-portal` project for Project & Unit Prep can exist and pass CI with toggled-off content today |
| Internationalization's reserved boundary could be mistaken for a commitment | A future document assumes i18n was scoped | Flagged explicitly, twice (Pre-Check Result and `LIBRARY_STRATEGY.md` §16) |

## 13. Assumptions

- Nx (or an equivalent tool providing the same tagging/enforcement capability) is acceptable to whoever ultimately implements this workspace — a genuine technology assumption, not verified against any team preference this series has access to.
- The renumbered NG sequence (§ Pre-Check Result item 1) reflects the user's actual intent, not a typo in the prompt — treated as intentional since it's internally consistent within this prompt's own document.

## 14. Constraints

No folder names, file names, routing, components, services, or implementation appear anywhere in this document or its companions (explicit Quality Rule). The tag matrix (`DEPENDENCY_GUIDE.md`) specifies categories and rules, not literal `nx.json`/`project.json` configuration — that belongs to actual implementation, not this document.

## 15. Future Expansion

New products (Tenant Platform, Service Marketplace, Partner Portal) are added as new `type:app` projects, reusing every existing Core/Shared/Utility/Theme library without modification (`diagrams/NG-002_Workspace_Diagrams.md` §7) — the concrete, tooling-level cash-out of NG-001 §14's scalability claim.

## 16. Updated ARCHITECTURE_INDEX.md

See `../../ARCHITECTURE_INDEX.md` — updated with the NG-002 entry and the corrected NG-series numbering (NG-003 Library & Package Architecture, NG-004 Folder Structure, NG-005 Routing, NG-006 State Management, NG-007 Authentication, NG-008 API Strategy, NG-009 Error Handling, NG-010 Performance).

## 17. Updated ADR List

**Required and completed.** ADR-010 (Workspace Tooling: Nx) is Accepted, decided by this document (§7). ADR-001 (Standalone Components) remains **not drafted** here despite this document's proximity to project setup — NG-001 redirected it specifically to NG-002, but this document's own scope explicitly excludes "components," so it is redirected once more, to **NG-004 (Folder Structure)**, the next document actually concerned with how individual projects are internally organized enough to force that choice. This redirection is itself logged in `docs/adr/ADR_INDEX.md`.

## 18. Review Checklist

- [ ] Nx as workspace tooling (ADR-010) accepted, or redirected to a plain Angular CLI workspace alternative
- [ ] Core/Shared/Utility/Theme taxonomy (`LIBRARY_STRATEGY.md`) confirmed as elaboration, not silent redesign, of NG-001's shared-platform model
- [ ] Renumbered NG sequence (§ Pre-Check Result) confirmed as intentional
- [ ] Internationalization's reserved-only status understood, not mistaken for a scoped feature

## 19. Approval Checklist

- [ ] Reviewed by Enterprise/Technical Architect
- [ ] Reviewed by Angular Architect
- [ ] Reviewed by DevOps Architect
- [ ] Status updated from Draft to Approved in `ARCHITECTURE_INDEX.md`
- [ ] NG-003 (Library & Package Architecture) authorized to begin
