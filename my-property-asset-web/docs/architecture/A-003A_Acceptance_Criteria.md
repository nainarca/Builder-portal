# A-003A — Acceptance Criteria (Given / When / Then)

**Companion to:** [`A-003A_User_Stories.md`](A-003A_User_Stories.md)
**Purpose:** Full, measurable Given/When/Then scenarios for every user story, cross-referenced by Story ID. Each story's main flow, key alternate flow, and key exception flow are covered — not exhaustively every branch, but enough to make each story testable.

---

## AC-PW-01 — Browse Website (US-PW-01)

- **Given** a visitor with no account, **when** they navigate to any public page, **then** the page loads without requiring authentication.
- **Given** a visitor on the public site, **when** they attempt to reach an authenticated-only route directly, **then** they are redirected away from it, not shown its content.
- **Given** public content fails to load, **when** the visitor is viewing the site, **then** they see a non-technical error state, not a raw failure.

## AC-PW-02 — View Pricing (US-PW-02)

- **Given** a visitor, **when** they navigate to the pricing page, **then** plan/tier information is displayed without requiring sign-in.
- **Given** pricing content is temporarily unavailable, **when** the visitor tries to view it, **then** the rest of the site remains usable.

## AC-PW-03 — Request Demo (US-PW-03)

- **Given** a visitor completes the demo request form with a valid email, **when** they submit it, **then** the request is captured and a confirmation is shown.
- **Given** a visitor submits the form with an invalid or missing contact detail, **when** they submit it, **then** the submission is rejected and the specific invalid field is indicated.
- **Given** a demo request is successfully submitted, **when** the submission completes, **then** no platform account is created as a side effect.

## AC-PW-04 — Contact Sales (US-PW-04)

- **Given** a visitor completes the sales inquiry form with valid contact details, **when** they submit it, **then** the inquiry is captured and confirmed.
- **Given** an invalid submission, **when** they submit it, **then** it is rejected with a specific reason (same as AC-PW-03).
- **Given** a visitor reaches Contact Sales from builder-track content, **when** they submit an inquiry, **then** no Builder Registration record is created as a side effect (that only happens via US-SA-01).

## AC-SA-01 — Register Builder (US-SA-01)

- **Given** a Super Admin with valid company/contact details for a new builder, **when** they create a registration, **then** a Builder Registration is created in "pending" state.
- **Given** a Builder Registration already exists for the same company, **when** a Super Admin attempts to create a duplicate, **then** the attempt is rejected with a specific reason.
- **Given** a Builder Registration was submitted via the Public Website, **when** a Super Admin opens it for review, **then** it is already present without needing manual re-entry.

## AC-SA-02 — Approve Builder (US-SA-02)

- **Given** a pending Builder Registration, **when** a Super Admin approves it, **then** exactly one Organization is created, exactly one admin account is provisioned, and the builder is notified.
- **Given** a pending Builder Registration, **when** a Super Admin rejects it, **then** no Organization or Builder Portal access is created, and the prospective builder is notified with a reason.
- **Given** a Builder Registration that has already been decided, **when** a Super Admin attempts to decide it again, **then** the action is rejected.

## AC-SA-03 — Configure White-label (US-SA-03)

- **Given** an approved Builder Organization, **when** a Super Admin sets its white-label configuration, **then** the configuration applies to that Organization only.
- **Given** Organization A's white-label configuration is changed, **when** Organization B's presentation is checked, **then** it is unaffected.
- **Given** a Super Admin attempts to configure white-label for a non-existent or non-Builder-type Organization, **when** they submit the change, **then** it is rejected.

## AC-SA-04 — Activate Subscription (US-SA-04)

- **Given** an approved Builder Organization with no active subscription, **when** a Super Admin activates a plan, **then** the Organization's subscription status becomes active.
- **Given** an Organization already has an active subscription, **when** a Super Admin activates a different plan, **then** the prior plan is replaced, not duplicated (the Organization has exactly one active subscription state at any time).
- **Given** an Organization that has not been approved, **when** a Super Admin attempts to activate a subscription for it, **then** the action is rejected.

## AC-SA-05 — Manage Organization (US-SA-05)

- **Given** approved builders and activated owners exist, **when** a Super Admin views Organization management, **then** every one of them is represented by exactly one Organization record, labeled by type.
- **Given** a specific Organization, **when** a Super Admin drills into its detail, **then** only that Organization's own data is shown.

## AC-SA-06 — Platform Monitoring (US-SA-06)

- **Given** platform activity (registrations, active Organizations, support items), **when** a Super Admin opens monitoring, **then** current figures are displayed without requiring direct database access.

## AC-BA-01 — Login (US-BA-01)

- **Given** an activated Builder Administrator account, **when** they log in, **then** they are placed in their own Organization's scoped context.
- **Given** a Builder Administrator whose Organization has been suspended, **when** they attempt to log in, **then** access is rejected with a specific reason, not a generic failure.
- **Given** a logged-in Builder Administrator, **when** they attempt to access another Organization's data by any means, **then** the attempt fails.

## AC-BA-02 — Create Project (US-BA-02)

- **Given** a logged-in Builder Administrator with a project name, **when** they create a project, **then** it exists within their own Organization only.
- **Given** a project creation attempt with no name, **when** they submit it, **then** it is rejected with field-level feedback.
- **Given** Organization A creates a project, **when** Organization B's Builder Administrator views their own project list, **then** Organization A's project does not appear.

## AC-BA-03 — Create Units (US-BA-03)

- **Given** an existing project, **when** a Builder Administrator creates a unit with an identifier, **then** the unit exists in "Draft" state, linked to exactly one project.
- **Given** a Builder Administrator attempts to create a unit under a project belonging to a different Organization, **when** they submit it, **then** the attempt is rejected.

## AC-BA-04 — Assign Owner (US-BA-04)

- **Given** a unit in "Ready for Handover" state, **when** a Builder Administrator assigns a prospective owner with valid contact details, **then** the unit moves to "Assigned" state.
- **Given** a unit already has an active assignment, **when** a Builder Administrator attempts to assign a different owner to it, **then** the attempt is rejected.
- **Given** a unit previously returned to "Needs Reassignment," **when** a Builder Administrator assigns a new owner, **then** the reassignment succeeds and supersedes the prior assignment.

## AC-BA-05 — Upload Documents (US-BA-05)

- **Given** a unit exists, **when** a Builder Administrator uploads a document against it, **then** the document is stored as "Builder-owned, Owner-pending" and is not visible to any owner.
- **Given** a document uploaded pre-handover, **when** the assigned owner (not yet accepted) attempts to view it, **then** access is denied.
- **Given** a unit outside the Builder Administrator's own Organization, **when** they attempt to upload a document to it, **then** the attempt is rejected.

## AC-BA-06 — Invite Owner (US-BA-06)

- **Given** a unit in "Assigned" state with documents uploaded, **when** a Builder Administrator sends an invitation, **then** the unit moves to "Invited" state and the owner receives a time-limited invitation.
- **Given** a unit already has an active, unexpired invitation, **when** a Builder Administrator attempts to send another, **then** the attempt is rejected.
- **Given** a unit not yet in "Assigned" state, **when** a Builder Administrator attempts to invite an owner for it, **then** the attempt is rejected.

## AC-BA-07 — Track Invitation (US-BA-07)

- **Given** an active invitation, **when** a Builder Administrator views its status, **then** the displayed state (pending/accepted/declined/expired) matches the invitation's actual current state.
- **Given** an invitation nearing expiry, **when** a Builder Administrator resends it, **then** a fresh, valid invitation is issued.

## AC-BA-08 — Complete Handover (US-BA-08)

- **Given** an owner accepts a handover, **when** acceptance completes, **then** the unit's status automatically updates to "Handed Over" with no separate builder action required.
- **Given** a unit is "Handed Over," **when** the Builder Administrator attempts to modify it, **then** the attempt is rejected — only read access to the historical record remains.

## AC-BA-09 — Reports (US-BA-09)

- **Given** a Builder Organization with units across multiple lifecycle states, **when** a Builder Administrator opens Reports, **then** the aggregate counts shown match the actual current unit-level statuses.
- **Given** a Builder Administrator filters Reports by a specific project, **when** the filter is applied, **then** only that project's units are reflected in the figures.

## AC-PO-01 — Accept Invitation (US-PO-01)

- **Given** a valid, unexpired invitation, **when** the owner opens it, **then** they are directed to account activation (if new) or directly to property review (if an existing account holder).
- **Given** an expired invitation, **when** the owner attempts to open it, **then** they are informed it has expired and no property/document data is exposed.

## AC-PO-02 — Activate Account (US-PO-02)

- **Given** a new owner completing activation from a valid invitation, **when** activation succeeds, **then** exactly one personal Organization is provisioned for them.
- **Given** an owner who already has an account, **when** they open an invitation, **then** no second Organization or duplicate account is created.

## AC-PO-03 — View Property / Accept Handover (US-PO-03)

- **Given** an owner reviewing a pending handover, **when** they view the package, **then** the unit and all its currently-uploaded documents are shown before any accept/decline decision is required.
- **Given** an owner accepts, **when** acceptance completes, **then** the property and its documents appear in the owner's account and the unit is marked "Handed Over" for the builder.
- **Given** an owner declines, **when** the decline completes, **then** no property or document record exists in the owner's account, and the unit returns to the builder's "Needs Reassignment" queue.
- **Given** an owner reviewing a handover, **when** they attempt to view a different, non-assigned unit from the same builder/project, **then** access is denied.

## AC-PO-04 — View Documents (US-PO-04)

- **Given** an accepted handover, **when** the owner opens their document vault, **then** the documents shown are the identical records the builder uploaded, not copies.
- **Given** a document the builder uploaded pre-handover, **when** compared post-handover, **then** its identity/reference is unchanged (transfer, not duplication).

## AC-PO-05 — Upload Documents (US-PO-05)

- **Given** an accepted handover-originated property, **when** the owner uploads a new document, **then** the behavior is identical to uploading a document against a manually-entered property.

## AC-PO-06 — Add Loan (US-PO-06)

- **Given** an accepted handover-originated property, **when** the owner adds a loan, **then** the behavior is identical to adding a loan against a manually-entered property.

## AC-PO-07 — Add Expense (US-PO-07)

- **Given** an accepted handover-originated property, **when** the owner adds an expense, **then** the behavior is identical to adding an expense against a manually-entered property.

## AC-PO-08 — Manage Tenant (US-PO-08)

- **Given** an accepted handover-originated property, **when** the owner adds/manages a tenant, **then** the behavior is identical to doing so for a manually-entered property.

## AC-PO-09 — Financial History (US-PO-09)

- **Given** an accepted handover-originated property with at least one recorded financial event, **when** the owner views Financial History, **then** that property's events appear identically to a manually-entered property's events.

## AC-PO-10 — Notifications (US-PO-10)

- **Given** an accepted handover-originated property, **when** an existing notification-worthy event occurs (EMI due, rent due, document expiry), **then** the owner receives the notification identically to how they would for a manually-entered property.

---

## Coverage Note

Every story in `A-003A_User_Stories.md` has at least one main-flow, one alternate-or-exception, and (where the story defines one) one boundary/security scenario above. EPIC-06 stories (AC-PO-05 through AC-PO-10) are deliberately single-scenario, consistent with their "integration point only" scope — their full behavioral acceptance criteria already exist in the respective backend IES documents and are not restated here.
