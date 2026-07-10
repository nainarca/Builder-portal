# Screen Inventory — MyPropertyAsset Web Platform

**Companion to:** [`A-004_Screen_Flow.md`](A-004_Screen_Flow.md) (full per-screen specification)
**Purpose:** Flat, scannable master list of every screen in the platform. Full detail (entry/exit, flows, rules, permissions) lives in A-004; this file is the quick-reference index.

## Public Website (9 screens)

| Screen ID | Name | Module | Actor | Purpose |
|---|---|---|---|---|
| PW-01 | Home | Marketing | Public Visitor | Entry point; orient visitor and fork toward owner-track or builder-track |
| PW-02 | Features | Marketing | Public Visitor | Communicate product capability |
| PW-03 | Pricing | Marketing | Public Visitor | Support the visitor's buy decision |
| PW-04 | About | Marketing | Public Visitor | Establish credibility/trust |
| PW-05 | FAQ | Marketing | Public Visitor | Answer common questions without a sales conversation |
| PW-06 | Contact / Contact Sales | Conversion | Public Visitor | Capture a general sales inquiry |
| PW-07 | Demo Request | Conversion | Public Visitor | Capture a qualified demo lead |
| PW-08 | Builder Registration | Conversion | Public Visitor (builder-track) | Submit a builder registration for Super Admin review |
| PW-09 | Login Gateway | Authentication | Returning Builder / Super Admin | Route an authenticating user to the correct portal |

## Super Admin Portal (11 screens)

| Screen ID | Name | Module | Actor | Purpose |
|---|---|---|---|---|
| SA-01 | Login | Authentication | Super Admin | Authenticate into the Super Admin Portal |
| SA-02 | Dashboard | Overview | Super Admin | Platform-wide operational snapshot |
| SA-03 | Builder Management (List) | Builder Onboarding | Super Admin | View/find all builder registrations and organizations |
| SA-04 | Builder Detail & Approval | Builder Onboarding | Super Admin | Review, approve, or reject a specific builder |
| SA-05 | Organization Management | Tenancy | Super Admin | View/manage all Organizations (Builder-type and Owner-type) |
| SA-06 | White-label Configuration | Branding | Super Admin | Configure a Builder Organization's presentation |
| SA-07 | Subscription Management | Commercial | Super Admin | Activate/change an Organization's subscription |
| SA-08 | User Management | Administration | Super Admin | Manage platform users across roles *(no dedicated A-003A story — see A-004 §14 Risks)* |
| SA-09 | Platform Monitoring | Operations | Super Admin | Business-level platform health/usage visibility |
| SA-10 | Audit Log | Operations | Super Admin | Review a record of Super Admin actions *(no dedicated A-003A story — see A-004 §14 Risks)* |
| SA-11 | Settings | Administration | Super Admin | Super Admin's own account/platform-level settings |

## Builder Handover Portal (13 screens)

| Screen ID | Name | Module | Actor | Purpose |
|---|---|---|---|---|
| BA-01 | Login | Authentication | Builder Administrator | Authenticate into the Builder Handover Portal |
| BA-02 | Dashboard | Overview | Builder Administrator | Organization-wide handover progress snapshot |
| BA-03 | Projects (List) | Project & Unit Prep | Builder Administrator | View/find the Organization's projects |
| BA-04 | Project Detail | Project & Unit Prep | Builder Administrator | Manage a single project and its units |
| BA-05 | Units (List) | Project & Unit Prep | Builder Administrator | View/find units within a project |
| BA-06 | Unit Detail | Project & Unit Prep / Handover | Builder Administrator | Central hub for one unit's lifecycle, assignment, documents, invitation status |
| BA-07 | Owner Assignment | Handover Prep | Builder Administrator | Link a prospective owner to a unit |
| BA-08 | Document Upload | Handover Prep | Builder Administrator | Upload handover documents against a unit |
| BA-09 | Invitations (Tracking) | Handover | Builder Administrator | Track invitation status across units |
| BA-10 | Documents (Library) | Handover | Builder Administrator | Cross-project document index |
| BA-11 | Reports | Reporting | Builder Administrator | Aggregate handover-progress reporting |
| BA-12 | Notifications | Communication | Builder Administrator | Builder-side notification center |
| BA-13 | Settings | Administration | Builder Administrator | Organization profile and team management *(no dedicated A-003A story — see A-004 §14 Risks)* |

## Owner App Interaction Points (reference only — existing screens, not redesigned)

| Reference ID | Existing Owner Mobile App Screen (unmodified) | New interaction introduced by this initiative |
|---|---|---|
| OA-REF-01 | Account activation | Reachable from a builder invitation link, in addition to existing self-serve entry |
| OA-REF-02 | Property acceptance / handover review | New screen *for the Owner App itself* — out of this document's scope to design (mobile, not web); referenced only |
| OA-REF-03 | Property Documents | Now also displays builder-originated, transferred documents — no change to the screen itself |
| OA-REF-04 | Loan, Expense, Tenant, Financial History | No change — a handover-originated property is indistinguishable from a manually-entered one |
| OA-REF-05 | Notifications | Two new trigger types (invitation received, handover complete) feed the existing, unmodified notification screen |

**Total: 33 web-platform screens (9 Public Website + 11 Super Admin + 13 Builder Portal) + 5 reference-only Owner App interaction points.**
