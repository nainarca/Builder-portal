---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | A-003 |
| **Document Name** | User Journey |
| **Project** | MyPropertyAsset Web Platform |
| **Version** | 1.0 |
| **Status** | Draft |
| **Prepared By** | Enterprise Architecture Team (Enterprise Solution Architect / SaaS Product Architect / Business Architect / UX Architect / UI-UX Strategist / Security Architect) |
| **Target AI** | Claude AI (Opus / Sonnet) |
| **Created Date** | 2026-07-09 |
| **Updated Date** | 2026-07-09 |
| **Dependencies** | A-001 Product Vision & Scope, A-002 Business Flow |
| **Referenced Documents** | `A-001-product-vision-scope.md`, `A-002-business-flow.md` |
| **Previous Document** | A-002 Business Flow |
| **Next Document** | A-004 Screen Flow |
| **Related ADR** | None yet (this document introduces no technical decision — see §22) |
| **Revision History** | v1.0 — 2026-07-09 — Initial draft |
| **Approval Status** | Pending approval |

**Companion document:** [`diagrams/A-003_User_Journey_Diagrams.md`](diagrams/A-003_User_Journey_Diagrams.md) — every diagram referenced below lives there, not inline, per this document's explicit deliverable structure.

**Naming note:** this document and its diagram companion use the exact filenames this prompt specified (`A-003_User_Journey.md`, underscore-separated), which differs from the hyphenated slug convention used by `A-001-product-vision-scope.md` and `A-002-business-flow.md`. Both are on record now; standardizing one convention is a small open item for whoever approves this series, not a decision made here.

---

# A-003 — User Journey

## Pre-Check Result

A-001 and A-002 were read in full and are treated as source of truth; nothing in either is modified or contradicted below. No ADR documents exist. Terminology (Organization, Builder, Owner, Handover) is used exactly as A-002 defined it, including A-002 §16's resolution that Organization is one shared construct for both Builders and Owners. No conflicts found requiring a stop.

---

## 1. Executive Summary

This document describes how each actor in the MyPropertyAsset ecosystem actually experiences the platform — what they're trying to accomplish, how they get in, what can go wrong, and what "done" looks like for them. It contains no screens, no navigation, no components: only goals, actions, decisions, and outcomes. A-002 defined *what the business does*; this document defines *what it feels like to be the person doing it*. A-004 (Screen Flow) is where these journeys start becoming actual UI.

## 2. Journey Overview

Four journeys are documented in full: Public Visitor, Super Admin, Builder Administrator, Property Owner. A fifth (Future Tenant) is named only, per instruction, since it isn't in this initiative's designed scope (A-001 §8). Every journey below is a downstream elaboration of a specific A-002 business process — none introduces a new business capability A-002 didn't already establish.

| Journey | Elaborates (A-002 §) |
|---|---|
| Public Visitor | §6 Public Website Flow |
| Super Admin | §7 Super Admin Flow |
| Builder Administrator | §8 Builder Portal Flow, §10/§11 Handover/Invitation |
| Property Owner | §9 Owner Flow, §10 Property Handover |

## 3. User Personas

| Persona | Actor | Snapshot |
|---|---|---|
| **Anaya** | Public Visitor (owner-track) | A working professional evaluating whether to bring her two rental flats onto the platform. Price- and credibility-sensitive; will leave if she can't quickly tell what the product does |
| **Karan** | Public Visitor (builder-track) | Operations lead at a mid-size developer, arrived via a sales conversation, looking to register his company and understand what handover on the platform actually requires of his team |
| **Rohan** | Super Admin | MyPropertyAsset's own platform operations lead — onboards builders, configures their white-label presentation, and is the first line of support when something breaks for a builder or owner |
| **Priya** | Builder Administrator | Operations head at a real-estate developer, responsible for handing over 40+ completed units to buyers with the least possible manual paperwork and the fewest possible "where's my document" calls afterward |
| **Vikram** | Property Owner | An NRI investor who just bought a flat from a builder using the platform, and wants the handover to require the least possible back-and-forth before he can start actually managing the property |

## 4. User Goals

| Actor | Primary goal | Secondary goal |
|---|---|---|
| Public Visitor | Decide, quickly, whether this platform is credible and relevant to them | Find the right conversion path (sign up / register as builder / talk to sales) without friction |
| Super Admin | Get a legitimate builder from registration to productive Builder Portal use as fast as safely possible | Keep the platform healthy — support, monitoring, subscriptions — without needing engineering help for routine operations |
| Builder Administrator | Hand a unit to its owner with zero ambiguity about what was transferred and when | Avoid re-explaining the same handover status to the same buyer twice |
| Property Owner | Accept a handed-over property and start managing it, with no surprise gaps in the documents they were promised | Trust that what they accepted is exactly what they now own, no more, no less |

## 5. Public Visitor Journey

**Persona:** Anaya (owner-track) and Karan (builder-track) — the journey forks partway through.

**Entry Points:** organic search, referral link, paid acquisition, direct navigation.

**Preconditions:** none — this is the platform's only unauthenticated journey.

**Main Journey (Owner-track — Anaya):**
1. Discover the platform (search/referral/ad).
2. Explore the website — understand what problem it solves.
3. Compare features against her current spreadsheet-based approach.
4. View pricing.
5. Decide: sign up directly (existing Owner Mobile App self-serve flow, unchanged by this initiative) or exit undecided.

**Main Journey (Builder-track — Karan):**
1. Discover the platform (often via a sales conversation, per A-002 §6's Contact Sales routing).
2. Explore the website, specifically the builder/handover value proposition.
3. Submit Builder Registration.
4. Journey ends here for Karan — from this point the process is owned by the Super Admin journey (§6); Karan re-enters the platform only once approved.

**Alternate Journey:** Anaya isn't ready to buy — she requests a demo or submits a pricing inquiry instead of signing up immediately; MyPropertyAsset's sales process (external to the platform, per A-002 §6) follows up.

**Exception Journey:** Karan submits a Builder Registration with incomplete information — per A-002 §15, he's notified with a reason and can resubmit; there is no journey dead-end, only a retry loop.

**Exit Points:** sign-up (owner), Builder Registration submitted (builder), demo/pricing inquiry submitted (either), or unconverted exit.

**Success Criteria:** the visitor reaches a clear next step (signed up, registered, or a qualified lead) within one session, without needing to contact support to understand what the product does.

**Pain Points:** generic marketing content that doesn't distinguish "I'm an owner" from "I'm a builder" early enough forces visitors to self-diagnose which path is theirs — a real risk if the website doesn't surface the fork early.

**Opportunities:** an explicit "Are you a property owner or a builder?" fork near the top of the journey would resolve the pain point above directly — a content/IA recommendation for A-004, not a decision made here.

**Business Value:** this is the only journey that creates new accounts of either kind — its conversion quality determines the growth rate of everything else in this document.

**Security Considerations:** none — fully unauthenticated, no sensitive data handled until sign-up/registration submission (which hands off to Supabase Auth, per A-001 §14/§4).

**Notifications:** none to the visitor during this journey; a confirmation notification follows Builder Registration submission (A-002 §14).

**Dependencies:** A-002 §6 (Public Website Flow), the existing Owner Mobile App self-serve signup (unchanged).

---

## 6. Super Admin Journey

**Persona:** Rohan.

**Entry Points:** direct login (internal tool, not discoverable via the Public Website).

**Preconditions:** Rohan already holds a Platform Operator account — this journey does not include how that account itself was created (an internal process, out of this document's scope).

**Main Journey:**
1. Login.
2. View Dashboard — pending builder registrations, open support items, platform health at a glance.
3. Review a pending Builder Registration (Karan's, from §5) → Approve.
4. Configure the newly-approved builder's White-label presentation.
5. Activate the builder's Subscription.
6. Manage Organizations — confirm the builder's Organization record is correctly set up (per A-002 §16's resolution: this is the same Organization construct an Owner also gets, just a different population/type).
7. Monitor Platform — recurring, not a one-time step.
8. Support Builders — recurring, triggered by inbound requests, not a linear "next step" in the same sense as 1–6.
9. Logout.

**Alternate Journey:** Rohan manually initiates a builder record himself (e.g., a sales-assisted onboarding where the builder never self-registered through the Public Website) — this is still "Super Admin creates the builder," consistent with A-002 §16's business rule that only Super Admin can create builders; it's an alternate entry into the same approval-adjacent process, not a different rule.

**Exception Journey:** Rohan rejects a Builder Registration — per A-002 §15, the prospective builder is notified with a reason; no Organization or Builder Portal access is ever provisioned for a rejected registration.

**Exit Points:** logout; or, mid-session, handing off to a specific support case that may extend beyond a single sitting.

**Success Criteria:** a legitimate builder reaches productive Builder Portal access within Rohan's committed SLA, with no manual workaround needed outside the Super Admin Portal itself.

**Pain Points:** if White-label Configuration and Subscription Activation aren't both required before a builder can log in, Rohan risks approving a builder into a half-configured state — this document doesn't mandate an order, but flags it as a real risk for A-004/A-006 to resolve with an actual required-steps gate.

**Opportunities:** a single "builder readiness" checklist view (approval + white-label + subscription, all in one place) would directly address the pain point above.

**Business Value:** Rohan's journey is the platform's operational throughput bottleneck for the entire Builder-side business — every builder, and every property that eventually gets handed over through them, passes through this journey first.

**Security Considerations:** Super Admin holds the platform's highest-privilege role (A-002 §3) — this journey should assume every action here is logged/auditable; the specific mechanism is a Security Architecture decision (A-001 §19 Future Roadmap), not designed here.

**Notifications:** Rohan receives a notification for every new Builder Registration submission (A-002 §14); Rohan's own approve/reject actions trigger notifications to the builder, not to himself.

**Dependencies:** A-002 §7 (Super Admin Flow), §16 (Organization rules).

---

## 7. Builder Journey

**Persona:** Priya.

**Entry Points:** direct login, only reachable after Super Admin approval (§6) and account activation.

**Preconditions:** Priya's builder organization has been approved and her own account activated (mirrors the Owner activation flow, §8, but for a Builder-type Organization).

**Main Journey:**
1. Login.
2. Dashboard — overview of her projects, units, and handover progress.
3. Create Project.
4. Create Units within that project.
5. Assign an owner to a specific unit (a data link to her own, external sales records — per A-002 §8, the platform is never the system of record for the sale itself).
6. Upload Initial Documents against the unit.
7. Invite Owner.
8. Track Invitation status.
9. Track Handover status through to completion.
10. Reports — handover progress across her whole portfolio of projects.
11. Logout.

**Alternate Journey:** Priya reassigns a unit to a different owner after an invitation expires or is declined (A-002 §15) — she re-enters the journey at step 5 for that specific unit, without restarting the project/unit setup.

**Exception Journey:** Priya's organization is suspended by Super Admin mid-flow (a rare but real case, A-002 §15) — she loses Builder Portal access immediately; critically, any unit she had *already* successfully handed over is unaffected — this is Vikram's property now, not hers, regardless of what happens to her account afterward.

**Exit Points:** logout; or a completed handover, which ends her active involvement in that specific unit's journey (Reports remains available for historical units).

**Success Criteria:** an owner accepts a unit's handover on the first invitation, with no follow-up "where's my document" contact — this is Priya's actual definition of success, not just "the invitation was sent."

**Pain Points:** if Priya can't see *why* an invitation hasn't been accepted yet (expired vs. pending vs. owner still reviewing), she has no way to decide whether to wait or intervene — a real gap this document flags for A-004's status-visibility design, not solved here.

**Opportunities:** surfacing document-level acceptance status (not just unit-level) would let Priya spot an incomplete handover package before inviting the owner, rather than after a rejection.

**Business Value:** Priya's journey is where the platform's core differentiator — structured, non-ERP handover — is actually delivered; a bad experience here undermines the entire Builder Portal's reason to exist.

**Security Considerations:** Priya's access is fully scoped to her own Organization's projects/units (A-002 §3) — she should never be able to see another builder's data, a hard requirement carried forward from A-002, not newly introduced here.

**Notifications:** Priya is notified on invitation acceptance/decline and on invitation expiry (A-002 §14).

**Dependencies:** A-002 §8 (Builder Portal Flow), §10 (Handover), §11 (Invitation). Also depends on the not-yet-designed backend Builder Projects domain (A-002 §18 Risks) — this journey describes Priya's *experience*, which is only buildable once that domain exists.

---

## 8. Owner Journey

**Persona:** Vikram.

**Entry Points:** an invitation from a builder (Priya's, from §7) **or** direct self-serve signup (existing, unchanged) — both are equally valid, per A-002 §9; this journey focuses on the invitation-originated path since that's the new capability this initiative adds.

**Preconditions:** none for the invitation itself; account activation is required before Property Acceptance.

**Main Journey:**
1. Receive Invitation (email/SMS/push, per A-002 §14).
2. Activate Account — if Vikram is new to the platform, this also silently provisions his own personal Organization (A-001/backend, unrelated to Priya's builder Organization — A-002 §16).
3. View Property — review the specific unit and its handover package before committing.
4. Accept Handover.
5. Access Initial Documents — the same documents Priya uploaded, now his, not a copy (A-002 §13).
6. Upload Personal Documents — his own additions, using the existing Property Documents capability, unmodified.
7. Add Loan — existing capability, now against a handover-originated property.
8. Add Expenses — existing capability.
9. Manage Tenant — existing capability, if/when he lets the unit.
10. Receive Notifications — ongoing, existing capability.
11. View Financial History — existing capability.
12. Profile / Settings.
13. Logout.

**Alternate Journey:** Vikram already has a MyPropertyAsset account (e.g., he owns other properties acquired independently of any builder) — the invitation links to his existing account rather than creating a new one (A-002 §15); steps 3 onward are identical.

**Exception Journey:** Vikram reviews the handover package and declines — per A-002 §10/§15, the unit returns to Priya's "needs reassignment" queue and no property or document ever appears in Vikram's account. A second exception: Vikram's invitation expires before he acts — he's not blocked from later contacting the builder, but the original invitation is dead and a new one must be issued.

**Exit Points:** logout, at any point after account activation — this is an ongoing-use journey, not a one-time completion, since steps 6–11 are the beginning of Vikram's regular use of the existing app.

**Success Criteria:** Vikram can, within minutes of accepting, see the exact set of documents he was promised and start managing the property — no gap between "I accepted" and "I can act on this."

**Pain Points:** if the handover package review (step 3) doesn't clearly show *everything* that will transfer before he commits, Vikram has no way to make an informed accept/decline decision — flagged for A-004's design, not resolved here.

**Opportunities:** since steps 7–11 are entirely existing, already-shipped app capability, the only genuinely new UX work in this whole journey is steps 1–6 — a small, well-bounded surface, which is good news for implementation risk (A-001 §12/§17).

**Business Value:** Vikram's experience is the platform's proof point that a builder-originated property is exactly as good an experience as a manually-entered one — any friction here undermines the entire premise of the Builder Handover Portal.

**Security Considerations:** document access (step 5) must be scoped to exactly the unit Vikram accepted — no visibility into other units, even ones from the same builder or project, a hard requirement carried forward from A-002 §13's ownership-transfer model.

**Notifications:** Vikram receives the invitation itself, plus a handover-complete confirmation (A-002 §14); all of steps 7–11's notifications are existing, unmodified app behavior.

**Dependencies:** A-002 §9 (Owner Flow), §10 (Handover), §13 (Document Lifecycle). Steps 7–11 depend entirely on the existing, unmodified Owner Mobile App (A-001 §8).

---

## 9. Future Tenant Considerations

Per instruction, no tenant workflow is designed here. The only thing recorded: a future Tenant Mobile App would plausibly integrate at the same two points the existing in-app tenant experience already does today — notification delivery and document access, scoped to the tenant's own tenancy (consistent with A-002 §21). No journey, persona, or diagram is produced for this actor in this document.

## 10. Journey Decision Points

| Decision point | Who decides | Outcome branches |
|---|---|---|
| Owner-track vs. builder-track (§5) | Public Visitor | Direct signup vs. Builder Registration |
| Approve vs. reject Builder Registration (§6) | Super Admin | Builder Portal access provisioned vs. rejection notice |
| Assign this unit to this owner (§7) | Builder Administrator | Invitation sent vs. unit remains unassigned |
| Accept vs. decline handover (§8) | Property Owner | Property/documents transfer vs. unit returns to builder's queue |
| New account vs. existing account on invitation (§8) | System, based on email match | New signup flow vs. linked to existing account |

## 11. Pain Points (consolidated)

| Journey | Pain point |
|---|---|
| Public Visitor | No early fork between owner-track and builder-track content |
| Super Admin | No single "builder readiness" view spanning approval + white-label + subscription |
| Builder | No visibility into *why* an invitation is still pending |
| Owner | No guarantee the handover package review is fully legible before commitment |

## 12. Opportunities (consolidated)

- Early owner/builder fork on the Public Website (§5).
- A unified builder-readiness checklist for Super Admin (§6).
- Document-level (not just unit-level) status visibility for Builders (§7).
- A complete, legible handover-package preview before Owner acceptance (§8).

None of these are decided here — they're UX recommendations for A-004 (Screen Flow) to design against, not commitments this document makes on A-004's behalf.

## 13. Journey Validation

Each journey above was checked against A-002's corresponding business flow section (§2 table) and found consistent — no journey introduces a business capability, actor, or rule that A-002 didn't already establish. No screen, wireframe, navigation menu, route, or UI component appears anywhere in this document, per this document's own validation rules.

## 14. Cross Journey Interaction

```
Public Visitor (builder-track) ──submits──▶ Super Admin (approves) ──provisions──▶ Builder
Builder ──creates project/unit, invites──▶ Owner ──accepts──▶ (returns to) Builder's Reports view
Super Admin ──configures/monitors/supports──▶ Builder and Owner journeys, standing alongside both
```

This mirrors A-002 §17's Cross Module Interaction exactly, restated at the journey (experience) level rather than the process level.

## 15. Business Rules Affecting Journeys

Every business rule from A-002 §16 governs the journeys above without restatement here, notably: document ownership transfers rather than duplicates (shapes Owner journey step 5); a unit has at most one active invitation at a time (shapes Builder journey's alternate/exception paths); an already-handed-over property is unaffected by later builder suspension (shapes the Builder exception journey's boundary).

## 16. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| A-004 designs screens before the pain points in §11 are actually addressed in the underlying flow | UX debt gets built into the first screen designs | §11/§12 are written explicitly as inputs to A-004, not optional color commentary |
| The Builder journey (§7) depends on the still-undesigned Builder Projects backend domain (carried from A-002 §18) | Journey described here can't be validated against real data shapes until that domain exists | Recorded again here so it isn't lost between documents |
| Two "Organization" populations (Builder-type, Owner-type) are referenced throughout without a settled `organization_type` mechanism (carried from A-002 §16) | Journey language may need revision once that mechanism is decided | Flagged, not solved, consistent with A-002's own framing |

## 17. Assumptions

- A-002's business flow and rules are stable enough to build journeys on without expecting near-term revision.
- The existing Owner Mobile App's steps 7–11 in §8 require no UX change to accommodate a handover-originated property — assumed, not yet verified against the real app (same caveat A-002 §19 already raised).
- Notification delivery mechanisms (email/SMS/push) are available platform-wide; which channel is used for which trigger is a future design decision, not assumed here beyond "some notification occurs."

## 18. Constraints

- No screens, wireframes, navigation menus, routes, folder structures, APIs, database design, UI components, or technical implementation may appear in this document (explicit Journey Validation Rule).
- The Builder Portal exclusion list (CRM/Sales/HR/Payroll/Accounting/Procurement/Inventory/Society Management) constrains every journey step in §7 exactly as it constrained A-002 §8.

## 19. Future Expansion

Tenant journey design (§9, deferred in full); a Super Admin "builder readiness" view (§12); document-level status visibility for Builders (§12); an owner/builder fork on the Public Website (§12) — all named as candidates for future documents, not designed here.

## 20. Summary

This document turns A-002's business flow into four experienced journeys — Visitor, Super Admin, Builder, Owner — each with goals, entry/exit points, main/alternate/exception paths, and named pain points and opportunities, without specifying any screen, route, or component. It surfaces four concrete pain points and four corresponding opportunities as direct inputs to A-004 (Screen Flow), and carries forward two open dependencies from A-002 (the Builder Projects backend domain, and the `organization_type` mechanism) without attempting to resolve either here.

---

## 21. Updated ARCHITECTURE_INDEX.md

See `../ARCHITECTURE_INDEX.md` — updated with the A-003 entry and the new `docs/adr/ADR_INDEX.md` split-out (§22). No prior document was overwritten.

## 22. Updated ADR List

**Not required for new content** — this document introduces no technical/architectural decision, consistent with A-002. However, the ADR log itself has been promoted from an embedded section of `ARCHITECTURE_INDEX.md` into its own file, `docs/adr/ADR_INDEX.md`, since this is the second consecutive document to reference `ADR_INDEX.md` as a distinct deliverable — see that file for the (still all-undrafted) ADR registry.

## 23. Review Checklist

- [ ] Personas (§3) match real target users, not generic placeholders
- [ ] Four consolidated pain points (§11) accepted as accurate, or redirected
- [ ] Owner journey's assumption that steps 7–11 need no UX change (§17) confirmed against the real mobile app
- [ ] Builder journey's dependency on the undesigned Builder Projects domain (§16) acknowledged as a blocking sequencing risk for A-006 (Functional Modules)

## 24. Approval Checklist

- [ ] Reviewed by Enterprise/Solution Architect
- [ ] Reviewed by UX Architect / UI-UX Strategist
- [ ] Status updated from Draft to Approved in `ARCHITECTURE_INDEX.md`
- [ ] A-004 (Screen Flow) authorized to begin
