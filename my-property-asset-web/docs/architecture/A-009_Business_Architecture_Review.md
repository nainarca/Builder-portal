---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | A-009 |
| **Document Name** | Business Architecture Review & Gap Analysis |
| **Project** | MyPropertyAsset Web Platform |
| **Version** | 1.0 |
| **Status** | Draft (audit findings — not itself subject to the same "approve as designed" workflow as A-001–A-008) |
| **Prepared By** | Independent Enterprise Architecture Review Board |
| **Target AI** | Claude AI (Opus / Sonnet) |
| **Created Date** | 2026-07-09 |
| **Updated Date** | 2026-07-09 |
| **Dependencies** | A-001 through A-008 (A-006 excepted — does not exist, itself a finding) |
| **Referenced Documents** | Every document in `docs/architecture/`, `ARCHITECTURE_INDEX.md`, `docs/adr/ADR_INDEX.md` |
| **Previous Document** | A-008 Permission Matrix (RBAC) |
| **Next Document** | NG-001 Angular Enterprise Architecture (conditional on this review's findings — see §14) |
| **Related ADR** | None — this document produces no new ADR |
| **Revision History** | v1.0 — 2026-07-09 — Initial audit |
| **Approval Status** | N/A — this document is itself the approval-gating artifact for the series |

---

# A-009 — Business Architecture Review & Gap Analysis

## Pre-Check / Scope Note

Per instruction, this document reviews only — it does not redesign, rewrite, or introduce new requirements. Two files this prompt's Read First list names, `MASTER_CONTEXT.md` and `PROJECT_FACTS.md`, were checked and **do not exist anywhere in this repository** — confirmed by direct file search. This is treated as a finding of the audit (§5), not a blocker to conducting it: every substantive document this audit needs to review (A-001 through A-005, A-007, A-008) exists and was read in full; only A-006 is absent among the documents actually required to produce prior content, and its absence has already been tracked, worked around, and escalated across four consecutive prior documents.

---

## 1. Executive Summary

Seven of eight expected business-architecture documents exist (A-001–A-005, A-007, A-008); A-006 was never written. The seven that exist are internally consistent, cross-reference each other correctly, and — notably — actively resolved several of their own open questions as the series progressed rather than leaving them to accumulate silently (Organization/Builder terminology, Super Admin's data-visibility boundary, Builder Organization Member's permission scope). Set against that: one backend dependency (the Supabase "Builder Projects" domain) has been an unresolved blocking dependency in **every single document since A-002** — seven consecutive documents — without ever being addressed, because the one document positioned to address it (A-006) doesn't exist. Two screens and one information sub-domain remain genuinely unspecified. Zero of the eight documents have completed their own Approval Checklist. **This board's verdict is a split one** (§14): the platform is ready to begin scoped technical architecture work in areas that don't depend on the Builder Projects domain, and not ready in the one area — the Builder Handover Portal's core operational screens — that is this platform's actual differentiating purpose.

## 2. Architecture Review

| Review Area | Source Document(s) | Assessment |
|---|---|---|
| Business Vision | A-001 | Sound. Clear vision, scope, and explicit non-goals (Builder Portal ≠ ERP). No revision needed. |
| Business Flow | A-002 | Sound and complete for all four products at the process level. Correctly sequences Expense→Loan→Ledger-equivalent dependency ordering (here: Public Website → Super Admin → Builder Portal → Owner App). |
| User Journey | A-003 | Sound. Four full journeys with genuine persona work, not generic placeholders. Future Tenant correctly left undesigned per instruction, not stubbed out with invented content. |
| User Stories | A-003A | Sound for 29 of 29 stories written. Correctly declines to duplicate Expense/Loan/Financial History IES business rules (EPIC-06) — the single best example of restraint in the whole series. |
| Acceptance Criteria | A-003A companion | Sound — every story has at least one Given/When/Then scenario; EPIC-06 deliberately thin, matching its "integration point only" scope. |
| Screen Flow | A-004 | Sound for 30 of 33 screens (three built without a backing story — §5). Screen ownership verified, no duplicates. |
| Navigation Flow | A-005 | Sound for 21 of 23 flows (two — Owners, Profile — reference screens that don't exist). Navigation vocabulary (§2 of that document) is a genuinely reusable asset, applied consistently in every document since. |
| Functional Modules | A-006 | **Does not exist.** A-007 and A-008 both operate on an explicitly-labeled provisional substitute (A-007 §2.1's "Working Module Reference") rather than silently pretending it isn't needed. |
| Information Architecture | A-007 | Sound structurally; correctly reuses A-004's screens and A-002's flows rather than inventing parallel structures. 15 domains cataloged, 1 (Audit) still underspecified. |
| RBAC | A-008 | The strongest single document in the series. Resolved two previously-open questions outright (Super Admin visibility via Support Access; Builder Member scope) rather than deferring again, and established one genuinely load-bearing hard rule (Restricted-Financial data has no delegation path, ever) that every downstream document must respect. |
| White-label | A-001 §13, A-002 §16, A-004 SA-06, A-008 ID-04 | Consistently and *deliberately* left at vision-level throughout — this is correct scoping, not a gap. No document claims more than "the seam exists," and none contradicts that. |
| Multi Organization | A-002 §16 (resolved), A-003A §16 (narrowed), A-007 ID-03, A-008 ROLE_CATALOG | The single best-tracked open question in the entire series — raised in A-001, narrowed in A-002, referenced consistently through A-008, still correctly marked open (the `organization_type` discriminator mechanism) rather than prematurely closed. |
| Builder Portal Scope | Every document | The "NOT Builder ERP" boundary (no CRM/Sales/HR/Payroll/Accounting/Inventory/Procurement/Society Management) is asserted and respected in all eight documents without exception — zero drift across the series. |
| Owner App Integration | A-004 §8, A-005 §7, A-008 SCREEN_PERMISSIONS | Correctly scoped as reference-only throughout; no document redesigns existing mobile screens, and the one absolute RBAC rule (§ above) directly protects this boundary from ever being violated by a future implementation. |
| Future Tenant Strategy | A-003 §9, A-003A §3.5, A-005 §19, A-007 ID-15, A-008 ROLE_CATALOG | Consistently deferred with a one-paragraph mention each time, never over-specified. Appropriate. |
| Scalability | A-007 §19, A-008 §15 | Named as a principle (Role Based Navigation already accommodates a fourth product without redesign) but not stress-tested against real volume — acceptable at this stage. |
| Maintainability | Cross-cutting | High — the series' own self-correcting behavior (resolving open questions as later documents become the right place to do so) is itself evidence of a maintainable process, not just a maintainable artifact. |
| Extensibility | A-007 §2.1, A-008 §7 | The provisional module reference and the Support Access mechanism are both explicitly designed to be superseded without breaking what depends on them — a genuine extensibility strength. |
| Consistency | §7 below | High, with the exceptions cataloged there. |
| Traceability | §4 below | Strong end-to-end for most business capability; broken specifically where a screen or module has no originating story (§5). |

## 3. Cross Document Validation

- **Terminology:** "Organization," "Builder," "Owner," "handover," "transfer not duplicate" are used identically across all eight documents. No drift found.
- **Screen IDs:** every navigation flow (A-005), information domain relationship (A-007), and permission row (A-008) that references a screen uses A-004's exact Screen ID — no renaming, no invented IDs, confirmed by cross-check against `SCREEN_INVENTORY.md`.
- **Resource/domain IDs:** A-008's `RESOURCE_MATRIX.md` reuses A-007's 15 domain IDs verbatim — zero duplication, confirmed the pre-check requirement this document itself inherited from A-008.
- **No conflicting decisions were found.** The series' pattern of *narrowing* open questions across documents (never reversing an earlier one) held throughout — A-002's Organization/Builder resolution was never contradicted by A-003A, A-004, A-005, A-007, or A-008.

## 4. Traceability Matrix

Business Goal → Business Flow → User Journey → User Story → Screen → Module → Information → Permission, illustrated by three representative threads:

| Thread | Goal (A-001) | Flow (A-002) | Journey (A-003) | Story (A-003A) | Screen (A-004) | Module (A-007 §2.1) | Information (A-007) | Permission (A-008) | Result |
|---|---|---|---|---|---|---|---|---|---|
| Builder Onboarding | ✅ | §7 | §6 | US-SA-01/02 | SA-03/04 | Builder Onboarding | ID-02 | ✅ | **Fully traceable, no gaps** |
| Project & Unit Management | ✅ | §8 | §7 | US-BA-02/03 | BA-03–06 | Project & Unit Prep *(provisional)* | ID-07 *(flagged)* | ✅ (built on flagged foundation) | **Traceable through documentation; rests on an undesigned backend domain and a provisional module reference** |
| Owners Directory | Implied only | Not named | Not named | **None** | **None** | — | ID-08 (unit-scoped only — not equivalent) | "No permission assignable" | **Broken chain — confirmed gap, not just a naming mismatch** |
| Audit Log | Implied only | Not named | Not named | **None** | SA-10 (built anyway) | Operations | ID-06 (Audit sub-domain, flagged) | Assigned (Super Admin Full, scope undefined) | **Broken chain at origin; downstream layers compensated rather than leaving a hole** |

**Finding:** the series' discipline of "build it if clearly needed, flag the gap explicitly" (established in A-004, applied consistently through A-008) means broken traceability chains are never silent — every one of them is documented at the point it occurs. That is a good process outcome; it does not make the underlying gaps (§5) any less real.

## 5. Gap Analysis

| Category | Finding |
|---|---|
| Missing Screens | Two: a cross-Organization "Owners Directory" and a personal "Profile" screen (A-005 NAV-BA-04, NAV-BA-10) — named in navigation scope, never specified in A-004, never given a story in A-003A |
| Missing Modules | One document: A-006 (Functional Module Architecture) in its entirety — not a missing module within a document, but the whole document |
| Missing User Stories | Three: backing stories for SA-08 (User Management), SA-10 (Audit Log), BA-13 (Settings/team management) — all three screens exist and now have permissions assigned (A-008), but no story defines their actual behavior |
| Missing Roles | None found — the role catalog (A-008) is complete relative to every actor named across A-001–A-007 |
| Missing Permissions | None found — every existing screen and information domain has an assigned permission level; only the two missing screens (above) have no permission because they have no screen to attach one to |
| Missing Information Domains | None structurally — but ID-06's Audit sub-domain and ID-15 (Future Tenant) are intentionally thin/placeholder |
| Missing Navigation | None beyond the two screen-less items already counted above |
| Missing Business Rules | None found in the areas covered; the `organization_type` discriminator mechanism (§2 Multi Organization) is a missing *decision*, not a missing rule — the rule that it must eventually resolve is already stated |
| Duplicate Content | None found — the series actively avoided this at every opportunity (EPIC-06's "reference don't restate," A-008's resource-catalog reuse) |
| Conflicting Decisions | None found (§3) |
| Future Risks | See §6 |

## 6. Risk Analysis

| Risk | Severity | First Appeared | Status |
|---|---|---|---|
| Builder Projects backend domain (Supabase) remains completely undesigned | **Critical** | A-002 | **Unresolved after 7 consecutive documents** — this board's top finding |
| A-006 does not exist | **High** | Discovered at A-007 | Worked around with an explicit provisional substitute in A-007/A-008; not resolved |
| Two screens (Owners, Profile) have no specification at all | Medium | A-005 | Unresolved; low complexity to close whenever prioritized |
| Three screens (SA-08, SA-10, BA-13) lack backing stories | Medium | A-004 | Partially mitigated (permissions assigned in A-008) but underlying behavior still undefined |
| `organization_type` discriminator mechanism undecided | Medium | A-001 §14 | Correctly tracked, not resolved — appropriately deferred to a data-architecture document, not a gap in *this* series' own job |
| Support Access invocation mechanism (approval workflow, duration) undesigned | Low-Medium | A-008 | Explicitly named as NG-005's job, not this series' |
| Zero documents have completed their Approval Checklist | Medium (process risk, not content risk) | A-001 onward | Every document is still formally "Draft" — no human sign-off has occurred on any of the seven real documents |
| `MASTER_CONTEXT.md`/`PROJECT_FACTS.md` referenced by this very prompt do not exist | Low | This document | Newly discovered; unclear whether they were ever meant to exist or are a prompt-template artifact — recommend clarifying with whoever maintains the prompt series |

## 7. Consistency Review

Consistent throughout: terminology, screen/resource ID reuse, the Builder-Portal-is-not-ERP boundary, the Restricted-Financial-has-no-exception rule, Organization isolation as a structural (not UI) requirement, and the "reference don't duplicate" principle applied to both existing backend domains (Expense/Loan/Financial History) and within this series itself (A-008 reusing A-007's resource catalog). No inconsistency was found strong enough to warrant a correction — the series' one structural inconsistency (filename convention, hyphenated vs. underscore) is cosmetic and already logged in `ARCHITECTURE_INDEX.md` §3, not repeated here as a new finding.

## 8. Readiness Assessment

| Area | Readiness Score | Basis |
|---|---|---|
| NG-001 Angular Enterprise Architecture | **65/100** | Strong for Public Website, Super Admin (non-Builder-data screens), and general component/architecture patterns; blocked for Builder Portal's core screens pending A-006 + the backend domain |
| NG-002 Folder Structure | **55/100** | Typically organized around functional modules — A-006's absence directly undermines this more than any other NG area |
| NG-003 Routing Strategy | **80/100** | A-004 + A-005 are thorough enough to derive a routing structure for every screen that actually exists; the two screen-less navigation items are the only gap |
| NG-004 State Management | **70/100** | A-007 + A-008 give a solid information/permission foundation; the Builder Projects domain gap affects only that slice of state, not the overall pattern |
| NG-005 Shared Libraries / Authorization Strategy | **60/100** | RBAC policy (A-008) is genuinely strong; the Support Access invocation mechanism is the one deliberate, acknowledged gap |
| API Standards | **45/100** | Cannot be meaningfully written for the Builder Projects domain without a real backend schema; fine for every other domain |
| UI Design System | **85/100** | Purely presentational, doesn't depend on any backend gap — the strongest-scoring area, and the safest place to start implementation work first |
| Cursor AI Development | **50/100** | Safe to begin on Public Website, Super Admin administrative screens, and Owner App integration points; premature for Builder Portal's operational core |

**Overall weighted readiness: ~64/100** — dragged down specifically by the one dependency (Builder Projects) that touches the platform's actual reason for existing, not by broad weakness across the series.

## 9. Recommendations

1. **Escalate the Builder Projects backend domain as a named, tracked blocker** — not another flag in a ninth document, but a decision point: either commission its design now (parallel to, not blocking, the rest of NG-001) or make an explicit, documented decision to delay the Builder Portal's technical architecture until it exists.
2. **Decide, explicitly, whether A-006 will ever be written.** If yes, do it before NG-002 (Folder Structure), which depends on it most directly. If no, formally promote A-007 §2.1's Working Module Reference from "provisional" to "adopted" so downstream documents stop citing it as a stand-in for something that isn't coming.
3. **Close the two screen-less navigation items** (Owners Directory, Profile) with a short, targeted addendum to A-004/A-003A rather than letting them ride into NG-001 unresolved — both are low-complexity to specify properly.
4. **Backfill the three story-less screens** (SA-08, SA-10, BA-13) with real A-003A stories — permissions already exist for them (A-008), so this is about behavior, not access.
5. **Run the Approval Checklists.** Zero of eight documents have been formally approved by a human reviewer — this board's technical findings don't substitute for that governance step.

## 10. Outstanding Questions

- Is A-006 still intended to exist, or has the series implicitly moved past it?
- Who owns the decision to commission the Builder Projects backend domain, and on what timeline relative to NG-001?
- Were `MASTER_CONTEXT.md`/`PROJECT_FACTS.md` ever created elsewhere, or should they be considered cancelled/never-started?
- Is the `organization_type` discriminator mechanism decision owned by this Web Platform series, or by the backend Platform Foundation Specification's own maintainers?

## 11. Future Improvements

- A dedicated, lightweight "gap tracker" companion file (this review effectively created one manually across §5/§6 — formalizing it would save re-deriving it in a future A-0XX Review) would reduce the need for a full re-audit each time.
- Consider whether the Support Access invocation mechanism and the `organization_type` decision should each get their own short decision document rather than waiting for NG-005/a data-architecture document respectively — both are small enough to resolve quickly and are blocking other work disproportionate to their size.

## 12. Updated ARCHITECTURE_INDEX.md

See `../ARCHITECTURE_INDEX.md` — updated with the A-009 entry and this review's headline findings folded into §4 Known Open Items.

## 13. Review Checklist

- [ ] Executive Summary's split verdict (§14) accepted as the correct framing, or redirected
- [ ] Builder Projects backend domain escalation (§9.1) actioned — decision made, not just acknowledged
- [ ] A-006's fate (write it / formally retire it) decided (§9.2)
- [ ] Approval Checklists for A-001–A-005, A-007, A-008 scheduled to actually run

## 14. Final Approval Recommendation

**This board does not issue a single blanket verdict — the evidence doesn't support one.**

🟡 **APPROVED WITH CONDITIONS — for a defined subset of NG-001:** Public Website, Super Admin Portal (excluding any screen requiring Builder-Organization-scoped data access beyond what Support Access already resolves), general Angular architecture/routing/state-management patterns, and the UI Design System track. These areas have complete, internally consistent, traceable documentation and no unresolved backend dependency.

🔴 **NOT READY — for the Builder Handover Portal's operational core** (Projects, Units, Owner Assignment, Documents, Invitations, and everything in `PERMISSION_MATRIX.md`'s ID-07–ID-10 rows): blocked on a real backend Builder Projects domain design and, ideally, a real A-006. Beginning NG-001 here now would mean building technical architecture against a documentation layer this board has confirmed is provisional, not final.

**Recommended path:** begin NG-001 immediately, scoped to the 🟡 areas above, while treating the Builder Projects backend domain design as a parallel, explicitly-tracked workstream — not a blocker to starting, but a hard blocker to finishing the platform's actual core.
