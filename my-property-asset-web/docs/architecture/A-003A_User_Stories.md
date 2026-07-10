---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | A-003A |
| **Document Name** | User Stories & Acceptance Criteria |
| **Project** | MyPropertyAsset Web Platform |
| **Version** | 1.0 |
| **Status** | Draft |
| **Prepared By** | Enterprise Architecture Team (Product Owner / Enterprise Business Analyst / Enterprise Solution Architect / SaaS Product Architect / UX Architect) |
| **Target AI** | Claude AI (Opus / Sonnet) |
| **Created Date** | 2026-07-09 |
| **Updated Date** | 2026-07-09 |
| **Dependencies** | A-001 Product Vision & Scope, A-002 Business Flow, A-003 User Journey |
| **Referenced Documents** | `A-001-product-vision-scope.md`, `A-002-business-flow.md`, `A-003_User_Journey.md` |
| **Previous Document** | A-003 User Journey |
| **Next Document** | A-004 Screen Flow |
| **Related ADR** | None yet — see `docs/adr/ADR_INDEX.md` |
| **Revision History** | v1.0 — 2026-07-09 — Initial draft |
| **Approval Status** | Pending approval |

**Companion document:** [`A-003A_Acceptance_Criteria.md`](A-003A_Acceptance_Criteria.md) — the full Given/When/Then breakdown for every story below lives there; this document carries a concise acceptance-criteria summary per story plus everything else the User Story template requires.

**Naming note:** filenames here follow the underscore/title-case pattern this prompt specified, matching A-003's own naming (not A-001/A-002's hyphenated slugs) — see `ARCHITECTURE_INDEX.md` §3 for the still-open convention question.

---

# A-003A — User Stories & Acceptance Criteria

## Pre-Check Result

A-001, A-002, and A-003 were read in full and are treated as source of truth; nothing in any of them is modified or contradicted below. No ADR documents exist. No conflict was found requiring a stop. One discipline point applied deliberately, per the "verify no duplicated requirements" pre-check item: the Property Owner stories covering Loan, Expense, Tenant, and Financial History (§3.4) do **not** restate business rules already established for those domains on the backend (Expense IES, Loan IES, Financial History IES) — they are scoped narrowly to the one thing that's actually new here: that a handover-originated property is indistinguishable from a manually-entered one to those existing features.

---

## 1. Executive Summary

This document converts A-002's business flow and A-003's user journeys into 29 discrete, testable user stories across four actors (Public Visitor, Super Admin, Builder Administrator, Property Owner), organized into six epics. Each story carries preconditions, main/alternate/exception flows, business/security/validation rules, and a measurable acceptance-criteria summary (full Given/When/Then scenarios in the companion document). No UI, technical, or database content appears anywhere in this document.

## 2. Epics

| Epic ID | Name | Description | Elaborates |
|---|---|---|---|
| EPIC-01 | Public Acquisition | Visitor-facing discovery and conversion | A-002 §6, A-003 §5 |
| EPIC-02 | Builder Onboarding & Platform Administration | Builder registration through approval, white-label, subscription, org setup, monitoring | A-002 §7, A-003 §6 |
| EPIC-03 | Project & Unit Preparation | Builder sets up projects/units ahead of handover | A-002 §8, A-003 §7 |
| EPIC-04 | Owner Invitation & Handover | Builder invites an owner; owner reviews and accepts | A-002 §8/§10/§11, A-003 §7/§8 |
| EPIC-05 | Handover Reporting | Builder-side visibility into handover progress | A-002 §8, A-003 §7 |
| EPIC-06 | Ongoing Property Management (integration only) | Confirms existing Owner Mobile App capability works unmodified for a handover-originated property | A-002 §9, A-003 §8 |

## 3. User Stories

### 3.1 Public Website (EPIC-01)

#### US-PW-01 — Browse Website
**Actor:** Public Visitor
**User Story:** As a visitor, I want to browse the platform's public content, so that I can understand what MyPropertyAsset offers before engaging further.
**Preconditions:** None — unauthenticated.
**Trigger:** Visitor navigates to the public site.
**Main Flow:** Visitor views informational content (product overview, features) and forms an impression.
**Alternate Flow:** Visitor arrives via a deep link to a specific page rather than the homepage.
**Exception Flow:** Content fails to load — visitor sees a graceful, non-technical error state.
**Acceptance Criteria (summary):** Public content is reachable without authentication; no authenticated-only data is ever exposed. Full scenarios: AC-PW-01.
**Business Rules:** No account or personal data required to browse (A-002 §6).
**Security Requirements:** No sensitive/authenticated data reachable from this unauthenticated surface.
**Validation Rules:** N/A — no data entry.
**Success Outcome:** Visitor can articulate what the platform does and identify whether they are an owner-track or builder-track visitor (A-003 §5).
**Priority:** Must Have.
**Future Considerations:** Personalized content by visitor track — an opportunity flagged in A-003 §12, not designed here.

#### US-PW-02 — View Pricing
**Actor:** Public Visitor
**User Story:** As a visitor, I want to view pricing information, so that I can evaluate whether the platform fits my budget before signing up.
**Preconditions:** None.
**Trigger:** Visitor navigates to pricing content.
**Main Flow:** Visitor views plan/tier information.
**Alternate Flow:** Visitor compares pricing against feature content viewed earlier in the same session.
**Exception Flow:** Pricing content temporarily unavailable — visitor is not blocked from other site content.
**Acceptance Criteria (summary):** Pricing information is visible without authentication and without requiring any data entry. Full scenarios: AC-PW-02.
**Business Rules:** Pricing structure itself is a commercial decision outside this document's scope; this story only requires that whatever pricing exists is presentable.
**Security Requirements:** None beyond US-PW-01.
**Validation Rules:** N/A.
**Success Outcome:** Visitor can determine, unaided, whether to proceed toward sign-up or a sales conversation.
**Priority:** Must Have.
**Future Considerations:** None named.

#### US-PW-03 — Request Demo
**Actor:** Public Visitor
**User Story:** As a visitor, I want to request a product demo, so that I can evaluate the platform with guided help before committing.
**Preconditions:** None.
**Trigger:** Visitor submits a demo request.
**Main Flow:** Visitor provides contact details → request is captured → routed to MyPropertyAsset's commercial process (external to the platform, A-002 §6).
**Alternate Flow:** Visitor requests a demo directly from a pricing or feature page rather than a dedicated form.
**Exception Flow:** Submission fails (e.g., invalid contact detail) — visitor is shown what needs correcting, not a generic failure.
**Acceptance Criteria (summary):** A submitted request is captured and confirmed to the visitor; invalid submissions are rejected with a specific reason. Full scenarios: AC-PW-03.
**Business Rules:** This is a lead-capture action, not an account-creation action — no platform account is created by this story.
**Security Requirements:** Contact details captured here are handled as lead data, not as authentication credentials.
**Validation Rules:** Contact detail (email and/or phone) must be present and well-formed before submission succeeds.
**Success Outcome:** MyPropertyAsset's commercial process receives a valid, actionable lead.
**Priority:** Should Have.
**Future Considerations:** None named.

#### US-PW-04 — Contact Sales
**Actor:** Public Visitor
**User Story:** As a visitor, I want to contact sales directly, so that I can get answers to questions the website content doesn't cover.
**Preconditions:** None.
**Trigger:** Visitor submits a sales inquiry.
**Main Flow:** Visitor provides contact details and a message → routed to MyPropertyAsset's commercial process (A-002 §6).
**Alternate Flow:** Visitor reaches this action from the Builder-track content specifically (a prospective builder asking questions before registering).
**Exception Flow:** Same as US-PW-03 — invalid submission is rejected with a specific reason.
**Acceptance Criteria (summary):** Same shape as US-PW-03, applied to a general sales inquiry rather than a demo request. Full scenarios: AC-PW-04.
**Business Rules:** Same as US-PW-03 — lead capture, not account creation. Distinct from the Builder Registration story (US-SA-01's trigger) — Contact Sales never itself creates a Builder Registration record.
**Security Requirements:** Same as US-PW-03.
**Validation Rules:** Same as US-PW-03.
**Success Outcome:** Same as US-PW-03.
**Priority:** Should Have.
**Future Considerations:** None named.

### 3.2 Super Admin (EPIC-02)

#### US-SA-01 — Register Builder
**Actor:** Super Admin
**User Story:** As a Super Admin, I want to register a builder on their behalf, so that I can onboard a builder who was acquired through a sales-assisted process rather than self-registration.
**Preconditions:** Super Admin is authenticated with platform-operator privileges.
**Trigger:** Super Admin initiates a new builder record, or reviews one submitted via the Public Website (A-002 §6/§16).
**Main Flow:** Super Admin enters/reviews the builder's company and contact information → a pending Builder Registration exists.
**Alternate Flow:** A Builder Registration already exists from a self-service submission — Super Admin reviews rather than creates.
**Exception Flow:** Duplicate registration attempt for an already-registered company — rejected with a specific reason.
**Acceptance Criteria (summary):** A registration record is created or located, in a pending state, before any approval decision is made. Full scenarios: AC-SA-01.
**Business Rules:** Only Super Admin can create a builder record, whether self-submitted or manually entered (A-002 §16, "Who can create builders").
**Security Requirements:** Action is restricted to the Super Admin role; not reachable by any other actor.
**Validation Rules:** Company name and a valid contact channel (email or phone) are required before a registration can proceed to review.
**Success Outcome:** A reviewable Builder Registration exists.
**Priority:** Must Have.
**Future Considerations:** None named.

#### US-SA-02 — Approve Builder
**Actor:** Super Admin
**User Story:** As a Super Admin, I want to approve or reject a builder registration, so that only legitimate builders gain Builder Portal access.
**Preconditions:** A pending Builder Registration exists (US-SA-01).
**Trigger:** Super Admin makes an approve/reject decision.
**Main Flow:** Super Admin approves → the builder's Organization is created, initial admin access is provisioned, and the builder is notified (A-002 §7/§14).
**Alternate Flow:** N/A beyond the two decision branches.
**Exception Flow:** Super Admin rejects → prospective builder is notified with a reason and may reapply (A-002 §15).
**Acceptance Criteria (summary):** Approval reliably provisions exactly one Organization and one notification; rejection provisions neither. Full scenarios: AC-SA-02.
**Business Rules:** A rejected registration creates no Organization and no Builder Portal access of any kind (A-002 §15).
**Security Requirements:** Action restricted to Super Admin. The provisioned Organization must be isolated from every other Organization (A-002 §7).
**Validation Rules:** A decision (approve or reject) requires the registration to be in a pending state — an already-decided registration cannot be re-decided by this story (a correction would be a separate, explicit action, not re-use of this story).
**Success Outcome:** The builder is either productively onboarded or clearly informed why not.
**Priority:** Must Have.
**Future Considerations:** None named.

#### US-SA-03 — Configure White-label
**Actor:** Super Admin
**User Story:** As a Super Admin, I want to configure a builder's white-label presentation, so that their Builder Portal reflects their own brand.
**Preconditions:** The builder's Organization exists (US-SA-02 approved).
**Trigger:** Super Admin opens white-label configuration for a specific Organization.
**Main Flow:** Super Admin sets branding configuration for the Organization (vision-level only — no mechanism is designed by this document, per A-001 §13).
**Alternate Flow:** Configuration is updated later, after initial approval.
**Exception Flow:** Configuration is attempted for an Organization that doesn't exist or isn't a Builder-type Organization — rejected.
**Acceptance Criteria (summary):** White-label configuration is scoped to exactly one Organization and has no effect on any other Organization's presentation. Full scenarios: AC-SA-03.
**Business Rules:** White-label applies at the Organization level (A-002 §16 White-label rules).
**Security Requirements:** Action restricted to Super Admin — no builder can configure their own white-label presentation in this story (whether that should change is future scope, not decided here).
**Validation Rules:** Deferred — no specific field-level rules are defined until white-label's actual mechanism is designed (A-001 §13, A-002 §16).
**Success Outcome:** The builder's Organization has a distinct presentation from any other Organization.
**Priority:** Should Have.
**Future Considerations:** Self-service white-label configuration by the builder themselves; extension to owner-facing surfaces (A-001 §13).

#### US-SA-04 — Activate Subscription
**Actor:** Super Admin
**User Story:** As a Super Admin, I want to activate a subscription for a builder, so that their Organization has commercial standing on the platform.
**Preconditions:** The builder's Organization exists (US-SA-02 approved).
**Trigger:** Super Admin activates a subscription plan for the Organization.
**Main Flow:** Super Admin selects and activates a plan → the Organization's subscription status becomes active.
**Alternate Flow:** Subscription is changed/upgraded after initial activation.
**Exception Flow:** Activation attempted for an Organization with no approved registration — rejected.
**Acceptance Criteria (summary):** An Organization has exactly one active subscription state at a time. Full scenarios: AC-SA-04.
**Business Rules:** Subscription today is a platform-operator-controlled action, not self-service, consistent with A-002 §7's Super Admin Flow.
**Security Requirements:** Restricted to Super Admin.
**Validation Rules:** A subscription cannot be activated for an Organization that hasn't been approved (US-SA-02).
**Success Outcome:** The builder Organization is commercially active and eligible for full Builder Portal use.
**Priority:** Must Have.
**Future Considerations:** Self-service subscription management; billing-per-organization reconciliation (a known open item from the backend Platform Foundation Specification).

#### US-SA-05 — Manage Organization
**Actor:** Super Admin
**User Story:** As a Super Admin, I want to view and manage Organization records, so that I can confirm each builder (and, indirectly, each owner) is correctly represented in the platform's tenancy model.
**Preconditions:** Super Admin is authenticated.
**Trigger:** Super Admin opens Organization management.
**Main Flow:** Super Admin views a list of Organizations, distinguishing Builder-type from Owner-type (A-002 §16's resolution — one shared construct, differentiated by type/population).
**Alternate Flow:** Super Admin drills into a specific Organization's detail.
**Exception Flow:** N/A — this is a read/administrative story with no destructive action defined here.
**Acceptance Criteria (summary):** Every approved builder and every activated owner is represented by exactly one visible Organization record. Full scenarios: AC-SA-05.
**Business Rules:** Organization is the same construct for both populations (A-002 §16) — this story must not present them as two unrelated data types.
**Security Requirements:** Restricted to Super Admin; an individual Organization's data is never exposed to another Organization's members through this story.
**Validation Rules:** N/A — administrative visibility only.
**Success Outcome:** Super Admin can answer "which Organizations exist and what type are they" without engineering assistance.
**Priority:** Should Have.
**Future Considerations:** The `organization_type` discriminator mechanism (A-002 §16, A-003 §16) is the underlying open dependency for this story's eventual data design — not resolved here.

#### US-SA-06 — Platform Monitoring
**Actor:** Super Admin
**User Story:** As a Super Admin, I want to monitor platform health and usage at a business level, so that I can identify issues before they affect builders or owners.
**Preconditions:** Super Admin is authenticated.
**Trigger:** Super Admin opens the monitoring view.
**Main Flow:** Super Admin views business-level indicators (e.g., pending registrations, active Organizations, support backlog).
**Alternate Flow:** N/A.
**Exception Flow:** N/A — read-only, informational story.
**Acceptance Criteria (summary):** Monitoring reflects current platform state without requiring direct database access. Full scenarios: AC-SA-06.
**Business Rules:** This is a business-level (not technical/APM) monitoring requirement, per A-002 §7.
**Security Requirements:** Restricted to Super Admin.
**Validation Rules:** N/A.
**Success Outcome:** Rohan (A-003 §6 persona) never needs engineering help to answer "is the platform healthy right now."
**Priority:** Should Have.
**Future Considerations:** Technical/APM-level monitoring is explicitly out of this document's scope — a future, separate concern.

### 3.3 Builder Administrator (EPIC-03, EPIC-04, EPIC-05)

#### US-BA-01 — Login
**Actor:** Builder Administrator
**User Story:** As a Builder Administrator, I want to log in to the Builder Handover Portal, so that I can manage my organization's projects and handovers.
**Preconditions:** Builder's Organization is approved and the admin's account is activated (US-SA-02).
**Trigger:** Builder navigates to the Builder Portal and authenticates.
**Main Flow:** Builder logs in via Supabase Auth → is placed in their own Organization's scoped context.
**Alternate Flow:** N/A beyond standard authentication alternates (password reset, etc. — existing Supabase Auth capability, not redesigned).
**Exception Flow:** Builder's Organization has been suspended (A-002 §15) — login is rejected with a specific reason, not a generic failure.
**Acceptance Criteria (summary):** A builder can only ever see and act within their own Organization's data. Full scenarios: AC-BA-01.
**Business Rules:** Builder access is fully scoped to their own Organization (A-002 §8/§17, A-003 §7 Security Considerations).
**Security Requirements:** Cross-Organization data access must be impossible, not merely hidden by UI.
**Validation Rules:** Standard credential validation (Supabase Auth, existing mechanism).
**Success Outcome:** Builder reaches their Dashboard.
**Priority:** Must Have.
**Future Considerations:** None named.

#### US-BA-02 — Create Project
**Actor:** Builder Administrator
**User Story:** As a Builder Administrator, I want to create a project, so that I can group the units I'll be handing over under one construction/development effort.
**Preconditions:** Builder is logged in (US-BA-01).
**Trigger:** Builder initiates project creation.
**Main Flow:** Builder provides project details → project exists within their Organization.
**Alternate Flow:** N/A.
**Exception Flow:** Required project information is missing — creation is rejected with specific field-level feedback.
**Acceptance Criteria (summary):** A created project is visible only within the creating Organization. Full scenarios: AC-BA-02.
**Business Rules:** This story is the business-process counterpart of the backend's undesigned Builder Projects domain (A-002 §8, A-003 §7 dependency note) — it describes the requirement, not the data model.
**Security Requirements:** Scoped to the Builder's own Organization.
**Validation Rules:** A project name is required at minimum; further field-level rules are deferred to the data-architecture document that designs the Builder Projects domain.
**Success Outcome:** Builder has a project to attach units to.
**Priority:** Must Have.
**Future Considerations:** None named beyond the already-flagged backend dependency.

#### US-BA-03 — Create Units
**Actor:** Builder Administrator
**User Story:** As a Builder Administrator, I want to create units within a project, so that each individual property has its own record ahead of handover.
**Preconditions:** A project exists (US-BA-02).
**Trigger:** Builder initiates unit creation within a project.
**Main Flow:** Builder provides unit details → unit exists in "Draft" state (A-002 §12 Property Lifecycle).
**Alternate Flow:** Multiple units are created in bulk for the same project.
**Exception Flow:** Unit creation attempted against a project that doesn't belong to the builder's own Organization — rejected.
**Acceptance Criteria (summary):** A unit always belongs to exactly one project and one Organization. Full scenarios: AC-BA-03.
**Business Rules:** Same Builder Projects domain dependency as US-BA-02.
**Security Requirements:** Scoped to the Builder's own Organization.
**Validation Rules:** A unit identifier/name is required.
**Success Outcome:** Builder has individually addressable units ready to progress through the handover lifecycle.
**Priority:** Must Have.
**Future Considerations:** None named.

#### US-BA-04 — Assign Owner
**Actor:** Builder Administrator
**User Story:** As a Builder Administrator, I want to assign a prospective owner to a unit, so that I can prepare the correct handover before formally inviting them.
**Preconditions:** A unit exists and is "Ready for Handover" (A-002 §12).
**Trigger:** Builder links a unit to a specific prospective owner's contact information.
**Main Flow:** Builder enters the prospective owner's identifying detail (name, email/phone) → unit moves to "Assigned" state.
**Alternate Flow:** Builder reassigns a unit that previously returned to "Needs Reassignment" (A-002 §15).
**Exception Flow:** Attempted assignment of a unit that already has an active assignment — rejected (A-002 §16, "a unit has at most one active prospective-owner assignment at a time").
**Acceptance Criteria (summary):** A unit has at most one active assignment; assignment does not itself notify the owner (that's US-BA-06). Full scenarios: AC-BA-04.
**Business Rules:** The assignment is a data link based on the builder's own external sales records — the platform is never the system of record for the underlying sale (A-002 §8, CRM/Sales exclusion).
**Security Requirements:** Scoped to the Builder's own Organization and its own units.
**Validation Rules:** A valid contact channel (email or phone) is required for the prospective owner.
**Success Outcome:** The unit is ready for document upload and invitation.
**Priority:** Must Have.
**Future Considerations:** None named.

#### US-BA-05 — Upload Documents
**Actor:** Builder Administrator
**User Story:** As a Builder Administrator, I want to upload handover documents against a unit, so that the owner receives everything they need at handover.
**Preconditions:** A unit exists (US-BA-03).
**Trigger:** Builder uploads one or more documents against a unit.
**Main Flow:** Documents are stored as "Builder-owned, Owner-pending" (A-002 §13) — not yet visible to any owner.
**Alternate Flow:** Additional documents are uploaded after the initial batch, before invitation.
**Exception Flow:** Upload attempted against a unit outside the builder's own Organization — rejected.
**Acceptance Criteria (summary):** Documents remain invisible to any owner until handover acceptance (US-PO-03). Full scenarios: AC-BA-05.
**Business Rules:** Document ownership transfers, never duplicates, at handover acceptance (A-002 §13) — this story is the "before" state of that rule.
**Security Requirements:** Scoped to the Builder's own Organization; no owner (even the eventually-assigned one) can access these documents before acceptance.
**Validation Rules:** Deferred — specific file-type/size rules are a future, technical-document concern, not defined here.
**Success Outcome:** A complete handover document package exists before the owner is ever invited.
**Priority:** Must Have.
**Future Considerations:** Document-level (not just unit-level) completeness indicators — an opportunity flagged in A-003 §12.

#### US-BA-06 — Invite Owner
**Actor:** Builder Administrator
**User Story:** As a Builder Administrator, I want to invite the assigned owner, so that they can review and accept the handover.
**Preconditions:** A unit is assigned (US-BA-04) and has at least its initial documents uploaded (US-BA-05).
**Trigger:** Builder sends the invitation.
**Main Flow:** System generates a time-limited invitation and delivers it to the owner (A-002 §11) → unit moves to "Invited" state.
**Alternate Flow:** N/A.
**Exception Flow:** Invitation attempted for a unit that already has an active, unexpired invitation — rejected (A-002 §15, duplicate invitation).
**Acceptance Criteria (summary):** Exactly one active invitation exists per unit at any time. Full scenarios: AC-BA-06.
**Business Rules:** Only an authorized user within an approved Builder's own Organization can invite, and only for a unit already assigned to that Organization's own project (A-002 §16).
**Security Requirements:** The invitation token must be usable only by its intended recipient's flow (specific mechanism deferred to a future security document).
**Validation Rules:** A unit must be in "Assigned" state before an invitation can be sent.
**Success Outcome:** The owner receives a usable invitation.
**Priority:** Must Have.
**Future Considerations:** None named.

#### US-BA-07 — Track Invitation
**Actor:** Builder Administrator
**User Story:** As a Builder Administrator, I want to track the status of an invitation, so that I know whether to wait, follow up, or reassign.
**Preconditions:** An invitation has been sent (US-BA-06).
**Trigger:** Builder views invitation status for a unit.
**Main Flow:** Builder sees the invitation's current state (pending, accepted, declined, expired).
**Alternate Flow:** Builder resends an about-to-expire invitation.
**Exception Flow:** N/A — status visibility is read-only.
**Acceptance Criteria (summary):** Status shown always matches the invitation's actual current state, with no stale/cached mismatch. Full scenarios: AC-BA-07.
**Business Rules:** Consistent with A-002 §15's exception handling for expiry/decline.
**Security Requirements:** Scoped to the Builder's own Organization.
**Validation Rules:** N/A.
**Success Outcome:** Addresses the pain point named in A-003 §11 — the builder is never left guessing why an invitation is still pending.
**Priority:** Should Have.
**Future Considerations:** Document-level acceptance status (A-003 §12 opportunity).

#### US-BA-08 — Complete Handover
**Actor:** Builder Administrator
**User Story:** As a Builder Administrator, I want the handover to be marked complete once the owner accepts, so that I have a clear record of what was transferred and when.
**Preconditions:** Owner has accepted (US-PO-03).
**Trigger:** System marks the unit "Handed Over" automatically on owner acceptance (A-002 §12) — this is not a separate manual builder action.
**Main Flow:** Unit status updates to "Handed Over"; builder's write/management access to that unit ends; a read-only historical view remains (A-002 §16).
**Alternate Flow:** N/A.
**Exception Flow:** N/A — this story only exists once acceptance has already occurred; decline is handled entirely within US-BA-04's reassignment path.
**Acceptance Criteria (summary):** Post-handover, the builder can view but not modify the unit's historical record. Full scenarios: AC-BA-08.
**Business Rules:** "When builders lose access" (A-002 §16) — access to a specific unit ends immediately on handover acceptance.
**Security Requirements:** Write access to a handed-over unit must be genuinely revoked, not merely hidden in the UI.
**Validation Rules:** N/A.
**Success Outcome:** The builder has a permanent, accurate record that this unit was successfully handed over.
**Priority:** Must Have.
**Future Considerations:** None named.

#### US-BA-09 — Reports
**Actor:** Builder Administrator
**User Story:** As a Builder Administrator, I want handover-progress reports across my projects, so that I can see my overall handover status without checking each unit individually.
**Preconditions:** Builder has at least one project with units (US-BA-02/03).
**Trigger:** Builder opens the reports view.
**Main Flow:** Builder views aggregate handover status (e.g., counts by lifecycle state) across their own Organization's projects.
**Alternate Flow:** Builder filters by a specific project.
**Exception Flow:** N/A — read-only.
**Acceptance Criteria (summary):** Reported figures always reconcile with the underlying unit-level statuses (no drift). Full scenarios: AC-BA-09.
**Business Rules:** Scoped entirely to the Builder's own Organization — never aggregates across builders.
**Security Requirements:** Scoped to the Builder's own Organization.
**Validation Rules:** N/A.
**Success Outcome:** Priya (A-003 §7 persona) can answer "how is my handover program going" without manual reconciliation.
**Priority:** Should Have.
**Future Considerations:** None named — report design detail is explicitly future scope (out of this document, per its own constraints).

### 3.4 Property Owner (EPIC-04, EPIC-06)

#### US-PO-01 — Accept Invitation
**Actor:** Property Owner
**User Story:** As a Property Owner, I want to receive and act on a builder's invitation, so that I can begin the process of accepting my new property.
**Preconditions:** A builder has invited the owner (US-BA-06).
**Trigger:** Owner receives the invitation (A-002 §14).
**Main Flow:** Owner opens the invitation and proceeds toward account activation (US-PO-02) or, if already an account holder, directly toward property review (US-PO-03).
**Alternate Flow:** Owner already has an existing MyPropertyAsset account — invitation links to that account rather than creating a new one (A-002 §15).
**Exception Flow:** Invitation has expired — owner is informed and directed to contact the builder; no property or document is exposed for an expired invitation.
**Acceptance Criteria (summary):** An expired invitation can never be used to gain property access. Full scenarios: AC-PO-01.
**Business Rules:** Consistent with A-002 §11 Owner Invitation Flow.
**Security Requirements:** Invitation tokens are single-purpose and time-limited (specific mechanism deferred to a future security document).
**Validation Rules:** N/A at this story's level — token validity is checked, not user-entered data.
**Success Outcome:** Owner reaches either account activation or direct property review.
**Priority:** Must Have.
**Future Considerations:** None named.

#### US-PO-02 — Activate Account
**Actor:** Property Owner
**User Story:** As a Property Owner, I want to activate my account from an invitation, so that I can access the platform and review my property.
**Preconditions:** A valid, unexpired invitation exists (US-PO-01).
**Trigger:** Owner completes account activation.
**Main Flow:** Owner activates via Supabase Auth (existing mechanism) → their own personal Organization is auto-provisioned (backend Platform Foundation Specification), entirely independent of the inviting builder's Organization.
**Alternate Flow:** Owner already has an account (US-PO-01 alternate) — this story is skipped entirely, not re-run.
**Exception Flow:** Activation fails (e.g., invalid input) — owner is shown what to correct.
**Acceptance Criteria (summary):** Every new owner ends this story with exactly one personal Organization, never zero and never more than one. Full scenarios: AC-PO-02.
**Business Rules:** Owner's personal Organization is distinct from the inviting Builder's Organization (A-002 §16).
**Security Requirements:** Standard account-activation security, existing Supabase Auth mechanism, not redesigned here.
**Validation Rules:** Standard account-field validation, existing mechanism.
**Success Outcome:** Owner has an active account and reaches property review.
**Priority:** Must Have.
**Future Considerations:** None named.

#### US-PO-03 — View Property (Handover Review & Acceptance)
**Actor:** Property Owner
**User Story:** As a Property Owner, I want to review the full handover package before accepting, so that I know exactly what I'm about to receive.
**Preconditions:** Owner is authenticated (US-PO-02, or already had an account).
**Trigger:** Owner opens the pending handover for review.
**Main Flow:** Owner reviews the unit and its uploaded documents → accepts.
**Alternate Flow:** N/A beyond the accept/decline branch.
**Exception Flow:** Owner declines — unit returns to the builder's "Needs Reassignment" queue (US-BA-04 alternate); no property or document is ever created in the owner's account (A-002 §15).
**Acceptance Criteria (summary):** Declining leaves absolutely no residual property/document record in the owner's account. Full scenarios: AC-PO-03.
**Business Rules:** Ownership transfers exactly at the moment of acceptance — not at invitation, not at document upload (A-002 §16).
**Security Requirements:** The owner can only ever review the specific unit they were invited to — no visibility into any other unit, even from the same builder/project.
**Validation Rules:** N/A — this is a review-and-decide action, not a data-entry form.
**Success Outcome:** Addresses the pain point named in A-003 §11 — the owner can make an informed decision because the full package was legible before commitment.
**Priority:** Must Have.
**Future Considerations:** A more complete handover-package preview UI — an opportunity flagged in A-003 §12, not designed here.

#### US-PO-04 — View Documents
**Actor:** Property Owner
**User Story:** As a Property Owner, I want to access the documents that came with my handover, so that I have my property's records available going forward.
**Preconditions:** Owner has accepted the handover (US-PO-03).
**Trigger:** Owner opens their property's document vault.
**Main Flow:** Owner views the same documents the builder originally uploaded — now theirs, via the existing Property Documents capability, entirely unmodified (A-002 §13).
**Alternate Flow:** N/A.
**Exception Flow:** N/A — this is existing, already-specified capability; no new exception handling is introduced by this story.
**Acceptance Criteria (summary):** The documents visible here are the identical records the builder uploaded — not a copy, not a re-upload. Full scenarios: AC-PO-04.
**Business Rules:** Document ownership transfer, not duplication (A-002 §13) — this story is the "after" state of US-BA-05's rule.
**Security Requirements:** Existing Property Documents access control, unmodified.
**Validation Rules:** N/A — no new data entry.
**Success Outcome:** Owner never has to ask the builder "can you resend that document."
**Priority:** Must Have.
**Future Considerations:** None named.

#### US-PO-05 — Upload Documents
**Actor:** Property Owner
**User Story:** As a Property Owner, I want to upload my own documents against the property, so that my record stays complete as I add to it over time.
**Preconditions:** Owner has accepted the handover (US-PO-03).
**Trigger:** Owner uploads a document.
**Main Flow:** Existing Property Documents capability, entirely unmodified — this story's only requirement is that it works identically for a handover-originated property as for a manually-entered one.
**Alternate Flow / Exception Flow:** Not redefined here — governed by existing, already-specified Property Documents behavior.
**Acceptance Criteria (summary):** A handover-originated property behaves identically to a manually-entered property for this capability. Full scenarios: AC-PO-05.
**Business Rules:** No new rules — existing capability, referenced not restated (per this document's stated discipline, §Pre-Check Result).
**Security Requirements:** Existing, unmodified.
**Validation Rules:** Existing, unmodified.
**Success Outcome:** No functional gap between the two property-origin paths.
**Priority:** Must Have.
**Future Considerations:** None named.

#### US-PO-06 — Add Loan
**Actor:** Property Owner
**User Story:** As a Property Owner, I want to record a loan against my handed-over property, so that I can track its financing the same way I would for any other property.
**Preconditions:** Owner has accepted the handover (US-PO-03).
**Trigger:** Owner adds a loan record.
**Main Flow:** Existing Loan capability, entirely unmodified (see Loan IES on the backend) — this story's only requirement is the integration point works.
**Alternate Flow / Exception Flow:** Governed entirely by existing, already-specified Loan behavior — not redefined here.
**Acceptance Criteria (summary):** A handover-originated property can have a loan added exactly as any other property can. Full scenarios: AC-PO-06.
**Business Rules:** No new rules — existing capability.
**Security Requirements:** Existing, unmodified (including the existing rule that managers never see loan data — irrelevant here since no manager role exists in this flow, but not contradicted either).
**Validation Rules:** Existing, unmodified.
**Success Outcome:** No functional gap between the two property-origin paths.
**Priority:** Must Have.
**Future Considerations:** None named.

#### US-PO-07 — Add Expense
**Actor:** Property Owner
**User Story:** As a Property Owner, I want to record expenses against my handed-over property, so that I can track its running costs the same way I would for any other property.
**Preconditions:** Owner has accepted the handover (US-PO-03).
**Trigger:** Owner adds an expense record.
**Main Flow:** Existing Expense capability, entirely unmodified (see Expense IES on the backend) — integration-point requirement only.
**Alternate Flow / Exception Flow:** Governed entirely by existing, already-specified Expense behavior.
**Acceptance Criteria (summary):** Same shape as US-PO-06, applied to Expense. Full scenarios: AC-PO-07.
**Business Rules:** No new rules — existing capability.
**Security Requirements:** Existing, unmodified.
**Validation Rules:** Existing, unmodified.
**Success Outcome:** No functional gap between the two property-origin paths.
**Priority:** Must Have.
**Future Considerations:** None named.

#### US-PO-08 — Manage Tenant
**Actor:** Property Owner
**User Story:** As a Property Owner, I want to manage a tenant for my handed-over property, so that I can let it out the same way I would for any other property.
**Preconditions:** Owner has accepted the handover (US-PO-03).
**Trigger:** Owner adds/manages a tenant record.
**Main Flow:** Existing Tenant capability, entirely unmodified — integration-point requirement only.
**Alternate Flow / Exception Flow:** Governed entirely by existing, already-specified Tenant behavior.
**Acceptance Criteria (summary):** Same shape as US-PO-06, applied to Tenant. Full scenarios: AC-PO-08.
**Business Rules:** No new rules — existing capability.
**Security Requirements:** Existing, unmodified.
**Validation Rules:** Existing, unmodified.
**Success Outcome:** No functional gap between the two property-origin paths.
**Priority:** Should Have.
**Future Considerations:** None named.

#### US-PO-09 — Financial History
**Actor:** Property Owner
**User Story:** As a Property Owner, I want my handed-over property's financial activity reflected in my Financial History, so that my portfolio view is complete regardless of how a property was acquired.
**Preconditions:** Owner has accepted the handover (US-PO-03) and has recorded at least one financial event (loan, expense) against it.
**Trigger:** Owner views Financial History.
**Main Flow:** Existing Financial Ledger capability, entirely unmodified — integration-point requirement only.
**Alternate Flow / Exception Flow:** Governed entirely by existing, already-specified Financial History behavior.
**Acceptance Criteria (summary):** A handover-originated property's financial events appear in the ledger identically to a manually-entered property's. Full scenarios: AC-PO-09.
**Business Rules:** No new rules — existing capability; explicitly does not duplicate anything the Financial History IES already specifies.
**Security Requirements:** Existing, unmodified.
**Validation Rules:** Existing, unmodified.
**Success Outcome:** No functional gap between the two property-origin paths.
**Priority:** Should Have.
**Future Considerations:** None named.

#### US-PO-10 — Notifications
**Actor:** Property Owner
**User Story:** As a Property Owner, I want to receive notifications relevant to my handed-over property, so that I stay informed the same way I would for any other property.
**Preconditions:** Owner has accepted the handover (US-PO-03).
**Trigger:** Any existing notification-worthy event occurs (EMI due, rent due, document expiry, etc.).
**Main Flow:** Existing Notification capability, entirely unmodified — integration-point requirement only.
**Alternate Flow / Exception Flow:** Governed entirely by existing, already-specified Notification behavior.
**Acceptance Criteria (summary):** A handover-originated property generates notifications identically to a manually-entered property's. Full scenarios: AC-PO-10.
**Business Rules:** No new rules — existing capability. New notification triggers specific to this initiative (invitation, handover complete) are already covered under US-BA-06/US-BA-08/US-PO-01/US-PO-03, not restated here.
**Security Requirements:** Existing, unmodified.
**Validation Rules:** Existing, unmodified.
**Success Outcome:** No functional gap between the two property-origin paths.
**Priority:** Should Have.
**Future Considerations:** None named.

### 3.5 Future — Tenant Integration

Per instruction, no full stories are written for the future Tenant Mobile App. Future considerations only: a future Tenant App would plausibly need stories analogous to US-PO-04 (document access) and US-PO-10 (notifications), scoped to a tenant's own tenancy rather than an owner's whole property — consistent with A-002 §21 and A-003 §9. No story ID, acceptance criteria, or flow is defined for this actor in this document.

## 4. Business Rules

This document does not restate A-002 §16's business rules wholesale — every story above references the specific A-002 rule it depends on inline. The only rules genuinely new to this document (not present in A-002) are the individual stories' own preconditions/exception handling detailed above (e.g., "a unit has at most one active invitation," US-BA-06 — actually already an A-002 rule, restated only because it's directly testable at the story level).

## 5. Validation Rules

| Story | Validation |
|---|---|
| US-PW-03, US-PW-04 | Contact detail (email/phone) required and well-formed |
| US-SA-01 | Company name and valid contact channel required |
| US-SA-02 | Registration must be in "pending" state to be decided |
| US-BA-02, US-BA-03 | Name/identifier required at minimum; further rules deferred to the Builder Projects data-architecture document |
| US-BA-04 | Valid contact channel required for the prospective owner |
| US-BA-06 | Unit must be in "Assigned" state before invitation |
| US-PO-05 through US-PO-10 | Existing, unmodified validation rules from the respective backend domains — not restated |

## 6. Security Considerations

- Every Builder-scoped story (US-BA-*) requires that cross-Organization data access is structurally impossible, not merely hidden by UI (US-BA-01, restated as the standing requirement for the whole epic).
- Every Owner-scoped story inherits existing, unmodified backend security posture (RLS, Auth) — this document introduces no new security requirement for EPIC-06.
- Invitation tokens (US-BA-06, US-PO-01) are single-purpose and time-limited; the exact mechanism is deferred to a future security document (S-001/S-002, per this series' Future Roadmap).
- Super Admin actions (EPIC-02) are the platform's highest-privilege operations and should be assumed auditable, consistent with A-003 §6's Security Considerations — the specific audit mechanism is not designed here.

## 7. Dependencies

- A-001 (Product Vision & Scope), A-002 (Business Flow), A-003 (User Journey) — all directly elaborated by this document.
- Backend: `PLATFORM_FOUNDATION_SPECIFICATION.md` (Organization/membership model underlying US-SA-05, US-PO-02); Expense/Loan/Financial History IES (underlying US-PO-06/07/09, referenced not restated).
- The undesigned backend Builder Projects domain — a direct dependency of US-BA-02/03, carried forward from A-002 §18 and A-003 §16.

## 8. Cross References

| This document | A-002 | A-003 |
|---|---|---|
| EPIC-01 | §6 | §5 |
| EPIC-02 | §7 | §6 |
| EPIC-03 | §8 | §7 |
| EPIC-04 | §8, §10, §11 | §7, §8 |
| EPIC-05 | §8 | §7 |
| EPIC-06 | §9 | §8 |

## 9. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| US-BA-02/03 are written against an undesigned backend domain | Stories can't be validated against a real data shape until Builder Projects is designed | Explicitly flagged again here, third consecutive document to carry this dependency (A-002 → A-003 → A-003A) |
| EPIC-06 stories assume zero required change to existing Loan/Expense/Tenant/Financial History behavior | If that assumption is wrong, this document understates the actual work required | Named explicitly as an assumption (§10), not a verified fact, consistent with A-002 §19/A-003 §17 |
| White-label (US-SA-03) has no defined mechanism, so its acceptance criteria are necessarily shallow | Story may need substantial revision once white-label is actually designed | Acknowledged in the story itself rather than presented as complete |

## 10. Assumptions

- A handover-originated property requires no change to existing Loan, Expense, Tenant, or Financial History behavior beyond correct property linkage (carried from A-002 §19/A-003 §17, restated here as it directly shapes EPIC-06).
- Supabase Auth's existing account-activation mechanism is sufficient for owner and builder onboarding alike, with no new authentication mechanism required.
- The Organization model from `PLATFORM_FOUNDATION_SPECIFICATION.md` can support both Builder-type and Owner-type population without structural change beyond the still-undecided `organization_type` question.

## 11. Constraints

- No UI, screen, Angular, Flutter, API, SQL, database, routing, or component content appears in this document (explicit output requirement).
- The Builder Portal exclusion list (CRM/Sales/Accounting/Payroll/HR/Inventory/Procurement/Society Management) constrains every EPIC-03/04/05 story exactly as it constrained A-002 §8 and A-003 §7.
- EPIC-06 stories are deliberately shallow by design — they must not become a vehicle for re-specifying already-approved backend domains.

## 12. Future Enhancements

- Self-service white-label configuration by builders themselves (US-SA-03).
- Document-level (not unit-level) invitation/completeness status (US-BA-05, US-BA-07).
- A richer handover-package preview before owner acceptance (US-PO-03).
- Tenant Mobile App stories (§3.5), once that product is formally scoped.
- The `organization_type` discriminator decision (US-SA-05), still open across three consecutive documents now.

## 13. Updated ARCHITECTURE_INDEX.md

See `../ARCHITECTURE_INDEX.md` — updated with the A-003A entry. No prior document was overwritten.

## 14. Updated ADR List

**Not required.** This document introduces no new technical/architectural decision. See `docs/adr/ADR_INDEX.md` — unchanged.

## 15. Review Checklist

- [ ] All 29 stories reviewed for completeness against A-002/A-003
- [ ] EPIC-06's "existing capability, integration point only" framing confirmed as the correct scope boundary (not under- or over-specified)
- [ ] Builder Projects backend dependency (US-BA-02/03) acknowledged as blocking for A-006 (Functional Modules)
- [ ] Priority assignments (Must/Should Have) validated against actual launch scope

## 16. Approval Checklist

- [ ] Reviewed by Product Owner
- [ ] Reviewed by Enterprise Business Analyst
- [ ] Reviewed by Enterprise/Solution Architect
- [ ] Status updated from Draft to Approved in `ARCHITECTURE_INDEX.md`
- [ ] A-004 (Screen Flow) authorized to begin
